from pydantic import BaseModel, Field
from typing import Literal, Optional


class USSDSessionRequest(BaseModel):
    sessionId: str
    phone: str
    input: str
    menuState: Optional[str] = None


class USSDSessionResponse(BaseModel):
    prompt: str
    nextMenuState: str
    actions: list[Literal["debit", "credit", "convert", "confirm"]] = Field(default_factory=list)


class ConvertLeg(BaseModel):
    rail: str
    operator: Optional[str] = None
    amount: float


class ConvertDest(BaseModel):
    token: str
    chain: Optional[str] = None


class ConvertRequest(BaseModel):
    userId: str
    from_: ConvertLeg = Field(alias="from")
    to: ConvertDest
    mode: Literal["fast", "standard"] = "fast"

    class Config:
        populate_by_name = True


class ConvertResponse(BaseModel):
    status: Literal["submitted", "failed", "completed"]
    txId: str
    estimatedCompletion: str
    fees: float


class RebalanceRequest(BaseModel):
    sourcePool: str
    destPool: str
    amount: float
    reason: Optional[str] = None
    predictedDemandWindow: Optional[str] = None


class RebalanceResponse(BaseModel):
    orderId: str
    status: Literal["placed", "failed", "executed"]


class KYCRequest(BaseModel):
    phone: str
    idNumber: str
    fullName: str


class KYCResponse(BaseModel):
    status: Literal["approved", "pending", "rejected"]
    level: int


class DarajaDebitRequest(BaseModel):
    phone: str
    amount: float


class DarajaDebitResponse(BaseModel):
    status: str
    ref: str


class ForecastRequest(BaseModel):
    operator: str
    window: Literal["1h", "4h", "24h"] = "4h"


class ForecastResponse(BaseModel):
    operator: str
    window: str
    predictedNetFlow: float


class OperatorSummaryResponse(BaseModel):
    operator: str
    summary: str
