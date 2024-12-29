from pydantic import BaseModel


class PublishParams(BaseModel):
    name: str
    input_subject: str
    message: str
    subjects: list[str]
