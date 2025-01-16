FROM python:3.12-slim AS base

RUN apt-get update --fix-missing
RUN apt-get install -y --no-install-recommends gcc g++ git curl
RUN apt-get clean


RUN pip install --upgrade pip poetry


WORKDIR /app

COPY pyproject.toml pyproject.toml
COPY poetry.lock poetry.lock

RUN poetry config virtualenvs.create false
RUN poetry install --no-root --only main


COPY app/ .



EXPOSE 8080
CMD ["uvicorn", "apps:app", "--host", "0.0.0.0", "--port", "8080"]
