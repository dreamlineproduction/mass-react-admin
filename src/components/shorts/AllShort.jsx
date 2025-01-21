import { useContext, useEffect, useMemo, useState } from "react";
import PageTitle from "../others/PageTitle";
import { API_URL, configPermission } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";
import { useReactTable,getCoreRowModel } from "@tanstack/react-table";
import Loading from "../others/Loading";
import DataTable from "../others/DataTable";
import PaginationDataTable from "../others/PaginationDataTable";
import Status from "../others/Status";
import Swal from "sweetalert2";
import NoState from "../others/NoState";

const AllShort = () => {
    const { Auth,hasPermission } = useContext(AuthContext)

    const navigate = useNavigate();

    const columns = useMemo(() => [
        {
            header: 'Id',
            accessorKey: 'id',
        },
        {
            header: 'Image',
            accessorKey: 'image',
            enableSorting: false,
            cell: ({ row }) => {
              if (row.original.image_url) {
                return (
                  <img
                    src={row.original.image_url}
                    className="rounded me-3"
                    alt={row.original.title}
                    width={48}
                    height={48}
                    style={{ objectFit: "cover" }}
                  />
                );
              } 
            },
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
            header: 'Type',
            accessorKey: 'type',
            enableSorting: false,
            cell: ({ row }) => {

                if(row.original.file_type === 'video'){
                  return <span className="badge bg-primary">Video</span>  
                }
                if(row.original.file_type === 'image'){
                  return <span className="badge bg-dark">Image</span>  
                }
            },
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
                    className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.EDIT_SHORT) && !hasPermission(configPermission.DELETE_SHORT)) ? 'disabled' : ''}`}
                    type="button"
                    disabled={(!hasPermission(configPermission.EDIT_SHORT) && !hasPermission(configPermission.DELETE_SHORT))}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    More Options
                  </button>
                  {(hasPermission(configPermission.EDIT_SHORT) || hasPermission(configPermission.DELETE_SHORT)) &&
                  <ul className="dropdown-menu">
                    {hasPermission(configPermission.EDIT_SHORT) &&
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/shorts/edit-shorts/${row.original.id}`}
                      >
                        Edit
                      </Link>
                    </li>
                    }
                    {hasPermission(configPermission.EDIT_SHORT) &&
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
                    {hasPermission(configPermission.DELETE_SHORT) &&
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
    const [shorts, setShort] = useState([])

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

        let response = await actionFetchData( `${API_URL}/shorts?${new URLSearchParams(params)}`, accessToken);
        response = await response.json();
        if (response.status) {
            setShort(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false);
    }

    //--Delete api call
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        setLoading(true);
        try {
            let response = await actionDeleteData(`${API_URL}/shorts/${id}`, accessToken)
            response = await response.json();
            if (response.status) {
                setShort(shorts=>shorts.filter(item => item.id !== id));
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
        setLoading(false);
    }

    // -- Delete SHORT
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
            let response = await actionPostData(`${API_URL}/shorts/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {
                setShort(shorts=>shorts.map(item => item.id === id ? { ...item, status } : item));
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    const table = useReactTable({
            data: shorts,
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
        if (!hasPermission(configPermission.VIEW_SHORT)) {
            navigate('/403')
        }

        fetchData()
    }, [pageIndex, pageSize, sorting, globalFilter])

    return (
        <div>
            <PageTitle 
                title={'All Shorts'}
                buttonLink={hasPermission(configPermission.ADD_SHORT) ? '/shorts/new-shorts' : null}
                buttonLabel={hasPermission(configPermission.ADD_SHORT) ? 'New Short' : null}
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
                        {!isLoading && shorts.length === 0 &&
                            <NoState
                                message="No shorts found."
                            />
                        }

                        {shorts.length > 0 &&
                            <DataTable table={table} columns={columns} />
                        }
                    </div>

                    {shorts.length > 0 &&
                       <PaginationDataTable table={table} pageCount={pageCount} pageIndex={pageIndex} setPageIndex={setPageIndex} />
                    }
                </div>
            </div>
        </div>
    );
};

export default AllShort;