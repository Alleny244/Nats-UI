from fastapi import APIRouter
from models import JetStreamParams

router = APIRouter(tags=["Endpoint used to create a new nats connection"])


@router.post("/stream")
async def create_stream(params: JetStreamParams):
    print(params)
