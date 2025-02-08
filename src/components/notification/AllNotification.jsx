import { useEffect, useState } from "react";
import PageTitle from "../others/PageTitle";
import { API_URL } from "../../config";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AllNotification = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

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

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This notification will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`${API_URL}/notifications/${id}`, {
                        method: "DELETE",
                    });

                    const result = await response.json();
                    if (response.ok) {
                        toast.success("Notification deleted successfully!");
                        setNotifications(notifications.filter((n) => n.id !== id)); // Remove from UI
                    } else {
                        toast.error(result.message || "Failed to delete notification.");
                    }
                } catch (error) {
                    toast.error("An error occurred while deleting the notification.");
                }
            }
        });
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        const time = date.toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
    
        // Add suffix (st, nd, rd, th) for day
        const getDayWithSuffix = (day) => {
            if (day > 3 && day < 21) return `${day}th`;
            const suffixes = ["st", "nd", "rd"];
            return `${day}${suffixes[(day % 10) - 1] || "th"}`;
        };
    
        return `${getDayWithSuffix(day)} ${month} ${year} at ${time}`;
    };
    return (
        <div>
            <PageTitle
                title="All Notifications"
                buttonLink="/notification/new-notification"
                buttonLabel="+ Create New Notification"
            />
            <div className="row">
                <div className="col-12">
                    <div className="card">
<div className="card-body">
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>Notification Name</th>
                                    <th>Created At</th>
                                    <th>Status</th>
                                    <th>Action</th> 
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <tr key={n.id}>
                                            <td>{n.id}</td>
                                            <td>{n.title}</td>
                                            <td>{n.body}</td>
                                            <td>{n.notification_name || "N/A"}</td>
                                            <td>{formatDate(n.created_at)}</td>
                                            <td>
                                                <span className={`badge ${n.status === 1 ? 'd-inline-flex px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2' : 'd-inline-flex px-2 py-1 fw-semibold text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-2'}`}>
                                                    {n.status === 1 ? "Sent" : "Failed"}
                                                </span>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(n.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="text-center">No notifications found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>    
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllNotification;
