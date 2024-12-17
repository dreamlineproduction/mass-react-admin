import React, { useContext, useEffect, useState } from 'react';
import PageTitle from '../others/PageTitle';
import Loading from '../others/Loading';
import AuthContext from '../../context/auth';
import { API_URL } from '../../config';
import Pagination from '../others/Pagination';
import { actionFetchData } from '../../actions/actions';
import { Link, useParams } from 'react-router-dom';
import { PiEyedropper } from 'react-icons/pi';

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
        <div>
            <div className="mb-3 d-flex align-items-center justify-content-between">
                <h1 className="h3 d-inline align-middle">{product.name}</h1>
                <div className="">
                    <Link 
                        to={`https://massbackoffice.in/public/show-pdf?batchNumber=${params.batchNumber}&productId=${params.productId}`}
                        target="_blank"
                        className="btn btn-outline-primary me-3" 
                        >
                            View PDF                       
                    </Link> 
                    <Link to={'/qr-manager/all-qr'} className="btn btn-primary">
                        {'Back to List'}
                    </Link>

                </div> 
            </div>           
            {!isLoading && product &&
                <div className='pb-4'>
                    {/* <h5 className='mb-2'>
                        Product: <b>{product.name}</b>
                    </h5> */}
                    <h5 className='mb-2'>
                        Product ID: <b>{product.unique_id}</b>
                    </h5>
                    <h5 className='mb-2'>
                        Batch Number: <b>{params.batchNumber}</b>
                    </h5>                                           
                </div>
            }
            <div className="row">
                <div className="col-12">
                    <div className="card">
                       

                        {isLoading &&
                            <Loading />
                        }
                        

                        {!isLoading && qrCodes.length === 0 &&
                            <NoState
                                
                            />
                        }

                        {qrCodes.length > 0 && 
                            <table className="table table-striped table-hover mb-0">
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

export default QrsDetail;