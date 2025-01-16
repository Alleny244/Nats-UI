import {useState, useEffect} from "react";
import {
    Box, Typography, Divider, List, ListItem, Card, CardContent, CircularProgress,
} from "@mui/material";
import "../css/dashboard.css";
import {useNavigate} from "react-router-dom";

const App = () => {
    const navigate = useNavigate();
    const [selectedStream, setSelectedStream] = useState(null);
    const [selectedConsumer, setSelectedConsumer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [serverData, setServerData] = useState(null);
    const [streamData, setStreamData] = useState([]);

    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/create/monitor`, {
                method: "POST",
            });
            if (response.status === 500) {
                const errorData = await response.json();
                const errorMessage = errorData.detail || "An error occurred";
                navigate("/error", {
                    state: {errorMessage},
                });
                return;
            }
            const result = await response.json();
            setStreamData(result[0]);
            setServerData(result[1]);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            window.location.reload();
        }, 30000);
        return () => clearInterval(intervalId);
    }, []);

    const handleStreamClick = (stream) => {
        setSelectedStream(stream);
        setSelectedConsumer(null);
    };

    return loading ? (<Box
        className="loading-container"
        sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            zIndex: 9999,
        }}
    >
        <CircularProgress/>
    </Box>) : (<Box className="app-container">
        <Card className="server-info glass-effect full-width" elevation={3}>
            <CardContent>
                <Typography className="server-inform">
                    <strong>Nats Server Info</strong>
                </Typography>
                <Typography className="subtext">
                    <span className="label">Server ID:</span>
                    <span className="version">
              <strong>{serverData.server_id}</strong>
            </span>
                </Typography>
                <Typography className="subtext">
                    <span className="label">Version:</span>
                    <span className="version">
              <strong>{serverData.version}</strong>
            </span>
                </Typography>
                <Typography className="subtext">
                    <span className="label">Client ID:</span>
                    <span className="version">
              <strong>{serverData.client_id}</strong>
            </span>
                </Typography>
            </CardContent>
        </Card>

        <Box className="main-container">
            <Card className="stream-container glass-effect">
                <CardContent>
                    <Typography variant="h6" className="section-header">
                        <strong>Streams</strong>
                    </Typography>
                    <List>
                        {streamData.map((stream) => (<ListItem
                            key={stream.name}
                            className={`stream-item ${selectedStream?.name === stream.name ? "active" : ""}`}
                            onClick={() => handleStreamClick(stream)}
                        >
                            <Box>
                                <Typography>{stream.name}</Typography>
                            </Box>
                        </ListItem>))}
                    </List>
                </CardContent>
            </Card>

            <Card className="consumer-container glass-effect">
                <CardContent>
                    <Typography variant="h6" className="section-header">
                        <strong>Consumers</strong>
                    </Typography>
                    {selectedStream ? (<List>
                        {selectedStream.consumers.map((consumer) => (<ListItem
                            key={consumer.name}
                            className={`consumer-item ${selectedConsumer?.name === consumer.name ? "active" : ""}`}
                            onClick={() => setSelectedConsumer(consumer)}
                        >
                            <Box>
                                <Typography>{consumer.name}</Typography>
                            </Box>
                        </ListItem>))}
                    </List>) : (<Typography className="placeholder-text">
                        Select a stream to view consumers.
                    </Typography>)}
                </CardContent>
            </Card>

            <Card className="details-container glass-effect">
                <CardContent>
                    {selectedStream && !selectedConsumer ? (<Box>
                        <Typography className="details-header">
                            Stream - {selectedStream.name}
                        </Typography>

                        <div className="stream-details-container">
                            <div className="detail-item">
                                <span className="label">Subject:</span>
                                <span className="value">{selectedStream.subject}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Retention:</span>
                                <span className="value">{selectedStream.retention}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Messages:</span>
                                <span className="value">{selectedStream.message_count}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Consumers:</span>
                                <span className="value">{selectedStream.consumer_count}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Discard:</span>
                                <span className="value">{selectedStream.discard}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">First Sequence:</span>
                                <span className="value">{selectedStream.first_seq}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Last Sequence:</span>
                                <span className="value">{selectedStream.last_seq}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Bytes:</span>
                                <span className="value">{selectedStream.bytes}</span>
                            </div>
                        </div>

                        <Typography className="details-subheader">Messages</Typography>
                        <Box className="message-list" style={{maxHeight: "500px", overflowY: "auto"}}>
                            {selectedStream.messages.map((message) => (<Box key={message.id} className="message-box">
                                <Typography>
                                    Sequence: <strong>{message.seq}</strong>
                                </Typography>
                                <Typography>
                                    Content: <strong>{message.data}</strong>
                                </Typography>
                            </Box>))}
                        </Box>
                    </Box>) : selectedConsumer ? (<Box>
                        <Typography className="details-header">
                            Consumer - {selectedConsumer.name}
                        </Typography>

                        <Card className="consumer-details-card">
                            <CardContent>
                                <div className="consumer-details-container">
                                    <div className="detail-item">
                                        <span className="label">Consumer:</span>
                                        <span className="value">{selectedConsumer.name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Redelivered Messages:</span>
                                        <span className="value">
                          {selectedConsumer.num_redelivered}
                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Outstanding Acks:</span>
                                        <span className="value">
                          {selectedConsumer.num_ack_pending}
                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Unprocessed Messages:</span>
                                        <span className="value">
                          {selectedConsumer.num_pending}
                        </span>
                                    </div>
                                    <div className="detail-item">
                        <span className="label">
                          Last Delivered Message Consumer Sequence:
                        </span>
                                        <span className="value">
                          {selectedConsumer.delivered_consumer}
                        </span>
                                    </div>
                                    <div className="detail-item">
                        <span className="label">
                          Last Delivered Message Stream Sequence:
                        </span>
                                        <span className="value">
                          {selectedConsumer.delivered_stream}
                        </span>
                                    </div>
                                    <div className="detail-item">
                        <span className="label">
                          Acknowledgment Floor Consumer Sequence:
                        </span>
                                        <span className="value">
                          {selectedConsumer.acked_consumer}
                        </span>
                                    </div>
                                    <div className="detail-item">
                        <span className="label">
                          Acknowledgment Floor Stream Sequence:
                        </span>
                                        <span className="value">
                          {selectedConsumer.acked_stream}
                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Typography className="details-subheader">Messages</Typography>
                        <Divider className="divider"/>
                        <Box className="message-list" style={{maxHeight: "500px", overflowY: "auto"}}>
                            {selectedConsumer.unacknowledged_messages.map((message) => (
                                <Box key={message.id} className="message-box">
                                    <Typography>
                                        Sequence: <strong>{message.seq}</strong>
                                    </Typography>
                                    <Typography>
                                        Content: <strong>{message.data}</strong>
                                    </Typography>
                                    <Typography>Status:<strong> Unacknowledged </strong></Typography>
                                </Box>))}
                            {selectedConsumer.pending_messages.map((message) => (
                                <Box key={message.id} className="message-box">
                                    <Typography>
                                        Sequence: <strong>{message.seq}</strong>
                                    </Typography>
                                    <Typography>
                                        Content: <strong>{message.data}</strong>
                                    </Typography>
                                    <Typography>Status: <strong>Pending</strong></Typography>
                                </Box>))}
                        </Box>
                    </Box>) : (<Typography className="placeholder-text">
                        Select a stream or consumer to view details.
                    </Typography>)}
                </CardContent>
            </Card>
        </Box>
    </Box>);
};

export default App;
