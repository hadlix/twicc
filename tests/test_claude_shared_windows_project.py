"""A shared project keeps native files and credentials separate from metadata mapping."""
import asyncio
from copy import deepcopy
from pathlib import Path
import os

import pytest
from watchfiles import Change, awatch

from twicc.providers.claude_code.compute import ClaudeCodeSessionCompute
from twicc.providers.claude_code.shared_paths import normalize_shared_path
from twicc.providers.claude_code.sessions_watcher import ClaudeCodeSessionsWatcher


@pytest.mark.parametrize(('original', 'expected'), [
    (r'C:\Dev\BIM', '/mnt/c/Dev/BIM'),
    ('D:/Work/Project', '/mnt/d/Work/Project'),
    ('C:/', '/mnt/c/'),
    ('/home/me/project', '/home/me/project'),
    (r'\\server\share\project', r'\\server\share\project'),
    (r'C:relative', r'C:relative'),
    (r'relative\file.py', r'relative\file.py'),
])
def test_only_absolute_drive_paths_are_mapped(settings, original, expected):
    settings.CLAUDE_WINDOWS_PATHS_ENABLED = True
    assert normalize_shared_path(original) == expected
    settings.CLAUDE_WINDOWS_PATHS_ENABLED = False
    assert normalize_shared_path(original) == original


def test_compute_maps_filesystem_fields_without_mutating_history(settings):
    settings.CLAUDE_WINDOWS_PATHS_ENABLED = True
    record = {'type': 'assistant', 'cwd': r'C:\Dev\BIM', 'message': {'content': [
        {'type': 'tool_use', 'name': 'Write', 'input': {
            'file_path': r'C:\Dev\BIM\docs\plan.md', 'content': 'Private original content',
        }},
    ]}}
    before = deepcopy(record)
    compute = ClaudeCodeSessionCompute()
    assert compute.extract_runtime_fields(record)['cwd'] == '/mnt/c/Dev/BIM'
    assert compute.extract_paths_from_tool_uses(record) == ['/mnt/c/Dev/BIM/docs/plan.md']
    events = compute.extract_doc_edit_events(record, cwd='/mnt/c/Dev/BIM')
    assert [event.path for event in events] == ['/mnt/c/Dev/BIM/docs/plan.md']
    assert record == before


def test_shared_target_events_keep_the_existing_logical_session_path(settings, provider_home, tmp_path):
    settings.CLAUDE_WINDOWS_PATHS_ENABLED = True
    root = provider_home.claude / 'projects'
    root.mkdir()
    target = tmp_path / 'windows-project'
    target.mkdir()
    alias = root / '-mnt-c-Dev-BIM'
    alias.symlink_to(target, target_is_directory=True)
    watcher = ClaudeCodeSessionsWatcher()
    assert watcher.watch_paths() == [root, target]
    source = target / 'session.jsonl'
    logical = alias / 'session.jsonl'
    assert watcher.normalize_watch_path(source) == logical
    parsed = asyncio.run(watcher.parse_session_file(watcher.normalize_watch_path(source)))
    assert parsed.project_id == alias.name
    assert parsed.file_path == f'{alias.name}/session.jsonl'
    assert watcher.normalize_watch_path(root / 'other' / 'x.jsonl') == root / 'other' / 'x.jsonl'
    settings.CLAUDE_WINDOWS_PATHS_ENABLED = False
    assert watcher.watch_paths() == [root]


def test_polling_observes_changes_behind_a_shared_project_link(settings, provider_home, tmp_path):
    settings.CLAUDE_WINDOWS_PATHS_ENABLED = True
    root = provider_home.claude / 'projects'
    root.mkdir()
    target = tmp_path / 'windows-project'
    target.mkdir()
    alias = root / 'shared-project'
    alias.symlink_to(target, target_is_directory=True)
    probe = target / 'session.jsonl'
    probe.write_text('before\n')
    watcher = ClaudeCodeSessionsWatcher()
    roots = watcher.watch_paths()

    async def run():
        async def observe():
            async for changes in awatch(*roots, force_polling=True, poll_delay_ms=50, debounce=50, step=10):
                mapped = {watcher.normalize_watch_path(Path(path)) for _, path in changes}
                if alias / probe.name in mapped:
                    return mapped
        task = asyncio.create_task(observe())
        try:
            # PollWatcher timestamp precision can be one second on mounted drives.
            await asyncio.sleep(1.3)
            probe.write_text('after with a different size\n')
            return await asyncio.wait_for(task, timeout=5)
        finally:
            task.cancel()

    assert alias / probe.name in asyncio.run(run())


def test_shared_poll_catches_appends_even_with_an_unchanged_timestamp(settings, provider_home, tmp_path, monkeypatch):
    settings.CLAUDE_WINDOWS_PATHS_ENABLED = True
    root = provider_home.claude / 'projects'
    root.mkdir()
    target = tmp_path / 'windows-project'
    target.mkdir()
    alias = root / 'shared-project'
    alias.symlink_to(target, target_is_directory=True)
    probe = target / 'session.jsonl'
    probe.write_text('before\n')
    old_stat = probe.stat()
    watcher = ClaudeCodeSessionsWatcher()
    watcher.watch_paths()
    stop = asyncio.Event()
    initialized = asyncio.Event()
    events = []

    def enqueue(path, kind):
        events.append((path, kind))
        initialized.set()
        if kind == Change.modified:
            stop.set()

    monkeypatch.setattr(watcher, '_enqueue', enqueue)
    monkeypatch.setattr(watcher, 'get_stop_event', lambda: stop)

    async def run():
        task = asyncio.create_task(watcher.poll_shared_projects())
        try:
            await asyncio.wait_for(initialized.wait(), timeout=2)
            probe.write_text('before\nappended under Windows\n')
            os.utime(probe, ns=(old_stat.st_atime_ns, old_stat.st_mtime_ns))
            await asyncio.wait_for(task, timeout=3)
        finally:
            stop.set()
            task.cancel()

    asyncio.run(run())
    assert events == [(alias / probe.name, Change.added), (alias / probe.name, Change.modified)]
