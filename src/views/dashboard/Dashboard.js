import React, { useContext, useEffect, useState } from 'react';
import { CCol, CRow, CCard, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CCardHeader, CCardBody, CContainer, CPagination, CPaginationItem, CCardTitle, CCardText, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormSelect, } from '@coreui/react';
import CIcon from "@coreui/icons-react";
import { Link, NavLink } from "react-router-dom";
import { cilCloudDownload } from "@coreui/icons";
import AuthContext from '../../context/auth';
import { actionFetchData } from '../../actions/actions';
import { API_URL, exportToExcel, getRandomInt, statusBadge } from "../../config";
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import NoState from '../../components/NoState';


const Dashboard = () => {

	const { Auth } =  useContext(AuthContext)
	const accessToken = Auth('accessToken');
	const perPage = 20;

	const [dashboard,setDashboard] = useState({});
	const [stateUsers,setStateUser] = useState([]);
	const [cityUsers,setCityUser] = useState([]);
	const [users,setUser] = useState([]);


	// Transaction State
	const [loadingTransaction,setLoadingTransaction] = useState(true);
	const [transactions,setTransaction] = useState([]);
	const [pageNumberTransaction, setPageNumberTransaction] = useState(1);
    const [pageCountTransaction, setPageCountTransaction] = useState(0);
	const [selectedValue, setSelectedValue] = useState('');


	// Qr Codes State
	const [loadingQrCode,setLoadingQrCode] = useState(true);
	const [qrCodes, setQrCode] = useState([]);
	const [pageNumberQrCode, setPageNumberQrCode] = useState(1);
    const [pageCountQrCode, setPageCountQrCode] = useState(0);

	const [manageUi,setManageUi] = useState({
		selectedState:'',
		selectedCity:'',
		loadingModal:false,
	});


  	const [visible, setVisible] = useState(false); // Modal visibility state
  	const [visible2, setVisible2] = useState(false)

  

 

  const fetchDashboard = async () => {
	//--Fetch Data
	let response = await actionFetchData(`${API_URL}/dashboard`,accessToken);
	response    = await response.json();
	
	if (response.status) {
		setDashboard(response);
		setStateUser(response.users)
	}          
  }

  const fetchTransaction = async () => {
	setLoadingTransaction(true)

	//--Fetch Data
	let finalUrl = `${API_URL}/dashboard/transaction?page=${pageNumberTransaction}&perPage=${perPage}`;
	if(selectedValue){
		finalUrl+=`&filter=${selectedValue}`;
	}

	let response = await actionFetchData(finalUrl,accessToken);
	response    = await response.json();	
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
			"#":item.id,
			"Referee name":item.referee.name,
			"Join Date":item.referral.created_at,
			"Contact":item.referral.phone,
			"Last Scanned Product":'N/A',
			"Earned XP":"0 xp",
			"Total XP Balance":"0 xp",
			"Referral’s Name":item.referral.name,
			"Referral’s Total XP Balance":0,
		}
	})

    exportToExcel(data);
  };


  // Fetch data
  const fetchQrCodes = async () => {
	setLoadingQrCode(true);

	let response =  await actionFetchData(`${API_URL}/qr-codes?page=${pageNumberQrCode}&perPage=${perPage}`,accessToken);
	response     = await response.json();
	if(response.status){
		setQrCode(response.data.data);
		setPageCountQrCode(response.totalPage);
	}  

	setLoadingQrCode(false);
  }


  const handleStateShowModal = async (state) =>{
	setVisible(true)
	setManageUi({...manageUi,loadingModal:true});
	

	//--Fetch Data
	let response = await actionFetchData(`${API_URL}/dashboard/state-users/${state}`,accessToken);
	response    = await response.json();
	
	if (response.status) {
		setCityUser(response.users);
	}          	
	setManageUi({...manageUi,loadingModal:false,selectedState:state});
  }

  const exportCityUserToExcel = () => {
	let data = cityUsers.map(item => {
		return {
			"#":item.id,
			"City":item.city,
			"Total User":item.total_user,
			"Active User":item.active_users,
			"InActive User":item.inactive_users,
		}
	})

	exportToExcel(data);
  }

  const handleCityShowModal = async (city) => {
	setManageUi({...manageUi,loadingModal:true});

	setVisible(false)
	setVisible2(true)


	//--Fetch Data
	let response = await actionFetchData(`${API_URL}/dashboard/city-users/${city}`,accessToken);
	response    = await response.json();
	
	if (response.status) {
		setUser(response.users);
	} 
	setManageUi({...manageUi,loadingModal:false,selectedCity:city});
  }

  const exportUserToExcel = () => {
	let data = users.map(item => {
		return {
			"#":item.id,
			"User Name":item.name,
			"Location":item.city,
			"Contact Number":item.phone,
			"Install Date":item.created_at,
			"Last Active":item.last_login,
			"Total XP Balance":item.total_xp ? item.total_xp : 0+' xp',
			"Total Reward Redeems":item.redeem_xp ? item.redeem_xp : 0+ ' xp'
		}
	})

	exportToExcel(data);
  }

  useEffect(() => {
	fetchDashboard();
  },[])

  useEffect(()=>{
	fetchTransaction();
  },[pageNumberTransaction,selectedValue])

  useEffect(()=>{
	fetchQrCodes()	
  },[pageNumberQrCode])


  return (
    <>
	{Object.keys(dashboard).length > 0 &&
	<CRow>
		<CCol md="3">
			<CCard>
				<CCardHeader>Total Users</CCardHeader>
				<CCardBody>
					<h1>{dashboard.total_user_count}</h1>
					<CContainer>
						<CRow className="justify-content-start dash-card-wrap mb-3 mt-2">
							<CCol xs={4} className='p-0'><span className='active-signal'></span>Active {dashboard.active_user_count}</CCol>
							<CCol xs={4} className='p-0'><span className='inactive-signal'></span>Inactive {dashboard.inactive_user_count}</CCol>
						</CRow>
					</CContainer>
					<Link className='btn btn-primary' to={'/users/all-users'}>All Users</Link>
				</CCardBody>
			</CCard>
		</CCol>

		<CCol md="3">
			<CCard>
				<CCardHeader>Total Products</CCardHeader>
					<CCardBody>
						<h1>{dashboard.total_product_count}</h1>
						<CContainer>
							<CRow className="justify-content-start dash-card-wrap mb-3 mt-2">
								<CCol xs={4} className='p-0'><span className='active-signal'></span>Active {dashboard.active_product_count}</CCol>
								<CCol xs={4} className='p-0'><span className='inactive-signal'></span>Inactive {dashboard.inactive_product_count}</CCol>
							</CRow>
						</CContainer>
						<Link className='btn btn-primary' to={'/products/all-products'}>All Products</Link>
				</CCardBody>
			</CCard>
		</CCol>

		<CCol md="3">
			<CCard>
				<CCardHeader>New Redemption</CCardHeader>
					<CCardBody>
						<h1>{dashboard.total_redemption_count}</h1>
						<CContainer>
							<CRow className="justify-content-start dash-card-wrap mb-3 mt-2">
							<CCol xs={4} className='p-0'><span className='active-signal'></span>Delivered {dashboard.total_deliver_count}</CCol>
							<CCol xs={4} className='p-0'><span className='inactive-signal'></span>In transit {dashboard.total_transit_count} </CCol>
							</CRow>
						</CContainer>
						{/* <CButton color="primary" href="#">All Redemption</CButton> */}
						<Link className='btn btn-primary' to={'#'}>All Redemption</Link>
				</CCardBody>
			</CCard>
		</CCol>

		<CCol md="3">
			<CCard>
				<CCardHeader>Offers</CCardHeader>
					<CCardBody>
					<h1>3</h1>
					<CContainer>
						<CRow className="justify-content-start dash-card-wrap mb-3 mt-2">
						<CCol xs={4} className='p-0'><span className='active-signal'></span> Active 2</CCol>
						<CCol xs={4} className='p-0'><span className='inactive-signal'></span> Inactive 10</CCol>
						</CRow>
					</CContainer>
					<Link className='btn btn-primary' to={'/offers/all-offers'}>All Offers</Link>
				</CCardBody>
			</CCard>
		</CCol>
	</CRow>
	}


	<CRow className='mt-3'>
	<CCol md="12">
		<CCard>
		<CCardHeader>
			<div className='d-flex justify-content-between'>
			<div>
				All Referral XP transactions
			</div>
			<div>
				<Link to={'/referrals/all-referrals'}>
				View All
				</Link>
			</div>
			</div>
		</CCardHeader>
		<div className='p-3'>
			{loadingTransaction === true &&
				<Loading />
			}

			{transactions.length > 0 && loadingTransaction === false ?
			<>
				<CRow>
					<CCol md={6}>

					</CCol>
					<CCol md={6}>
					<div className='d-flex justify-content-end'>
						<div>
						<CFormSelect aria-label="Default select example" defaultValue={selectedValue}  onChange={(e) => filterTransaction(e.target.value)}>
							<option disabled value={''} >Select Date</option>
							<option value="1_week">1 Week</option>
							<option value="15_days">15 Days</option>
							<option value="1_month">1 Month</option>
							<option value="3_month">3 Months</option>
							<option value="1_year">1 Year</option>
						</CFormSelect>
						</div>
						<div>
							<CButton 
								onClick={exportTransactionToExcel}
								color="primary" 
								variant="outline" 
								className='ms-2'>
								<CIcon icon={cilCloudDownload} /> Export as Excel
							</CButton>
						</div>
					</div>
					</CCol>
				</CRow>

				<CTable responsive bordered className='mt-3' >
					<CTableHead>
					<CTableRow>
						<CTableHeaderCell scope="col">#</CTableHeaderCell>
						<CTableHeaderCell scope="col">Referee name</CTableHeaderCell>
						<CTableHeaderCell scope="col">Join Date</CTableHeaderCell>
						<CTableHeaderCell scope="col">Contact</CTableHeaderCell>
						<CTableHeaderCell scope="col">Last Scanned Product</CTableHeaderCell>
						<CTableHeaderCell scope="col">Earned XP</CTableHeaderCell>
						<CTableHeaderCell scope="col">Total XP Balance</CTableHeaderCell>
						<CTableHeaderCell scope="col">Referral’s Name</CTableHeaderCell>
						<CTableHeaderCell scope="col">Referral’s Total XP Balance</CTableHeaderCell>
					</CTableRow>
					</CTableHead>
					<CTableBody>
					{
						transactions.map(item => {
							return(
								<CTableRow key={item.id}>
									<CTableHeaderCell scope="row">{item.id}</CTableHeaderCell>
									<CTableDataCell>{item.referral.name}</CTableDataCell>
									<CTableDataCell>{item.referral.created_at}</CTableDataCell>
									<CTableDataCell>{item.referral.phone}</CTableDataCell>
									<CTableDataCell>N/A</CTableDataCell>
									<CTableDataCell>0 xp</CTableDataCell>
									<CTableDataCell>0 xp</CTableDataCell>
									<CTableDataCell>{item.referee.name}</CTableDataCell>
									<CTableDataCell>0 xp</CTableDataCell>
								</CTableRow>
							)
						})
						
					}						
					</CTableBody>
				</CTable>									
			</>	
			:
			<NoState 
				message='No records found (s).'
			/>
			}

			{transactions.length > 0 &&
			<div className='pagination justify-content-end'>
				<Pagination 
					pageCount={pageCountTransaction}
					handlePageChange={(event) => setPageNumberTransaction(event.selected+1)}
				/> 
			</div>	
			}

		</div>

		</CCard>
	</CCol>
	</CRow>


	<CRow className='mt-3'>
	<CCol md="12">
		<CCard>
		<CCardHeader>
			<div className='d-flex justify-content-between'>
			<div>
				Recent QR Details
			</div>
			<div>
				<Link to={'/qr-manager/all-qr'}>
				View All
				</Link>
			</div>
			</div>

		</CCardHeader>
		<div className='p-3'>

			{loadingQrCode === true &&
				<Loading />
			}

			{qrCodes.length > 0 && loadingQrCode === false ?
			<CTable bordered className='mt-3'>
				<CTableHead>
					<CTableRow>
						<CTableHeaderCell scope="col">ID</CTableHeaderCell>
						<CTableHeaderCell scope="col">Product Name</CTableHeaderCell>
						<CTableHeaderCell scope="col">XP Assigned</CTableHeaderCell>
						<CTableHeaderCell scope="col">Batch Number</CTableHeaderCell>
						<CTableHeaderCell scope="col">Created At</CTableHeaderCell>
					</CTableRow>
				</CTableHead>
				<CTableBody>	
					{
						qrCodes.map((item) => {
							return(
								<CTableRow key={item.id}>
									<CTableHeaderCell scope="row">{item.id}</CTableHeaderCell>
									<CTableDataCell>{item.product.name}</CTableDataCell>
									<CTableDataCell>{item.xp_value}</CTableDataCell>
									<CTableDataCell>{item.batch_number}</CTableDataCell>
									<CTableDataCell>{item.created_at}</CTableDataCell>
								</CTableRow>
							)
						})
					}				
					
				</CTableBody>
			</CTable>								
			:
			<NoState 
				message='No records found (s).'
			/>
			}

			{qrCodes.length > 0 &&
			<div className='pagination justify-content-end'>
				<Pagination 
					pageCount={pageCountQrCode}
					handlePageChange={(event) => setPageNumberQrCode(event.selected+1)}
				/> 
			</div>	
			}
		</div>

		</CCard>
	</CCol>
	</CRow>

		
	<CRow className='mt-3 mb-5'>
		<CCol md="12">
			<CCard>
				<CCardHeader>
					Users Tracking
				</CCardHeader>


				<div className='p-3'>
					<CRow className='mt-3'>
						<CCol md="6">
							India Interactive map will be added here
						</CCol>
						<CCol md="6">
							<CTable bordered className='mt-3'>
								<CTableHead>
									<CTableRow>
										<CTableHeaderCell scope="col">State</CTableHeaderCell>
										<CTableHeaderCell scope="col">Total Users</CTableHeaderCell>
										<CTableHeaderCell scope="col">Action</CTableHeaderCell>
									</CTableRow>
								</CTableHead>
								<CTableBody>
									{stateUsers ? stateUsers.map(item => {
										return(
											<CTableRow key={item.id}>
												<CTableHeaderCell scope="row">{item.state_str}</CTableHeaderCell>
												<CTableDataCell>{item.total_user}</CTableDataCell>
												<CTableDataCell>
													<CButton color="primary" onClick={() =>handleStateShowModal(item.state_str)}>View Details</CButton>
												</CTableDataCell>
											</CTableRow>
										)
									})										
									:
									<div>
										No State found.
									</div>
									}
									
								</CTableBody>
							</CTable>
						</CCol>
					</CRow>
				</div>
			</CCard>
		</CCol>			
	</CRow>

	<CModal
			visible={visible}
			backdrop="static"
			onClose={() => setVisible(false)}
			aria-labelledby="DistrictModal"
			size="xl"
		>
			<CModalHeader>
				<CModalTitle id="DistrictModal">{manageUi.selectedState}</CModalTitle>
			</CModalHeader>

			{manageUi.loadingModal === true &&
				<Loading />
			}

			{cityUsers.length > 0 &&  manageUi.loadingModal === false ?
			<CModalBody>
				
				<div className='d-flex justify-content-between'>
					<div>
						Showing all users from {manageUi.selectedState}
					</div>
					<div>
						<CButton 
							onClick={exportCityUserToExcel}
							color="primary" 
							variant="outline" 
							className='ms-2'>
								<CIcon icon={cilCloudDownload} /> Export as Excel
						</CButton>
					</div>
				</div>


				<div className='district-table mt-4'>
					<CTable bordered hover>
						<CTableHead>
							<CTableRow>
								<CTableHeaderCell scope="col">#</CTableHeaderCell>
								<CTableHeaderCell scope="col">District</CTableHeaderCell>
								<CTableHeaderCell scope="col">Total Users</CTableHeaderCell>
								<CTableHeaderCell scope="col">Total Active Users</CTableHeaderCell>
								<CTableHeaderCell scope="col">Total Inactive Users</CTableHeaderCell>
								<CTableHeaderCell scope="col">Action</CTableHeaderCell>
							</CTableRow>
						</CTableHead>
						<CTableBody>
						{
							cityUsers.map((item) => {
								return(
									<CTableRow key={item.id}>
										<CTableHeaderCell scope="row">{item.id}</CTableHeaderCell>
										<CTableDataCell>{item.city}</CTableDataCell>
										<CTableDataCell>{item.total_user}</CTableDataCell>
										<CTableDataCell>{item.active_users}</CTableDataCell>
										<CTableDataCell>{item.inactive_users}</CTableDataCell>
										<CTableDataCell>
										<CButton
											color="primary"
											onClick={() => handleCityShowModal(item.city)}
										>
											View Details
										</CButton>
										</CTableDataCell>
									</CTableRow>
								)
							})
						}
						</CTableBody>
					</CTable>
				</div>
			</CModalBody>
			:
			<CModalBody>
				<NoState 
					message='No records found (s).'
				/>
			</CModalBody>
			}

		</CModal>


		<CModal
			visible={visible2}
			backdrop="static"
			size="xl"
			onClick={() => {
				setVisible(true)
				setVisible2(false)
			}}
			aria-labelledby="CityModal"
		>
			<CModalHeader>
				<CModalTitle id="CityModal">{manageUi.selectedCity}</CModalTitle>
			</CModalHeader>

			{manageUi.loadingModal === true &&
				<Loading />
			}

			{users.length > 0 &&  manageUi.loadingModal === false ?
			<CModalBody>
				<div className='d-flex justify-content-between'>
					<div>
						Showing all users from {manageUi.selectedCity}
					</div>
					<div>
						<CButton onClick={exportUserToExcel} color="primary"  variant="outline" className='ms-2'>
							<CIcon icon={cilCloudDownload} /> Export as Excel
						</CButton>
					</div>
				</div>


				<div className='city-table mt-4'>
					<CTable bordered hover align="middle" responsive>
						<CTableHead>
							<CTableRow>
							<CTableHeaderCell scope="col">#</CTableHeaderCell>
							<CTableHeaderCell scope="col">User Name</CTableHeaderCell>
							<CTableHeaderCell scope="col">Location</CTableHeaderCell>
							<CTableHeaderCell scope="col">Contact Number</CTableHeaderCell>
							<CTableHeaderCell scope="col">Install Date</CTableHeaderCell>
							<CTableHeaderCell scope="col">Last Active</CTableHeaderCell>
							<CTableHeaderCell scope="col">Total XP Balance</CTableHeaderCell>
							<CTableHeaderCell scope="col">Total Reward Redeems</CTableHeaderCell>
							</CTableRow>
						</CTableHead>
					<CTableBody>
						{users.map((item) => {
							return (<CTableRow key={item.id}>
								<CTableHeaderCell scope="row">{item.id}</CTableHeaderCell>
								<CTableDataCell>
									<Link to={'/users/all-users'}>
										{item.name}
									</Link>
								</CTableDataCell>
								<CTableDataCell>									
									<a href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} target='_blank'>
										{item.city}
									</a>
								</CTableDataCell>
								<CTableDataCell>+{item.phone}</CTableDataCell>
								<CTableDataCell>{item.created_at}</CTableDataCell>
								<CTableDataCell>{item.last_login}</CTableDataCell>
								<CTableDataCell>{item.total_xp ? item.total_xp : '0'} xp</CTableDataCell>
								<CTableDataCell>{item.redeem_xp ? item.redeem_xp : '0'} xp</CTableDataCell>
							</CTableRow>)
						})
						}
						

					</CTableBody>
					</CTable>
				</div>

			</CModalBody>
			:
			<CModalBody>
				<NoState 
					message='No records found (s).'
				/>
			</CModalBody>
			}
		</CModal>

    </>
  )
}

export default Dashboard
