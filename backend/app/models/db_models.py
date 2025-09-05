from __future__ import annotations
from typing import Optional
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import String, Integer, Float, ForeignKey


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    phone: Mapped[str] = mapped_column(String(32), unique=True, index=True)
    pin_hash: Mapped[str] = mapped_column(String(128))
    kyc_level: Mapped[int] = mapped_column(Integer, default=0)

    wallet: Mapped["Wallet"] = relationship(back_populates="user")


class Wallet(Base):
    __tablename__ = "wallets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    balance_local: Mapped[float] = mapped_column(Float, default=0.0)
    balance_usdc: Mapped[float] = mapped_column(Float, default=0.0)

    user: Mapped[User] = relationship(back_populates="wallet")


class LedgerEntry(Base):
    __tablename__ = "ledger_entries"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    wallet_id: Mapped[int] = mapped_column(ForeignKey("wallets.id"))
    amount: Mapped[float] = mapped_column(Float)
    asset: Mapped[str] = mapped_column(String(16))  # e.g., LOCAL, USDC
    note: Mapped[str] = mapped_column(String(255), default="")


class LiquidityPoolRecord(Base):
    __tablename__ = "liquidity_pools"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(64), unique=True)
    balance: Mapped[float] = mapped_column(Float, default=0.0)
