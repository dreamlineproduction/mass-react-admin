import { Link } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useContext, useEffect, useMemo, useState } from "react";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import { API_URL, configPermission } from "../../config";
import AuthContext from "../../context/auth";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Status from "../others/Status";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import DataTable from "../others/DataTable";
import PaginationDataTable from "../others/PaginationDataTable";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

const AllUser = () => {
    const navigate = useNavigate();
    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');

    const columns = useMemo(() => [
        { accessorKey: "id", header: "Id" },
        { 
            accessorKey: "image", 
            header: "Image",
            enableSorting: false,
            cell: ({ row }) => {
                if(row.original.image) {
                    return (
                        <img 
                            src={row.original.image_url} 
                            className="rounded-circle me-3" 
                            alt={row.original.name} 
                            width={48} 
                            height={48}
                            style={{objectFit: 'cover'}}
                        />
                    );
                } else {
                    return (
                        <img
                            src={`https://ui-avatars.com/api/?name=${row.original.name}&background=212631&color=fff`}
                            className="rounded-circle me-3"
                            alt={row.original.name} 
                            width={48} 
                            height={48}
                            style={{objectFit: 'cover'}}
                        />  
                    );
                }
            },
        },
        { accessorKey: "name", header: "Full Name" },
        { accessorKey: "age", header: "Age", enableSorting: false,
            cell: ({ row }) => row.original.age ? row.original.age : 'N/A' 
        },
        { accessorKey: "gender", header: "Gender", enableSorting: false,
            cell: ({ row }) => row.original.gender ? row.original.gender : 'N/A' 
        },
        { 
            accessorKey: "role", 
            header: "User Type",
            enableSorting: false,
            cell: ({ row }) => {
                return <span className="badge bg-primary">{row.original.role.name}</span>;
            },
        },
        { accessorKey: "phone", header: "Phone" },
        { 
            accessorKey: "city", 
            header: "City", 
            enableSorting: false, 
            cell: ({ row }) => row.original.city ? row.original.city : 'N/A' 
        },
        { 
            accessorKey: "state_str", 
            header: "State", 
            enableSorting: false, 
            cell: ({ row }) => row.original.state_str ? row.original.state_str : 'N/A' 
        },
        { accessorKey: "area", header: "Area", enableSorting: false, 
            cell: ({ row }) => row.original.area ? row.original.area : 'N/A' 
        },
        { accessorKey: "created_at", header: "Joined Date", enableSorting: false },
        { accessorKey: "source", header: "Source", enableSorting: false,
            cell: ({ row }) => row.original.source ? row.original.source : 'N/A' 
        },

        { 
            accessorKey: "referral_code", 
            header: "Referral Code", 
            cell: ({ row }) => row.original.referral_code ? row.original.referral_code : 'N/A' 
        },
        { 
            accessorKey: "employee_code", 
            header: "Employee Code", 
            cell: ({ row }) => row.original.employee_code ? row.original.employee_code : 'N/A' 
        },
        
        { accessorKey: "scan_product_count", header: "Total Product Scanned", enableSorting: false },
        { accessorKey: "total_xp", header: "Total XP", enableSorting: false },
        { accessorKey: "balance_xp", header: "Current XP Balance", enableSorting: false },
        { accessorKey: "order_count", header: "Total Redeemed", enableSorting: false },
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
                            className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.EDIT_USER) && !hasPermission(configPermission.DELETE_USER)) ? 'disabled' : ''}`} 
                            type="button" 
                            disabled={(!hasPermission(configPermission.EDIT_USER) && !hasPermission(configPermission.DELETE_USER))}
                            data-bs-toggle="dropdown" 
                            aria-expanded="false">
                            More Options
                        </button>
                        {(hasPermission(configPermission.EDIT_USER) || hasPermission(configPermission.DELETE_USER)) &&
                        <ul className="dropdown-menu">
                            {hasPermission(configPermission.EDIT_USER) &&
                            <li>
                                <Link className="dropdown-item" to={`/users/edit-user/${row.original.id}`}>
                                    Edit
                                </Link>
                            </li>
                            }
                            {hasPermission(configPermission.EDIT_USER) &&
                            <li>
                                <button type="button" className="dropdown-item" onClick={() => changeStatus(row.original.id,row.original.status)}>
                                    {row.original.status === 1 ? 'Inactive' : 'Active'}
                                </button>
                            </li>
                            }
                            {hasPermission(configPermission.DELETE_USER) &&
                            <li>
                                <button type="button" className="dropdown-item" onClick={() => deleteUser(row.original.id)}>
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

    
    const [users, setUsers] = useState([])
    const [userCount, setUserCount] = useState('');
   

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    
    // Fetch data
    const fetchData = async () => {

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
            let response = await actionFetchData(`${API_URL}/users?${new URLSearchParams(params)}`, accessToken);
            response = await response.json();
            if (response.status) {
                setUsers(response.data.data);
                setPageCount(response.data.totalPage);
            }
            setLoading(false)            
        } catch (error) {
            toast.error(error)
        }
    }

    // Delete Data
    const actionDeleteUser = async (id) => {
        const toastId = toast.loading("Please wait...")

        try {
            let response = await actionDeleteData(`${API_URL}/users/${id}`, accessToken)
            response = await response.json();

            if (response.status) {
                setUsers(prevData => prevData.filter(row => row.id !== id));

                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    const deleteUser = (id) => {
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
                actionDeleteUser(id)
            }
        });
    }

   
    const changeStatus = async (id,currentStatus) => {
        const toastId = toast.loading("Please wait...");      
        let status = currentStatus === 1 ? 0 : 1;
    
        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/users/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();
    
            if (response.status) {
                setUsers(prevData => 
                    prevData.map(row => row.id === id ? { ...row, status } : row)
                );
                toast.success(response.message, {
                    id: toastId
                });
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error("An error occurred while changing status", {
                id: toastId
            });
            console.error(error);
        }
    };
       

    // Fetch Data user count
    const fetchUserCount = async () => {
        let response = await actionFetchData(`${API_URL}/users/roles/count`, accessToken);
        response = await response.json();
        if (response.status === 200) {
            setUserCount(response);
        }
    }

    const table = useReactTable({
        data: users,
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
        fetchUserCount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        if(!hasPermission(configPermission.VIEW_USER) && !isLoading){
            navigate('/403')
         }
        fetchData()            
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);

   
    
    return (
        <div>
            <PageTitle 
                title="All Users"
                buttonLink={hasPermission(configPermission.ADD_USER) ? "/users/add-user" : null}
                buttonLabel={hasPermission(configPermission.ADD_USER) ? "Add New User" : null}
            />

            {Object.keys(userCount).length > 0 &&
            <div className="row">
                <div className="col-12 col-sm-6 col-xl-4 col-xxl-3">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title mb-0">Customer</h3>
                        </div>
                        <div className="card-body pt-0">
                            <div className="row">
                                <div className="col-12">
                                    <h1>{userCount.total_customer}</h1>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-auto">
                                            <span className="active-signal"></span> Active {userCount.active_customer}
                                        </div>
                                        <div className="col-auto">
                                            <span className="inactive-signal"></span> Inactive {userCount.inactive_customer}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-4 col-xxl-3">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title mb-0">Carpenter</h3>
                        </div>
                        <div className="card-body pt-0">
                            <div className="row">
                                <div className="col-12">
                                    <h1>{userCount.total_carpenter}</h1>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-auto">
                                            <span className="active-signal"></span> Active {userCount.active_carpenter}
                                        </div>
                                        <div className="col-auto">
                                            <span className="inactive-signal"></span> Inactive {userCount.inactive_carpenter}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-4 col-xxl-3">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title mb-0">Vendor</h3>
                        </div>
                        <div className="card-body pt-0">
                            <div className="row">
                                <div className="col-12">
                                    <h1>{userCount.total_vendor}</h1>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-auto">
                                            <span className="active-signal"></span> Active {userCount.active_vendor}
                                        </div>
                                        <div className="col-auto">
                                            <span className="inactive-signal"></span> Inactive {userCount.inactive_vendor}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6 col-xl-4 col-xxl-3">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title mb-0">Employee</h3>
                        </div>
                        <div className="card-body pt-0">
                            <div className="row">
                                <div className="col-12">
                                    <h1>{userCount.total_employee}</h1>
                                </div>
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-auto">
                                            <span className="active-signal"></span> Active {userCount.active_employee}
                                        </div>
                                        <div className="col-auto">
                                            <span className="inactive-signal"></span> Inactive {userCount.inactive_employee}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
           
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
                        {!isLoading && users.length === 0 &&
                            <NoState
                                message="No users found."
                            />
                        }
                        
                        {users.length > 0 &&
                        <div className="table-responsive">
                            <DataTable table={table} columns={columns} />                  
                        </div>                                  
                        }
                    </div>

                    {users.length > 0 &&
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

export default AllUser;