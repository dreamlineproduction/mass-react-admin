import { useContext, useEffect, useMemo, useState } from "react";
import PageTitle from "../others/PageTitle";
import { API_URL } from "../../config";
import { actionDeleteData, actionFetchData } from "../../actions/actions";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth";
import { useReactTable,getCoreRowModel } from "@tanstack/react-table";
import PaginationDataTable from "../others/PaginationDataTable";
import DataTable from "../others/DataTable";

const AllPermission = () => {
    const columns = useMemo(() => [
        { accessorKey: "id", header: "Id" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "created_at", header: "Created At", enableSorting: false },
        {
            accessorKey: "action",
            header: "Action",
            enableSorting: false,
            cell: ({ row }) => {
                return (
                    <div className="dropdown">
                        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            More Options
                        </button>
                        <ul className="dropdown-menu">
                            <li>
                                <Link className="dropdown-item" to={`/permissions/edit-permission/${row.original.id}`}>
                                    Edit
                                </Link>
                            </li>
                            <li>
                                <button type="button" className="dropdown-item" onClick={() => deletePermission(row.original.id)}>
                                   Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                );
            },
        },
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ],[]);

    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const [permissions, setPermission] = useState([])

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

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

        let response = await actionFetchData(`${API_URL}/permissions?${new URLSearchParams(params)}`, accessToken);
        response = await response.json();
        if (response.status) {
            setPermission(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false);
    }

    //--Delete api call
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionDeleteData(`${API_URL}/permissions/${id}`, accessToken)
            response = await response.json();
            if (response.status) {        
                setPermission(prevData => prevData.filter(row => row.id !== id));
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    // -- Delete reward
    const deletePermission = (id) => {
        Swal.fire({
            title: "Delete Confirmation",
            text: "Are you sure you want to delete this?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                actionDelete(id)
            }
        });
    }



    const table = useReactTable({
        data: permissions,
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
        fetchData()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <PageTitle
                title="All Permissions"
                buttonLink="/permissions/new-permission"
                buttonLabel="Add New Permission"
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
                        {!isLoading && permissions.length === 0 &&
                            <NoState
                                message="No permissions found."
                            />
                        }

                        {permissions.length > 0 &&
                            <DataTable
                                table={table}
                                columns={columns}
                            />
                        }
                    </div>

                    {permissions.length > 0 &&
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

export default AllPermission;