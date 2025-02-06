import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import Status from "../others/Status";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import AuthContext from "../../context/auth";
import {
    actionDeleteData,
    actionFetchData,
    actionPostData,
} from "../../actions/actions";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { API_URL, configPermission } from "../../config";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "../others/DataTable";
import PaginationDataTable from "../others/PaginationDataTable";
import BsModal from "../others/BsModal";
import { useForm } from "react-hook-form";
import LoadingButton from "../others/LoadingButton";


const AllEmployee = () => {
    const { Auth, hasPermission } = useContext(AuthContext);
    const navigate = useNavigate();
    const changePasswordModal = useRef(null);

    const columns = useMemo(
        () => [
            {
                header: "ID",
                accessorKey: "id",
            },
            {
                accessorKey: "image",
                header: "Image",
                enableSorting: false,
                cell: ({ row }) => {
                    if (row.original.image) {
                        return (
                            <img
                                src={row.original.image_url}
                                className="rounded me-3"
                                alt={row.original.name}
                                width={48}
                                height={48}
                                style={{ objectFit: "cover" }}
                            />
                        );
                    } else {
                        return (
                            <img
                                src={`https://ui-avatars.com/api/?name=${row.original.name}&background=212631&color=fff`}
                                className="rounded me-3"
                                alt={row.original.name}
                                width={48}
                                height={48}
                                style={{ objectFit: "cover" }}
                            />
                        );
                    }
                },
            },
            {
                header: "Name",
                accessorKey: "name",
            },
            {
                header: "Email",
                accessorKey: "email",
            },
            {
                header: "Phone Number",
                accessorKey: "phone",
                cell: ({ row }) => (row.original.phone ? row.original.phone : "N/A"),
            },
            {
                header: "User Type",
                accessorKey: "role",
                cell: ({ row }) => {
                    return (
                        <span className="d-inline-flex px-2 py-1 fw-semibold text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-2">{row.original.role.name}</span>
                    );
                },
            },
            {
                header: "Designation",
                accessorKey: "designation",
                cell: ({ row }) =>
                    row.original.designation ? row.original.designation : "N/A",
            },
            {
                header: "Employee Code",
                accessorKey: "employee_code",
                cell: ({ row }) =>
                    row.original.employee_code ? row.original.employee_code : "N/A",
            },
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
                                className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.EDIT_EMPLOYEE) && !hasPermission(configPermission.DELETE_EMPLOYEE)) ? 'disabled' : ''}`}
                                type="button"
                                disabled={(!hasPermission(configPermission.EDIT_EMPLOYEE) && !hasPermission(configPermission.DELETE_EMPLOYEE))}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                More Options
                            </button>
                            {(hasPermission(configPermission.EDIT_EMPLOYEE) || hasPermission(configPermission.DELETE_EMPLOYEE)) &&
                                <ul className="dropdown-menu">
                                    {hasPermission(configPermission.EDIT_EMPLOYEE) &&
                                        <li>
                                            <Link
                                                className="dropdown-item"
                                                to={`/employees/edit-employee/${row.original.id}`}
                                            >
                                                Edit
                                            </Link>
                                        </li>
                                    }
                                    {hasPermission(configPermission.EDIT_EMPLOYEE) &&
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

                                    {hasPermission(configPermission.EDIT_EMPLOYEE) &&
                                    <li>
                                        <button
                                            data-bs-toggle="modal"
                                            data-bs-target="#changePasswordModal"
                                            type="button"
                                            className="dropdown-item"
                                            onClick={() => setSingleEmployee(row.original)}
                                        >
                                            Change Password
                                        </button>
                                    </li>
                                    }

                                    {hasPermission(configPermission.DELETE_EMPLOYEE) && (row.original.role_id !== 1) &&
                                        <li>
                                            <button
                                                type="button"
                                                className="dropdown-item"
                                                onClick={() => deleteEmployee(row.original.id)}
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


    const accessToken = Auth("accessToken");
    const [employees, setEmployees] = useState([]);
    const [singleEmployee, setSingleEmployee] = useState('');


    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

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
            `${API_URL}/employees?${new URLSearchParams(params)}`,
            accessToken
        );
        response = await response.json();
        if (response.status) {
            setEmployees(response.data.data || []);
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
                `${API_URL}/employees/${id}`,
                accessToken
            );
            response = await response.json();
            if (response.status) {
                setEmployees(prevData => prevData.filter(row => row.id !== id));

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
    const deleteEmployee = (id) => {
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

    // Change Status
    const changeStatus = async (id, currentStatus) => {
        const toastId = toast.loading("Please wait...");
        let status = currentStatus === 1 ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(
                `${API_URL}/employees/change-status/${id}`,
                accessToken,
                postData,
                "PUT"
            );
            response = await response.json();

            if (response.status) {
                setEmployees(prevData =>
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

    const table = useReactTable({
        data: employees,
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

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors, isSubmitting },
        setError,
    } = useForm();

    const submitHandler = async (data) => {
        try {
            const toastId = toast.loading("Please wait...")
            let response = await actionPostData(`${API_URL}/employees/change-password/${singleEmployee.id}`, accessToken, data,'PUT');
            response = await response.json();

            if (response.status === 200) {
                toast.success(response.message, {
                    id: toastId
                });

                changePasswordModal.current.click();
            }
            if (response.status === 409) {
                toast.error(response.message, {
                    id: toastId
                });
                reset()
            }

            if (response.status === 422) {
                Object.keys(response.errors).forEach((field) => {
                    setError(field, {
                        type: "server",
                        message: response.errors[field],
                    });
                });
                toast.dismiss(toastId);
            }
        } catch (error) {
            toast.error(error)
        }
    };

    useEffect(() => {
        if (!hasPermission(configPermission.VIEW_EMPLOYEE)) {
            navigate('/403')
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <PageTitle
                title="All Employees"
                buttonLink={hasPermission(configPermission.ADD_EMPLOYEE) ? '/employees/add-employee' : null}
                buttonLabel={hasPermission(configPermission.ADD_EMPLOYEE) ? '+ Add New Employee' : null}
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

                        {!isLoading && employees.length === 0 && (
                            <NoState message="No employees found." />
                        )}

                        {employees.length > 0 && (
                            <DataTable table={table} columns={columns} />
                        )}
                    </div>
                    {employees.length > 0 && (
                        <PaginationDataTable
                            table={table}
                            pageCount={pageCount}
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                        />
                    )}
                </div>
            </div>

            {/* Modals */}
            <BsModal
                modalId="changePasswordModal"
                title={'Change Password'}
                size="md"
                modalRef={changePasswordModal}
                showCloseBtn={false}
            >
                <form onSubmit={handleSubmit(submitHandler)} method="post">
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters long",
                                },
                            })}
                            className={`form-control custom-input ${errors.password && `is-invalid`}`}
                            type="password"
                            name="password"
                            id="password"
                        />
                        <p className="invalid-feedback">{errors?.password?.message}</p>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Confirm Password</label>
                        <input
                            {...register("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: (value) =>
                                    (value === getValues('password')) || "Passwords do not match",
                                }
                            )}
                            type="password"
                            className={`form-control custom-input ${errors.confirmPassword && `is-invalid`}`}
                            name="confirmPassword"
                            id="confirmPassword"
                        />
                        <p className="invalid-feedback">{errors?.confirmPassword?.message}</p>
                    </div>

                    <div className="mb-3">
                        {isSubmitting ?
                            <LoadingButton />
                            :
                            <button type="submit" className="btn btn-primary large-btn">
                                Change Password
                            </button>
                        }
                    </div>
                </form>

            </BsModal>
        </div>
    );
};

export default AllEmployee;
