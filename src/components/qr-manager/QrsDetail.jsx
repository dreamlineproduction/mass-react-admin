import  { useContext, useEffect, useState } from 'react';
import Loading from '../others/Loading';
import AuthContext from '../../context/auth';
import { API_URL } from '../../config';
import { actionFetchData } from '../../actions/actions';
import { Link, useParams } from 'react-router-dom';
import NoState from '../others/NoState';
import { useReactTable, getCoreRowModel } from '@tanstack/react-table';
import DataTable from '../others/DataTable';
import PaginationDataTable from '../others/PaginationDataTable';

const QrsDetail = () => {

    const columns = [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Unique ID', accessorKey: 'unique_id' },
        { header: 'XP Credit', accessorKey: 'xp_value', enableSorting: false },
        { header: 'Batch Number', accessorKey: 'batch_number', enableSorting: false },
        { header: 'Created At', accessorKey: 'created_at',enableSorting: false },
    ];


    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');

    const {productId, batchNumber} =  useParams();
    const [pageCount, setPageCount] = useState(0);
    const [isLoading,setLoading] = useState(true);
    const [qrCodes, setQrCode] = useState([]);
    const [product, setProduct] = useState('');

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Fetch data
    const fetchData = async () => {
        setLoading(true); // Loading on

        const params = {
            product_id: productId,
            batch_number: batchNumber,
            page: pageIndex + 1,
            perPage: pageSize,
        };

        if (sorting.length > 0) {
            params.sort = sorting[0].id;
            params.order = sorting[0].desc ? "desc" : "asc";
        }

        if (globalFilter !== "") {
            params.search = globalFilter.trim();
        }

        let response =  await actionFetchData( `${API_URL}/qr-codes-details?${new URLSearchParams(params)}`,accessToken);
        response     = await response.json();
        if(response.status){
            setQrCode(response.data.data);
            setProduct(response.product)
            setPageCount(response.totalPage);
        }  
        setLoading(false);
    }

    const table = useReactTable({
        data: qrCodes,
        columns,
        pageCount,
        globalFilter,
        state: {
          sorting,
          pagination: { pageIndex, pageSize },
        },
        onSortingChange: setSorting,
        onPaginationChange: ({ pageIndex, pageSize }) => {
          setPageIndex(pageIndex);
          setPageSize(pageSize);
        },
        manualSorting: true,
        manualPagination: true,
        getCoreRowModel: getCoreRowModel(),
    });

    useEffect(() =>{
        fetchData()
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <div className="mb-3 d-flex align-items-center justify-content-between">
                <h1 className="h3 d-inline align-middle">{product.name}</h1>
                <div className="">
                    <Link 
                        to={`https://massbackoffice.in/public/show-pdf?batchNumber=${batchNumber}&productId=${productId}`}
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
                        Batch Number: <b>{batchNumber}</b>
                    </h5>                                           
                </div>
            }
            <div className="row">
                <div className="col-12">
                    <div className="card">  
                         <div className="my-4 d-flex justify-content-end gap-3">
                            <div className="search-input-outer me-4">
                                <input 
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    value={globalFilter}
                                    className="form-control" 
                                    type="text"                                   
                                    placeholder="Search..." 
                                />
                            </div>                            
                        </div>                    
                        {isLoading &&
                            <Loading />
                        }                        

                        {!isLoading && qrCodes.length === 0 &&
                            <NoState
                                title="No QR Code Found"
                            />
                        }

                        {qrCodes.length > 0 && 
                            <DataTable
                                table={table}
                                columns={columns}                              
                            />
                        }
                    </div>

                    {qrCodes.length > 0 &&
                        <div className='d-flex  align-items-start justify-content-end'>
                            <PaginationDataTable
                                table={table}
                                pageCount={pageCount}
                                pageIndex={pageIndex}
                                setPageIndex={setPageIndex}
                            />
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default QrsDetail;