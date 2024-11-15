import { CButton, CCard, CCardBody, CCardHeader, CFormCheck, CFormInput } from "@coreui/react"
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { actionFetchData } from "../../actions/actions";
import { API_URL } from "../../config";
import NoState from "../../components/NoState";
import Pagination from "../../components/Pagination";
import AuthContext from "../../context/auth";
import CIcon from "@coreui/icons-react";
import { cilCloudDownload, cilMagnifyingGlass, cilSearch } from "@coreui/icons";
import Loading from "../../components/Loading";

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
        <main>
            <div className="mb-4 d-flex justify-content-end  gap-3">
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
                    <CButton onClick={handlerSearch} color="primary" className="me-3">
                        <CIcon icon={cilSearch} /> Search
                    </CButton>
                </div>
            </div>
            <CCard>
                <CCardHeader>
                    <div className="d-flex justify-content-between align-items-center">
                        <div><strong>All QR Codes</strong></div>
                        <div className="d-flex">
                            <div>
                                <Link to={'/qr-manager/generate-qr'}>
                                    <CButton color="primary" className="me-3">+ Add New QR</CButton>
                                </Link>

                            </div>                     
                        </div>
                    </div>
                </CCardHeader>

                <CCardBody>
                    <div className="table-responsive">
                        {isLoading &&
                            <Loading />
                        }

                        {qrCodes.length > 0 && !isLoading ?
                            <table className="table">
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
                                    {
                                        qrCodes.map(item => {
                                            return (
                                                <tr key={item.id}>

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
                                                            color="primary" 
                                                            variant="outline" 
                                                            className="me-2">
                                                            <CIcon icon={cilCloudDownload} />
                                                        </Link>

                                                        <Link to={`/qr-manager/qr-details/${item.product_id}/${item.batch_number}`}>
                                                            <CButton color="primary" variant="outline">
                                                                <CIcon icon={cilMagnifyingGlass} />
                                                            </CButton>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </thead>
                            </table>
                            :
                            <NoState />
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
                </CCardBody>
            </CCard>
        </main>
    );
};

export default AllQrs;