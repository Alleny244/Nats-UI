import asyncio
import subprocess


async def connect():
    result = subprocess.run(  # noqa: ASYNC101
        "nats-server",
        shell=True,  # nosec
        stderr=subprocess.STDOUT,
        stdout=subprocess.PIPE,
        text=True,
        check=False,
    )

    print(result.stdout)


if __name__ == "__main__":
    asyncio.run(connect())
