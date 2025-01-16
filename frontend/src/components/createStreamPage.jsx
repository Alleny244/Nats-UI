import  {useState} from "react";
import {useNavigate} from 'react-router-dom';
import "../css/createStreamPage.css";

const CreateStreamPage = () => {
    const [name, setName] = useState("");
    const [subjects, setSubjects] = useState("");
    const [streamProperties, setStreamProperties] = useState({
        retention: null, storage: null, discard: null,
    });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setStreamProperties({...streamProperties, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Stream name is required!");
            return;
        }

        if (!subjects.trim()) {
            alert("Subjects are required! Please enter them as a comma-separated list.");
            return;
        }

        const requestData = {
            name, subjects: subjects.split(",").map((subject) => subject.trim()), ...streamProperties,
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/create/stream`, {
                method: "POST", headers: {
                    "Content-Type": "application/json",
                }, body: JSON.stringify(requestData),
            });

            if (response.status === 500) {
                const errorData = await response.json();
                const errorMessage = errorData.detail || "An error occurred";
                navigate("/error", {state: {errorMessage, name, subjects, streamProperties}});
                return;
            }
            const data = await response.json()
            navigate("/modify", {
                state: {
                    data
                }
            });
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (<form className="create-stream-form" onSubmit={handleSubmit}>
            <h2 className="create-stream-title">Create Stream</h2>

            <div className="create-stream-field">
                <label htmlFor="streamName">Stream Name (Required)</label>
                <input
                    type="text"
                    id="streamName"
                    placeholder="Enter stream name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="create-stream-field">
                <label htmlFor="subjects">Subjects (Required)</label>
                <input
                    type="text"
                    id="subjects"
                    placeholder="Comma-separated subjects"
                    value={subjects}
                    onChange={(e) => setSubjects(e.target.value)}
                />
            </div>

            <div className="create-stream-field">
                <label htmlFor="retention">Retention Policy</label>
                <select
                    id="retention"
                    name="retention"
                    onChange={handleInputChange}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select a policy
                    </option>
                    <option value="limits">Limits</option>
                    <option value="interest">Interest</option>
                    <option value="workqueue">Work Queue</option>
                </select>
            </div>

            <div className="create-stream-field">
                <label htmlFor="storage">Storage Type</label>
                <select
                    id="storage"
                    name="storage"
                    onChange={handleInputChange}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select storage type
                    </option>
                    <option value="file">File</option>
                    <option value="memory">Memory</option>
                </select>
            </div>

            <div className="create-stream-field">
                <label htmlFor="discard">Discard Policy</label>
                <select
                    id="discard"
                    name="discard"
                    onChange={handleInputChange}
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select a policy
                    </option>
                    <option value="old">Old</option>
                    <option value="new">New</option>
                </select>
            </div>

            <div className="create-stream-buttons">
                <button
                    type="button"
                    className="create-stream-cancel"
                    onClick={() => navigate("/")}
                >
                    Cancel
                </button>
                <button type="submit" className="create-stream-submit">
                    Create Stream
                </button>
            </div>
        </form>);
};

export default CreateStreamPage;
