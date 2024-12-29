from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers import health_router, create_router
from utils import NatsClient

app = FastAPI()


origins = ["*"]

app.add_middleware(
    CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"]
)


@app.on_event("startup")
async def startup_event():
    await NatsClient().store_nats_client()


app.include_router(prefix="/health", router=health_router)
app.include_router(
    prefix="/create",
    router=create_router,
    dependencies=[Depends(NatsClient().return_nats_client)],
)
