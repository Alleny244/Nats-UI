from fastapi import APIRouter

from controllers.creating.message import MessageController
from controllers.creating.streams import StreamsController
from models import JetStreamParams, PublishParams

router = APIRouter(tags=["Endpoint used to create a new nats connection"])


@router.post("/stream")
async def create_stream(params: JetStreamParams):
    return await StreamsController().create_streams(properties=params)


@router.post("/publish")
async def publish_message(params: PublishParams):
    return await MessageController().publish(params=params)
