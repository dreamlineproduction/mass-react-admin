import { useCallback, useContext, useEffect, useState } from "react";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import LoadingButton from "../others/LoadingButton";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { actionDeleteData, actionFetchData, actionPostData,actionFetchSetting } from "../../actions/actions";
import AuthContext from "../../context/auth";
import { API_URL } from "../../config";
import Swal from "sweetalert2";
import Pagination from "../others/Pagination";
import { Link } from "react-router-dom";
import { Search, Trash2 } from "react-feather";
import BsModal from "../others/BsModal";
const AllReferrals = () => {
    const { Auth } = useContext(AuthContext);
    const perPage = 20;
    const accessToken = Auth('accessToken');

    //const [setting, setSetting] = useState(null);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [isReferralLoading, setReferralLoading] = useState(false);

    //const [showModal, setShowModal] = useState(false);
    //const [referralCommissionModal, setReferralCommissionModal] = useState(false)


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
        //setShowModal(true);
        setReferralLoading(true)
        setSelectedReferral(referral);

        let response = await actionFetchData(`${API_URL}/referral/all/${referral.from_id}`, accessToken);
        response = await response.json();
        if (response.status) {
            setReferral(response.data);
        }
        setReferralLoading(false)
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

            //setReferralCommissionModal(false);
            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
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
        <div>
            <BsModal 
                modalId="referralDetail"
                title="Referral Details"
            >
               
                <div className="referraluserbody">
                    <div className="mb-2"><strong>ID:</strong> {selectedReferral?.id}</div>
                    <div className="mb-2"><strong>Name:</strong> {selectedReferral?.name}</div>
                    <div className="mb-2"><strong>Mobile:</strong> {selectedReferral?.phone}</div>
                    <div className="mb-2"><strong>No of referrals:</strong> {selectedReferral?.total_referral || 0}</div>
                    <div className="mb-2"><strong>XP Earned:</strong> {selectedReferral?.total_xp || 0} XP</div>
                </div>

                {isReferralLoading && referrals.length === 0 &&
                    <div className="d-flex justify-content-center align-items-center">
                        <Loading />
                    </div>
                }
                {referrals.length === 0 && !isReferralLoading &&
                    <NoState
                        message="No Referral"
                    />
                }
                    
                {referrals.length > 0 &&
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
                                    <th scope="col">Referee&apos;s Earned XP</th>
                                    <th scope="col">Referral&apos;s Total XP (20%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {referrals.map(item => {
                                    return (
                                        <tr key={`referrals-${item.id}`}>
                                            <th scope="row">{item.referral.id || 'N/A'}</th>
                                            <td>{item.referral.name || 'N/A'}</td>
                                            <td>{item.referral.created_at || 'N/A'}</td>
                                            <td>{item?.referral?.total_xp ? item.referral.total_xp  : 0} XP</td>
                                            <td>{item.referral.phone || 'N/A'}</td>
                                            <td>{item?.lastScan?.product?.name ? item.lastScan.product.short_name :  'N/A'}</td>
                                            <td>{item?.lastScan?.xp ? item.lastScan.xp :  '0'} XP</td>
                                            <td>{item?.commission?.xp ? item.commission.xp:  0} XP</td>
                                        </tr>
                                    )
                                })

                                }



                            </tbody>
                        </table>
                    </div>                   
                }
            </BsModal>

            {/* Commission Modal */}
            <BsModal 
                modalId="commissionModal"
                title="Add Referral Commission"
                size="md"
                showCloseBtn={false}
            >
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="mb-3">
                        <input 
                            {...register("commission", {
                                required: "Please enter title",
                                validate: {
                                    isInteger: (value) =>
                                        Number.isInteger(Number(value)) || "Only integer values are allowed."
                                }
                            })}
                            className={`form-control remove-arrow ${errors.commission && 'is-invalid'}`}
                            type="number"
                            id="commission"
                            name='commission'
                            placeholder="Commission(%)"
                        />
                        <p className="invalid-feedback">{errors.commission?.message}</p>
                    </div>
                    <div>
                        {isSubmitting ?
                            <LoadingButton />
                            :
                            <button type="submit" className="btn btn-primary">Save</button>
                        }
                    </div>
                </form>
            </BsModal>
                
           
            <div className="mb-3 d-flex align-items-center justify-content-between">
                <h1 className="h3 d-inline align-middle">{`All Referrals`}</h1>
                <div>
                    <button 
                        type="button" 
                        data-bs-target="#commissionModal"
                        data-bs-toggle="modal"
                        className="btn btn-primary">
                            Add Referral Commission
                        </button>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="card">  
                        <div className="my-4 d-flex justify-content-end gap-3">
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
                                    <button
                                        type="button"
                                        onClick={handlerSearch}
                                        className="btn btn-primary me-3">
                                        Search
                                    </button>
                                </div>
                            </div>                      
                            {isLoading &&
                                <Loading />
                            }
                            {!isLoading && referee.length === 0 &&
                                <NoState
                                    message="No referee found."
                                />
                            }

                            {referee.length > 0 &&
                                <table className="table table-striped table-hover mb-0">
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
                                                <tr key={item.id}>
                                                    <td>{item.from_id}</td>
                                                    <td>
                                                        <Link to={`/users/edit-user/${item.from_id}`}>
                                                            {item.name}
                                                        </Link>
                                                    </td>
                                                    <td>{item.phone}</td>
                                                    <td>{item.total_referral || 0}</td>
                                                    <td>{item.total_xp || 0 } XP</td>
                                                    <td>
                                                    
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-outline-primary px-2 py-2 me-2"
                                                            data-bs-toggle="modal" 
                                                            data-bs-target="#referralDetail"
                                                            onClick={() => {
                                                                handleOpenModal(item)
                                                            }}>                                                        
                                                            <Search />
                                                        </button>
                                                        <button type="button" className="btn btn-outline-danger px-2 py-2" onClick={() => deleteReferralCode(item.from_id)}>                                                        
                                                            <Trash2 />
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                </table>
                            }
                        </div>

                        {referee.length > 0 &&
                            <div className='d-flex  align-items-start justify-content-end'>
                                <Pagination
                                    pageCount={pageCount}
                                    handlePageChange={(event) => setPageNumber(event.selected + 1)}
                                />
                            </div>
                        }
                </div>
            </div>
           
        </div>
    );
};

export default AllReferrals;