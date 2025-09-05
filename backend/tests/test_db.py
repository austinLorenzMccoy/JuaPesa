from app.core.db import get_session, engine
from app.models.db_models import Base, User, Wallet


def test_db_session_and_models():
    # ensure tables exist (idempotent)
    Base.metadata.create_all(bind=engine)
    with get_session() as s:
        u = User(phone="+254700000002", pin_hash="x", kyc_level=1)
        s.add(u)
        s.flush()  # get id
        w = Wallet(user_id=u.id, balance_local=10.0, balance_usdc=5.0)
        s.add(w)
        s.flush()
        assert u.id is not None
        assert w.user_id == u.id
