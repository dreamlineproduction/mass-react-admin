import React,{useContext, useEffect, useState} from 'react';
import PageTitle from "../others/PageTitle";
import ApexChart from './ApexChart';
import { API_URL } from '../../config';
import { actionFetchData, actionFetchState, actionPostData } from '../../actions/actions';
import AuthContext from '../../context/auth';
import { getYear } from '../../config';
import NoState from '../others/NoState';

const ProductAnalytic = () => {
    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const years = getYear();

    const [charData, setCharData] = useState({
        series: [{
            name:'Total Scanned',
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

    const [isLoading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        product_id: '',
        size_id: '',
        year: ''
    });

    const [states,setState] = useState([]);
    const [districts,setDistrict] = useState([]);
    const [cities,setCity] = useState([]);
    const [areas,setArea] = useState([]);

    const [description,setDescription] = useState('')
    const [products, setProduct] = useState([])
    const [sizes,setSize]  = useState([]);

    const [tableData,setTableData]  = useState([]);
    
    const handleProduct = async (e) => {
        const productId = e.target.value;

        if(productId > 0){           
            setLoading(true);
            let response = await actionFetchData(`${API_URL}/products/${productId}`, accessToken);
            response = await response.json();
            if (response.status) {
                setSize(response.data.product_size);
                setFormData((prevState) => ({
                    ...prevState,
                    product_id:productId,
                }));
            }
            setLoading(false);
        }
        return
    }
    
    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if(name === 'state_name'){                  
            fetchDistrict(value)
            filterData(value)
        }

        if(name === 'district_name'){            
            fetchCity(formData.state_name,value)     
            filterData(formData.state_name,value)       
        }  

        if(name === 'city_name'){       
            fetchArea(formData.state_name,formData.district_name,value)  
            filterData(formData.state_name,formData.district_name,value)  
        }  

        if(name === 'area_name')
        {
            filterData(formData.state_name,formData.district_name,formData.city_name,value)  
        }
      
       
    };


    // Fetch data
    const fetchProduct = async () => {    
        setLoading(true);

        const params = {
            page: 1,
            perPage: 1000,
        };
        
        let response = await actionFetchData(`${API_URL}/products?${new URLSearchParams(params)}`,accessToken);
        response = await response.json();
        if (response.status) {
            setProduct(response.data.data || []);
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

    const fetchDistrict = async (stateName = '') => {
        if(stateName.length === 0) {
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
        if(stateName.length === 0 || district.length === 0){
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

    const fetchArea = async (stateName = '', district = '',cityName = '') => {
        if(stateName.length === 0 || district.length === 0 || cityName.length === 0){
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
    const filterData = async (stateName = '', district = '', cityName = '',areaName = '') => {    
        let postData = {
            ...formData
        }
        if(stateName.length > 0){           
            postData.state_name = stateName
        }
        if(district.length > 0){          
            postData.district_name = district
        }
        if(cityName.length > 0){           
            postData.city_name = cityName
        }
        if(areaName.length > 0){           
            postData.area_name = areaName
        }


        let chatText = '';
        if(formData.product_id > 0 && formData.size_id > 0 && formData.year > 0){
            const selectedProduct = products.find(item=> item.id === parseInt(formData.product_id))
            const selectedSize = sizes.find(item=> item.id === parseInt(formData.size_id))
            chatText = `${selectedProduct.name} ${selectedSize.size_custom+selectedSize.size_in} - ${formData.year}`;       
        }       

        setLoading(true)
        let response = await actionPostData(`${API_URL}/products/chart-data`,accessToken,postData);
        response = await response.json();
        
        if(response.status === 200){
            setCharData({...charData,
                series: [{
                    name:response.message,
                    data:response.chartData
                }],                
            })
            setDescription(chatText)

        }
        setLoading(false)        
    }

    const filterTableData = async (stateName = '', district = '', cityName = '',areaName = '') => {
        let postData = {
            ...formData
        }

        setLoading(true)
        let response = await actionPostData(`${API_URL}/products/table-data`,accessToken,postData);
        response = await response.json();
        
        if(response.status === 200){
           setTableData(response.data.data || []);

        }
        setLoading(false)    
    } 

    useEffect(() => {
        // if(!hasPermission(configPermission.VIEW_PRODUCT)){
        //     navigate('/403')
        // }
        fetchProduct()
        fetchState();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className='position-relative'>

            <PageTitle
                title="Product Analytics"
                buttonLink="/products/all-products"
                buttonLabel="Back to List"
            />

            <div className="row">
                {isLoading && <div className="cover-body"></div>}

                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <select 
                                        defaultValue={formData.product_id}
                                        onChange={handleProduct}
                                        name="product_id"
                                        id="product_id"
                                        className="form-select custom-input" >
                                        <option value={''} disabled>Select product</option>
                                        {products && products.length > 0 &&
                                            products.map(item => {
                                                return(<option key={item.id} value={item.id}>{item.name}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select 
                                        defaultValue={formData.size_id}
                                        onChange={handleChange}
                                        name="size_id"
                                        id="size_id"
                                        className="form-select custom-input" >
                                        <option value={''} selected>Select product size</option>
                                        {sizes && sizes.length > 0 &&
                                            sizes.map(item =>(<option key={item.id} value={item.id}> {item.size_custom} {item.size_in}</option>))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select 
                                        defaultValue={formData.year}
                                        onChange={handleChange}
                                        name="year"
                                        id="year"
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
                                    <ApexChart 
                                       charData={charData}
                                       description={`Month Wise Scanning of ${description}`}
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
                            <div className="row">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4>{description}</h4>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between">
                                            <div className="mb-3 me-3">
                                                <label className="form-label">Short by state</label>
                                                <select 
                                                    defaultValue={''}
                                                    name='state_name' 
                                                    id='state_name' 
                                                    className="form-select" 
                                                    onChange={handleChange}>
                                                    <option selected disabled>Select State</option>
                                                    {states.map(item => {
                                                        return(
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
                                                    <option selected disabled>Select District</option>
                                                    {districts.map(item => {
                                                        return(
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
                                                    <option selected disabled>Select City</option>                                                    
                                                    {cities.map(item => {
                                                        return(
                                                            <option key={item.id} value={item.name}>{item.name}</option>
                                                        )
                                                    })}                                                   
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Short by Area</label>
                                                <select  
                                                    defaultValue={''}
                                                    name='area_name' 
                                                    id='area_name' 
                                                    className="form-select" 
                                                    onChange={handleChange}>
                                                    <option selected disabled>Select Area</option>                                                    
                                                    {areas.map(item => {
                                                        return(
                                                            <option key={item.id} value={item.name}>{item.name}</option>
                                                        )
                                                    })}                                                   
                                                </select>
                                            </div>                                                                                   
                                        </div>
                                    </div>
                                </div>
                                {tableData && tableData.length > 0 ?
                                <div className="col-md-12">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">State</th>
                                                <th scope="col">District</th>
                                                <th scope="col">City</th>
                                                <th scope="col">Area</th>
                                                <th scope="col">Total Scanned</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {tableData.map(item => {
                                                return(
                                                    <tr key={item.id}>
                                                        <td>{item.state_str}</td>
                                                        <td>{item.district}</td>
                                                        <td>{item.city}</td>
                                                        <td>{item.area_name}</td>
                                                        <td>{item.total}</td>
                                                    </tr>
                                                )
                                            })}                                                                                        
                                        </tbody>
                                    </table>
                                </div>
                                :
                                <NoState />
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductAnalytic;