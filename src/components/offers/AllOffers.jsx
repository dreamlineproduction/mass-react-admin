import { useContext, useEffect, useMemo, useState } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import { API_URL, configPermission } from "../../config";
import Status from "../others/Status";
import { Link, useNavigate } from "react-router-dom";
import { useReactTable,getCoreRowModel  } from "@tanstack/react-table";
import DataTable from "../others/DataTable";
import PaginationDataTable from "../others/PaginationDataTable";

const AllOffers = () => {
    const { Auth,hasPermission } = useContext(AuthContext)

    const columns = useMemo(() => [
        { header: 'Id', accessorKey: 'id' },
        { header: 'Image', accessorKey: 'image', enableSorting: false, cell: ({ row }) => {
            return <img 
                src={row.original.image_url} 
                alt="Offer Image" 
                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
                className="img-thumbnail"
            />
        }},
        { header: 'Title', accessorKey: 'title' },
        { header: 'In Homepage', accessorKey: 'is_home', enableSorting: false, cell: ({ row }) => {
            return row.original.is_home ? 
                <span className="d-inline-flex px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2">Yes</span> : 
                <span className="d-inline-flex px-2 py-1 fw-semibold text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-2">No</span>;
        } },
        { header: 'Crated At', accessorKey: 'created_at',enableSorting: false, },
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
                    className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.EDIT_OFFER) && !hasPermission(configPermission.DELETE_OFFER)) ? 'disabled' : ''}`}
                    type="button"
                    disabled={(!hasPermission(configPermission.EDIT_OFFER) && !hasPermission(configPermission.DELETE_OFFER))}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    More Options
                  </button>
                  {((hasPermission(configPermission.EDIT_OFFER) || hasPermission(configPermission.DELETE_OFFER))) &&
                  <ul className="dropdown-menu">
                    {hasPermission(configPermission.EDIT_OFFER) &&
                    <li>
                      <Link
                        className="dropdown-item"
                        to={`/offers/edit-offer/${row.original.id}`}
                      >
                        Edit
                      </Link>
                    </li>
                    }
                    {hasPermission(configPermission.EDIT_OFFER) &&
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
                    {hasPermission(configPermission.DELETE_OFFER) &&
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => deleteOffer(row.original.id)}
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

    
    const navigate = useNavigate();
    const accessToken = Auth('accessToken');

    const [offers, setOffer] = useState([]);

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState([]);

    // Delete Data
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionDeleteData(`${API_URL}/offers/${id}`, accessToken)
            response = await response.json();

            if (response.status) {
                setOffer(prevData => prevData.filter(item => item.id !== id));
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }


    const deleteOffer = (id) => {
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

    //--Fetch Data
    const fetchOffer = async () => {
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
            `${API_URL}/offers?${new URLSearchParams(params)}`,
            accessToken
        );
        response = await response.json();
        if (response.status) {
            setOffer(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false)
    }

    // Change Status
    const changeStatus = async (id,currentStatus) => {
        const toastId = toast.loading("Please wait...")

        let status = (currentStatus === 1) ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/offers/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {               
                setOffer(prevData => prevData.map(item => item.id === id ? { ...item, status } : item));
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    const table = useReactTable({
        data: offers,
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
        if(!hasPermission(configPermission.VIEW_OFFER)){
            navigate('/403')
        }
        fetchOffer();
    }, [pageIndex, pageSize, sorting, globalFilter])

    return (
        <div>
            <PageTitle
                title="All Offers"
                buttonLink={hasPermission(configPermission.ADD_OFFER) ? '/offers/add-offer' : null}
                buttonLabel={hasPermission(configPermission.ADD_OFFER) ? 'Add New Offer' : null}
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
                        {!isLoading && offers.length === 0 &&
                            <NoState
                                message="No offers found."
                            />
                        }

                        {offers.length > 0 &&
                            <DataTable table={table} columns={columns} />
                        }
                    </div>

                    {offers.length > 0 &&
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

export default AllOffers;