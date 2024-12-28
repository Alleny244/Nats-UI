from fastapi import FastAPI, Depends
from routers import health_router, create_router


app = FastAPI()
import middleware  # noqa

app.include_router(prefix="/health", router=health_router)
app.include_router(
    prefix="/create",
    router=create_router,
    dependencies=[Depends(middleware.return_nats_client)],
)
