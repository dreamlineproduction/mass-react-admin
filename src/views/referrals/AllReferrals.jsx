import { CButton, CCard, CCardBody, CCardHeader, CFormInput } from "@coreui/react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { actionFetchData } from "../../actions/actions";
import { API_URL } from "../../config";
import Pagination from "../../components/Pagination";
import AuthContext from "../../context/auth";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass, cilTrash, cilPenAlt } from "@coreui/icons";



const AllReferrals = () => {
    const { Auth } = useContext(AuthContext);
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const [qrCodes, setQrCode] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Modal state
    const [selectedReferral, setSelectedReferral] = useState(null); // Store selected referral details

    // Fetch data
    let finalUrl = `${API_URL}/qr-codes?page=${pageNumber}&perPage=${perPage}`;
    const fetchData = async () => {
        setLoading(true); // Loading on

        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setQrCode(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [pageNumber]);

    // Function to handle modal open and store the selected referral data
    const handleOpenModal = (referral) => {
        setSelectedReferral(referral); // Save referral details
        setShowModal(true); // Open modal
    };

    const handleCloseModal = () => {
        setShowModal(false); // Close modal
        setSelectedReferral(null); // Clear selected referral
    };

    return (
        <CCard>
            <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                    <div><strong>All Referrals</strong></div>
                    <div className="d-flex">
                        <div>
                            <Link to={'/referrals/new-referrals'}>
                                <CButton color="primary" className="me-3">+ Add New Referral</CButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </CCardHeader>

            <CCardBody>
                <div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User Name</th>
                                <th>Mobile</th>
                                <th>No of referrals</th>
                                <th>XP Earned</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Balaram Das</td>
                                <td>+917812587458</td>
                                <td>22</td>
                                <td>220</td>
                                <td>
                                    <CButton color="primary" variant="outline" onClick={() => handleOpenModal({ id: 1, name: "Balaram Das", mobile:"+917812587458", numbereferrals:"22", xpearned:"220" })}>
                                        <CIcon icon={cilMagnifyingGlass} />
                                    </CButton>

                                    <CButton color="dark" variant="outline" className="ms-2">
                                        <CIcon icon={cilPenAlt} />
                                    </CButton>
                                    <CButton color="danger" variant="outline" className="ms-2">
                                        <CIcon icon={cilTrash} />
                                    </CButton>
                                </td>
                            </tr>

                            <tr>
                                <td>2</td>
                                <td>Balaram Das</td>
                                <td>+917812587458</td>
                                <td>22</td>
                                <td>220</td>
                                <td>
                                    <CButton color="primary" variant="outline" onClick={() => handleOpenModal({ id: 1, name: "Balaram Das", mobile:"+917812587458", numbereferrals:"22", xpearned:"220" })}>
                                        <CIcon icon={cilMagnifyingGlass} />
                                    </CButton>

                                    <CButton color="dark" variant="outline" className="ms-2">
                                        <CIcon icon={cilPenAlt} />
                                    </CButton>
                                    <CButton color="danger" variant="outline" className="ms-2">
                                        <CIcon icon={cilTrash} />
                                    </CButton>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div className='d-flex align-items-start justify-content-end'>
                    <Pagination
                        pageCount={pageCount}
                        handlePageChange={(event) => setPageNumber(event.selected + 1)}
                    />
                </div>
            </CCardBody>

            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Referral Details</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <div className="referraluserbody">
                                <p><strong>ID:</strong> {selectedReferral?.id}</p>
                                <p><strong>Name:</strong> {selectedReferral?.name}</p>
                                <p><strong>Mobile:</strong> {selectedReferral?.mobile}</p>
                                <p><strong>No of referrals:</strong> {selectedReferral?.numbereferrals}</p>
                                <p><strong>XP Earned:</strong> {selectedReferral?.xpearned}</p>
                                {/* You can add more details about the referral here */}
                                </div>

                                <div className="referraltable table-responsive mt-4">
                                <table class="table table-bordered">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">User</th>
      <th scope="col">Joined On</th>
      <th scope="col">Total XP Earned</th>
      
      <th scope="col">Contact</th>
      <th scope="col">Last Scanned Product</th>
      <th scope="col">Referee's Earned XP</th>
      <th scope="col">Referral's Total XP (20%)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>12th Sept 2024</td>
      <td>2000XP</td>
      <td>+91878587445</td>
      <td>Mass Polymar 250gm (21DSD5488754)</td>
      <td>100XP</td>
      <td>20XP</td>
    </tr>
    
    <tr>
      <th scope="row">2</th>
      <td>Shyam</td>
      <td>12th Sept 2024</td>
      <td>2000XP</td>
      <td>+91878587445</td>
      <td>Mass Polymar 250gm (21DSD5488754)</td>
      <td>100XP</td>
      <td>20XP</td>
    </tr>

    <tr>
      <th scope="row">3</th>
      <td>Ram</td>
      <td>12th Sept 2024</td>
      <td>2000XP</td>
      <td>+91878587445</td>
      <td>Mass Polymar 250gm (21DSD5488754)</td>
      <td>100XP</td>
      <td>20XP</td>
    </tr>
  </tbody>
</table>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </CCard>
    );
};

export default AllReferrals;
