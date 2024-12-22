from fastapi import APIRouter, Response
from beartype import beartype

router = APIRouter(tags=["Health Check Route"])


@router.get("/")
@beartype
def health_check() -> Response:
    return Response(content="OK")
