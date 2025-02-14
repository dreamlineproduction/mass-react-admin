import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import PageTitle from '../others/PageTitle';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth';
import { actionFetchData } from '../../actions/actions';
import { API_URL, configPermission } from '../../config';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import Loading from '../others/Loading';
import NoState from '../others/NoState';
import DataTable from '../others/DataTable';
import PaginationDataTable from '../others/PaginationDataTable';
import BsModal from '../others/BsModal';

const ReportProduct = () => {
    const { Auth, hasPermission } = useContext(AuthContext);
    const navigate = useNavigate();
    const accessToken = Auth("accessToken");
    
    const [products, setProduct] = useState([]);
    const [description, setDescription] = useState('');

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const columns = useMemo(
        () => [
            {
                header: "ID",
                accessorKey: "id",
            },            
            {
                header: "Product Name",
                accessorKey: "product_name",
                cell:({ row }) => {
                    return <Link to={`/products/edit-product/${row.original.product_id}`}>{row.original.product_name}</Link>
                }
            },
            {
                header: "User Information",
                accessorKey: "name",
                cell:({ row }) => {
                    return <Link to={`/users/transaction/${row.original.user_id}`}>
                            {row.original.phone} ({row.original.name})
                        </Link>
                }
            },
            {
                header: "Reason",
                accessorKey: "reason",
            },
            {
                header: "Reported Date",
                accessorKey: "created_at",
            },
            
            {
                header: "View Details",
                accessorKey: "description",
                cell: ({ row }) =>{
                    return <button 
                            data-bs-toggle="modal"
                            data-bs-target="#descriptionModal"
                            type="button"
                            onClick={() => {                                
                                showDescription(row.original.description)
                            }}
                            className="btn btn-primary" 
                       >View Details
                    </button>
                }
                    
            },                        
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const showDescription = (description = '') => {
        setDescription(description)
    }

    // Fetch Data
    const fetchData = async () => {
        setLoading(true);
        const params = {
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

        let response = await actionFetchData(
            `${API_URL}/products/reports?${new URLSearchParams(params)}`,
            accessToken
        );
        response = await response.json();
        if (response.status) {
            setProduct(response.data.data || []);
            setPageCount(response.totalPage || 0);
        }
        setLoading(false);
    };

    const table = useReactTable({
        data: products,
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


    useEffect(() => {
        if (!hasPermission(configPermission.VIEW_USER_DELETE)) {
            navigate('/403')
        }
        fetchData();
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <PageTitle
                title="Products Report"
            />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="my-4 d-flex justify-content-end gap-3">
                            <div className="search-input-outer me-4">
                                <input
                                    placeholder="Search..."
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="form-control"
                                    type="text"
                                />
                            </div>
                        </div>
                        {isLoading && <Loading />}

                        {!isLoading && products.length === 0 && (
                            <NoState  />
                        )}

                        {products.length > 0 && (
                            <DataTable table={table} columns={columns} />
                        )}
                    </div>
                    {products.length > 0 && (
                        <PaginationDataTable
                            table={table}
                            pageCount={pageCount}
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                        />
                    )}
                </div>
            </div>


            {/* Modals */}
            <BsModal
                modalId="descriptionModal"
                title={'View Details'}
                size="md"
                showCloseBtn={false}
            >
                    <div className="mb-3">
                        <textarea className='form-control' defaultValue={description}></textarea>                                                      
                    </div>

                 

            </BsModal>
            
        </div>
    );
};

export default ReportProduct;