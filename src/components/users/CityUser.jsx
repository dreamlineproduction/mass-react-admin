import { Link, useLocation, useParams } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useContext, useEffect, useMemo, useState } from "react";
import AuthContext from "../../context/auth";
import { actionFetchData } from "../../actions/actions";
import { API_URL, exportToExcel, getValueOrDefault } from "../../config";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Pagination from "../others/Pagination";
import { BsCloudDownload } from "react-icons/bs";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "../others/DataTable";
import PaginationDataTable from "../others/PaginationDataTable";

const CityUser = () => {
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const state = queryParams.get('state');
    const district = queryParams.get('district');
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');

     const columns = useMemo(() => [
        { accessorKey: "id", header: "#" },
        { 
            accessorKey: "name", 
            header: "Name",
            cell:({row}) => {

                return <Link to={`/users/transaction/${row.original.id}`}>{row.original.name}</Link>
            }

         },
        { accessorKey: "area_name", header: "Area Name" },
        { accessorKey: "city", header: "City" },
        { accessorKey: "state_str", header: "State" },
        { accessorKey: "phone", header: "Contact Number", enableSorting: false },
        { accessorKey: "created_at", header: "Install Date", enableSorting: false },
        { accessorKey: "last_login", header: "Last Active", enableSorting: false },
        { 
            accessorKey: "total_xp", 
            header: "Total XP Balance", 
            enableSorting: false,
            cell:({row}) => {
                return getValueOrDefault(row.original.total_xp , '0')+'XP' 
            } 
        },
        { 
            accessorKey: "redeem_xp", 
            header: "Total Reward Redeems", 
            enableSorting: false,
            cell:({row}) => {
                return getValueOrDefault(row.original.redeem_xp , '0')+'XP' 
            } 
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
    ],[]);
    const [users, setUsers] = useState([])

    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);

    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    // Fetch data
    const fetchUsers = async () => {

        setLoading(true);
        const params = {
            page: pageIndex + 1,
            perPage: pageSize,
            state,
            district
        };
        if (sorting.length > 0) {
            params.sort = sorting[0].id;
            params.order = sorting[0].desc ? "desc" : "asc";
        }
        if (globalFilter !== "") {
            params.search = globalFilter.trim();
        }

        let response = await actionFetchData(`${API_URL}/users/district?${new URLSearchParams(params)}`, accessToken);
        response = await response.json();
        if (response.status) {
            setUsers(response.data.data);
            setPageCount(response.totalPage);
            setLoading(false)

        }
    }

    const exportUserToExcel = () => {
        let data = users.map(item => {
            return {
                "#": item.id,
                "Name": item.name,
                "Area Name": item.area_name,
                "Contact Number": item.phone,
                "Install Date": item.created_at,
                "Last Active": item.last_login,
                "Total XP Balance": item.total_xp ? item.total_xp : 0 + ' xp',
                "Total Reward Redeems": item.redeem_xp ? item.redeem_xp : 0 + ' xp'
            }
        })

        exportToExcel(data);
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
        fetchUsers()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex, pageSize, sorting, globalFilter]);

    return (
        <div>
            <PageTitle
                title={`Showing all users from ${district}`}
            />

            <div className="row">
                <div className="col-12">
                    <div className="card">                        
                        <div className="my-4 d-flex justify-content-end">
                            <div className="search-input-outer me-4">
                                <input
                                    placeholder="Search..."     
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    className="form-control"
                                    type="text"
                                />
                            </div> 
                            <div>
                                <button className="btn btn-outline-primary me-4" onClick={exportUserToExcel}>
                                    <BsCloudDownload /> Export to Excel
                                </button>
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
                            <DataTable table={table} columns={columns} />
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

export default CityUser;