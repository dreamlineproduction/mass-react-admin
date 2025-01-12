import { useContext } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import { API_URL, configPermission } from "../../config";

const NewArea = () => {
    const { Auth, hasPermission } = useContext(AuthContext);

    return (
        <div>
            <PageTitle
                title="Add New Area"
                buttonLink={hasPermission(configPermission.ADD_AREA) ? '/areas/all-area' : null}
                buttonLabel={hasPermission(configPermission.ADD_AREA) ? 'Back to list' : null}
            />


            <div className="row">
                <div className="col-12 col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Pin Code*</label>
                                <input name="name" className="form-control custom-input" type="number" id="pincode" placeholder="Enter pin code"></input>
                            </div>
                            <div class="mb-3">
                                <label className="form-label">State*</label>
                                <select className="form-select custom-input" aria-label="Default select example">
                                    <option selected disabled>Select State</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label className="form-label">District*</label>
                                <select className="form-select custom-input" aria-label="Default select example">
                                    <option selected disabled>Select District</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label className="form-label">City*</label>
                                <select className="form-select custom-input" aria-label="Default select example">
                                    <option selected disabled>Select District</option>
                                    <option value="1">One</option>
                                    <option value="2">Two</option>
                                    <option value="3">Three</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Area Name*</label>
                                <input name="name" className="form-control custom-input" type="text" id="area" placeholder="Enter pin code"></input>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewArea;