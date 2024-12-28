class NatsConnectionError(Exception):
    def __init__(
        self,
        message: str = "Unable to establish connection with nats server",
    ):
        super().__init__(message)

    pass
