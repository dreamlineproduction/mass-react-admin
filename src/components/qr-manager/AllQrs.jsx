import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { API_URL } from "../../config";
import { actionFetchData } from "../../actions/actions";
import PageTitle from "../others/PageTitle";
import Loading from "../others/Loading";
import { DownloadCloud, Search } from "react-feather";
import Pagination from "../others/Pagination";
import NoState from "../others/NoState";
import { Link } from "react-router-dom";

const AllQrs = () => {
    const { Auth } = useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const [qrCodes, setQrCode] = useState([]);
    const [search, setSearchinput] = useState('')

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    // Fetch data
    let finalUrl = `${API_URL}/qr-codes?page=${pageNumber}&perPage=${perPage}`;
    const fetchData = async () => {
        setLoading(true); // Loading on

        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setQrCode(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false);
    }


    const handlerSearch = () => {
        if (search.trim() !== '') {
            finalUrl+=`&search=${search}`
            fetchData();
        }   
    };

    //console.log(qrCodes);
    useEffect(() => {
        fetchData();
    }, [pageNumber])

    return (
        <div>
            <PageTitle
                title="All QR Codes"
                buttonLink="/qr-manager/generate-qr"
                buttonLabel="Add New QR"
            />

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="my-4 d-flex justify-content-end gap-3">
                            <div className="search-input-outer">
                                <input 
                                    onChange={(e) => {
                                        setSearchinput(e.target.value)
                                        if(e.target.value === ''){
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
                        {!isLoading && products.length === 0 &&
                            <NoState
                                message="No qr found."
                            />
                        }

                        {qrCodes.length > 0 &&
                            <table className="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Product Name</th>
                                        <th>Total Qr</th>
                                        <th>XP Required</th>
                                        <th>Batch Number</th>
                                        <th>Created At</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        qrCodes.map(item => {
                                            return (
                                                <tr key={item.id} className="align-middle">
                                                    <td>{item.id}</td>
                                                    <td>{(item.name)}</td>
                                                    <td>{item.qr_code_content_count || 0}</td>                                                    
                                                    <td>{item.xp_value} XP</td>
                                                    <td>{item.batch_number}</td>
                                                    <td>{item.created_at}</td>
                                                    <td>
                                                        
                                                        <Link 
                                                            to={`https://massbackoffice.in/public/show-pdf?batchNumber=${item.batch_number}&productId=${item.product_id}`}  
                                                            target="_blank"
                                                            className="btn py-2 px-2 btn-outline-primary me-2"
                                                        >
                                                            <DownloadCloud width={30} />
                                                        </Link>

                                                        <Link 
                                                            to={`/qr-manager/qr-details/${item.product_id}/${item.batch_number}`}
                                                            target="_blank"
                                                            className="btn py-2 px-2 btn-outline-primary me-2"
                                                            >
                                                                <Search width={30} />
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })

                                    }
                                </tbody>
                            </table>
                        }
                    </div>

                    {qrCodes.length > 0 &&
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

export default AllQrs;