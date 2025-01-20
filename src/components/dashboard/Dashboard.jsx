import { Link } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { actionFetchData } from "../../actions/actions";
import { API_URL, configPermission, exportToExcel, getValueOrDefault } from "../../config";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Pagination from "../others/Pagination";
import { BiCloudDownload } from "react-icons/bi";
import IndiaMap from "./IndiaMap";
import BsModal from "../others/BsModal";
import TopCard from "../others/TopCard";

const Dashboard = () => {
    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const perPage = 20;

    const [dashboardLoading, setDashboardLoading] = useState(true);
    const [userRoleCount,setUserRoleCount] = useState("");
    const [products,setProduct] = useState("");
    const [orders,setOrder] = useState("");
    const [district,setDistrict] = useState([]);
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

        // Card 1 Total Users
        const result = await actionFetchData(`${API_URL}/users/roles/count`,accessToken)
        const response = await result.json()
        if(response.status === 200)
        {
            setUserRoleCount(response)
        }

        // Card 2 Total Products
        const resultI = await actionFetchData(`${API_URL}/dashboard/products?page=1&perPage=5`,accessToken)
        const responseI = await resultI.json()
        if(responseI.status === 200)
        {
            setProduct(responseI)
        }

        // Card 3 Total Redemption
        const resultII = await actionFetchData(`${API_URL}/dashboard/redemption`,accessToken)
        const responseII = await resultII.json()
        if(responseII.status === 200)
        {
            setOrder(responseII)
        }

        // Card 4 Top 6 Districts by Users
        const resultIII = await actionFetchData(`${API_URL}/users/district/count?limit=6`,accessToken)
        const responseIII = await resultIII.json()
        if(responseIII.status === 200)
        {
            setDistrict(responseIII.data)
        }
        
        // Card 5 States and total users 
        const resultIV = await actionFetchData(`${API_URL}/users/states/count`,accessToken)
        const responseIV = await resultIV.json()
        if(responseIV.status === 200)
        {
            setStateUser(responseIV.data)
            setDashboardLoading();
        }

        //--Fetch Data
        const resultV = await actionFetchData(`${API_URL}/dashboard/india-map-data`, accessToken);
        const responseV = await resultV.json();

        if (responseV.status) {
            setMapData(responseV.data);
            setMapLoading(false);
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

        setManageUi({ ...manageUi, loadingModal: true, selectedState: state });


        //--Fetch Data
        //let response = await actionFetchData(`${API_URL}/dashboard/state-users/${state}`, accessToken);
        //response = await response.json();
        let response = await actionFetchData(`${API_URL}/users/district/count?state=${state}`,accessToken)
        response = await response.json()
        if(response.status === 200)
        {
            //setDistrict(responseIII.data)
            setCityUser(response.data);
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
   
    useEffect(() => {
        fetchDashboard();
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
            <div className="row">
                <TopCard   
                    title="Total Users"                        
                    active={getValueOrDefault(userRoleCount.active_user,0)}
                    inactive={getValueOrDefault(userRoleCount.inactive_user,0)}
                    total={getValueOrDefault(userRoleCount.total_user,0)}
                    buttonLink={hasPermission(configPermission.VIEW_USER) ? '/users/all-users' : null}
                    buttonLabel={hasPermission(configPermission.VIEW_USER) ? 'All Users' : null}
                >
                    {userRoleCount?.data?.length > 0 ?
                        <table className="table mb-0">
                            <tbody>
                                {userRoleCount.data.map(item =>
                                    <tr key={`roles-${item.role_id}`}>
                                        <td>{item.name}</td>
                                        <td className="text-end">{item.total_user}</td>
                                    </tr>  
                                )}                                                                      
                            </tbody>
                        </table>
                        :
                        <NoState />
                    }                        
                </TopCard>

                <TopCard   
                    title="Total Products"                        
                    active={getValueOrDefault(products.active_product,0)}
                    inactive={getValueOrDefault(products.inactive_product,0)}
                    total={getValueOrDefault(products.total_product,0)}
                    buttonLink={hasPermission(configPermission.VIEW_PRODUCT) ? '/products/all-products' : null}
                    buttonLabel={hasPermission(configPermission.VIEW_PRODUCT) ? 'All Product' : null}
                >
                    {products?.data?.length > 0 ?
                        <table className="table mb-0">
                            <tbody>
                                {products.data.map(item =>
                                    <tr key={`products-${item.id}`}>
                                        <td>{item.short_name}</td>
                                    </tr>  
                                )}                                                                      
                            </tbody>
                        </table>
                        :
                        <NoState />
                    }                        
                </TopCard>

                <TopCard   
                    title="Total Redemption"                        
                    showActive={false}
                    total={getValueOrDefault(orders.total_redemption,0)}
                    buttonLink={hasPermission(configPermission.VIEW_REDEMPTION) ? '/redemptions/all-redemptions' : null}
                    buttonLabel={hasPermission(configPermission.VIEW_REDEMPTION) ? 'All Redemption' : null}
                >
                    <div className="redemption">
                        <table className="table mb-0">
                            <tbody>
                                <tr>
                                    <td><span className="active-signal"></span> Delivered</td>
                                    <td className="text-end">{getValueOrDefault(orders.total_deliver_redemption,0)}</td>
                                </tr>
                                <tr>
                                    <td><span className="transit-signal"></span> In-Transit</td>
                                    <td className="text-end">{getValueOrDefault(orders.total_transit_redemption,0)}</td>
                                </tr>
                                <tr>
                                    <td><span className="pending-signal"></span> Pending</td>
                                    <td className="text-end">{getValueOrDefault(orders.total_pending_redemption,0)}</td>
                                </tr>
                                <tr>
                                    <td><span className="inactive-signal"></span> Declined</td>
                                    <td className="text-end">{getValueOrDefault(orders.total_cancel_redemption,0)}</td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                </TopCard>
                    
                <TopCard   
                    title="Top 6 Districts by Users"                        
                    showActive={false}
                    total={district.reduce((sum,item) => sum + item.total_user,0)}
                    buttonLink={hasPermission(configPermission.VIEW_REDEMPTION) ? '/analytics/user-analytic' : null}
                    buttonLabel={hasPermission(configPermission.VIEW_REDEMPTION) ? 'User Analytic' : null}
                >
                    <div className="redemption">
                        {district.length > 0 ?
                        <table className="table mb-0">
                            <tbody>
                                {district.map(item => 
                                    <tr key={`district-${item.id}`}>
                                        <td>{item.district} <small className="text-muted">({item.state_str})</small></td>
                                        <td className="text-end">{item.total_user}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        :
                        <NoState />
                        }
                    </div>
                </TopCard>                   
            </div>

            <div className="mt-4">
                <PageTitle
                    title="All Referral XP transactions"
                    buttonLink={hasPermission(configPermission.VIEW_REFERRAL) ? '/referrals/all-referrals' : null}
                    buttonLabel={hasPermission(configPermission.VIEW_REFERRAL) ? 'View All' : null}
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
                <PageTitle 
                    title="Recent QR Details" 
                    buttonLink={hasPermission(configPermission.VIEW_QR) ? '/qr-manager/all-qr' : null}
                    buttonLabel={hasPermission(configPermission.VIEW_QR) ? 'View All' : null}
                />

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
                    <div className="col-6">
                        <div className="card">
                            <div className="card-body">
                                {mapLoading &&
                                    <div className="d-flex justify-content-center align-items-center">
                                        <Loading />
                                    </div>
                                }

                                {!mapLoading &&
                                    <IndiaMap
                                        stateInfo={mapData}
                                        accessToken={accessToken}
                                    />
                                }
                            </div>
                        </div>

                    </div>


                    <div className="col-6">
                        <div className="card">
                            <div className="card-body">
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
                                        stateUsers.map((item,index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{item.state_str}</td>
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
                                                <td>{item.district}</td>
                                                <td>{item.total_user}</td>
                                                <td>{item.active_user}</td>
                                                <td>{item.inactive_user}</td>
                                                <td>
                                                    <Link target="_blank" to={`/users/city-users/${item.district}`}>
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