from enum import Enum

from pydantic import BaseModel


class PublishParams(BaseModel):
    name: str
    input_subject: str
    message: str


class ConsumerTypeEnum(str, Enum):
    DURABLE = "DURABLE"
    EPHEMERAL = "EPHEMERAL"


class SubscribeParams(BaseModel):
    stream_name: str
    type: ConsumerTypeEnum
    subjects: list[str]


class MonitorParams(BaseModel):
    stream_name: str
