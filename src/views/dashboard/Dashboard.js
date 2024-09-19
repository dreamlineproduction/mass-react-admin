import React, { useState } from 'react';
import { CCol, CRow, CCard, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CCardHeader, CCardBody, CContainer, CPagination, CPaginationItem, CCardTitle, CCardText, CButton, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormSelect, } from '@coreui/react';
import CIcon from "@coreui/icons-react";
import { Link } from "react-router-dom";
import { cilCloudDownload } from "@coreui/icons";
const Dashboard = () => {

  const [visible, setVisible] = useState(false); // Modal visibility state
  const [visible2, setVisible2] = useState(false)
  const [selectedState, setSelectedState] = useState(null); // Selected state data

  // Function to open modal and set selected state
  const handleShowDetails = (stateName, totalUsers) => {
    setSelectedState({ stateName, totalUsers });
    setVisible(true); // Show modal
  };

  // Function to close modal
  const handleCloseModal = () => {
    setVisible(false); // Close modal
    setSelectedState(null); // Reset selected state
  };

  return (
    <>
      <CRow>
        <CCol md="3">
          <CCard>
            <CCardHeader>Total Users</CCardHeader>
            <CCardBody>
              <h1>2450</h1>
              <CContainer>
                <CRow className="justify-content-start dash-card-wrap mb-3 mt-2">
                  <CCol xs={4} className='p-0'><span className='active-signal'></span>Active 1500</CCol>
                  <CCol xs={4} className='p-0'><span className='inactive-signal'></span>Inactive 1500</CCol>
                </CRow>
              </CContainer>
              <CButton color="primary" href="#">All Users</CButton>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md="3">
          <CCard>
            <CCardHeader>Total Products</CCardHeader>
            <CCardBody>
              <h1>24</h1>
              <CContainer>
                <CRow className="justify-content-start dash-card-wrap mb-3 mt-2">
                  <CCol xs={4} className='p-0'><span className='active-signal'></span>Active 15</CCol>
                  <CCol xs={4} className='p-0'><span className='inactive-signal'></span>Inactive 9</CCol>
                </CRow>
              </CContainer>
              <CButton color="primary" href="#">All Products</CButton>
            </CCardBody>
          </CCard>
        </CCol>

        <CCol md="3">
          <CCard>
            <CCardHeader>New Redemption</CCardHeader>
            <CCardBody>
              <h1>24</h1>
              <CContainer>
                <CRow className="justify-content-start dash-card-wrap mb-3 mt-2">
                  <CCol xs={4} className='p-0'><span className='active-signal'></span>Delivered 15</CCol>
                  <CCol xs={4} className='p-0'><span className='inactive-signal'></span>In transit 30 </CCol>
                </CRow>
              </CContainer>
              <CButton color="primary" href="#">All Redemption</CButton>
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
              <CButton color="primary" href="#">All Offers</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>


      <CRow className='mt-3'>
        <CCol md="12">
          <CCard>
            <CCardHeader>
              All Referral XP transactions
            </CCardHeader>
            <div className='p-3'>
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
                  <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">2</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">3</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">4</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">5</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">6</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">7</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">8</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">9</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">10</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>2/2/2024</CTableDataCell>
                    <CTableDataCell>+9158745874</CTableDataCell>
                    <CTableDataCell>Apple IPod</CTableDataCell>
                    <CTableDataCell>100 xp</CTableDataCell>
                    <CTableDataCell>2000 xp</CTableDataCell>
                    <CTableDataCell>Balaram</CTableDataCell>
                    <CTableDataCell>50,000 xp</CTableDataCell>
                  </CTableRow>
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
                  <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell scope="row">2</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell scope="row">3</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell scope="row">4</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>


                  <CTableRow>
                    <CTableHeaderCell scope="row">5</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell scope="row">6</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell scope="row">7</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell scope="row">8</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell scope="row">9</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>

                  <CTableRow>
                    <CTableHeaderCell scope="row">10</CTableHeaderCell>
                    <CTableDataCell>Mass Polymar 250gm</CTableDataCell>
                    <CTableDataCell>250</CTableDataCell>
                    <CTableDataCell>MASS54875545</CTableDataCell>
                    <CTableDataCell>16-09-2024 at 11:40AM</CTableDataCell>
                  </CTableRow>




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
                      <CTableRow>
                        <CTableHeaderCell scope="row">West Bengal</CTableHeaderCell>
                        <CTableDataCell>15752</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="primary" onClick={() => setVisible(!visible)}>View Details</CButton>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">Bihar</CTableHeaderCell>
                        <CTableDataCell>14500</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="primary" onClick={() => setVisible(!visible)}>View Details</CButton>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">Uttar Pradesh</CTableHeaderCell>
                        <CTableDataCell>20000</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="primary" onClick={() => setVisible(!visible)}>View Details</CButton>
                        </CTableDataCell>
                      </CTableRow>
                      <CTableRow>
                        <CTableHeaderCell scope="row">Jharkhand</CTableHeaderCell>
                        <CTableDataCell>10500</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="primary" onClick={() => setVisible(!visible)}>View Details</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </div>
          </CCard>
        </CCol>

        {/* CModal from CoreUI */}
        <CModal
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="DistrictModal"
          size="xl"
        >
          <CModalHeader>
            <CModalTitle id="DistrictModal">Utter Pradesh</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className='d-flex justify-content-between'>
              <div>
                Showing all users from Utter Pradesh
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
                  <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>Lucknow</CTableDataCell>
                    <CTableDataCell>12500</CTableDataCell>
                    <CTableDataCell>8000</CTableDataCell>
                    <CTableDataCell>4500</CTableDataCell>
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
                  <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>Lucknow</CTableDataCell>
                    <CTableDataCell>12500</CTableDataCell>
                    <CTableDataCell>8000</CTableDataCell>
                    <CTableDataCell>4500</CTableDataCell>
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
                </CTableBody>
              </CTable>
            </div>

          </CModalBody>

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
