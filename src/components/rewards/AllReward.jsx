import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { API_URL } from "../../config";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Loading from "../others/Loading";
import PageTitle from "../others/PageTitle";
import NoState from "../others/NoState";
import Pagination from "../others/Pagination";
import Status from "../others/Status";
import { Link } from "react-router-dom";

const AllReward = () => {

    const { Auth } = useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');
    const [rewards, setReward] = useState([])
    const [search, setSearchinput] = useState('')

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    // Fetch Data
    let finalUrl = `${API_URL}/rewards?page=${pageNumber}&perPage=${perPage}`;
    const fetchData = async () => {
        setLoading(true);

        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setReward(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false);
    }

    //--Delete api call
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionDeleteData(`${API_URL}/rewards/${id}`, accessToken)
            response = await response.json();
            if (response.status) {
                const filteredData = rewards.filter(item => item.id !== id);
                setReward(filteredData);

                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    // -- Delete reward
    const deleteReward = (id) => {
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

    // -- Change status
    const changeStatus = async (id) => {
        const toastId = toast.loading("Please wait...")

        let findedIndex = rewards.findIndex(item => item.id === id);
        let status = (rewards[findedIndex].status === 1) ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/rewards/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {
                rewards[findedIndex].status = status;
                setReward([...rewards]);
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
            fetchData();
        }
    };


    useEffect(() => {
        fetchData()
    }, [pageNumber])

    return (
        <div>
            <PageTitle
                title="All Rewards"
                buttonLink="/rewards/add-reward"
                buttonLabel="Add New Reward"
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
                        {!isLoading && rewards.length === 0 &&
                            <NoState
                                message="No rewards found."
                            />
                        }

                        {rewards.length > 0 &&
                            <table className="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Reward ID</th>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>XP Required</th>
                                        <th>Created At</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rewards.map(item => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>
                                                    {item.image &&
                                                        <img
                                                            src={item.image_url}
                                                            className="rounded-circle"
                                                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                                            alt="Description of image" width={"80"} height={'50'}
                                                        />
                                                    }
                                                </td>
                                                <td>{item.title}</td>
                                                <td>{item.xp_value}</td>
                                                <td>{item.created_at}</td>
                                                <td>
                                                    <Status
                                                        status={item.status}
                                                    />
                                                </td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            More Options
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li>
                                                                <Link className="dropdown-item" to={`/rewards/edit-reward/${item.id}`}>
                                                                    Edit
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item" onClick={() => changeStatus(item.id)}>
                                                                    {item.status === 1 ? 'Inactive' : 'Active'}
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item" onClick={() => deleteReward(item.id)}>
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

                    {rewards.length > 0 &&
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

export default AllReward;