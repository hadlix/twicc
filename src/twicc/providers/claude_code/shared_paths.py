"""Map Windows metadata paths when reading a shared Claude project from WSL."""
import re
from pathlib import PureWindowsPath

from django.conf import settings


def normalize_shared_path(value: str) -> str:
    """Convert absolute drive paths only; never rewrite the source transcript."""
    if not isinstance(value, str) or not settings.CLAUDE_WINDOWS_PATHS_ENABLED or not re.match(r"^[A-Za-z]:[\\/]", value):
        return value
    windows = PureWindowsPath(value)
    return "/mnt/" + windows.drive[0].lower() + "/" + "/".join(windows.parts[1:])
