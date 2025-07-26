from fastapi import APIRouter

router = APIRouter(prefix="/healthz", tags=["Healthz"])

@router.get("")
def healthz():
    return {"status": "ok"}