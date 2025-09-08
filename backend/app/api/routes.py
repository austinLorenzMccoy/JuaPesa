from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    USSDSessionRequest,
    USSDSessionResponse,
    ConvertRequest,
    ConvertResponse,
    RebalanceRequest,
    RebalanceResponse,
    KYCRequest,
    KYCResponse,
    DarajaDebitRequest,
    DarajaDebitResponse,
    ForecastRequest,
    ForecastResponse,
    OperatorSummaryResponse,
)
from app.services.wallet import WalletService
from app.services.liquidity import LiquidityService
from app.services.auth import AuthService
from app.integrations.integration_factory import get_daraja_client
from app.services.forecast import ForecastService

router = APIRouter()


@router.post("/ussd/session", response_model=USSDSessionResponse)
async def ussd_session(req: USSDSessionRequest):
    # Simulate state progression
    next_state = (req.menuState or "start") + ":next"
    prompt = f"Received input '{req.input}' from {req.phone}."
    return USSDSessionResponse(prompt=prompt, nextMenuState=next_state, actions=["confirm"]) 


@router.post("/convert", response_model=ConvertResponse)
async def convert(req: ConvertRequest):
    try:
        tx_id = WalletService().convert(
            user_id=req.userId,
            from_rail=req.from_.rail,
            from_operator=req.from_.operator,
            amount=req.from_.amount,
            to_token=req.to.token,
            to_chain=req.to.chain,
            mode=req.mode,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return ConvertResponse(status="submitted", txId=tx_id, estimatedCompletion="~15s", fees=0.05)


@router.post("/liquidity/rebalance", response_model=RebalanceResponse)
async def liquidity_rebalance(req: RebalanceRequest):
    try:
        order_id, status = LiquidityService().rebalance(
            source_pool=req.sourcePool,
            dest_pool=req.destPool,
            amount=req.amount,
            reason=req.reason,
            window=req.predictedDemandWindow,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return RebalanceResponse(orderId=order_id, status=status)


@router.post("/kyc/verify", response_model=KYCResponse)
async def kyc_verify(req: KYCRequest):
    try:
        status, level = AuthService().verify_kyc(req.phone, req.idNumber, req.fullName)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return KYCResponse(status=status, level=level)


@router.post("/daraja/debit", response_model=DarajaDebitResponse)
async def daraja_debit(req: DarajaDebitRequest):
    try:
        client = get_daraja_client()
        res = client.simulate_debit(req.phone, req.amount)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return DarajaDebitResponse(**res)


@router.post("/forecast", response_model=ForecastResponse)
async def forecast(req: ForecastRequest):
    try:
        predicted = ForecastService().predict(operator=req.operator, window=req.window)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return ForecastResponse(operator=req.operator, window=req.window, predictedNetFlow=predicted)


@router.get("/operators/{operator}/summary", response_model=OperatorSummaryResponse)
async def operator_summary(operator: str, window: str = "4h"):
    try:
        summary = ForecastService().operator_summary(operator=operator, window=window)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return OperatorSummaryResponse(operator=operator, summary=summary)
