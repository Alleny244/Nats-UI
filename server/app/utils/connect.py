import logging

from nats import connect, NATS
from beartype import beartype

from exceptions import NatsConnectionError

logger = logging.getLogger(__name__)


class NatsClient:
    @staticmethod
    async def handle_error_cb(e) -> None:
        logger.error(e)
        raise NatsConnectionError()

    # TODO: Replace NATS_URL with url specific docker
    @beartype
    async def connect(self) -> NATS:
        nc = await connect(
            servers="nats://localhost:4222", error_cb=self.handle_error_cb
        )
        return nc
