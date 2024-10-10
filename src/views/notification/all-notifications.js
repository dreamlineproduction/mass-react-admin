import { CButton, CCard, CCardBody, CCardHeader, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck } from "@coreui/react";
import { Link } from "react-router-dom";



const AllNotifications = () => {




    return (
        <CCard>
            <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                    <div><strong>All Notifications</strong></div>
                    <div className="d-flex">
                        <div>
                            <Link to={'/notification/new-notification'}>
                                <CButton color="primary" className="me-3">+ New Notification</CButton>
                            </Link>
                        </div>

                    </div>
                </div>
            </CCardHeader>

            <CCardBody>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>

                                <th>Offer ID</th>
                                <th>Image</th>
                                <th>Title</th>
                                <th>In Homepage ?</th>
                                <th>Created At</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>

                                <td>1</td>
                                <td>asdadasd</td>
                                <td>adasd</td>
                                <td>asdasdasd</td>
                                <td>asdasdasd</td>
                                <td>asdasdasd</td>
                                <td>dasdasd</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </CCardBody>

        </CCard >
    );
};

export default AllNotifications;