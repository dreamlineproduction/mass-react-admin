import { useState } from "react";
import PageTitle from "../others/PageTitle";
import './phoneframe2.scss';
import Select from 'react-select';

const NewNotification = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [notificationName, setNotificationName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]); // For multi-select
    const [isSelectAll, setIsSelectAll] = useState(false);

    // Example user data (can be fetched from backend)
    const users = [
        { value: 'user1', label: 'John Doe' },
        { value: 'user2', label: 'Jane Smith' },
        { value: 'user3', label: 'Alice Johnson' },
        { value: 'user4', label: 'Bob Williams' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        const notificationData = {
            title,
            description,
            imageUrl,
            notificationName,
            selectedUsers: isSelectAll ? users.map(user => user.value) : selectedUsers
        };

        // Logic to send notification via Firebase
        console.log(notificationData);
    };

    const handleSelectAll = (isSelected) => {
        setIsSelectAll(isSelected);
        if (isSelected) {
            setSelectedUsers(users.map(user => user.value));
        } else {
            setSelectedUsers([]);
        }
    };

    return (
        <div>
            <PageTitle
                title="New Notification"
                buttonLink="/notification/all-notifications"    
                buttonLabel="Back To List"
            />
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
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Notification Description</label>
                                    <textarea
                                        rows="4"
                                        className="form-control"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Image URL (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Notification Name (Optional)</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={notificationName}
                                        onChange={(e) => setNotificationName(e.target.value)}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Select User(s)</label>
                                    <Select
                                        options={[{ value: 'select_all', label: 'Select All Users' }, ...users]}
                                        onChange={(selectedOptions) => {
                                            const isSelectedAll = selectedOptions.some(option => option.value === 'select_all');
                                            handleSelectAll(isSelectedAll);
                                            if (!isSelectedAll) {
                                                setSelectedUsers(selectedOptions.map(option => option.value));
                                            }
                                        }}
                                        isMulti
                                        isSearchable
                                        value={isSelectAll ? [{ value: 'select_all', label: 'Select All Users' }] : users.filter(user => selectedUsers.includes(user.value))}
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary large-btn mt-3">Send Notification</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-xl-4">
                    <div className="card">
                        <div className="card-header">
                            <strong>Preview Notification</strong>
                        </div>
                        <div className="card-body">
                            <div className="notification-preview mt-4">
                            <div className="phone-frame">
                                    <div className="notification">
                                        <div className="notification-header">
                                            <img src={imageUrl || 'https://via.placeholder.com/50'} alt="Notification" className="notification-icon" />
                                            <div className="notification-content">
                                                <div className="notification-title">{title || 'Notification Title'}</div>
                                                <div className="notification-body">{description || 'Notification description will appear here.'}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewNotification;