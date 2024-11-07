import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFloating, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { actionDeleteData, actionFetchData, actionFetchSetting, actionPostData } from "../../actions/actions";
import { API_URL } from "../../config";
import Pagination from "../../components/Pagination";
import AuthContext from "../../context/auth";
import CIcon from "@coreui/icons-react";
import { cilMagnifyingGlass, cilTrash, cilPenAlt, cilSearch } from "@coreui/icons";
import Loading from "../../components/Loading";
import NoState from "../../components/NoState";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import LoadingButton from "../../components/LoadingButton";



const AllReferrals = () => {
    const { Auth } = useContext(AuthContext);
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const [setting, setSetting] = useState(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [referralCommissionModal, setReferralCommissionModal] = useState(false)


    const [selectedReferral, setSelectedReferral] = useState(null);
    const [referee, setReferee] = useState([]);
    const [referrals, setReferral] = useState([]);
    const [search, setSearchinput] = useState('')

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();

    let finalUrl = `${API_URL}/referral?page=${pageNumber}&perPage=${perPage}`;
    const fetchReferee = async () => {
        setLoading(true);
        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setReferee(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false)
    }

    const fetchSetting = async () => {
        const setting = await actionFetchSetting(accessToken);
        reset(setting.data)
    }


    const handleOpenModal = async (referral) => {
        setShowModal(true);
        setLoading(true)
        setSelectedReferral(referral);

        let response = await actionFetchData(`${API_URL}/referral/all/${referral.from_id}`, accessToken);
        response = await response.json();
        if (response.status) {
            setReferral(response.data);
        }
        setLoading(false)
    };


    const deleteReferralCode = async (refereeId) => {
        Swal.fire({
            title: "Delete Confirmation",
            text: "Are you sure you want to delete this referral code ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                actionDelete(refereeId)
            }
        });
    }

    // Delete Data
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")

        try {
            let response = await actionDeleteData(`${API_URL}/referral/${id}`, accessToken);
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    const handlerSearch = () => {
        if (search.trim() !== '') {
            finalUrl += `&search=${search}`
            fetchReferee();
        }
    };

    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")

        try {
            let response = await actionPostData(`${API_URL}/settings/1`, accessToken, data, 'PUT');
            response = await response.json();

            setReferralCommissionModal(false);
            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
            } else {
                toast.error('server error', {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })

    useEffect(() => {
        fetchSetting()
    }, [])

    useEffect(() => {
        fetchReferee();
    }, [pageNumber]);


    return (
        <main>
            <div className="mb-4 d-flex justify-content-end  gap-3">
                <div className="search-input-outer">
                    <input
                        onChange={(e) => {
                            setSearchinput(e.target.value)
                            if (e.target.value === '') {
                                fetchReferee()
                            }
                        }}
                        value={search}
                        className="form-control"
                        type="text"
                        placeholder="Search..."
                    />
                </div>

                <div>
                    <CButton onClick={handlerSearch} color="primary" className="me-3">
                        <CIcon icon={cilSearch} /> Search
                    </CButton>
                </div>
            </div>
            <CCard>
                <CCardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>All Referrals</strong>
                        </div>
                        <div>
                            <CButton onClick={() => setReferralCommissionModal(!referralCommissionModal)} color="dark" type="submit" >Add Referral Commission</CButton>
                        </div>
                    </div>
                </CCardHeader>

                <CCardBody>
                    <div className="table-responsive">
                        {isLoading && referee.length === 0 &&
                            <Loading />
                        }

                        {referee.length > 0 ?
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
                                    {
                                        referee.map(item => {
                                            return (
                                                <tr key={`referee-${item.id}`}>
                                                    <td>{item.from_id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.total_referral || 0}</td>
                                                    <td>0</td>
                                                    <td>
                                                        <CButton color="primary" variant="outline" onClick={() => handleOpenModal(item)}>
                                                            <CIcon icon={cilMagnifyingGlass} />
                                                        </CButton>
                                                        <CButton color="danger" variant="outline" className="ms-2" onClick={() => deleteReferralCode(item.from_id)}>
                                                            <CIcon icon={cilTrash} />
                                                        </CButton>
                                                    </td>
                                                </tr>
                                            )
                                        })

                                    }

                                </tbody>
                            </table>
                            :
                            <NoState
                                message="No Referee"
                            />
                        }
                    </div>

                    {referee.length > 0 &&
                        <div className='d-flex align-items-start justify-content-end'>
                            <Pagination
                                pageCount={pageCount}
                                handlePageChange={(event) => setPageNumber(event.selected + 1)}
                            />
                        </div>
                    }

                </CCardBody>

                {/* Modal */}
                {showModal && (
                    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Referral Details</h5>
                                    <button type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setShowModal(false)
                                            setSelectedReferral(null)
                                        }}>

                                    </button>
                                </div>
                                <div className="modal-body">
                                    <div className="referraluserbody">
                                        <p><strong>ID:</strong> {selectedReferral?.id}</p>
                                        <p><strong>Name:</strong> {selectedReferral?.name}</p>
                                        <p><strong>Mobile:</strong> {selectedReferral?.phone}</p>
                                        <p><strong>No of referrals:</strong> {selectedReferral.total_referral || 0}</p>
                                        <p><strong>XP Earned:</strong> {selectedReferral?.xp || 0}</p>
                                    </div>

                                    {isLoading && referrals.length === 0 &&
                                        <Loading />
                                    }

                                    {referrals.length > 0 ?
                                        <div className="referraltable table-responsive mt-4">
                                            <table className="table table-bordered">
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
                                                    {referrals.map(item => {
                                                        return (
                                                            <tr key={`referrals-${item.id}`}>
                                                                <th scope="row">{item.referral.id || 'N/A'}</th>
                                                                <td>{item.referral.name || 'N/A'}</td>
                                                                <td>{item.referral.created_at || 'N/A'}</td>
                                                                <td>0XP</td>
                                                                <td>{item.referral.phone || 'N/A'}</td>
                                                                <td>{'N/A'}</td>
                                                                <td>{0}XP</td>
                                                                <td>{0}XP</td>
                                                            </tr>
                                                        )
                                                    })

                                                    }



                                                </tbody>
                                            </table>
                                        </div>
                                        :
                                        <NoState
                                            message="No Referral"
                                        />
                                    }

                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => {
                                            setShowModal(false)
                                            setSelectedReferral(null)
                                        }}>

                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <CModal
                    alignment="center"
                    backdrop="static"
                    visible={referralCommissionModal}
                    onClose={() => setReferralCommissionModal(false)}
                    aria-labelledby="StaticBackdropExampleLabel"
                >
                    <CForm onSubmit={handleSubmit(submitHandler)}>
                        <CModalHeader>
                            <CModalTitle id="StaticBackdropExampleLabel">Referral Commission</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                            <CCol md="12">
                                <CFormFloating>
                                    <CFormInput
                                        {...register("commission", {
                                            required: "Please enter title",
                                            validate: {
                                                isInteger: (value) =>
                                                    Number.isInteger(Number(value)) || "Only integer values are allowed."
                                            }
                                        })}
                                        className={errors.commission && 'is-invalid'}
                                        type="text"
                                        id="commission"
                                        name='commission'
                                        floatingLabel="Commission(%)"
                                        placeholder="Enter Commission*"
                                    />
                                </CFormFloating>
                                <p className="invalid-feedback d-block">{errors.commission?.message}</p>
                            </CCol>
                        </CModalBody>
                        <CModalFooter className="justify-content-start">
                            {isSubmitting ?
                                <LoadingButton />
                                :
                                <CButton color="primary" type="submit" >Save</CButton>
                            }
                        </CModalFooter>
                    </CForm>

                </CModal>


            </CCard>
        </main>
    );
};

export default AllReferrals;
