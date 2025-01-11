import React from 'react';
import PageTitle from "../others/PageTitle";
import ApexChart from './ApexChart';

const UserAnalytic = () => {
  

    return (
        <div>
            <PageTitle
                title="Users Analytics (Total User: 25585)"
                buttonLink="/users/all-users"
                buttonLabel="View all users"
            />
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <select className="form-select custom-input" aria-label="Default select example">
                                        <option selected>Select user type</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select className="form-select custom-input" aria-label="Default select example">
                                        <option selected>Select source</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>
                                <div className="col-md-3">
                                    <select className="form-select custom-input" aria-label="Default select example">
                                        <option selected>Select joining year</option>
                                        {Array.from({ length: 26 }, (_, i) => 2000 + i).map(year => (
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
                                    <ApexChart 
                                        name={'Total Joined'}
                                        data={[22, 31, 40, 101, 40, 36, 32, 23, 14, 80, 55, 28]}
                                        description={'Month Wise Carpenter Joining on 2024'}
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
                                            <select className="form-select" aria-label="Default select example">
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
                                            <select className="form-select" aria-label="Default select example">
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
                                            <select className="form-select" aria-label="Default select example">
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
                                            <select className="form-select" aria-label="Default select example">
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
                                            
                                            <select className="form-select" aria-label="Default select example">
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