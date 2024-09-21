import React, { useContext, useEffect, useState } from 'react';
import { CCol, CRow, CCard, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CCardHeader, CCardBody, CContainer, CPagination, CPaginationItem, CCardTitle, CCardText, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormSelect, } from '@coreui/react';
import CIcon from "@coreui/icons-react";
import { Link, NavLink } from "react-router-dom";
import { cilCloudDownload } from "@coreui/icons";
import AuthContext from '../../context/auth';
import { actionFetchData } from '../../actions/actions';
import { API_URL, statusBadge } from "../../config";
import Loading from '../../components/Loading';

const Dashboard = () => {

	const { Auth } =  useContext(AuthContext)
	const accessToken = Auth('accessToken');

	const [dashboard,setDashboard] = useState({});
	const [stateUsers,setStateUser] = useState([]);
	const [cityUsers,setCityUser] = useState([]);
	const [transactions,setTransaction] = useState([]);
	const [qrCodes, setQrCode] = useState([]);

	const [manageUi,setManageUi] = useState({
		selectedState:'',
		loadingModal:false,
		loadingTransaction:false,
		loadingQrCode:false
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
	setManageUi({...manageUi,loadingTransaction:true});
	//--Fetch Data
	let response = await actionFetchData(`${API_URL}/dashboard/transaction`,accessToken);
	response    = await response.json();
	
	if (response.status) {
		setTransaction(response.transactions)
	}   
	
	setManageUi({...manageUi,loadingTransaction:false});
  }


  // Fetch data
  const fetchQrCodes = async () => {
	let finalUrl = `${API_URL}/qr-codes?page=${1}&perPage=${20}`;
	setManageUi({...manageUi,loadingQrCode:true});

	let response =  await actionFetchData(finalUrl,accessToken);
	response     = await response.json();
	if(response.status){
		setQrCode(response.data.data);
	}  
	setManageUi({...manageUi,loadingQrCode:false});
  }

  console.log(qrCodes);

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

  useEffect(() => {
	fetchQrCodes()
	fetchTransaction();
	fetchDashboard();
  },[])

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
              All Referral XP transactions
            </CCardHeader>
            <div className='p-3'>
				{manageUi.loadingTransaction === true &&
					<Loading />
				}

				{transactions.length > 0 && manageUi.loadingTransaction === false ?
				<>
					<CRow>
						<CCol md={6}>

						</CCol>
						<CCol md={6}>
						<div className='d-flex justify-content-end'>
							<div>
							<CFormSelect aria-label="Default select example">
								<option disabled>Select Date</option>
								<option value="7days">1 Week</option>
								<option value="15days">15 Days</option>
								<option value="30days">1 Month</option>
								<option value="90days">3 Months</option>
								<option value="365days">1 Year</option>
							</CFormSelect>
							</div>
							<div>
							<CButton color="primary" variant="outline" className='ms-2'><CIcon icon={cilCloudDownload} /> Export as Excel</CButton>
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
										<CTableDataCell>{item.referee.name}</CTableDataCell>
										<CTableDataCell>{item.referral.created_at}</CTableDataCell>
										<CTableDataCell>{item.referral.phone}</CTableDataCell>
										<CTableDataCell>N/A</CTableDataCell>
										<CTableDataCell>0 xp</CTableDataCell>
										<CTableDataCell>0 xp</CTableDataCell>
										<CTableDataCell>{item.referral.name}</CTableDataCell>
										<CTableDataCell>0 xp</CTableDataCell>
									</CTableRow>
								)
							})
							
						}						
						</CTableBody>
					</CTable>

					<div>
						<CPagination aria-label="Page navigation example" align="end">
						<CPaginationItem>Previous</CPaginationItem>
						<CPaginationItem>1</CPaginationItem>
						<CPaginationItem>2</CPaginationItem>
						<CPaginationItem>3</CPaginationItem>
						<CPaginationItem>Next</CPaginationItem>
						</CPagination>
					</div>					
				</>	
				:
				<div>
					Not Found.	
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

				{manageUi.loadingQrCode === true &&
					<Loading />
				}

				{qrCodes.length > 0 && manageUi.loadingQrCode === false ?
				<>
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
									<CTableRow>
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

				<div>
					<CPagination aria-label="Page navigation example" align="end">
						<CPaginationItem>Previous</CPaginationItem>
						<CPaginationItem>1</CPaginationItem>
						<CPaginationItem>2</CPaginationItem>
						<CPaginationItem>3</CPaginationItem>
						<CPaginationItem>Next</CPaginationItem>
					</CPagination>
				</div>				
				</>
				:
				<div>
					Not Found.	
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

			<CModal
				visible={visible}
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
							<CButton color="primary" variant="outline" className='ms-2'><CIcon icon={cilCloudDownload} /> Export as Excel</CButton>
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
												onClick={() => {
												setVisible(false)
												setVisible2(true)
												}}
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
					<p>No User</p>
				</CModalBody>
				}

        	</CModal>


        <CModal
          visible={visible2}
          size="xl"
          onClick={() => {
            setVisible(true)
            setVisible2(false)
          }}
          aria-labelledby="CityModal"
        >
          <CModalHeader>
            <CModalTitle id="CityModal">Lucknow</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className='d-flex justify-content-between'>
              <div>
                Showing all users from Lucknow
              </div>
              <div>
                <CButton color="primary" variant="outline" className='ms-2'><CIcon icon={cilCloudDownload} /> Export as Excel</CButton>
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
                  <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>
                      <Link to={'/users/all-users'}>
                        Ayan Mukhopadhyay
                      </Link>
                    </CTableDataCell>
                    <CTableDataCell>
                      <a href='https://www.google.com/maps/place/thakurganj,+lucknow/data=!4m2!3m1!1s0x399bfe03f2d08611:0x8b96b394a9be352c?sa=X&ved=1t:242&ictx=111' target='_blank'>
                        Thakurganj
                      </a>
                    </CTableDataCell>
                    <CTableDataCell>+91123879545</CTableDataCell>
                    <CTableDataCell>12/02/2024</CTableDataCell>
                    <CTableDataCell>15th Sept 2024 at 12:50 PM</CTableDataCell>
                    <CTableDataCell>2500 xp</CTableDataCell>
                    <CTableDataCell>5</CTableDataCell>

                  </CTableRow>

                </CTableBody>
              </CTable>
            </div>

          </CModalBody>

        </CModal>
      </CRow>

    </>
  )
}

export default Dashboard
