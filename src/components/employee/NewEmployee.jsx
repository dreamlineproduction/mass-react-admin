import { useState } from "react";
import PageTitle from "../others/PageTitle";

const NewEmployee = () => {
    const [manageUi, setManageUi] = useState({
        hideEmployeeCode: true,
    });


  return (
    <div>
      <PageTitle
        title="Add New Employee"
        buttonLink="/employees/all-employee"
        buttonLabel="Back to List"
      />
      <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                   
                                    className={`form-control custom-input`}
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Enter name*"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input
                                   
                                    className={`form-control custom-input`}
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="Enter email*"
                                />
                            </div>
                            <div className="mb-3">  
                                <label className="form-label">Phone Number</label>
                                <div className="input-group">
                                    <button className="btn btn-primary" type="button">+91</button>
                                    <input                                            
                                        className={`form-control remove-arrows custom-input` } 
                                        type="number" 
                                        id="phone" 
                                        name="phone"
                                        min={10}
                                        placeholder="Enter phone number" 
                                    />
                                </div>
                            </div> 
                            <div className="mb-3">
                                <label className="form-label">Designation</label>
                                <input
                                   
                                    className={`form-control custom-input`}
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Enter designation*"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                   
                                    className={`form-control custom-input`}
                                    type="text"
                                    id="title"
                                    name="title"
                                    placeholder="Enter address*"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select 
                                    onChange={(e) => setManageUi({...manageUi, hideEmployeeCode: e.target.value === 'employee'})}
                                    defaultValue={''} 
                                    name="role" 
                                    id="role" 
                                    className="form-control custom-input">
                                    <option value="" disabled>Select Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="employee">Employee</option>
                                    <option value="marketing">Marketing</option>
                                </select>
                            </div>
                            {manageUi.hideEmployeeCode && (
                                <div className="mb-3">
                                    <label className="form-label">Employee Code</label>
                                    <input
                                   
                                    className={`form-control custom-input`}
                                    type="text"
                                    id="employee_code"
                                    name="employee_code"
                                    placeholder="Enter employee code*"
                                />
                            </div>
                            )}

                            <button type="submit" className="btn  btn-primary large-btn">
                                Add Employee
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
  );
};

export default NewEmployee;
