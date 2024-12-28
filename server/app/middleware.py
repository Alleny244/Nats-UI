from fastapi.exceptions import HTTPException

from fastapi.middleware.cors import CORSMiddleware

from exceptions import NatsConnectionError
from utils import NatsClient

from apps import app

nats_client = None
origins = ["*"]

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"]
)


@app.on_event("startup")
async def startup_event():
    global nats_client
    try:
        nats_client = await NatsClient().connect()
    except NatsConnectionError as e:
        print(f"Failed to connect to NATS: {e}")


def return_nats_client():
    if nats_client is None:
        raise HTTPException(
            status_code=500,
            detail="NATS server is down. Please check the server status.",
        )

    return nats_client
