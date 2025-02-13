import { configPermission } from "../../config";
import PageTitle from "../others/PageTitle";


const AllReports = () => {


return (
<div>
    <PageTitle title="Product Reports" />
    <div className="row">
        <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">User Information</th>
                                    <th scope="col">Reason</th>
                                    <th scope="col">Reported Date</th>
                                    <th scope="col">View Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">12</th>
                                    <td><a href="#">Mass Wood Polish</a></td>
                                    <td><a href="#">919836952666 (Ayan Mukhopadhyay)</a></td>
                                    <td>Fake Product</td>
                                    <td>12/01/2025</td>
                                    <td>
                                    <a title="View Top 50" className="btn btn-primary" href="/users/all-users">View Details</a>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">12</th>
                                    <td><a href="#">Mass Wood Polish</a></td>
                                    <td><a href="#">919836952666 (Ayan Mukhopadhyay)</a></td>
                                    <td>Fake Product</td>
                                    <td>12/01/2025</td>
                                    <td>
                                    <a title="View Top 50" className="btn btn-primary" href="/users/all-users">View Details</a>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">12</th>
                                    <td><a href="#">Mass Wood Polish</a></td>
                                    <td><a href="#">919836952666 (Ayan Mukhopadhyay)</a></td>
                                    <td>Fake Product</td>
                                    <td>12/01/2025</td>
                                    <td>
                                    <a title="View Top 50" className="btn btn-primary" href="/users/all-users">View Details</a>
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
);
};

export default AllReports;
