import { useContext, useEffect, useMemo, useState } from "react";
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
import { useNavigate } from "react-router-dom";

const AllAnnouncement = () => {
    const { Auth,hasPermission } = useContext(AuthContext);
    const navigate = useNavigate();

    const columns = useMemo(() => [
        { accessorKey: "id", header: "Id" },
        { accessorKey: "state", header: "State" },
        { accessorKey: "district", header: "District" },
        { accessorKey: "city", header: "City" },
        { accessorKey: "area", header: "Area" },
        { accessorKey: "pin_code", header: "Pin Code" },
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
                            className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.EDIT_AREA) || !hasPermission(configPermission.DELETE_AREA)) ? 'disabled' : ''}`} 
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            disabled={(!hasPermission(configPermission.EDIT_AREA) || !hasPermission(configPermission.DELETE_AREA))}
                        >
                            More Options
                        </button>
                        {(hasPermission(configPermission.EDIT_AREA) || hasPermission(configPermission.DELETE_AREA)) &&
                        <ul className="dropdown-menu">
                            
                            {hasPermission(configPermission.EDIT_AREA) &&
                            <li>
                                <button type="button" className="dropdown-item" onClick={() => changeStatus(row.original.id,row.original.status)}>
                                    {row.original.status === 1 ? 'Inactive' : 'Active'}
                                </button>
                            </li>
                            }
                            {hasPermission(configPermission.DELETE_EMPLOYEE) && (row.original.role_id !== 1) &&
                            <li>
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={() => deleteArea(row.original.id)}
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
    ],[]);

    const [areas, setArea] = useState([]);
    const accessToken = Auth("accessToken");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(100);
    const [sorting, setSorting] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [pageCount, setPageCount] = useState(0);
    const [globalFilter, setGlobalFilter] = useState("");

    const fetchArea = async () => {
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
                `${API_URL}/areas?${new URLSearchParams(params)}`,
                accessToken
            );
            const data = await response.json();
            if (data.status) {
                setArea(data.data.data || []);
                setPageCount(data.totalPage || 0);
              
            } else {
                setArea([]);
                setPageCount(0);
            }
        } catch (e) {
            toast.error(`Failed to fetch pages: ${e}`);
            setArea([]);
            setPageCount(0);
        } finally {
            setLoading(false);
        }
    };

    const table = useReactTable({
        data: areas,
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

    // Change Status
    const changeStatus = async (id,currentStatus) => {
        const toastId = toast.loading("Please wait...");
        let status = currentStatus === 1 ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(
                `${API_URL}/areas/change-status/${id}`,
                accessToken,
                postData,
                "PUT"
            );
            response = await response.json();

            if (response.status) {
                setArea(prevData => 
                    prevData.map(row => row.id === id ? { ...row, status } : row)
                );
                toast.success(response.message, {
                id: toastId,
                });
            }
        } catch (error) {
            toast.error(error);
        }
    };

     //--Delete api call
    const actionDelete = async (id) => {      
        try {
            const toastId = toast.loading("Please wait...");
            setLoading(true)
            let response = await actionDeleteData(
                `${API_URL}/areas/${id}`,
                accessToken
            );
            response = await response.json();
            if (response.status) {
                setArea(prevData => prevData.filter(row => row.id !== id));

                toast.success(response.message, {
                    id: toastId,
                });
            }
        } catch (error) {
            toast.error(error);
        }
        setLoading(false)
    };
    
    // -- Delete employee
    const deleteArea = (id) => {
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
            actionDelete(id);
          }
        });    
    };

    useEffect(() => {
        if(!hasPermission(configPermission.VIEW_ANNOUNCEMENT)){
            navigate('/403')
        }
        fetchArea();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <PageTitle
                title="All Announcement"
                buttonLink={hasPermission(configPermission.ADD_AREA) ? '/announcements/new-announcement' : null}
                buttonLabel={hasPermission(configPermission.ADD_AREA) ? 'Add New Announcement' : null}
            />
        </div>
    );
};

export default AllAnnouncement;