"""The language preference only changes the standalone forms' display labels."""

import pytest
from django.template.loader import render_to_string
from django.test import RequestFactory

from twicc.auth.labels import auth_labels


@pytest.mark.parametrize("template", ["share_auth.html", "artifact_auth.html"])
def test_french_password_form_keeps_the_same_controls(template):
    request = RequestFactory().get("/", HTTP_ACCEPT_LANGUAGE="fr-FR,fr;q=0.9,en;q=0.8")
    labels = auth_labels(request)
    html = render_to_string(template, {"redirect": "/test/", "error": True, **labels})
    assert 'lang="fr"' in html
    assert "Mot de passe" in html
    assert "Mot de passe incorrect. Réessayez." in html
    assert 'name="password"' in html
    assert 'name="redirect" value="/test/"' in html
    assert 'type="submit"' in html


def test_explicit_english_choice_overrides_french_browser():
    request = RequestFactory().get("/", HTTP_ACCEPT_LANGUAGE="fr-FR")
    request.COOKIES["twicc_locale"] = "en"
    assert auth_labels(request)["ui"]["password"] == "Password"
    assert auth_labels(request)["ui"]["page_title"] == "TwiCC — Password required"


def test_invalid_cookie_is_ignored():
    request = RequestFactory().get("/", HTTP_ACCEPT_LANGUAGE="en-US")
    request.COOKIES["twicc_locale"] = "<script>"
    assert auth_labels(request)["ui_language"] == "en"


@pytest.mark.parametrize("language", ["en", "fr"])
def test_oauth_wait_page_translates_copy_without_changing_protocol(language):
    from starlette.requests import Request

    from twicc.mcp.oauth.routes import WAIT_PAGE, localized_wait_page

    request = Request({"type": "http", "headers": [
        (b"accept-language", b"fr-FR"),
        (b"cookie", f"twicc_locale={language}".encode()),
    ]})
    page = localized_wait_page(request)
    assert f'lang="{language}"' in page
    assert "d.state==='expired'" in page
    assert "sessionStorage.removeItem(key)" in page
    if language == "en":
        assert page == WAIT_PAGE
    else:
        assert "Autoriser le MCP TwiCC" in page
        assert "Cette demande a expiré." in page


def test_french_unavailable_share_keeps_uniform_404_and_headers():
    from twicc.share.html import _UNAVAILABLE_PAGE, share_unavailable_response

    request = RequestFactory().get("/share/unknown/", HTTP_ACCEPT_LANGUAGE="fr-FR")
    french = share_unavailable_response(request)
    english = share_unavailable_response()
    assert french.status_code == english.status_code == 404
    assert english.content == _UNAVAILABLE_PAGE
    assert 'lang="fr"' in french.content.decode()
    assert "Ce partage n’est plus disponible" in french.content.decode()
    assert french["X-Content-Type-Options"] == english["X-Content-Type-Options"]
    assert french["Cache-Control"] == english["Cache-Control"]
