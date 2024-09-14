import { CButton, CCard, CCardBody, CCardHeader, CFormCheck, CFormInput } from "@coreui/react"
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom"
import { actionFetchData, actionDownloadPdf } from "../../actions/actions";
import { API_URL } from "../../config";
import NoState from "../../components/NoState";
import Pagination from "../../components/Pagination";
import AuthContext from "../../context/auth";
import CIcon from "@coreui/icons-react";
import { cilCloudDownload, cilMagnifyingGlass } from "@coreui/icons";
import Loading from "../../components/Loading";

const AllQrs = () => {
    const { Auth } =  useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const [qrCodes, setQrCode] = useState([]);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading,setLoading] = useState(true);
   
    // Fetch data
    let finalUrl = `${API_URL}/qr-codes?page=${pageNumber}&perPage=${perPage}`;
    const fetchData = async () => {
        setLoading(true); // Loading on

        let response =  await actionFetchData(finalUrl,accessToken);
        response     = await response.json();
        if(response.status){
            setQrCode(response.data.data);
            setPageCount(response.totalPage);
        }  
        setLoading(false);
    }

    //console.log(qrCodes);
    useEffect(() =>{
        fetchData();
    },[pageNumber])


    return (
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

                {qrCodes.length > 0 && !isLoading ? 
                <table className="table">
                    <thead>
                        <tr>
                           
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>XP Required</th>
                            <th>Batch Number</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                        {
                            qrCodes.map(item => {
                                return(
                                    <tr key={item.id}>
                                       
                                        <td>{item.id}</td>
                                        <td>{(item.product.name) }</td>
                                        <td>{item.xp_value} XP</td>
                                        <td>{item.batch_number}</td>
                                        <td>{item.created_at}</td>
                                        <td>
                                            
                                            <CButton onClick={()=>actionDownloadPdf(item.product_id,item.batch_number,accessToken)} color="primary" variant="outline" className="me-2">
                                                <CIcon icon={cilCloudDownload} />
                                            </CButton>

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
                        handlePageChange={(event) => setPageNumber(event.selected+1)}
                    />  
                    
                </div>  
                                    
            }  
        </CCardBody>
        </CCard>
    );
};

export default AllQrs;