import { useState, useEffect, useContext } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import toast from "react-hot-toast";
import { API_URL } from "../../config";

const MAX_BODY_LENGTH = 250; // Limit for Notification Description

const NewNotification = () => {
    const { Auth } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [notificationName, setNotificationName] = useState("");
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchTokens = async () => {
            try {
                const response = await fetch(`${API_URL}/get-user-tokens`);
                const data = await response.json();
                if (data.status && data.tokens.length > 0) {
                    setTokens(data.tokens);
                }
            } catch (error) {
                toast.error("Failed to load user tokens.");
            }
        };

        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${API_URL}/notifications`);
                const data = await response.json();
                if (data.status) {
                    setNotifications(data.notifications);
                }
            } catch (error) {
                toast.error("Failed to load notifications.");
            }
        };

        fetchTokens();
        fetchNotifications();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !body || tokens.length === 0) {
            toast.error("Title, Body, and User Tokens are required.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/send-notification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, body, tokens, notification_name: notificationName || null }),
            });

            const result = await response.json();
            if (response.ok) {
                toast.success("Notification sent successfully!");
                setTitle("");
                setBody("");
                setNotificationName("");
            } else {
                toast.error(result.errors ? JSON.stringify(result.errors) : "Failed to send notification.");
            }
        } catch (error) {
            toast.error("An error occurred while sending the notification.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <PageTitle title="New Notification" buttonLink="/notification/all-notifications" buttonLabel="Back To List" />

            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-header">
                            <strong>Create New Notification</strong>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Notification Title</label>
                                    <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Notification Description</label>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                        value={body}
                                        onChange={(e) => {
                                            if (e.target.value.length <= MAX_BODY_LENGTH) {
                                                setBody(e.target.value);
                                            }
                                        }}
                                        required
                                    />
                                    <small className="text-muted">
                                        {body.length}/{MAX_BODY_LENGTH} characters
                                    </small>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Notification Name (Label)</label>
                                    <input type="text" className="form-control" value={notificationName} onChange={(e) => setNotificationName(e.target.value)} />
                                </div>

                                <button type="submit" className="btn btn-primary mt-3" disabled={loading}>
                                    {loading ? "Sending..." : "Send Notification"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            
            </div>
        </div>
    );
};

export default NewNotification;
