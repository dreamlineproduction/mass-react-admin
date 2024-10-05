import { CButton, CCard, CCardBody, CCardHeader, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck } from "@coreui/react";
import { Link } from "react-router-dom"

const AllRedemptions = () => {






  return (
    <CCard>
      <CCardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div><strong>All Redemptions</strong></div>         
        </div>
      </CCardHeader>



      <CCardBody>
        <div>

          <table className="table">
            <thead>
              <tr>
                <th><CFormCheck id="flexCheckDefault" /></th>
                <th> ID</th>
                <th>Item Name</th>
                <th>XP Deducted</th>
                <th>User Name</th>
                <th>Requested On</th>
                <th>Status</th>
                <th>Updated On</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>

              <tr>
                <td>
                  <CFormCheck id="flexCheckDefault" />
                </td>
                <td>1</td>
                <td>
                  Apple Macbook M1
                </td>
                <td>5000XP</td>
                <td>Ajay Kulkarni</td>
                <td>03-10-2024 at 12:36 PM</td>
                <td>
                  <span className="badge bg-warning">Pending</span>
                </td>
                <td>
                  N/A
                </td>
                <td>
                  <CDropdown>
                    <CDropdownToggle color="dark">More Options</CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem href="#">Dispatched</CDropdownItem>
                      <CDropdownItem href="#">Delivered</CDropdownItem>
                      <CDropdownItem href="#" style={{ color: "#e55353", }}>Declined</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                </td>
              </tr>

            </tbody>
          </table>


        </div>


      </CCardBody>




    </CCard>
  );
};

export default AllRedemptions;