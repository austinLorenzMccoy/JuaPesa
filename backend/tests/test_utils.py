from app.utils.ids import new_tx_id


def test_new_tx_id_format_and_uniqueness():
    a = new_tx_id(prefix="x")
    b = new_tx_id(prefix="x")
    assert a != b
    assert a.startswith("x-")
