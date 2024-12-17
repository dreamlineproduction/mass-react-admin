import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { API_URL } from "../../config";
import { actionFetchData, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";
import NoState from "../others/NoState";
import Loading from "../others/Loading";
import PageTitle from "../others/PageTitle";
import Status from "../others/Status";
import { Link } from "react-router-dom";
import Pagination from "../others/Pagination";

const AllPages = () => {
    const { Auth } = useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const [pages, setPage] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    //--Fetch Data
    let finalUrl = `${API_URL}/pages?page=${pageNumber}&perPage=${perPage}`;
    const fetchOffer = async () => {
        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setPage(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false)
    }

    // Change Status
    const changeStatus = async (id) => {
        const toastId = toast.loading("Please wait...")

        let findedIndex = pages.findIndex(item => item.id === id);
        let status = (pages[findedIndex].status === 1) ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/pages/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {
                pages[findedIndex].status = status;
                setPage([...pages]);
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(() => {
        fetchOffer();
    }, [pageNumber])

    return (
        <div>
            <PageTitle
                title="All Pages"
            />

            <div className="row">
                <div className="col-12">
                    <div className="card">                        
                        {isLoading &&
                            <Loading />
                        }
                        {!isLoading && pages.length === 0 &&
                            <NoState
                                message="No pages found."
                            />
                        }

                        {pages.length > 0 &&
                            <table className="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Page ID</th>
                                        <th>Title</th>
                                        <th>Crated At</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    pages.map(item => {
                                        return (
                                            <tr key={item.id}>
                                                <td>{item.id}</td>
                                                <td>{item.title}</td>
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
                                                                <Link className="dropdown-item" to={`/pages/edit-page/${item.id}`}>
                                                                    Edit
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item" onClick={() => changeStatus(item.id)}>
                                                                    {item.status === 1 ? 'Inactive' : 'Active'}
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

                    {pages.length > 0 &&
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

export default AllPages;