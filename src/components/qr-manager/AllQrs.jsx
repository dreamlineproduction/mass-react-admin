import { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../../context/auth";
import { API_URL } from "../../config";
import { actionFetchData } from "../../actions/actions";
import PageTitle from "../others/PageTitle";
import Loading from "../others/Loading";
import { DownloadCloud, Search } from "react-feather";
import NoState from "../others/NoState";
import { Link } from "react-router-dom";
import { useReactTable,getCoreRowModel  } from "@tanstack/react-table";
import PaginationDataTable from "../others/PaginationDataTable";
import DataTable from "../others/DataTable";

const AllQrs = () => {
    const columns = useMemo(() => [
        { header: 'ID', accessorKey: 'id' },
        { header: 'Product Name', accessorKey: 'name' },       
        { header: 'Package Size', accessorKey: 'package' },       
        { header: 'XP Required', accessorKey: 'xp_value' },
        { header: 'Batch Number', accessorKey: 'batch_number' },
        { header: 'Total Qr', accessorKey: 'qr_code_content_count',enableSorting: false  },
        { header: 'Created At', accessorKey: 'created_at',enableSorting: false },
        { header: 'Actions', 
            accessorKey: 'actions',
            cell: ({ row }) => {
                return (
                    <div>
                        <Link 
                            to={`https://massbackoffice.in/public/show-pdf?batchNumber=${row.original.batch_number}&productId=${row.original.product_id}`}  
                            target="_blank"
                            className="btn py-2 px-2 btn-outline-primary me-2"
                        >
                            <DownloadCloud width={16} height={16}/>
                        </Link>

                        <Link 
                            to={`/qr-manager/qr-details/${row.original.product_id}/${row.original.batch_number}`}
                            target="_blank"
                                className="btn py-2 px-2 btn-outline-primary me-2"
                            >
                                <Search width={16} height={16} />
                        </Link>
                    </div>
                )
            }
        },
    ], []);
    const { Auth } = useContext(AuthContext)
    
    const accessToken = Auth('accessToken');

    const [qrCodes, setQrCode] = useState([]);

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Fetch data
    const fetchData = async () => {
        setLoading(true); // Loading on
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

        let response = await actionFetchData( `${API_URL}/qr-codes?${new URLSearchParams(params)}`, accessToken);
        response = await response.json();
        if (response.status) {
            setQrCode(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false);
    }
    
    const table = useReactTable({
        data: qrCodes,
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

    //console.log(qrCodes);
    useEffect(() => {
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <PageTitle
                title="All QR Codes"
                buttonLink="/qr-manager/generate-qr"
                buttonLabel="Add New QR"
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
                        {!isLoading && qrCodes.length === 0 &&
                            <NoState
                                message="No qr found."
                            />
                        }

                        {qrCodes.length > 0 &&                            
                            <DataTable
                                table={table}
                                columns={columns}
                            /> 
                        }
                    </div>

                    {qrCodes.length > 0 &&
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

export default AllQrs;