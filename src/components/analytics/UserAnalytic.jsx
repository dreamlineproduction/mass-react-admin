import React, { useContext, useEffect, useMemo, useState } from 'react';
import PageTitle from "../others/PageTitle";
import ApexChart from './ApexChart';
import { API_URL, getYear } from '../../config';
import AuthContext from '../../context/auth';
import { actionFetchData, actionFetchState, actionPostData } from '../../actions/actions';

const UserAnalytic = () => {
    const { Auth,hasPermissios } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const years = getYear();

    const [charData, setCharData] = useState({
        series: [{
            name:'Total Joined',
            data:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
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
                        position: 'top',
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
        year: ''
    });
        
    const [isLoading, setLoading] = useState(true);

    const [description,setDescription] = useState('')
    const [roles,setRole] = useState([]);
    const [sources,setSource] = useState([]);

    const [states,setState] = useState([]);
    const [districts,setDistrict] = useState([]);
    const [cities,setCity] = useState([]);
    const [areas,setArea] = useState([]);

    const [tableData,setTableData]  = useState([]);
    
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
           
    };

    // Fetch Roles data
    const fetchRole = async () => {    
        setLoading(true);

        const params = {
            page: 1,
            perPage: 1000,
        };
        
        let response = await actionFetchData(`${API_URL}/app-roles`,accessToken);
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
        
        let response = await actionFetchData(`${API_URL}/sources`,accessToken);
        response = await response.json();
        if (response.status) {
            setSource(response.data || []);
        }
        setLoading(false)
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

    // Filter data
    const filterData = async () => {    
        let postData = {
            ...formData
        }
        
        {/* Month Wise Carpenter Joining on 2024 */}

        let chatText = '';
        if(formData.role_id > 0 &&  formData.year > 0){
            const selectedRole = roles.find(item=> item.id === parseInt(formData.role_id))
            chatText = `Month Wise ${selectedRole.name} Joining on ${formData.year}`;       
        }       

        setLoading(true)
        let response = await actionPostData(`${API_URL}/users/chart-data`,accessToken,postData);
        response = await response.json();
        
        if(response.status === 200){
            setCharData({...charData,
                series: [{
                    name:response.message,
                    data:response.chartData
                }],                
            })
            setTableData(response.data)
            setDescription(chatText)

        }
        setLoading(false)
    }


    useEffect(() => {
        // if(!hasPermission(configPermission.VIEW_PRODUCT)){
        //     navigate('/403')
        // }
        fetchRole()
        fetchSource()
        fetchState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className='position-relative'>
            <PageTitle
                title="Users Analytics (Total User: 25585)"
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
                                        <option selected disabled>Select user type</option>
                                        {roles && roles.length > 0 &&
                                            roles.map(item => {
                                                return(<option key={item.id} value={item.id}>{item.name}</option>)
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
                                        <option selected>Select source</option>
                                        {sources && sources.length > 0 &&
                                            sources.map(item => {
                                                return(<option key={item.id} value={item.name}>{item.name}</option>)
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
                                        <option value={''} selected disabled>Select year</option>
                                        {years && years.length > 0 &&
                                            years.map((item,index) =>(<option key={index} value={item}> {item}</option>))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <button type="button" onClick={filterData} className="btn btn-primary large-btn w-100">Show Report</button>
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
                                    Location Heat Map
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
                                        <h4>Detailed User Report (West Bengal: 12000)</h4>
                                    </div>

                                    <div className='d-flex justify-content-between mb-3'>
                                    <div className="me-3">
                                            <select className="form-select">
                                                <option selected>Short by State</option>
                                                <option value="1">10-19</option>
                                                <option value="2">20-25</option>
                                                <option value="3">25-30</option>
                                                <option value="3">30-35</option>
                                                <option value="3">35-40</option>
                                                <option value="3">40-45</option>
                                                <option value="3">45-50</option>
                                                <option value="3">50-55</option>
                                                <option value="3">55-60</option>
                                                <option value="3">60-65</option>
                                                <option value="3">65-70</option>
                                                <option value="3">70-75</option>
                                                <option value="3">Above 75+</option>
                                            </select>
                                        </div>

                                        <div className="me-3">
                                            <select className="form-select">
                                                <option selected>Short by District</option>
                                                <option value="1">10-19</option>
                                                <option value="2">20-25</option>
                                                <option value="3">25-30</option>
                                                <option value="3">30-35</option>
                                                <option value="3">35-40</option>
                                                <option value="3">40-45</option>
                                                <option value="3">45-50</option>
                                                <option value="3">50-55</option>
                                                <option value="3">55-60</option>
                                                <option value="3">60-65</option>
                                                <option value="3">65-70</option>
                                                <option value="3">70-75</option>
                                                <option value="3">Above 75+</option>
                                            </select>
                                        </div>

                                        <div className="me-3">
                                            <select className="form-select">
                                                <option selected>Short by City</option>
                                                <option value="1">10-19</option>
                                                <option value="2">20-25</option>
                                                <option value="3">25-30</option>
                                                <option value="3">30-35</option>
                                                <option value="3">35-40</option>
                                                <option value="3">40-45</option>
                                                <option value="3">45-50</option>
                                                <option value="3">50-55</option>
                                                <option value="3">55-60</option>
                                                <option value="3">60-65</option>
                                                <option value="3">65-70</option>
                                                <option value="3">70-75</option>
                                                <option value="3">Above 75+</option>
                                            </select>
                                        </div>

                                        <div className="me-3">
                                            <select className="form-select">
                                                <option selected>Short by Area</option>
                                                <option value="1">10-19</option>
                                                <option value="2">20-25</option>
                                                <option value="3">25-30</option>
                                                <option value="3">30-35</option>
                                                <option value="3">35-40</option>
                                                <option value="3">40-45</option>
                                                <option value="3">45-50</option>
                                                <option value="3">50-55</option>
                                                <option value="3">55-60</option>
                                                <option value="3">60-65</option>
                                                <option value="3">65-70</option>
                                                <option value="3">70-75</option>
                                                <option value="3">Above 75+</option>
                                            </select>
                                        </div>

                                    <div className="me-3">
                                            
                                            <select className="form-select">
                                                <option selected>Short by age group</option>
                                                <option value="1">10-19</option>
                                                <option value="2">20-25</option>
                                                <option value="3">25-30</option>
                                                <option value="3">30-35</option>
                                                <option value="3">35-40</option>
                                                <option value="3">40-45</option>
                                                <option value="3">45-50</option>
                                                <option value="3">50-55</option>
                                                <option value="3">55-60</option>
                                                <option value="3">60-65</option>
                                                <option value="3">65-70</option>
                                                <option value="3">70-75</option>
                                                <option value="3">Above 75+</option>
                                            </select>
                                        </div>

                                        
                                    <div>
                                    <button
                                        onClick={2}
                                        className="btn btn-outline-primary"
                                    >
                                        Export as Excel
                                    </button>
                                </div>
                                       

                                    </div>

                                </div>

                                <div className="col-md-12">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">ID</th>
                                                <th scope="col">Image</th>
                                                <th scope="col">Full Name</th>
                                                <th scope="col">Age</th>
                                                <th scope="col">Gender</th>
                                                <th scope="col">User Type</th>
                                                <th scope="col">Phone</th>
                                                <th scope="col">State</th>
                                                <th scope="col">District</th>
                                                <th scope="col">City</th>
                                                <th scope="col">Area</th>
                                                <th scope="col">View More</th>
                                                <th scope="col">Status</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                                <td>25</td>
                                                <td>User Image</td>
                                                <td><a href='#'>Sudip Dutta</a></td>
                                                <td>35</td>
                                                <td>Male</td>
                                                <td>Carpenter</td>
                                                <td>+919836952666</td>
                                                <td>West Bengal</td>
                                                <td>North 24 Parganas</td>
                                                <td>Barrackpore I</td>
                                                <td>Feeder Road</td>
                                                <td><button data-bs-toggle="modal" data-bs-target="#viewMoreUserInfoModal" className="btn btn-primary">View More</button></td>
                                                <td><span className="badge bg-success">Active</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">More Options</button>
                                                        <ul class="dropdown-menu">
                                                            <li>
                                                                <a className="dropdown-item" href="/users/edit-user/26">Edit</a>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item">Inactive</button>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item">Delete</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>25</td>
                                                <td>User Image</td>
                                                <td><a href='#'>Sudip Dutta</a></td>
                                                <td>35</td>
                                                <td>Male</td>
                                                <td>Carpenter</td>
                                                <td>+919836952666</td>
                                                <td>West Bengal</td>
                                                <td>North 24 Parganas</td>
                                                <td>Barrackpore I</td>
                                                <td>Feeder Road</td>
                                                <td><button data-bs-toggle="modal" data-bs-target="#viewMoreUserInfoModal" className="btn btn-primary">View More</button></td>
                                                <td><span className="badge bg-success">Active</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">More Options</button>
                                                        <ul class="dropdown-menu">
                                                            <li>
                                                                <a className="dropdown-item" href="/users/edit-user/26">Edit</a>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item">Inactive</button>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item">Delete</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>25</td>
                                                <td>User Image</td>
                                                <td><a href='#'>Sudip Dutta</a></td>
                                                <td>35</td>
                                                <td>Male</td>
                                                <td>Carpenter</td>
                                                <td>+919836952666</td>
                                                <td>West Bengal</td>
                                                <td>North 24 Parganas</td>
                                                <td>Barrackpore I</td>
                                                <td>Feeder Road</td>
                                                <td><button data-bs-toggle="modal" data-bs-target="#viewMoreUserInfoModal" className="btn btn-primary">View More</button></td>
                                                <td><span className="badge bg-success">Active</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <button className="btn btn-secondary dropdown-toggle " type="button" data-bs-toggle="dropdown" aria-expanded="false">More Options</button>
                                                        <ul class="dropdown-menu">
                                                            <li>
                                                                <a className="dropdown-item" href="/users/edit-user/26">Edit</a>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item">Inactive</button>
                                                            </li>
                                                            <li>
                                                                <button type="button" className="dropdown-item">Delete</button>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </td>
                                            </tr>


                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserAnalytic;