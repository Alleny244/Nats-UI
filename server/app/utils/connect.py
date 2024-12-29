from fastapi import HTTPException
from nats import connect
from nats.aio.client import Client as NATS
from beartype import beartype
import logging

from exceptions import NatsConnectionError

logger = logging.getLogger(__name__)

nats_client: NATS = None


class NatsClient:
    @staticmethod
    async def handle_error_cb(e) -> None:
        logger.error(e)
        raise NatsConnectionError()

    # TODO: Replace NATS_URL with url specific to Docker
    @beartype
    async def connect(self) -> NATS:
        nc = await connect(
            servers="nats://localhost:4222", error_cb=self.handle_error_cb
        )
        return nc

    async def store_nats_client(self):
        global nats_client
        try:
            nats_client = await self.connect()
        except NatsConnectionError as e:
            logger.error(f"Failed to connect to NATS: {e}")

    @staticmethod
    def return_nats_client():
        if nats_client is None:
            raise HTTPException(
                status_code=500,
                detail="NATS server is down. Please check the server status.",
            )
        return nats_client
