import { useContext, useEffect, useState, useMemo } from "react";
import AuthContext from "../../context/auth";
import { API_URL, configPermission } from "../../config";
import { actionFetchData, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";
import NoState from "../others/NoState";
import Loading from "../others/Loading";
import PageTitle from "../others/PageTitle";
import Status from "../others/Status";

import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { Link, useNavigate } from "react-router-dom";
import PaginationDataTable from "../others/PaginationDataTable";
import DataTable from "../others/DataTable";

const AllPages = () => {
    const { Auth,hasPermission } = useContext(AuthContext);
    const navigate = useNavigate();
    const columns = useMemo(() => [
        { accessorKey: "id", header: "Id" },
        { accessorKey: "title", header: "Title" },
        { accessorKey: "created_at", header: "Created At", enableSorting: false },
        {
            accessorKey: "status",
            header: "Status",
            enableSorting: false,
            cell: ({ getValue }) => {
                return <Status status={getValue()} />;
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
                            className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.EDIT_PAGE) || !hasPermission(configPermission.DELETE_PAGE)) ? 'disabled' : ''}`} 
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            disabled={(!hasPermission(configPermission.EDIT_PAGE) || !hasPermission(configPermission.DELETE_PAGE))}
                        >
                            More Options
                        </button>
                        {(hasPermission(configPermission.EDIT_PAGE) || hasPermission(configPermission.DELETE_PAGE)) &&
                        <ul className="dropdown-menu">
                            {hasPermission(configPermission.EDIT_PAGE) &&
                            <li>
                                <Link className="dropdown-item" to={`/pages/edit-page/${row.original.id}`}>
                                    Edit
                                </Link>
                            </li>
                            }
                            {hasPermission(configPermission.DELETE_PAGE) &&
                            <li>
                                <button type="button" className="dropdown-item" onClick={() => changeStatus(row.original.id,row.original.status)}>
                                    {row.original.status === 1 ? 'Inactive' : 'Active'}
                                </button>
                            </li>
                            }
                        </ul>
                        }
                    </div>
                );
            },
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
    ],[]);

  
    const accessToken = Auth("accessToken");

    const [pages, setPages] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [sorting, setSorting] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [globalFilter, setGlobalFilter] = useState("");

    const fetchPages = async () => {
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

        try {
            const response = await actionFetchData(
                `${API_URL}/pages?${new URLSearchParams(params)}`,
                accessToken
            );
            const data = await response.json();
            if (data.status) {
                setPages(data.data.data || []);
                setPageCount(data.totalPage || 0);
              
            } else {
                setPages([]);
                setPageCount(0);
            }
        } catch (e) {
            toast.error(`Failed to fetch pages: ${e}`);
            setPages([]);
            setPageCount(0);
        } finally {
            setLoading(false);
        }
    };

    const table = useReactTable({
        data: pages,
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

    const changeStatus = async (id,currentStatus) => {      

        const status = currentStatus === 1 ? 0 : 1;

        const toastId = toast.loading("Please wait...");
        try {
            const response = await actionPostData(
                `${API_URL}/pages/change-status/${id}`,
                accessToken,
                { status },
                "PUT"
            );
            const result = await response.json();

            if (result.status) {              
                toast.success(result.message, { id: toastId });
                fetchPages();
            }
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            toast.dismiss(toastId);
        }
    };

    useEffect(() => {
        if(!hasPermission(configPermission.VIEW_PAGE)){
            navigate('/403')
        }
        fetchPages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);

    //console.log(pages);
    return (
        <div>
            <PageTitle title="All Pages" />
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
                        {!isLoading && pages.length === 0 && (
                            <NoState message="No pages found." />
                        )}

                        {pages.length > 0 && (
                            <DataTable table={table} columns={columns} />
                        )}
                    </div>

                    {pages.length > 0 && (
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

export default AllPages;
