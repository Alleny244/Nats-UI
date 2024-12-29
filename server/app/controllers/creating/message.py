from nats.js import JetStreamContext
from fastapi import HTTPException
from beartype import beartype

from models import PublishParams
from utils import NatsClient


class MessageController:
    @beartype
    async def publish(self, params: PublishParams) -> None:
        try:
            nats_client = NatsClient().return_nats_client()
            jetstream_context: JetStreamContext = nats_client.jetstream()
            await jetstream_context.stream_info(name=params.name)
            await jetstream_context.publish(
                subject=params.input_subject, payload=params.message.encode("utf-8")
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
