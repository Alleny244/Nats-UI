from nats.js import JetStreamContext
from fastapi import HTTPException
from models import JetStreamParams
from beartype import beartype

from utils import NatsClient


class StreamsController:
    @beartype
    async def create_streams(self, properties: JetStreamParams) -> dict | HTTPException:
        try:
            nats_client = NatsClient().return_nats_client()
            result = nats_client._server_info
            jetstream_context: JetStreamContext = nats_client.jetstream()
            js = await jetstream_context.add_stream(**properties.model_dump())
            result.update({"name": js.config.name, "subjects": js.config.subjects})
            return result
        except Exception as e:
            raise HTTPException(status_code=500, detail=e.description)
