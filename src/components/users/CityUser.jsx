import { Link, useParams } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { actionFetchData } from "../../actions/actions";
import { API_URL, exportToExcel } from "../../config";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Pagination from "../others/Pagination";
import { BsCloudDownload } from "react-icons/bs";

const CityUser = () => {
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    return (
        <div>
             <PageTitle 
                title={`Showing all users from ${params.city}` }
            />

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="my-4 d-flex justify-content-end gap-3">
                            <button className="btn btn-outline-primary me-4" onClick={exportUserToExcel}>
                               <BsCloudDownload /> Export to Excel
                            </button>
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
                                        <th scope="col">#</th>
                                        <th scope="col">User Name</th>
                                        <th scope="col">Location</th>
                                        <th scope="col">Contact Number</th>
                                        <th scope="col">Install Date</th>
                                        <th scope="col">Last Active</th>
                                        <th scope="col">Total XP Balance</th>
                                        <th scope="col">Total Reward Redeems</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    users.map(item => {
                                        return (
                                            <tr key={`${item.id}-user`}>
                                                <td scope="row">{item.id}</td>
                                                <td>
                                                    <Link to={`/users/edit-user/${item.id}`}>
                                                        {item.name}
                                                    </Link>
                                                </td>
                                                <td>
                                                    {item.latitude && item.longitude ? 
                                                        <Link to={`https://www.google.com/maps?q=${item.latitude},${item.longitude}`} target='_blank'>
                                                        {item.city}
                                                    </Link>
                                                    :
                                                    item.city
                                                    }                                                
                                                </td>
                                                <td>{item.phone}</td>
                                                <td>{item.created_at}</td>
                                                <td>{item.last_login}</td>
                                                <td>{item.total_xp ? item.total_xp : '0'} xp</td>
                                                <td>{item.redeem_xp ? item.redeem_xp : '0'} xp</td>
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

export default CityUser;