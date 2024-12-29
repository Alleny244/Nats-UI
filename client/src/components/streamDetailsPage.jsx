import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import '../css/streamDetailsPage.css';

const StreamDetails = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [streamName, setStreamName] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [inputsubject, setInputsubject] = useState('');
    const [serverId, setServerId] = useState('');
    const [clientId, setClientId] = useState('');
    const [consumerName, setConsumerName] = useState('');
    const [messageToPublish, setMessageToPublish] = useState('');
    const [consumedMessages, setConsumedMessages] = useState([]);

    useEffect(() => {
        if (location.state) {
            const {name, subjects, server_id, client_id} = location.state.data;
            setStreamName(name || 'Not Set');
            setSubjects(subjects || []);
            setServerId(server_id || 'Not Set');
            setClientId(client_id || 'Not Set');
        }
    }, [location.state]);

    const handlePublishMessage = async () => {
        if (!messageToPublish || !subjects.length) {
            alert("Please provide subject and message to publish.");
            return;
        }

        const payload = {
            name: streamName, input_subject: inputsubject, message: messageToPublish, subjects: subjects
        };

        try {
            const response = await fetch('http://localhost:8078/create/publish', {
                method: 'POST', headers: {
                    'Content-Type': 'application/json',
                }, body: JSON.stringify(payload),
            });
            if (response.ok) {
                console.log("Message published successfully:", payload);
                alert("Message published successfully!");
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.detail || "An error occurred";
                navigate("/error", {
                    state: {
                        errorMessage

                    }

                });
            }
        } catch (error) {
            console.error("Error publishing message:", error);
        }

        setMessageToPublish('');

    };

    const handleConsumeMessage = () => {
        if (!consumerName || !subjects.length) {
            alert("Please provide consumer name and subject to listen.");
            return;
        }
        console.log("Message Consumed from Subject:", {consumerName, subject: subjects[0]});
        setConsumedMessages([...consumedMessages, `Message from ${subjects[0]} consumed by ${consumerName}`]);
    };

    const handleMonitor = () => {
        console.log("Monitoring stream:", streamName);
        alert(`Monitoring started for stream: ${streamName}`);
    };

    return (<div className="stream-details-container">
        <div className="stream-header">
            <h1>Stream Details</h1>
            <div className="stream-info">
                <p><strong>Stream Name:</strong> {streamName}</p>
                <p><strong>Subjects:</strong> {subjects.length > 0 ? subjects.join(", ") : "Not Set"}</p>
                <p><strong>Server ID:</strong> {serverId}</p>
                <p><strong>Client ID:</strong> {clientId}</p>
            </div>
        </div>

        <div className="action-container">
            <div className="action-panel produce">
                <h3>Produce Message</h3>
                <div className="form-group">
                    <label>Subject</label>
                    <input
                        type="text"
                        placeholder="Enter subject name"
                        value={inputsubject}
                        onChange={(e) => setInputsubject(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Message to Publish</label>
                    <input
                        type="text"
                        placeholder="Enter message"
                        value={messageToPublish}
                        onChange={(e) => setMessageToPublish(e.target.value)}
                    />
                </div>
                <button onClick={handlePublishMessage} className="action-btn publish-btn">Publish Message</button>
            </div>

            <div className="action-panel consume">
                <h3>Consume Message</h3>
                <div className="form-group">
                    <label>Consumer Name</label>
                    <input
                        type="text"
                        placeholder="Enter consumer name"
                        value={consumerName}
                        onChange={(e) => setConsumerName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Subject to Listen</label>
                    <input
                        type="text"
                        placeholder="Enter subject to listen"
                        value={''}
                        onChange={(e) => setSubjects([e.target.value])}
                    />
                </div>
                <button onClick={handleConsumeMessage} className="action-btn consume-btn">Consume Message</button>


            </div>
        </div>

        <div className="monitor-section">
            <button onClick={handleMonitor} className="action-btn monitor-btn">Monitor</button>
        </div>
    </div>);
};

export default StreamDetails;
