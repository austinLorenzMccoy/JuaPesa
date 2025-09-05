from app.ai.groq_client import GroqClient


def test_groq_client_mock_without_key():
    client = GroqClient(api_key=None)
    out = client.summarize("Hello world, this is a test of Groq client")
    assert out.startswith("[mock-summary:")


def test_groq_client_with_key_branch():
    client = GroqClient(api_key="dummy")
    out = client.summarize("Hello again")
    assert out.startswith("[would-call-groq]")


def test_groq_client_raises_on_empty():
    client = GroqClient(api_key=None)
    try:
        client.summarize("")
        assert False, "should have raised"
    except ValueError:
        assert True
