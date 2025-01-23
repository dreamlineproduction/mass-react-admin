import React, { useContext, useEffect, useMemo, useState } from 'react';
import PageTitle from "../others/PageTitle";
import ApexChart from './ApexChart';
import { API_URL, configPermission, getInitYears } from '../../config';
import AuthContext from '../../context/auth';
import { actionFetchData, actionFetchState, actionPostData } from '../../actions/actions';
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from '../others/DataTable';
import NoState from '../others/NoState';
import { Link } from 'react-router-dom';
import Status from '../others/Status';
import PaginationDataTable from '../others/PaginationDataTable';
import UserInfomationModal from '../users/UserInfomationModal';
import { BiCloudDownload } from 'react-icons/bi';
import Loading from '../others/Loading';
import { getYear } from 'date-fns';
import { use } from 'react';
import IndiaMap from '../dashboard/IndiaMap';

const UserAnalytic = () => {
    const { Auth, hasPermission } = useContext(AuthContext)

    const accessToken = Auth('accessToken');
    const years = getInitYears();

    const columns = useMemo(
        () => [
            { accessorKey: "id", header: "Id" },
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
                accessorKey: "name",
                header: "Full Name",
                enableSorting: false,
                cell: ({ row }) => {
                    return (<Link to={`/users/edit-user/${row.original.id}?hideForm=true`}>
                        {row.original.name}
                    </Link>)
                }
            },
            {
                accessorKey: "age",
                header: "Age",
                enableSorting: false,
                cell: ({ row }) => (row.original.age ? row.original.age : "N/A"),
            },
            {
                accessorKey: "gender",
                header: "Gender",
                enableSorting: false,
                cell: ({ row }) => (row.original.gender ? row.original.gender : "N/A"),
            },
            {
                accessorKey: "role",
                header: "User Type",
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <span className="badge bg-primary">{row.original.role.name}</span>
                    );
                },
            },
            { accessorKey: "phone", header: "Phone", enableSorting: false },
            {
                accessorKey: "city",
                header: "City",
                enableSorting: false,
                cell: ({ row }) => (row.original.city ? row.original.city : "N/A"),
            },
            {
                accessorKey: "state_str",
                header: "State",
                enableSorting: false,
                cell: ({ row }) =>
                    row.original.state_str ? row.original.state_str : "N/A",
            },
            {
                accessorKey: "more",
                header: "View More",
                enableSorting: false,
                cell: ({ row }) => {
                    return (
                        <button
                            data-bs-toggle="modal"
                            data-bs-target="#viewMoreUserInfoModal"
                            className="btn btn-primary"
                            onClick={() => {
                                setSingleUser(row.original)
                            }}>
                            View More
                        </button>)
                }
            },
            {
                accessorKey: "status",
                header: "Status",
                enableSorting: false,
                cell: ({ getValue }) => {
                    return <Status status={getValue()} />;
                },
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const [charData, setCharData] = useState({
        series: [{
            name: 'Total Joined',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }],
        options: {
            chart: {
                height: 350,
                type: 'bar',
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    dataLabels: {
                        position: 'bottom',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val;
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },
            xaxis: {
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                position: 'top',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                crosshairs: {
                    fill: {
                        type: 'gradient',
                        gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                }
            },
            yaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false,
                },
                labels: {
                    show: false,
                    formatter: function (val) {
                        return val;
                    }
                }
            }
        },
    });

    const hasValueGreaterThanZero = charData.series[0].data.some(value => value > 0);

    const [formData, setFormData] = useState({
        role_id: '',
        source: '',
        year: getYear(new Date())
    });

    const [isLoading, setLoading] = useState(true);
    const [isTableLoading, setTableLoading] = useState(true);

    const [description, setDescription] = useState('')
    const [roles, setRole] = useState([]);
    const [sources, setSource] = useState([]);

    const [states, setState] = useState([]);
    const [districts, setDistrict] = useState([]);
    const [cities, setCity] = useState([]);
    const [areas, setArea] = useState([]);

    const [totalUserCount,setTotalUserCount] = useState(0);
    const [filterUserCount,setFilterUserCount] = useState(0);

    // Data table users
    const [singleUser, setSingleUser] = useState({});
    const [pageCount, setPageCount] = useState(0);
    const [sorting, setSorting] = useState([]);
    const [pageIndex, setPageIndex] = useState(0);
    const [pageSize, setPageSize] = useState(20);
    const [tableData, setTableData] = useState([]);

    const [mapData, setMapData] = useState(null);
    

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if(name === 'role_id'){
            setFormData((prevState) => ({
                ...prevState,
                source:""
            }));
        }

        if(name === 'state_name'){  
            setFormData((prevState) => ({
                ...prevState,
                district_name: "",
                city_name: "",
                area_name: "",
            }));
    
            setDistrict([])   
            setCity([])     
            setArea([])                           
            fetchDistrict(value)
        }

        if(name === 'district_name'){  
            setFormData((prevState) => ({
                ...prevState,
                city_name: "",
                area_name: "",
            }));  
            setCity([])          
            setArea([])  
            fetchCity(formData.state_name,value)     
        }  

        if(name === 'city_name'){      
            setFormData((prevState) => ({
                ...prevState,
                area_name: "",
            }));
            setArea([])   
            fetchArea(formData.state_name,formData.district_name,value)  
        }          
    };

    // Fetch Roles data
    const fetchRole = async () => {
        setLoading(true);

        const params = {
            page: 1,
            perPage: 1000,
        };

        let response = await actionFetchData(`${API_URL}/app-roles`, accessToken);
        response = await response.json();
        if (response.status) {
            setRole(response.data.data || []);
        }
        setLoading(false)
    }

    // Fetch Roles data
    const fetchSource = async () => {
        setLoading(true);

        const params = {
            page: 1,
            perPage: 1000,
        };

        let response = await actionFetchData(`${API_URL}/sources`, accessToken);
        response = await response.json();
        if (response.status) {
            setSource(response.data || []);
        }
        setLoading(false)
    }

    const fetchAppUserCount = async () => {    
        const response = await actionFetchData(`${API_URL}/app-users-count`,accessToken)
        let data = await response.json();
        if (data.status === 200) {
            setTotalUserCount(data.total);
        }
    }

    const fetchState = async () => {
        setLoading(true)
        const response = await actionFetchState()
        let data = await response.json();
        if (data.status === 200) {
            setState(data.data)
        }
        setLoading(false)
    }

    const fetchDistrict = async (stateName = '') => {
        if (stateName.length === 0) {
            return;
        }

        setLoading(true)
        const response = await actionFetchData(`${API_URL}/district/${stateName}`)
        let data = await response.json();
        if (data.status === 200) {
            setDistrict(data.data)
        }
        setLoading(false)
    }

    const fetchCity = async (stateName = '', district = '') => {
        if (stateName.length === 0 || district.length === 0) {
            return
        }

        setLoading(true)
        const response = await actionFetchData(`${API_URL}/cities/${stateName}/${district}`)
        let data = await response.json();
        if (data.status === 200) {
            setCity(data.data)
        }
        setLoading(false)
    }

    const fetchArea = async (stateName = '', district = '', cityName = '') => {
        if (stateName.length === 0 || district.length === 0 || cityName.length === 0) {
            return
        }

        setLoading(true)
        const response = await actionFetchData(`${API_URL}/areas/${stateName}/${district}/${cityName}`)
        let data = await response.json();
        if (data.status === 200) {
            setArea(data.data)
        }
        setLoading(false)
    }

    // Filter data
    const filterData = async () => {
        let postData = {
            ...formData
        }

        {/* Month Wise Carpenter Joining on 2024 */ }

        let chatText = '';
        if (formData.role_id > 0 && formData.year > 0) {
            const selectedRole = roles.find(item => item.id === parseInt(formData.role_id))
            chatText = `Month Wise ${selectedRole.name} Joining on ${formData.year}`;
        }

        setLoading(true)
        let response = await actionPostData(`${API_URL}/users/chart-data`, accessToken, postData);
        response = await response.json();

        if (response.status === 200) {
            setCharData({
                ...charData,
                series: [{
                    name: response.message,
                    data: response.chartData
                }],
            })
            setDescription(chatText)

        }
        setLoading(false)
    }

    // filter table data
    const filterTableData = async () => {        
        const params = {
            ...formData,
            page: pageIndex + 1,
            perPage: pageSize,
        };

        setTableLoading(true)
        let tableResponse = await actionPostData(`${API_URL}/users/table-data`, accessToken, params);
        tableResponse = await tableResponse.json();

        if (tableResponse.status === 200) {
            setTableData(tableResponse.data.data || []);
            setPageCount(tableResponse.totalPage);
            setFilterUserCount(tableResponse.data.total);

        }
        setTableLoading(false)
    }

    const filterMapData = async () => {     

        let response = await actionPostData(`${API_URL}/users/map-data`, accessToken, formData)
        response = await response.json();
        if (response.status === 200) {
            setMapData(response.data || null);
        }

    }

    const table = useReactTable({
        data: tableData,
        columns,
        pageCount,
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

    const exportUserToExcel = () => {
        let data = users.map((item) => {
            return {
                "#": getValueOrDefault(item.id),
                Name: getValueOrDefault(item.name),
                Age: getValueOrDefault(item.age),
                Gender: getValueOrDefault(item.gender),
                Role: getValueOrDefault(item.role.name),
                Phone: getValueOrDefault(item.phone),
                City: getValueOrDefault(item.city),
                State: getValueOrDefault(item.state_str),
                Area: getValueOrDefault(item.area),
                "Joined Date": getValueOrDefault(item.created_at),
                Source: getValueOrDefault(item.source),
                "Referral Code": getValueOrDefault(item.referral_code),
                "Employee Code": getValueOrDefault(item.employee_code),
                "Scaned Product Count": getValueOrDefault(item.scan_product_count),
                "Total Xp": getValueOrDefault(item.total_xp, 0),
                "Current XP Balance": getValueOrDefault(item.balance_xp, 0),
                "Total Redeemed": getValueOrDefault(item.order_count, 0),
                Status: item.status === 1 ? "Active" : "Inactive",
            };
        });

        const fileName = 'all-users';
        exportToExcel(data,fileName);
    };

    useEffect(() => { 
        // if(!hasPermission(configPermission.VIEW_PRODUCT)){
        //     navigate('/403')
        // }      
        fetchRole()
        fetchSource()
        fetchState();
        fetchAppUserCount()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (formData.role_id > 0 && formData.year > 0) {
            filterData()
            filterMapData()
        }
    }, [formData.role_id, formData.year, formData.source]);

    useEffect(() => {
        if (formData.role_id > 0 && formData.year > 0) {
            filterTableData();
        }
    }, [pageIndex, pageSize, sorting,formData]);


    return (
        <div className='position-relative'>
            <PageTitle
                title={`Users Analytics (Total User: ${totalUserCount})`}
                buttonLink="/users/all-users"
                buttonLabel="View all users"
            />
            <div className="row">
                {isLoading && <div className="cover-body"></div>}
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <select
                                        defaultValue={formData.role_id}
                                        name='role_id'
                                        id='role_id'
                                        onChange={handleChange}
                                        className="form-select custom-input">
                                        <option value="" disabled>Select user type</option>
                                        {roles && roles.length > 0 &&
                                            roles.map(item => {
                                                return (<option key={item.id} value={item.id}>{item.name}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select
                                        defaultValue={formData.source}
                                        name='source'
                                        id='source'
                                        onChange={handleChange}
                                        className="form-select custom-input">
                                        <option value="" >Select source</option>
                                        {sources && sources.length > 0 &&
                                            sources.map(item => {
                                                return (<option key={item.id} value={item.name}>{item.name}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select
                                        defaultValue={formData.year}
                                        name="year"
                                        id="year"
                                        onChange={handleChange}
                                        className="form-select custom-input">
                                        <option value="" disabled>Select year</option>
                                        {years && years.length > 0 &&
                                            years.map((item, index) => (<option key={index} value={item}> {item}</option>))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    {(formData.role_id > 0 && formData.year > 0) ?
                                        <button type="button" onClick={filterData} className="btn btn-primary large-btn w-100">Show Report</button>
                                        :
                                        <button type="button" disabled className="btn btn-primary large-btn w-100 disabled">Show Report</button>
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {hasValueGreaterThanZero &&
                    <>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {/* Month Wise Carpenter Joining on 2024 */}
                                            <ApexChart
                                                charData={charData}
                                                description={description}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-12">
                                            {mapData &&
                                                <IndiaMap
                                                    stateInfo={mapData}
                                                    accessToken={accessToken}
                                                    type="user"
                                                    formData={formData}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    }


                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-body">
                                <div className='d-flex justify-content-end gap-3'>

                                </div>
                                <div className="row">
                                    <div className="d-flex justify-content-between">
                                       
                                        <div>
                                            {formData.state_name ? 
                                                <h4>Detailed User Report ({formData.state_name}: {filterUserCount})</h4>
                                                :
                                                <h4>Detailed User Report ({filterUserCount})</h4>   
                                            }
                                        </div>

                                        <div className='d-flex justify-content-between mb-3'>
                                            <div className="mb-3 me-3">
                                                <label className="form-label">Short by state</label>
                                                <select
                                                    defaultValue={''}
                                                    name='state_name'
                                                    id='state_name'
                                                    className="form-select"
                                                    onChange={handleChange}>
                                                    <option  value="">Select State</option>
                                                    {states.map(item => {
                                                        return (
                                                            <option key={item.id} value={item.name}>{item.name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>

                                            <div className="mb-3 me-3">
                                                <label className="form-label">Short by district</label>
                                                <select
                                                    defaultValue={''}
                                                    name='district_name'
                                                    id='district_name'
                                                    className="form-select"
                                                    onChange={handleChange}>
                                                    <option value="">Select District</option>
                                                    {districts.map(item => {
                                                        return (
                                                            <option key={item.id} value={item.name}>{item.name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                            <div className="mb-3 me-3">
                                                <label className="form-label">Short by City</label>
                                                <select
                                                    defaultValue={''}
                                                    name='city_name'
                                                    id='city_name'
                                                    className="form-select"
                                                    onChange={handleChange}>
                                                    <option value="">Select City</option>
                                                    {cities.map(item => {
                                                        return (
                                                            <option key={item.id} value={item.name}>{item.name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                            <div className="mb-3 me-3">
                                                <label className="form-label">Short by Area</label>
                                                <select
                                                    defaultValue={''}
                                                    name='area_name'
                                                    id='area_name'
                                                    className="form-select"
                                                    onChange={handleChange}>
                                                    <option value="">Select Area</option>
                                                    {areas.map(item => {
                                                        return (
                                                            <option key={item.id} value={item.name}>{item.name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </div>

                                            <div className="mb-3 me-3">
                                                <label className="form-label">Short by age group</label>
                                                <select 
                                                    name='age'
                                                    id='age'
                                                    onChange={handleChange}
                                                    defaultValue="" 
                                                    className="form-select">
                                                    <option value="">Short by age group</option>
                                                    <option value="10-19">10-19</option>
                                                    <option value="20-25">20-25</option>
                                                    <option value="25-30">25-30</option>
                                                    <option value="30-35">30-35</option>
                                                    <option value="35-40">35-40</option>
                                                    <option value="40-45">40-45</option>
                                                    <option value="45-50">45-50</option>
                                                    <option value="50-55">50-55</option>
                                                    <option value="55-60">55-60</option>
                                                    <option value="60-65">60-65</option>
                                                    <option value="65-70">65-70</option>
                                                    <option value="70-75">70-75</option>
                                                    <option value="75-500">Above 75+</option>
                                                </select>
                                            </div>


                                            <div style={{marginTop:"28px"}}>
                                                <button
                                                    onClick={exportUserToExcel}
                                                    className="btn btn-outline-primary"
                                                >
                                                    <BiCloudDownload /> Export as Excel
                                                </button>
                                            </div>


                                        </div>

                                    </div>

                                    <div className="col-md-12">
                                        {isLoading && <Loading />}

                                        {!isLoading && tableData.length === 0 && (
                                            <NoState message="No users found." />
                                        )}
                                        {tableData.length > 0 && (
                                            <div className="table-responsive p-3">
                                                <DataTable table={table} columns={columns} />
                                            </div>
                                        )}

                                        {tableData.length > 0 && (
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
                        </div>
                    </div>

                    <UserInfomationModal
                        singleUser={singleUser}
                    />
                  
            </div>
        </div>
    );
};

export default UserAnalytic;