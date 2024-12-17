import { Link } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useContext, useEffect, useState } from "react";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import { API_URL } from "../../config";
import AuthContext from "../../context/auth";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Status from "../others/Status";
import Pagination  from "../others/Pagination";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AllUser = () => {

    const { Auth } = useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');
    const [users, setUsers] = useState([])
    const [search, setSearchinput] = useState('')


    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    // Fetch data
    let finalUrl = `${API_URL}/users?page=${pageNumber}&perPage=${perPage}`;
    const fetchUsers = async () => {
        try {
            let response = await actionFetchData(finalUrl, accessToken);
            response = await response.json();
            if (response.status) {
                setUsers(response.data.data);
                setPageCount(response.totalPage);
            }
            setLoading(false)
            
        } catch (error) {
            toast.error(error)
        }
    }

    // Delete Data
    const actionDeleteUser = async (id) => {
        const toastId = toast.loading("Please wait...")

        try {
            let response = await actionDeleteData(`${API_URL}/users/${id}`, accessToken)
            response = await response.json();

            if (response.status) {
                const filteredData = users.filter(item => item.id !== id);
                setUsers(filteredData);
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
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

        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/users/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {
                users[findedIndex].status = status;
                setUsers([...users]);
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
            fetchUsers();
        }
    };



    useEffect(() => {
        fetchUsers()
    }, [pageNumber])

    return (
        <div>
            <PageTitle 
                title="All Users"
                buttonLink="/users/add-user"
                buttonLabel="Add New User"
            />

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="my-4 d-flex justify-content-end gap-3">
                            <div className="search-input-outer">
                                <input
                                    onChange={(e) => {
                                        setSearchinput(e.target.value)
                                        if (e.target.value === '') {
                                            fetchUsers()
                                        }
                                    }}
                                    value={search}
                                    className="form-control"
                                    type="text"
                                    placeholder="Search ID,name,phone,Referral Code etc."
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
                        {!isLoading && users.length === 0 &&
                            <NoState
                                message="No users found."
                            />
                        }
                        
                        {users.length > 0 &&
                            <table className="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Full Name</th>
                                        <th>User Type</th>
                                        <th>Phone Number</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Joined date</th>
                                        <th>Referral Code</th>
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
                                        return (
                                            <tr key={`${user.id}-user`}>
                                                <td>{user.id}</td>
                                              
                                                <td>
                                                    {user.image ?
                                                        <img 
                                                            src={user.image_url} 
                                                            className="rounded-circle me-3" 
                                                            alt={user.name} 
                                                            width={48} 
                                                        />
                                                        :
                                                        <img
                                                            src={`https://ui-avatars.com/api/?name=${user.name}&background=212631&color=fff`}
                                                            className="rounded-circle me-3"
                                                            alt={user.name} 
                                                            width={48} 
                                                        />
                                                    }
                                                    {user.name}
                                                </td>
                                                <td>{user.role.name}</td>
                                                <td>{user.phone}</td>
                                                <td>{user.city}</td>
                                                <td>{user.state_str || 'N/A'}</td>
                                                <td>{user.created_at}</td>
                                                <td>{user.referral_code ? user.referral_code : 'N/A'}</td>

                                                <td>{user.scan_product_count} Products</td>
                                                <td>{user.balance_xp} XP</td>
                                                <td>{user.order_count} Items</td>
                                                <td>
                                                  <Status status={user.status} />
                                                </td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            More Options
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <Link className="dropdown-item" to={`/users/edit-user/${user.id}`}>
                                                                    Edit
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item" onClick={() => changeStatus(user.id)}>
                                                                    {user.status === 1 ? 'Inactive' : 'Active'}
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item" onClick={() => deleteUser(user.id)}>
                                                                    Delete
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            </table>                                                        
                        }
                    </div>

                    {users.length > 0 &&
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

export default AllUser;