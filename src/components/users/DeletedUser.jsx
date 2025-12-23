import React, { useContext, useEffect, useMemo, useState } from 'react';
import AuthContext from '../../context/auth';
import { Link, useNavigate } from 'react-router-dom';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import PageTitle from '../others/PageTitle';
import Loading from '../others/Loading';
import PaginationDataTable from '../others/PaginationDataTable';
import NoState from '../others/NoState';
import { API_URL, configPermission } from '../../config';
import { actionDeleteData, actionFetchData } from '../../actions/actions';
import DataTable from '../others/DataTable';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const DeletedUser = () => {
    const { Auth, hasPermission } = useContext(AuthContext);
    const navigate = useNavigate();
    const accessToken = Auth("accessToken");
    
    const [products, setProduct] = useState([]);

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
                header: "User Information",
                accessorKey: "product_name",
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
                header: "Delete Request Date",
                accessorKey: "created_at",
            },
            
            {
                header: "Action",
                accessorKey: "delete",
                cell: ({ row }) =>{
                    return <div>
                    {hasPermission(configPermission.DELETE_USER) && (
                        <button 
                            type="button"            
                            onClick={() => deleteUser(row.original.user_id)}                
                            className="btn btn-danger" 
                        >Delete User
                        </button>                    
                    )}
                </div>
                }
                    
            },                        
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

   // Delete Data
    const actionDeleteUser = async (id) => {
        const toastId = toast.loading("Please wait...");

        try {
            let response = await actionDeleteData(
                `${API_URL}/users/${id}`,
                accessToken
            );
            response = await response.json();

            if (response.status) {
                setUsers((prevData) => prevData.filter((row) => row.user_id !== id));

                toast.success(response.message, {
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error(error?.message || 'Failed to delete user');
        }
    };

    const deleteUser = (id) => {
        Swal.fire({
            title: "Delete Confirmation",
            text: "Are you sure you want to delete this?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                actionDeleteUser(id);
            }
        });
    };

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
            `${API_URL}/users/delete-requests?${new URLSearchParams(params)}`,
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
                title="Deleted User Request"
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
 
        </div>
    );
};

export default DeletedUser;