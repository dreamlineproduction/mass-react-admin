import { cilEyedropper, cilNotes } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCard, CCardBody, CCardHeader, CFormInput } from "@coreui/react"
import { Link, useParams } from "react-router-dom";
import { API_URL } from "../../config";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { actionFetchData } from "../../actions/actions";
import Loading from "../../components/Loading";
import NoState from "../../components/NoState";
import Pagination from "../../components/Pagination";

const QrsDetail = () => {
    const { Auth } =  useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const params =  useParams();
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading,setLoading] = useState(true);
    const [qrCodes, setQrCode] = useState([]);
    const [product, setProduct] = useState('');
    const [viewPdf, setViewPdf] = useState('');

    // Fetch data
    let finalUrl = `${API_URL}/qr-codes-details?product_id=${params.productId}&batch_number=${params.batchNumber}&page=${pageNumber}&perPage=${perPage}`;
    const fetchData = async () => {
        setLoading(true); // Loading on

        let response =  await actionFetchData(finalUrl,accessToken);
        response     = await response.json();
        if(response.status){
            setQrCode(response.data.data);
            setProduct(response.product)
            setViewPdf(response.viewPdf)
            setPageCount(response.totalPage);
        }  
        setLoading(false);
    }

    useEffect(() =>{
        fetchData()
    },[pageNumber])

    return (
        <CCard className="mb-5">
            <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                    <div><strong>Result</strong></div>
                    <div className="d-flex">                        
                        <div>
                            <Link 
                                to={`https://massbackoffice.in/public/show-pdf?batchNumber=${params.batchNumber}&productId=${params.productId}`}
                                color="primary" 
                                target="_blank"
                                className="me-3" 
                                variant="outline" 
                                click="actionDownloadPdf">
                                <CButton color="primary" variant="outline">
                                    <CIcon icon={cilEyedropper} /> View PDF
                                </CButton>
                            </Link>                            
                        </div>
                        <div>
                            <Link to={'/qr-manager/all-qr'}>
                                <CButton color="primary" className="me-3" variant="ghost">Back to List</CButton>
                            </Link>
                        </div>
                    </div>
                </div>
            </CCardHeader>
            <CCardBody>
                {isLoading && 
                    <Loading />
                }
                
                {!isLoading && product &&
                    <div>
                        <h6>
                            Product: {product.name}
                        </h6>
                        <h6>
                            Product ID: {product.unique_id}
                        </h6>
                        <h6>
                            Batch Number: {params.batchNumber}
                        </h6>                        
                    </div>
                }
                

                <hr/>

                
                <div className="qr-table-wrap">
               

                {qrCodes.length > 0 ?
                    <table className="table">
                        <thead>
                            <tr>
                            
                                <th>ID</th>
                                <th>Unique ID </th>
                                <th>XP Credit</th>
                                <th>Batch Number</th>
                                <th>Created At</th>
                            </tr>
                            {
                                qrCodes.map(item => {
                                    return(
                                        <tr key={item.id}>
                                        
                                            <td>{item.id}</td>
                                            <td>{(item.unique_id) }</td>
                                            <td>{item.xp_value} XP</td>
                                            <td>{item.batch_number}</td>
                                            <td>{item.created_at}</td>                                        
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

export default QrsDetail;