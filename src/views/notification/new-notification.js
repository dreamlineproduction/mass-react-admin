import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCardHeader, CForm, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CRow, CCol } from '@coreui/react';
import Select from 'react-select'; // To enable multi-select and searchable dropdowns
import './phoneframe.css';

const NewNotification = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [notificationName, setNotificationName] = useState('');
    const [sendTo, setSendTo] = useState('bulk');  // single or bulk
    const [userId, setUserId] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]); // For multi-select

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
            sendTo,
            userId: sendTo === 'single' ? userId : null,
            selectedUsers: sendTo === 'bulk' ? selectedUsers : null
        };

        // Logic to send notification via Firebase
        console.log(notificationData);
    };

    return (
        <CRow>
            {/* Left card - Notification form */}
            <CCol md={4}>
                <CCard>
                    <CCardHeader>
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>Create New Notification</strong>
                        </div>
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
                                <CFormLabel>Image URL</CFormLabel>
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
                                <CFormLabel>Send To</CFormLabel>
                                <CFormSelect value={sendTo} onChange={(e) => setSendTo(e.target.value)}>
                                    <option value="bulk">Bulk Users</option>
                                    <option value="single">Single User</option>
                                </CFormSelect>
                            </div>

                            <CButton type="submit" color="primary">Send Notification</CButton>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>

            {/* Right card - User selection & Preview */}
            <CCol md={4}>
                <CCard>
                    <CCardHeader>
                        <strong>Select User(s)</strong>
                    </CCardHeader>
                    <CCardBody>
                        {/* Single user selection */}
                        {sendTo === 'single' && (
                            <div className="mb-3">
                                <CFormLabel>Select Single User</CFormLabel>
                                <Select
                                    options={users}
                                    onChange={(option) => setUserId(option.value)}
                                    isSearchable
                                />
                            </div>
                        )}

                        {/* Bulk user selection */}
                        {sendTo === 'bulk' && (
                            <div className="mb-3">
                                <CFormLabel>Select Multiple Users</CFormLabel>
                                <Select
                                    options={users}
                                    onChange={(selectedOptions) => setSelectedUsers(selectedOptions.map(option => option.value))}
                                    isMulti
                                    isSearchable
                                />
                            </div>
                        )}
                    </CCardBody>
                </CCard>


            </CCol>


            <CCol md={4}>
                {/* Preview Card */}
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
