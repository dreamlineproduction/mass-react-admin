import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormLabel, CFormTextarea, CRow, CCol } from '@coreui/react';
import Select from 'react-select';
import './phoneframe.css';

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
        <CRow>
            {/* Left card - Notification form */}
            <CCol md={8}>
                <CCard>
                    <CCardHeader>
                        <strong>Create New Notification</strong>
                    </CCardHeader>
                    <CCardBody>
                        <CForm onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <CFormLabel>Notification Title</CFormLabel>
                                <CFormInput
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <CFormLabel>Notification Description</CFormLabel>
                                <CFormTextarea
                                    rows="4"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <CFormLabel>Image URL (Optional)</CFormLabel>
                                <CFormInput
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <CFormLabel>Notification Name (Optional)</CFormLabel>
                                <CFormInput
                                    value={notificationName}
                                    onChange={(e) => setNotificationName(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <CFormLabel>Select User(s)</CFormLabel>
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

                            <CButton type="submit" color="primary">Send Notification</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>

            {/* Right card - Preview */}
            <CCol md={4}>
                <CCard>
                    <CCardHeader>
                        <strong>Preview Notification</strong>
                    </CCardHeader>
                    <CCardBody>
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
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow>
    );
};

export default NewNotification;
