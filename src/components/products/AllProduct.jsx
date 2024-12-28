import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useContext, useEffect,  useMemo,  useState } from "react";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import { API_URL, configPermission } from "../../config";
import AuthContext from "../../context/auth";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Status from "../others/Status";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "../others/DataTable";
import PaginationDataTable from "../others/PaginationDataTable";

const AllProduct = () => {
    const { Auth,hasPermission } = useContext(AuthContext)
    const navigate = useNavigate();

    const columns = useMemo(() => [
        {
            accessorKey: "image",
            header: "Image",
            enableSorting: false,
            cell: ({ row }) => {
              if (row.original.image) {
                return (
                  <img
                    src={row.original.image_url}
                    className="rounded-circle me-3"
                    alt={row.original.name}
                    width={48}
                    height={48}
                    style={{ objectFit: "cover" }}
                  />
                );
              } 
            },
        },
        { accessorKey: "unique_id", header: "Product ID" },
        { accessorKey: "name", header: "Product Name" },
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
                            className={`btn btn-secondary dropdown-toggle ${(!hasPermission(configPermission.EDIT_PRODUCT) && !hasPermission(configPermission.DELETE_PRODUCT)) ? 'disabled' : ''}`}
                            type="button" 
                            data-bs-toggle="dropdown" 
                            aria-expanded="false"
                            disabled={(!hasPermission(configPermission.EDIT_PRODUCT) && !hasPermission(configPermission.DELETE_PRODUCT))}
                        >
                            More Options
                        </button>
                        {((hasPermission(configPermission.EDIT_PRODUCT) || hasPermission(configPermission.DELETE_PRODUCT))) &&
                        <ul className="dropdown-menu">
                            {hasPermission(configPermission.EDIT_PRODUCT) &&
                            <li>
                                <Link className="dropdown-item" to={`/products/edit-product/${row.original.id}`}>
                                    Edit
                                </Link>
                            </li>
                            }
                            {hasPermission(configPermission.EDIT_PRODUCT) &&
                            <li>
                                <button type="button" className="dropdown-item" onClick={() => changeStatus(row.original.id,row.original.status)}>
                                    {row.original.status === 1 ? 'Inactive' : 'Active'}
                                </button>
                            </li>
                            }
                            {hasPermission(configPermission.DELETE_PRODUCT) &&
                            <li>
                                <button type="button" className="dropdown-item" onClick={() => deleteProduct(row.original.id)}>
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

    
    const accessToken = Auth('accessToken');
    const [products, setProduct] = useState([])

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    // Fetch data
    const fetchProduct = async () => {

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

        let response = await actionFetchData(`${API_URL}/products?${new URLSearchParams(params)}`,accessToken);
        response = await response.json();
        if (response.status) {
            setProduct(response.data.data || []);
            setPageCount(response.totalPage);
        }
        setLoading(false)
    }

    // Delete Data
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        setLoading(true)
        try {
            let response = await actionDeleteData(`${API_URL}/products/${id}`, accessToken);
            response = await response.json();

            if (response.status) {
                setProduct(prevProducts => prevProducts.filter(item => item.id !== id));
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
        setLoading(false)
    }

    const deleteProduct = (id) => {
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

    // Change Status
    const changeStatus = async (id,currentStatus) => {
        const toastId = toast.loading("Please wait...")

        let status = (currentStatus === 1) ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/products/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {
                setProduct(prevProducts => 
                    prevProducts.map(product => product.id === id ? { ...product, status } : product)
                );
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

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
        if(!hasPermission(configPermission.VIEW_PRODUCT)){
            navigate('/403')
        }
        fetchProduct()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <PageTitle
                title="All Products"
                buttonLink={hasPermission(configPermission.ADD_PRODUCT) ? '/products/add-product' : null}
                buttonLabel={hasPermission(configPermission.ADD_PRODUCT) ? 'Add New Product' : null}
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
                        {!isLoading && products.length === 0 &&
                            <NoState
                                message="No products found."
                            />
                        }

                        {products.length > 0 &&
                            <DataTable table={table} columns={columns} />
                        }
                    </div>

                    {products.length > 0 &&
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

export default AllProduct;