from fastapi import APIRouter

from controllers.creating.message import MessageController
from controllers.creating.streams import StreamsController
from controllers.monitoring import NatsDashboardController
from models import JetStreamParams, PublishParams, SubscribeParams

router = APIRouter(tags=["Endpoint used to create a new nats connection"])


@router.post("/stream")
async def create_stream(params: JetStreamParams):
    return await StreamsController().create_streams(properties=params)


@router.post("/publish")
async def publish_message(params: PublishParams):
    return await MessageController().publish(params=params)


@router.post("/subscribe")
async def subscribe_message(params: SubscribeParams):
    return await MessageController().subscribe(params=params)


@router.post("/monitor")
async def dashboard():
    return await NatsDashboardController().dashboard()
