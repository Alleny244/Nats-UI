from fastapi import APIRouter, Response
from beartype import beartype

router = APIRouter(tags=["Health Check Route"])


@router.post("/")
@beartype
def monitor_connection() -> Response:
    return Response(content="OK")
