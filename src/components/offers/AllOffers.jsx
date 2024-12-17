import { useContext, useEffect, useState } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import { API_URL } from "../../config";
import Status from "../others/Status";
import { Link } from "react-router-dom";
import Pagination from "../others/Pagination";

const AllOffers = () => {
    const { Auth } = useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const [offers, setOffer] = useState([]);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [search, setSearchinput] = useState('')

    // Delete Data
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionDeleteData(`${API_URL}/offers/${id}`, accessToken)
            response = await response.json();

            if (response.status) {
                const filteredData = offers.filter(item => item.id !== id);
                setOffer(filteredData);
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }


    const deleteOffer = (id) => {
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

    //--Fetch Data
    let finalUrl = `${API_URL}/offers?page=${pageNumber}&perPage=${perPage}`;
    const fetchOffer = async () => {
        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setOffer(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false)
    }

    // Change Status
    const changeStatus = async (id) => {
        const toastId = toast.loading("Please wait...")

        let findedIndex = offers.findIndex(item => item.id === id);
        let status = (offers[findedIndex].status === 1) ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/offers/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {
                offers[findedIndex].status = status;
                setOffer([...offers]);
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
            fetchOffer();
        }
    };



    useEffect(() => {
        fetchOffer();
    }, [pageNumber])

    return (
        <div>
            <PageTitle
                title="All Offers"
                buttonLink="/offers/add-offer"
                buttonLabel="Add New Offer"
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
                                            fetchOffer()
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
                        {!isLoading && offers.length === 0 &&
                            <NoState
                                message="No offers found."
                            />
                        }

                        {offers.length > 0 &&
                            <table className="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Offer ID</th>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>In Homepage ?</th>
                                        <th>Crated At</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    offers.map(item => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>
                                                    {item.image &&
                                                        <img src={item.image_url}
                                                            className="img-thumbnail"
                                                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                                            alt="Description of image" width={"80"} height={'50'} />
                                                    }
                                                </td>
                                                <td>{item.title}</td>
                                                <td>{(item.is_home === 1) ? 'Yes' : 'No'}</td>
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
                                                                <Link className="dropdown-item" to={`/offers/edit-offer/${item.id}`}>
                                                                    Edit
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item" onClick={() => changeStatus(item.id)}>
                                                                    {item.status === 1 ? 'Inactive' : 'Active'}
                                                                </button>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item" onClick={() => deleteOffer(item.id)}>
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

                    {offers.length > 0 &&
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

export default AllOffers;