from nats.js import JetStreamContext
from fastapi.exceptions import HTTPException

from utils import NatsClient


class NatsDashboardController:
    async def get_message_info(self, stream_info, jetstream: JetStreamContext):
        for stream in stream_info:
            for consumer in stream["consumers"]:
                unacknowledged_messages = []
                pending_messages = []
                for i in range(
                    consumer["acked_consumer"] + 1, consumer["delivered_stream"] + 1
                ):
                    message = await jetstream.get_msg(
                        stream_name=stream["name"],
                        seq=i,
                    )
                    unacknowledged_messages.append(
                        {"data": message.data, "seq": message.seq}
                    )
                for i in range(
                    consumer["delivered_stream"] + 1,
                    consumer["delivered_stream"] + consumer["num_pending"] + 1,
                ):
                    message = await jetstream.get_msg(stream_name=stream["name"], seq=i)
                    pending_messages.append({"data": message.data, "seq": message.seq})
                consumer.update(
                    {
                        "unacknowledged_messages": unacknowledged_messages,
                        "pending_messages": pending_messages,
                    }
                )
        return stream_info

    async def dashboard(self):
        try:
            nats_client = NatsClient().return_nats_client()
            server = nats_client._server_info
            server_info = {}
            server_info.update(
                {
                    "server_id": server["server_id"],
                    "version": server["version"],
                    "client_id": server["client_id"],
                }
            )
            jetstream = nats_client.jetstream()
            streams = await jetstream.streams_info()
            stream_info = []

            for stream in streams:
                messages = []
                for i in range(stream.state.first_seq, stream.state.last_seq + 1):
                    message = await jetstream.get_msg(
                        stream_name=stream.config.name, seq=i
                    )
                    messages.append(
                        {"data": message.data.decode("utf-8"), "seq": message.seq}
                    )

                stream_info.append(
                    {
                        "name": stream.config.name,
                        "consumer_count": stream.state.consumer_count,
                        "subject": stream.config.subjects[0],
                        "messages": messages,
                        "retention": stream.config.retention,
                        "message_count": stream.state.messages,
                        "first_seq": stream.state.first_seq,
                        "last_seq": stream.state.last_seq,
                        "discard": stream.config.discard,
                        "bytes": stream.state.bytes,
                        "num_deleted": 0
                        if not stream.state.num_deleted
                        else stream.state.num_deleted,
                    }
                )
            for stream_index, name in enumerate(stream_info):
                consumers = await jetstream.consumers_info(stream=name["name"])
                consumer_info = []
                for consumer in consumers:
                    consumer_info.append(
                        {
                            "name": consumer.name,
                            "delivered_consumer": consumer.delivered.consumer_seq,
                            "delivered_stream": consumer.delivered.stream_seq,
                            "acked_consumer": consumer.ack_floor.consumer_seq,
                            "acked_stream": consumer.ack_floor.stream_seq,
                            "num_pending": consumer.num_pending,
                            "num_ack_pending": consumer.num_ack_pending,
                            "num_redelivered": consumer.num_redelivered,
                        }
                    )
                stream_info[stream_index].update({"consumers": consumer_info})
            stream_info = await NatsDashboardController().get_message_info(
                stream_info=stream_info, jetstream=jetstream
            )
            return stream_info, server_info
        except Exception as e:
            raise HTTPException(status_code=500, detail=e.description)
