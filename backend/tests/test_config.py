from app.core.config import get_settings, Info


def test_settings_and_info():
    s = get_settings()
    assert s.ENV in {"development", s.ENV}
    info = Info()
    assert info.name == "juapesa-backend"
    assert info.version == "0.1.0"
    assert info.env == s.ENV
