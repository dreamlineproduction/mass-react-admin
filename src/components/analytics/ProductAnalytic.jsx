import React from 'react';
import PageTitle from "../others/PageTitle";
import ReactApexChart from 'react-apexcharts';

const ProductAnalytic = () => {
    const currentYear = new Date().getFullYear();
    const ApexChart = () => {
        const [state, setState] = React.useState({
            series: [{
                name: 'Total Scanned',
                data: [22, 0, 40, 101, 40, 36, 32, 23, 14, 80, 55, 28]
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
                            position: 'top', // top, center, bottom
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
                },
            },
        });

        return (
            <div>
                <div id="chart">
                    <ReactApexChart options={state.options} series={state.series} type="bar" height={450} />
                </div>
                <div id="html-dist">
                   <h5 className='text-center'>Month Wise Scanning of Mass Polymar 2L- 2025</h5>
                </div>
            </div>
        );
    };

    return (
        <div>
            <PageTitle
                title="Product Analytics"
                buttonLink="/products/all-products"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <select className="form-select custom-input" aria-label="Default select example">
                                        <option selected>Select product</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select className="form-select custom-input" aria-label="Default select example">
                                        <option selected>Select product size</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select className="form-select custom-input" aria-label="Default select example">
                                        <option selected>Select year</option>
                                        {Array.from({ length: currentYear - 2024 }, (_, i) => 2025 ).map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <button type="button" className="btn btn-primary large-btn w-100">Show Report</button>
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
                                    <ApexChart />
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
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4>Mass Polymar 2L- 2024</h4>
                                    </div>
                                    <div>
                                        <div className="d-flex justify-content-between">
                                        <div className="mb-3 me-3">
                                                <label for="exampleFormControlInput1" class="form-label">Short by state</label>
                                                <select className="form-select" aria-label="Default select example">
                                                    <option selected>Open this select menu</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className="mb-3 me-3">
                                                <label for="exampleFormControlInput1" class="form-label">Short by district</label>
                                                <select className="form-select" aria-label="Default select example">
                                                    <option selected>Open this select menu</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label for="exampleFormControlInput1" class="form-label">Short by city</label>
                                                <select className="form-select" aria-label="Default select example">
                                                    <option selected>Open this select menu</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                         
                                          
                                        </div>
                                    </div>
                                </div>

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
                                            <tr>
                                                <td>West Bengal</td>
                                                <td>North 24 Parganas</td>
                                                <td>Barrackpore 1</td>
                                                <td>Feeder Road</td>
                                                <td>200</td>
                                            </tr>
                                            <tr>
                                                <td>West Bengal</td>
                                                <td>North 24 Parganas</td>
                                                <td>Barrackpore 1</td>
                                                <td>Feeder Road</td>
                                                <td>200</td>
                                            </tr>
                                            <tr>
                                                <td>West Bengal</td>
                                                <td>North 24 Parganas</td>
                                                <td>Barrackpore 1</td>
                                                <td>Feeder Road</td>
                                                <td>200</td>
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

export default ProductAnalytic;