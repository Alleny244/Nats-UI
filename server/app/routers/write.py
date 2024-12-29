from fastapi import APIRouter

from controllers.creating.streams import StreamsController
from models import JetStreamParams

router = APIRouter(tags=["Endpoint used to create a new nats connection"])


@router.post("/stream")
async def create_stream(params: JetStreamParams):
    return await StreamsController().create_streams(properties=params)
