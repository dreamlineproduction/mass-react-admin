import { configPermission } from "../../config";
import PageTitle from "../others/PageTitle";


const AllReports = () => {


return (
<div>
    <PageTitle title="All Reports" />
    <div className="row">
        <div className="col-md-12">
            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Report Title</th>
                                    <th scope="col">Report Category</th>
                                    <th scope="col">User</th>
                                    <th scope="col">Date and Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">12</th>
                                    <td>This product is not valid</td>
                                    <td>Invalid</td>
                                    <td>Sudip Dutta</td>
                                    <td>12/01/2025 at 12:30PM</td>
                                </tr>
                                <tr>
                                    <th scope="row">12</th>
                                    <td>This product is not valid</td>
                                    <td>Invalid</td>
                                    <td>Sudip Dutta</td>
                                    <td>12/01/2025 at 12:30PM</td>
                                </tr>
                                <tr>
                                    <th scope="row">12</th>
                                    <td>This product is not valid</td>
                                    <td>Invalid</td>
                                    <td>Sudip Dutta</td>
                                    <td>12/01/2025 at 12:30PM</td>
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
