"""Labels for the two standalone password forms (no JavaScript required)."""

from types import SimpleNamespace

from django.utils.translation import get_language_from_request

_EN = {
    "page_title": "TwiCC — Password required",
    "password": "Password",
    "placeholder": "Enter password",
    "incorrect": "Incorrect password. Try again.",
    "artifact_intro": "Password required to view this artifact",
    "share_intro": "This shared link is password-protected",
    "sign_in": "Sign in",
    "open": "Open",
}
_FR = {
    "page_title": "TwiCC — Mot de passe requis",
    "password": "Mot de passe",
    "placeholder": "Saisissez le mot de passe",
    "incorrect": "Mot de passe incorrect. Réessayez.",
    "artifact_intro": "Mot de passe requis pour consulter cet artefact",
    "share_intro": "Ce lien partagé est protégé par un mot de passe",
    "sign_in": "Se connecter",
    "open": "Ouvrir",
}


def auth_labels(request):
    """Prefer an explicit device choice, then the browser's language negotiation."""
    if not hasattr(request, "META"):
        request = SimpleNamespace(
            COOKIES=request.cookies,
            META={"HTTP_ACCEPT_LANGUAGE": request.headers.get("accept-language", "")},
        )
    selected = request.COOKIES.get("twicc_locale")
    language = selected if selected in ("en", "fr") else get_language_from_request(request)
    language = "fr" if language and language.split("-")[0] == "fr" else "en"
    return {"ui": _FR if language == "fr" else _EN, "ui_language": language}
