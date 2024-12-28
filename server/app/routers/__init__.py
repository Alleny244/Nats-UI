from .health import router as health_router
from .write import router as create_router

__all__ = [health_router, create_router]
