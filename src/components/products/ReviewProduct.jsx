import React, { useContext, useMemo,useState,useEffect } from 'react';
import { API_URL, configPermission } from "../../config";

import PageTitle from '../others/PageTitle';
import DataTable from "../others/DataTable";
import PaginationDataTable from "../others/PaginationDataTable";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/auth';
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import Loading from '../others/Loading';
import NoState from '../others/NoState';
import { actionFetchData } from '../../actions/actions';

const ReviewProduct = () => {
    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    
    const navigate = useNavigate();

    const [reviews, setReview] = useState([])
    
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const columns = useMemo(() => [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "product_name",
            header: "Product Name",
            enableSorting: false,            
        },
        { accessorKey: "name", header: "User Name" },
        { accessorKey: "review", header: "Review" },
        { accessorKey: "created_at", header: "Review Date" },
       
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ],[]);

     // Fetch data
    const fetchReview = async () => {

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

        let response = await actionFetchData(`${API_URL}/products/reviews?${new URLSearchParams(params)}`,accessToken);
        response = await response.json();
        if (response.status) {
            setReview(response.data.data || []);
            setPageCount(response.totalPage);
        }
        setLoading(false)
    }
    

    const table = useReactTable({
        data: reviews,
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
        if(!hasPermission(configPermission.VIEW_PRODUCT_REVIEW)){
            navigate('/403')
        }
        fetchReview()    
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);
    return (
        <div>
            <PageTitle
                title="Products Review"
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

                        {isLoading &&
                            <Loading />
                        }
                        {!isLoading && reviews.length === 0 &&
                            <NoState
                                message="No reviews found."
                            />
                        }

                        {reviews.length > 0 &&
                            <DataTable table={table} columns={columns} />
                        }
                    </div>

                    {reviews.length > 0 &&
                        <PaginationDataTable
                            table={table}
                            pageCount={pageCount}
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                        />
                    }
                </div>
            </div>
            
        </div>
    );
};

export default ReviewProduct;