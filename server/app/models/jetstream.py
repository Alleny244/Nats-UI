from enum import Enum

from pydantic import BaseModel


class RetentionPolicy(str, Enum):
    LIMITS = "limits"
    INTEREST = "interest"
    WORK_QUEUE = "workqueue"


class StorageType(str, Enum):
    FILE = "file"
    MEMORY = "memory"


class DiscardPolicy(str, Enum):
    OLD = "old"
    NEW = "new"


class JetStreamParams(BaseModel):
    name: str | None = None
    subjects: list[str] | None = None
    retention: RetentionPolicy | None = None
    discard: DiscardPolicy | None = None
    storage: StorageType | None = None
    max_msgs: int | None = None
    max_bytes: int | None = None
    max_age: int | None = None
