import { useContext, useEffect, useState } from "react";
import PageTitle from "../others/PageTitle";
import { API_URL } from "../../config";
import { actionDeleteData, actionFetchData } from "../../actions/actions";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import { Link } from "react-router-dom";
import Pagination from "../others/Pagination";
import AuthContext from "../../context/auth";

const AllPermission = () => {

    const { Auth } = useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');
    const [permissions, setPermission] = useState([])
    const [search, setSearchinput] = useState('')

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    // Fetch Data
    let finalUrl = `${API_URL}/permissions?page=${pageNumber}&perPage=${perPage}`;
    const fetchData = async () => {
        setLoading(true);

        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setPermission(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false);
    }

    //--Delete api call
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionDeleteData(`${API_URL}/permissions/${id}`, accessToken)
            response = await response.json();
            if (response.status) {
                const filteredData = permissions.filter(item => item.id !== id);
                setPermission(filteredData);

                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    // -- Delete reward
    const deletePermission = (id) => {
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
                actionDelete(id)
            }
        });
    }


    const handlerSearch = () => {
        if (search.trim() !== '') {
            finalUrl += `&search=${search}`
            fetchData();
        }
    };


    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber])

    return (
        <div>
            <PageTitle
                title="All Permissions"
                buttonLink="/permissions/new-permission"
                buttonLabel="Add New Permission"
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
                                            fetchData()
                                        }
                                    }}
                                    value={search}
                                    className="form-control"
                                    type="text"
                                    placeholder="Search..."
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
                        {!isLoading && permissions.length === 0 &&
                            <NoState
                                message="No permissions found."
                            />
                        }

                        {permissions.length > 0 &&
                            <table className="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Created At</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {permissions.map(item => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.name}</td>
                                                <td>{item.created_at}</td>
                                                
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            More Options
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <Link className="dropdown-item" to={`/permissions/edit-permission/${item.id}`}>
                                                                    Edit
                                                                </Link>
                                                            </li>                                                            
                                                            <li>
                                                                <button type="button" className="dropdown-item" onClick={() => deletePermission(item.id)}>
                                                                    Delete
                                                                </button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        }
                    </div>

                    {permissions.length > 0 &&
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

export default AllPermission;