import { useContext, useEffect, useMemo, useState } from "react";
import PageTitle from "../others/PageTitle";
import { API_URL,configPermission  } from "../../config";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AuthContext from "../../context/auth";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { actionDeleteData, actionFetchData } from "../../actions/actions";
import DataTable from "../others/DataTable";
import NoState from "../others/NoState";
import Loading from "../others/Loading";
import Status from "../others/Status";
import { useNavigate } from "react-router-dom";
import PaginationDataTable from "../others/PaginationDataTable";

const AllNotification = () => {
    const { Auth,hasPermission } = useContext(AuthContext);
    const accessToken = Auth("accessToken");
     const navigate = useNavigate();

    const columns = useMemo(
        () => [
            {
                header: "ID",
                accessorKey: "id",
            },            
            {
                header: "Title",
                accessorKey: "title",
            },
            {
                header: "Description",
                accessorKey: "body",
                enableSorting:false
            },
            {
                header: "Notification Name",
                accessorKey: "label",
                enableSorting:false,
                cell: ({ row }) => (row.original.label ? row.original.label : "N/A"),
            },
            {
                header: "Created At",
                accessorKey: "created_at",
                cell: ({ row }) => {
                    return (
                        <span className="d-inline-flex px-2 py-1 fw-semibold text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-2">
                            {row.original.created_at}
                        </span>
                    );
                },
            },            
            {
                accessorKey: "status",
                header: "Status",
                enableSorting: false,
                cell: ({ row }) => {
                    if (row.original.status === 1) {
                        return (<span className="d-inline-flex px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2">Sent</span>)
                    } else {
                        return (<span className="d-inline-flex px-2 py-1 fw-semibold text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-2">Failed</span>)
                    }
                },
            },
            {
                accessorKey: "action",
                header: "Action",
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <div className="dropdown">
                            <button
                                className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.DELETE_NOTIFICATION)) ? 'disabled' : ''}`}
                                type="button"
                                disabled={(!hasPermission(configPermission.DELETE_EMPLOYEE))}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                More Options
                            </button>
                            {(hasPermission(configPermission.EDIT_EMPLOYEE) || hasPermission(configPermission.DELETE_EMPLOYEE)) &&
                                <ul className="dropdown-menu">
                                    {hasPermission(configPermission.DELETE_EMPLOYEE) &&
                                        <li>
                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() => deleteNotification(row.original.id)}
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    }
                                </ul>
                            }
                        </div>
                    );
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const [notifications, setNotifications] = useState([]);

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);


    const fetchNotifications = async () => {
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

        let response = await actionFetchData(`${API_URL}/notifications?${new URLSearchParams(params)}`,accessToken);
        response = await response.json();

        if (response.status === 200) {
            setNotifications(response.data.data || []);
            setPageCount(response.totalPage || 0);
        }
        setLoading(false);        
    };

    //--Delete api call
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...");
        setLoading(true)
        try {
            let response = await actionDeleteData(
                `${API_URL}/notifications/${id}`,
                accessToken
            );
            response = await response.json();
            if (response.status) {
                setNotifications(prevData => prevData.filter(row => row.id !== id));

                toast.success(response.message, {
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error(error);
        }
        setLoading(false)
    };

    // -- Delete Notification
    const deleteNotification = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This notification will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                actionDelete(id);
            }
        });
    };
   

     const table = useReactTable({
        data: notifications,
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
        if (!hasPermission(configPermission.VIEW_NOTIFICATION)) {
            navigate('/403')
        }

        fetchNotifications();
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <PageTitle
                title="All Notifications"
                buttonLink={hasPermission(configPermission.ADD_NOTIFICATION) ? '/notification/new-notification' : null}
                buttonLabel={hasPermission(configPermission.ADD_NOTIFICATION) ? '+ Create New Notification' : null}
            />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
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

                            {!isLoading && notifications.length === 0 && (
                                <NoState  />
                            )}

                            {notifications.length > 0 && (
                                <DataTable table={table} columns={columns} />
                            )}

                            {notifications.length > 0 && (
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
            </div>
        </div>
    );
};

export default AllNotification;
