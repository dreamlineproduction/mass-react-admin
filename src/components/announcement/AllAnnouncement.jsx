import React, { useContext, useEffect, useMemo, useState } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import { API_URL, configPermission } from "../../config";
import Status from "../others/Status";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import DataTable from "../others/DataTable";
import PaginationDataTable from "../others/PaginationDataTable";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useNavigate,Link } from "react-router-dom";

const AllAnnouncement = () => {
    const { Auth,hasPermission } = useContext(AuthContext)

    const navigate = useNavigate();

    const columns = useMemo(() => [
        {
            header: 'Id',
            accessorKey: 'id',
        },        
        {
            header: 'Title',
            accessorKey: 'title',
        },       
        {
            header: 'Created At',
            accessorKey: 'created_at',
        },          
        {
            header: 'Status',
            accessorKey: 'status',
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
                    className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.EDIT_ANNOUNCEMENT) && !hasPermission(configPermission.DELETE_ANNOUNCEMENT)) ? 'disabled' : ''}`}
                    type="button"
                    disabled={(!hasPermission(configPermission.EDIT_ANNOUNCEMENT) && !hasPermission(configPermission.DELETE_ANNOUNCEMENT))}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    More Options
                  </button>
                  {(hasPermission(configPermission.EDIT_ANNOUNCEMENT) || hasPermission(configPermission.DELETE_ANNOUNCEMENT)) &&
                  <ul className="dropdown-menu">
                    {hasPermission(configPermission.EDIT_ANNOUNCEMENT) &&
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/announcements/edit-announcement/${row.original.id}`}
                      >
                        Edit
                      </Link>
                    </li>
                    }
                    {hasPermission(configPermission.EDIT_ANNOUNCEMENT) &&
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() =>
                          changeStatus(row.original.id, row.original.status)
                        }
                      >
                        {row.original.status === 1 ? "Inactive" : "Active"}
                      </button>
                    </li>
                    }
                    {hasPermission(configPermission.DELETE_ANNOUNCEMENT) &&
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => deleteShort(row.original.id)}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ], [])

    const accessToken = Auth('accessToken');
    const [announcements, setAnnouncement] = useState([])

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);

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

        let response = await actionFetchData( `${API_URL}/announcements?${new URLSearchParams(params)}`, accessToken);
        response = await response.json();
        if (response.status) {
            setAnnouncement(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false);
    }

    //--Delete Announcement
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        setLoading(true);
        try {
            let response = await actionDeleteData(`${API_URL}/announcements/${id}`, accessToken)
            response = await response.json();
            if (response.status) {
                setAnnouncement(announcements=>announcements.filter(item => item.id !== id));
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
        setLoading(false);
    }

    // -- Delete Announcement
    const deleteShort = (id) => {
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

    // -- Change status
    const changeStatus = async (id,currentStatus) => {
        const toastId = toast.loading("Please wait...")      
        let status = (currentStatus === 1) ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/announcements/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {
                setAnnouncement(announcements=>announcements.map(item => item.id === id ? { ...item, status } : item));
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    const table = useReactTable({
            data: announcements,
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
        if (!hasPermission(configPermission.VIEW_ANNOUNCEMENT)) {
            navigate('/403')
        }

        fetchData()
    }, [pageIndex, pageSize, sorting, globalFilter])

    return (
        <React.Fragment>
            <PageTitle
                title="All Announcement"
                buttonLink={hasPermission(configPermission.ADD_ANNOUNCEMENT) ? '/announcements/new-announcement' : null}
                buttonLabel={hasPermission(configPermission.ADD_ANNOUNCEMENT) ? 'Add New Announcement' : null}
            />
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
                        {!isLoading && announcements.length === 0 &&
                            <NoState
                                message="No announcements found."
                            />
                        }

                        {announcements.length > 0 &&
                            <DataTable table={table} columns={columns} />
                        }
                    </div>

                    {announcements.length > 0 &&
                       <PaginationDataTable table={table} pageCount={pageCount} pageIndex={pageIndex} setPageIndex={setPageIndex} />
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

export default AllAnnouncement;