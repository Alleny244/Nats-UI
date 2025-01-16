import {useLocation, useNavigate} from "react-router-dom";
import "../css/errorPage.css";

const ErrorPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {errorMessage} = location.state || {
        errorMessage: {detail: "Unknown error occurred."},
    };

    const messageToDisplay = errorMessage?.detail || errorMessage || "An unknown error occurred.";

    return (<div className="error-page">
        <div className="error-page-container">
            <img
                src="/img.png"
                alt="NATS Logo"
                className="error-logo"
            />
            <h1 className="error-title">Oops! Something went wrong.</h1>
            <p className="error-message">{messageToDisplay}</p>
            <div className="error-actions">
                <button
                    className="home-button"
                    onClick={() => navigate("/")}
                >
                    Go to Home
                </button>
            </div>
        </div>
    </div>);
};

export default ErrorPage;
