# Shared Claude Code sessions from Windows and WSL

Claude Code on Windows and TwiCC in WSL can use the same project-history folder
without sharing their credentials or global settings. This is opt-in and currently
covers Claude Code histories only.

Keep the Linux Claude home and its authentication files. Under its `projects/`
directory, link an individual project's **Linux encoded path** to the existing
Windows project-history directory, for example:

```text
~/.claude/projects/-mnt-c-Dev-MyProject
    -> /mnt/c/Users/<user>/.claude/projects/C--Dev-MyProject
```

The actual working tree is already shared through `/mnt/c/Dev/MyProject`.
Set these instance-local values in `~/.twicc/.env`, then restart the backend:

```dotenv
TWICC_CLAUDE_WINDOWS_PATHS=1
WATCHFILES_FORCE_POLLING=1
```

TwiCC maps absolute Windows drive paths in derived cwd, file, and plan metadata
to WSL drive mounts. It does not rewrite the shared transcript or translate
conversation text. New Linux records and existing Windows records may coexist.
UNC paths and drive-relative paths are left unchanged.

The Claude watcher also observes each linked project's physical target and maps
events back to its logical Linux path. A lightweight size/timestamp poll catches
same-second appends that mounted-drive notifications can coalesce. Session IDs
and URLs remain stable. Restart the backend after adding or removing a project link.

If TwiCC previously indexed an independent copy, stop the backend and back up its
SQLite database and that copy before switching. Its byte checkpoints refer to the
copy, and must be rebased against the native file after verifying the transcript
prefix; blindly changing the link would seek to incorrect offsets. Preserve the
logical cached history and user annotations. Do not point an existing copy at a
different source without this verification.

Only one application should actively continue a given session at a time. Historical
Windows commands and tool arguments remain as written; resuming from Linux uses
Linux tools and may require adapting Windows-specific commands. No authentication
files need to be copied, and no AI turn is required to index the shared history.
