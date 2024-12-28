import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "../css/errorPage.css";

const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {errorMessage, streamName, subjects, streamProperties} = location.state || {
        errorMessage: {detail: "Unknown error occurred."},
        streamName: "",
        subjects: "",
        streamProperties: {},
    };

    const [loading, setLoading] = useState(false);

    const handleRetry = async () => {
        setLoading(true);

        const requestData = {
            streamName,
            subjects: subjects.split(",").map((subject) => subject.trim()),
            ...streamProperties,
        };

        try {
            const response = await fetch("http://localhost:8078/create/stream", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });

            if (response.status === 500) {
                const errorData = await response.json();
                const errorMessage = errorData.detail || "An error occurred";
                navigate("/error", {state: {errorMessage, streamName, subjects, streamProperties}});
                return;
            }

            if (!response.ok) {
                throw new Error(`Failed to create stream. Status: ${response.status}`);
            }

            alert(`Stream "${streamName}" created successfully!`);
            navigate("/success");
        } catch (error) {
            console.error("Error:", error);
            alert("Error creating stream. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const messageToDisplay = errorMessage?.detail || errorMessage || "An unknown error occurred.";

    return (
        <div className="error-page">
            <div className="error-page-container">
                <img
                    src={require("../assets/nats-logo.png")}
                    alt="NATS Logo"
                    className="error-logo"
                />
                <h1 className="error-title">Oops! Something went wrong.</h1>
                <p className="error-message">{messageToDisplay}</p>
                <div className="error-actions">
                    <button
                        className="retry-button"
                        onClick={handleRetry}
                        disabled={loading}
                    >
                        {loading ? "Retrying..." : "Retry"}
                    </button>
                    <button
                        className="home-button"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
