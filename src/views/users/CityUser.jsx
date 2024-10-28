import { CButton, CCard, CCardBody, CCardHeader, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CFormInput, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from "@coreui/react"
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { API_URL, exportToExcel, statusBadge } from "../../config";
import AuthContext from "../../context/auth";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import NoState from "../../components/NoState";
import { actionFetchData } from "../../actions/actions";
import { cilCloudDownload } from "@coreui/icons";
import CIcon from "@coreui/icons-react";


const CityUser = ({}) => {
    const params = useParams();

    const { Auth } =  useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');
    const [users, setUsers] = useState([])

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading,setLoading] = useState(true);

     // Fetch data
     const fetchUsers = async () => {
        let response = await actionFetchData(`${API_URL}/dashboard/city-users/${params.city}?page=${pageNumber}&perPage=${perPage}`, accessToken);
		response = await response.json();
        if (response.status) {
            setUsers(response.data.data);
            setPageCount(response.totalPage);
            setLoading(false)
       }       
     }

     const exportUserToExcel = () => {
		let data = users.map(item => {
			return {
				"#": item.id,
				"User Name": item.name,
				"Location": item.city,
				"Contact Number": item.phone,
				"Install Date": item.created_at,
				"Last Active": item.last_login,
				"Total XP Balance": item.total_xp ? item.total_xp : 0 + ' xp',
				"Total Reward Redeems": item.redeem_xp ? item.redeem_xp : 0 + ' xp'
			}
		})

		exportToExcel(data);
	}

    useEffect(() =>{
        fetchUsers()
    },[])
    return (
        <CCard>               
                <CCardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>Showing all users from {params.city}</strong>
                        </div> 
                        <div>
                            <CButton onClick={exportUserToExcel} color="primary" variant="outline" className='ms-2'>
                                <CIcon icon={cilCloudDownload} /> Export as Excel
                            </CButton>
                        </div>                           
                    </div>
                </CCardHeader>

                <CCardBody>
                    <div className="table-responsive"> 
                        {isLoading && 
                            <Loading />
                        } 

                        {users.length > 0 ? 
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
                                                <Link to={`/users/edit-user/${item.id}`}>
                                                    {item.name}
                                                </Link>
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.latitude && item.longitude ? 
                                                    <a href={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} target='_blank'>
                                                        {item.city}
                                                    </a>
                                                    :
                                                    item.city
                                                }
                                                
                                            </CTableDataCell>
                                            <CTableDataCell>{item.phone}</CTableDataCell>
                                            <CTableDataCell>{item.created_at}</CTableDataCell>
                                            <CTableDataCell>{item.last_login}</CTableDataCell>
                                            <CTableDataCell>{item.total_xp ? item.total_xp : '0'} xp</CTableDataCell>
                                            <CTableDataCell>{item.redeem_xp ? item.redeem_xp : '0'} xp</CTableDataCell>
                                        </CTableRow>)
                                    })
                                    }


                                </CTableBody>
                            </CTable>
                            :
                            <NoState 
                                message="No User"
                            />  
                        }                        
                    </div>

                   

                    {users.length > 0 &&
                        <div className='d-flex  align-items-start justify-content-end'>
                            {/* <button className="btn btn-danger text-white" onClick={deleteSelectedItems} disabled={selectedItems.length === 0}>
                                Delete Selected
                            </button> */}
                            <Pagination 
                                pageCount={pageCount}
                                handlePageChange={(event) => setPageNumber(event.selected+1)}
                            /> 
                        </div>                      
                    }                          
                </CCardBody>
            </CCard>
    );
};

export default CityUser;