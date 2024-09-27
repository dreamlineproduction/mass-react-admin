import { CButton, CCard, CCardBody, CCardHeader, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CFormInput, CTable } from "@coreui/react"
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { API_URL, statusBadge } from "../../config";
import AuthContext from "../../context/auth";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import Swal from 'sweetalert2'
import Header from "../../components/form/Header";
import NoState from "../../components/NoState";
import { actionDeleteData, actionPostData } from "../../actions/actions";

const AllUser = () => {
    const { Auth } =  useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');
    const [users, setUsers] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);


    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading,setLoading] = useState(true);

    // Fetch data
    let finalUrl = `${API_URL}/users?page=${pageNumber}&perPage=${perPage}`;
    const fetchUsers = async () => {
        try{
            setLoading(true); // Loading on
            await fetch(finalUrl, {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken}`
                },
                method: "GET",
            })
            .then(res => res.json())
            .then(response => {
                setLoading(false); // Loading off
                if (response.status) {
                    setUsers(response.data.data);
                    setPageCount(response.totalPage);
                }              
            })
            .catch((e) =>
                toast.error(e)
            )
        } catch(error){
            toast.error(error)
        }
    }

    // Delete Data
    const actionDeleteUser = async (id) => {
        const toastId = toast.loading("Please wait...")   
        
        try{
            let response =  await actionDeleteData(`${API_URL}/users/${id}`,accessToken)
            response    = await response.json();

            if (response.status) {
                const filteredData = users.filter(item => item.id !==id);
                setUsers(filteredData);
                toast.success(response.message,{
                    id:toastId
                });
            }             
        } catch(error){
            toast.error(error)
        }
    }
    
    const deleteUser = (id) => {        
        Swal.fire({
            title: "Delete Confirmation",
            text: "Are you sure you want to delete this?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            if (result.isConfirmed) {
                actionDeleteUser(id)
            } 
        });
    }

    // Change Status
    const changeStatus = async (id) => {
        const toastId = toast.loading("Please wait...")   
        let findedIndex = users.findIndex(user => user.id === id);
        let status = (users[findedIndex].status === 1) ? 0 : 1;  

        try{
            const postData = {status};
            let response =  await actionPostData(`${API_URL}/users/change-status/${id}`,accessToken,postData,'PUT');
            response    = await response.json();

            if (response.status) {
                users[findedIndex].status = status;
                setUsers([...users]);
                toast.success(response.message,{
                    id:toastId
                });
            }               
        } catch(error){
            toast.error(error)
        }
    }

    // Bulk Action
    const handleCheckboxChange = (id) => {
        setSelectedItems(prevSelectedItems =>
          prevSelectedItems.includes(id)
            ? prevSelectedItems.filter(itemId => itemId !== id)
            : [...prevSelectedItems, id]
        );
    };

    const deleteSelectedItems = () => {
        console.log(selectedItems);
        // setUsers(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]); 
    };

    useEffect(() => {
        fetchUsers()
    }, [pageNumber])


   

    return (
        <>           
            <CCard>               
                <CCardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                        <div><strong>All Users</strong></div>
                        <div className="d-flex">
                            <div>
                                <Link to={'/users/add-user'}>
                                    <CButton color="primary" className="me-3">+ Add New User</CButton>
                                </Link>
                            </div>
                            {/* <div>
                                <CFormInput  type="text" placeholder="Search..." />
                            </div> */}
                        </div>
                    </div>
                </CCardHeader>

                <CCardBody>
                    <div> 
                        {isLoading && 
                            <Loading />
                        } 

                        {users.length > 0 ? 
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th><CFormCheck  id="flexCheckDefault" />
                                        </th>
                                        <th>ID</th>
                                        <th>User Image</th>
                                        <th>Full Name</th>
                                        <th>Phone Number</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Joined date</th>
                                        <th>Device Info</th>
                                        <th>Total Product Scanned</th>
                                        <th>XP Balance</th>
                                        <th>Total Redeemed</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        users.map(user => {
                                            return(
                                                <tr key={user.id}>
                                                    <td>
                                                        <CFormCheck 
                                                            checked={selectedItems.includes(user.id)}
                                                            onChange={() => handleCheckboxChange(user.id)}
                                                            id="flexCheckDefault" 
                                                        />
                                                    </td>
                                                    
                                                    <td>{user.id}</td>
                                                    {/* <img src="https://greendroprecycling.com/wp-content/uploads/2017/04/GreenDrop_Station_Aluminum_Can_Pepsi.jpg" className="img-thumbnail" alt="Description of image" width={80} /> */}

                                                    <td>
                                                        {user.image ?
                                                            <img src={user.image_url} className="img-thumbnail" alt={user.name} width={80} />    
                                                            :
                                                            <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} className="img-thumbnail" alt={user.name} width={80} />    
                                                        }
                                                        
                                                    </td>
                                                    <td>{user.name}</td>
                                                    <td>{user.phone}</td>
                                                    <td>{user.city}</td>
                                                    <td>{user.state}</td>
                                                    <td>{user.created_at}</td>
                                                    <td>{user.device_info ? user.device_info: 'N/A'}</td>
                                                    <td>0 Products</td>
                                                    <td>0 XP</td>
                                                    <td>0 Items</td>
                                                    <td>
                                                        {statusBadge(user.status)}
                                                    </td>
                                                    <td>
                                                    <CDropdown>
                                                        <CDropdownToggle className="border-0" caret={false} href="#" color="ghost">...</CDropdownToggle>
                                                        <CDropdownMenu>
                                                            
                                                            <Link className="dropdown-item" to={`/users/edit-user/${user.id}`}>
                                                                Edit
                                                            </Link>
                                                            <CDropdownItem onClick={() => changeStatus(user.id)}>
                                                                {user.status === 1 ? 'Inactive' : 'Active' }
                                                            </CDropdownItem>
                                                            <CDropdownItem className="text-danger" onClick={() =>  deleteUser(user.id)}>Delete</CDropdownItem>
                                                        </CDropdownMenu>
                                                    </CDropdown>
                                                    </td>
                                                </tr>
                                            )
                                        })

                                    }
                                    
                                    
                                    
                                </tbody>
                            </table>
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
        </>
    );
};

export default AllUser;