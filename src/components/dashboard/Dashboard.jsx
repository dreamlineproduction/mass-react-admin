import { Link } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { actionFetchData } from "../../actions/actions";
import { API_URL, exportToExcel } from "../../config";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Pagination from "../others/Pagination";
import { BiCloudDownload } from "react-icons/bi";
import IndiaMap from "./IndiaMap";
import BsModal from "../others/BsModal";

const Dashboard = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const perPage = 20;

    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [dashboard, setDashboard] = useState({});
    const [stateUsers, setStateUser] = useState([]);
    const [cityUsers, setCityUser] = useState([]);

    // Transaction State
    const [loadingTransaction, setLoadingTransaction] = useState(true);
    const [transactions, setTransaction] = useState([]);
    const [pageNumberTransaction, setPageNumberTransaction] = useState(1);
    const [pageCountTransaction, setPageCountTransaction] = useState(0);
    const [selectedValue, setSelectedValue] = useState('');


    // Qr Codes State
    const [loadingQrCode, setLoadingQrCode] = useState(true);
    const [qrCodes, setQrCode] = useState([]);
    const [pageNumberQrCode, setPageNumberQrCode] = useState(1);
    const [pageCountQrCode, setPageCountQrCode] = useState(0);

    const [manageUi, setManageUi] = useState({
        selectedState: '',
        selectedCity: '',
        loadingModal: false,
    });



    const [mapLoading, setMapLoading] = useState(true);
    const [mapData, setMapData] = useState(null);



    const fetchDashboard = async () => {
        //--Fetch Data
        let response = await actionFetchData(`${API_URL}/dashboard`, accessToken);
        response = await response.json();

        if (response.status) {
            setDashboard(response);
            setStateUser(response.users)
            setDashboardLoading(false)
        }
    }

    const fetchTransaction = async () => {
        setLoadingTransaction(true)

        //--Fetch Data
        let finalUrl = `${API_URL}/dashboard/transaction?page=${pageNumberTransaction}&perPage=${perPage}`;
        if (selectedValue) {
            finalUrl += `&filter=${selectedValue}`;
        }

        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setTransaction(response.data.data);
            setPageCountTransaction(response.totalPage);
        }
        setLoadingTransaction(false)
    }

    const filterTransaction = (filter) => {
        setSelectedValue(filter)
    }

    const exportTransactionToExcel = () => {

        let data = transactions.map(item => {
            return {
                "#": item.id,
                "Referee name": item.referee.name,
                "Join Date": item.referral.created_at,
                "Contact": item.referral.phone,
                "Last Scanned Product": item?.reward?.title ? item.reward.short_title : 'N/A',
                "Earned XP": item?.referral?.total_xp ? item.referral.total_xp + ' XP' : '0 XP',
                "Total XP Balance": item?.referral?.balance_xp + ' XP' ? item.referral.balance_xp : '0 XP',
                "Referral’s Name": item.referral.name,
                "Referral’s Total XP Balance": item?.referee?.balance_xp + ' XP' ? item.referee.balance_xp : '0 XP',
            }
        })

        exportToExcel(data);
    };


    // Fetch data
    const fetchQrCodes = async () => {
        setLoadingQrCode(true);

        let response = await actionFetchData(`${API_URL}/qr-codes?page=${pageNumberQrCode}&perPage=${perPage}`, accessToken);
        response = await response.json();
        if (response.status) {
            setQrCode(response.data.data);
            setPageCountQrCode(response.totalPage);
        }

        setLoadingQrCode(false);
    }


    const handleStateShowModal = async (state) => {
        //setVisible(true)

        setManageUi({ ...manageUi, loadingModal: true, selectedState: state });


        //--Fetch Data
        let response = await actionFetchData(`${API_URL}/dashboard/state-users/${state}`, accessToken);
        response = await response.json();

        if (response.status) {
            setCityUser(response.users);
        }
        setManageUi({ ...manageUi, loadingModal: false, selectedState: state });
    }

    const exportCityUserToExcel = () => {
        let data = cityUsers.map(item => {
            return {
                "#": item.id,
                "City": item.city,
                "Total User": item.total_user,
                "Active User": item.active_users,
                "InActive User": item.inactive_users,
            }
        })

        exportToExcel(data);
    }



    const fetchMap = async () => {
        //--Fetch Data
        let response = await actionFetchData(`${API_URL}/dashboard/map-data`, accessToken);
        response = await response.json();

        if (response.status) {
            setMapData(response.data);
            setMapLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboard();
        fetchMap();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetchTransaction();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumberTransaction, selectedValue])

    useEffect(() => {
        fetchQrCodes()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumberQrCode])


    return (
        <div>
            <PageTitle title="Dashboard" />
            {dashboardLoading &&
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="d-flex justify-content-center align-items-center">
                                <Loading />
                            </div>
                        </div>
                    </div>
                </div>
            }
            {Object.keys(dashboard).length > 0 && !dashboardLoading &&
                <div className="row">
                    <div className="col-12 col-md-6 col-xxl-3 d-flex">
                        <div className="card w-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="card-title mb-0">Total Users</h5>
                                    <span className="active-signal"></span> Active {dashboard.active_user_count}
                                    <span className="inactive-signal ms-4"></span> Inactive {dashboard.inactive_user_count}
                                </div>
                                <div>
                                    <h2>{dashboard.total_user_count}</h2>
                                </div>
                            </div>



                            <hr style={{ margin: "0" }} />
                            <div className="card-body">

                                <div className="align-self-center w-100">


                                    <table className="table mb-0">
                                        <tbody>
                                            <tr>
                                                <td>Carpenter</td>
                                                <td className="text-end">4306</td>
                                            </tr>
                                            <tr>
                                                <td>Contractor</td>
                                                <td className="text-end">3801</td>
                                            </tr>
                                            <tr>
                                                <td>Shop Owner</td>
                                                <td className="text-end">1689</td>
                                            </tr>
                                            <tr>
                                                <td>Dealer</td>
                                                <td className="text-end">1689</td>
                                            </tr>
                                            <tr>
                                                <td>Retail User</td>
                                                <td className="text-end">1689</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Link to="/users/all-users" className="btn btn-primary mt-4">All Users</Link>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-12 col-md-6 col-xxl-3 d-flex">
                        <div className="card w-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="card-title mb-0">Total Products</h5>
                                    <span className="active-signal"></span> Active {dashboard.active_product_count}
                                    <span className="inactive-signal ms-4"></span> Inactive {dashboard.inactive_product_count}
                                </div>
                                <div>
                                    <h2>{dashboard.total_product_count}</h2>
                                </div>
                            </div>



                            <hr style={{ margin: "0" }} />
                            <div className="card-body">

                                <div className="align-self-center w-100">


                                    <table className="table mb-0">
                                        <tbody>
                                            <tr>
                                                <td>Mass Wood Polish</td>

                                            </tr>
                                            <tr>
                                                <td>Mass Wood Polish</td>

                                            </tr>
                                            <tr>
                                                <td>Mass Wood Polish</td>
                                            </tr>
                                            <tr>
                                                <td>Mass Wood Polish</td>
                                            </tr>
                                            <tr>
                                                <td>Mass Wood Polish</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <Link to="/products/all-products" className="btn btn-primary mt-4">All Products</Link>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="col-12 col-md-6 col-xxl-3 d-flex">
                        <div className="card w-100">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="card-title mb-0">Total Redemption</h5>
                                    
                                </div>
                                <div>
                                    <h2>{dashboard.total_redemption_count}</h2>
                                </div>
                            </div>



                            <hr style={{ margin: "0" }} />
                            <div className="card-body">

                                <div className="align-self-center w-100">


                                    <table className="table mb-0">
                                        <tbody>
                                            <tr>
                                                <td>Delivered</td>
                                                <td className="text-end">4306</td>
                                            </tr>
                                            <tr>
                                                <td>In-Transit</td>
                                                <td className="text-end">4306</td>
                                            </tr>
                                            <tr>
                                                <td>Pending</td>
                                                <td className="text-end">4306</td>
                                            </tr>
                                            <tr>
                                                <td>Declined</td>
                                                <td className="text-end">4306</td>
                                            </tr>

                                        </tbody>
                                    </table>
                                    <Link to="/redemptions/all-redemptions" className="btn btn-primary mt-4">All Products</Link>
                                </div>
                            </div>
                        </div>
                    </div>





                 

                    <div className="col-12 col-sm-6 col-xl-4 col-xxl-3">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title mb-0">Total Offers</h3>
                            </div>
                            <div className="card-body pt-0">
                                <div className="row">
                                    <div className="col-12">
                                        <h1>{dashboard.total_offer_count}</h1>
                                    </div>
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-auto">
                                                <span className="active-signal"></span> Active {dashboard.active_offer_count}
                                            </div>
                                            <div className="col-auto">
                                                <span className="inactive-signal"></span> Inactive {dashboard.inactive_offer_count}
                                            </div>
                                        </div>
                                        <Link to="/offers/all-offers" className="btn btn-primary mt-4">All Offers</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <div className="mt-4">
                <PageTitle
                    title="All Referral XP transactions"
                    buttonLabel="View All"
                    buttonLink="referrals/all-referrals"
                />

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="my-4 d-flex justify-content-end gap-3">
                                <div>
                                    <select className="form-select" defaultValue={selectedValue} onChange={(e) => filterTransaction(e.target.value)}>
                                        <option disabled value={''} >Select Date</option>
                                        <option value="1_week">1 Week</option>
                                        <option value="15_days">15 Days</option>
                                        <option value="1_month">1 Month</option>
                                        <option value="3_month">3 Months</option>
                                        <option value="1_year">1 Year</option>
                                    </select>
                                </div>
                                <div>
                                    <button
                                        onClick={exportTransactionToExcel}
                                        className="btn btn-outline-primary me-4">
                                        <BiCloudDownload /> Export as Excel
                                    </button>
                                </div>
                            </div>

                            {loadingTransaction &&
                                <Loading />
                            }
                            {!loadingTransaction && transactions.length === 0 &&
                                <NoState

                                />
                            }

                            {transactions.length > 0 &&
                                <table className="table table-striped table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">Referee name</th>
                                            <th scope="col">Join Date</th>
                                            <th scope="col">Contact</th>
                                            <th scope="col">Last Scanned Product</th>
                                            <th scope="col">Earned XP</th>
                                            <th scope="col">Total XP Balance</th>
                                            <th scope="col">Referral’s Name</th>
                                            <th scope="col">Referral’s Total XP Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            transactions.map(item => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td scope="row">{item.id}</td>
                                                        <td>{item.referral.name}</td>
                                                        <td>{item.referral.created_at}</td>
                                                        <td>{item.referral.phone}</td>
                                                        <td>{item?.reward?.title ? item.reward.short_title : 'N/A'}</td>
                                                        <td>{item?.referral?.total_xp ? item.referral.total_xp : 0} XP</td>
                                                        <td>{item?.referral?.balance_xp ? item.referral.balance_xp : 0} XP</td>
                                                        <td>{item?.referee?.name ? item.referee.name : 'N/A'}</td>
                                                        <td>{item?.referee?.balance_xp ? item.referee.balance_xp : 0} XP</td>
                                                    </tr>
                                                )
                                            })

                                        }
                                    </tbody>
                                </table>
                            }
                        </div>

                        {transactions.length > 0 &&
                            <div className='d-flex  align-items-start justify-content-end'>
                                <Pagination
                                    pageCount={pageCountTransaction}
                                    handlePageChange={(event) => setPageNumberTransaction(event.selected + 1)}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* Recent Qr Codes Details */}
            <div className="mt-4">
                <PageTitle title="Recent QR Details" buttonLabel="View All" buttonLink="qr-manager/all-qr" />

                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            {loadingQrCode &&
                                <Loading />
                            }
                            {!loadingQrCode && qrCodes.length === 0 &&
                                <NoState

                                />
                            }

                            {qrCodes.length > 0 &&
                                <table className="table table-striped table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">ID</th>
                                            <th scope="col">Product Name</th>
                                            <th scope="col">XP Assigned</th>
                                            <th scope="col">Batch Number</th>
                                            <th scope="col">Created At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            qrCodes.map(item => {
                                                return (
                                                    <tr key={`qr-${item.id}`}>
                                                        <td scope="row">{item.id}</td>
                                                        <td>{item.name}</td>
                                                        <td>{item.xp_value}</td>
                                                        <td>{item.batch_number}</td>
                                                        <td>{item.created_at}</td>
                                                    </tr>
                                                )
                                            })

                                        }
                                    </tbody>
                                </table>
                            }
                        </div>

                        {qrCodes.length > 0 &&
                            <div className='d-flex  align-items-start justify-content-end'>
                                <Pagination
                                    pageCount={pageCountQrCode}
                                    handlePageChange={(event) => setPageNumberQrCode(event.selected + 1)}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>

            {/* User Tracking */}
            <div className="mt-4">
                <PageTitle title=" User Tracking" />

                <div className="row">
                    <div className="col-12">
                        {mapLoading &&
                            <div className="d-flex justify-content-center align-items-center">
                                <Loading />
                            </div>
                        }
                    </div>

                    <div className="col-7">
                        {!mapLoading &&
                            <IndiaMap
                                stateInfo={mapData}
                            />
                        }
                    </div>
                    <div className="col-5">
                        {stateUsers.length === 0 && !mapLoading &&
                            <NoState
                                message="No state user found."
                            />
                        }

                        {stateUsers.length > 0 &&
                            <table className="table table-striped table-hover mb-0 border mb-0">
                                <thead>
                                    <tr>
                                        <th scope="col">State</th>
                                        <th scope="col">Total Users</th>
                                        <th scope="col">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        stateUsers.map(item => {
                                            return (
                                                <tr key={item.id}>
                                                    <th>{item.state_str}</th>
                                                    <td>{item.total_user}</td>
                                                    <td>
                                                        <button
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#cityModal"
                                                            type="button"
                                                            className="btn btn-primary"
                                                            onClick={() => handleStateShowModal(item.state_str)}>
                                                            View Details
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
                </div>
            </div>

            {/* Modals */}
            <BsModal
                modalId="cityModal"
                title={manageUi.selectedState}
                size="xl"
                showCloseBtn={false}
            >
                {manageUi.loadingModal === true &&
                    <div className="d-flex justify-content-center align-items-center">
                        <Loading />
                    </div>
                }

                {cityUsers.length > 0 && manageUi.loadingModal === false &&
                    <div>
                        <div className='d-flex justify-content-between'>
                            <div>
                                Showing all users from {manageUi.selectedState}
                            </div>
                            <div>
                                <button
                                    className="btn btn-outline-primary 'ms-2"
                                    onClick={exportCityUserToExcel}
                                >
                                    <BiCloudDownload /> Export as Excel
                                </button>
                            </div>
                        </div>
                    </div>
                }

                {cityUsers.length === 0 &&
                    <NoState
                        message='No records found (s).'
                    />
                }

                {cityUsers.length > 0 &&
                    <div className='city-table mt-4'>
                        <table className="table table-striped table-hover mb-0 border mb-0">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">District</th>
                                    <th scope="col">Total Users</th>
                                    <th scope="col">Total Active Users</th>
                                    <th scope="col">Total Inactive Users</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    cityUsers.map(item => {
                                        return (
                                            <tr key={`city-user-${item.id}`}>
                                                <td scope="row">{item.id}</td>
                                                <td>{item.city}</td>
                                                <td>{item.total_user}</td>
                                                <td>{item.active_users}</td>
                                                <td>{item.inactive_users}</td>
                                                <td>
                                                    <Link target="_blank" to={`/users/city-users/${item.city}`}>
                                                        <button className="btn btn-primary">View Details</button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                }
            </BsModal>
        </div>
    );
};

export default Dashboard;