import asyncio

from nats.js import JetStreamContext
from nats.js.api import ConsumerConfig
from fastapi import HTTPException, Response
from nats.js.client import Subscription
from beartype import beartype

from models import PublishParams, SubscribeParams
from models.message import ConsumerTypeEnum
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

    @staticmethod
    async def ack_message(message: Subscription) -> None:
        async for msg in message.messages:
            await msg.ack()

    @beartype
    async def subscribe(self, params: SubscribeParams) -> Response:
        try:
            nats_client = NatsClient().return_nats_client()
            jetstream_context: JetStreamContext = nats_client.jetstream()
            await jetstream_context.stream_info(name=params.stream_name)
            config = ConsumerConfig()
            durable = None
            if params.type == ConsumerTypeEnum.EPHEMERAL:
                config = ConsumerConfig(name=params.consumer_name)
            else:
                durable = params.consumer_name
            message = await jetstream_context.subscribe(
                subject=params.subjects[0], config=config, durable=durable
            )
            asyncio.create_task(self.ack_message(message))
            return Response(status_code=200)
        except Exception as e:
            print(e)
            raise HTTPException(status_code=500, detail=e.description)
