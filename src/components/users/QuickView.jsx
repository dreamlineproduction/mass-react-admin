import { Link} from "react-router-dom";



const QuickView = ({user}) => {


    return (
        <div className="postion-relative">
            <div className="row">
                <div className="col-12 col-xl-12">
                    <div className="card">
                        <div className="card-body">
                            <div className="row">
                                {/* Personal Information Table */}
                                <div className="col-12 col-xl-6 col-lg-6">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">User ID</th>
                                                    <td>{user?.id}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Date of Registration</th>
                                                    <td>{user?.created_at}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">User Type</th>
                                                    <td>

                                                        <span
                                                            className="d-inline-flex px-2 py-1 fw-semibold text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-2">{user?.role?.name
                                                                || "N/A"} </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Name</th>
                                                    <td>{user?.name}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Date of Birth</th>
                                                    <td>{user?.date_of_birth ? new
                                                        Date(user.date_of_birth).toLocaleDateString("en-GB", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric"
                                                        }) : "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Age</th>
                                                    <td>{user?.age}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Gender</th>
                                                    <td>{user?.gender}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Phone Number</th>
                                                    <td><a href={`tel:${user?.phone}`}>{user?.phone}</a></td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Email Address</th>
                                                    <td>{user?.email || "N/A"}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Pin Code</th>
                                                    <td>{user?.pincode}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">State</th>
                                                    <td>{user?.state_str}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">District</th>
                                                    <td>{user?.district}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">City</th>
                                                    <td>{user?.city}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Area</th>
                                                    <td>{user?.area_name}</td>
                                                </tr>



                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* User Account & Stats Table */}
                                <div className="col-12 col-xl-6 col-lg-6">
                                    <div className="table-responsive">
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <th scope="row">Referral Code</th>
                                                    <td>{user?.referral_code}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Number of Referral</th>
                                                    <td>{user?.referral_count}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Referred By </th>
                                                    <td>

                                                        {user?.to_referral_code || 'N/A'}
                                                        {user?.to_referral_id &&
                                                            <Link className="ms-1" to={`/users/transaction/${user?.to_referral_id}`}>({user?.to_referral_name} )</Link>
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Employee Code </th>
                                                    <td> {user?.employee_code || "N/A"}
                                                        {user?.employee_name}</td>
                                                </tr>

                                                <tr>
                                                    <th scope="row">Source</th>
                                                    <td>{user?.source || 'N/A'}</td>
                                                </tr>


                                                <tr>
                                                    <th scope="row">Total Product Scanned</th>
                                                    <td>
                                                        <a href="#allOrders">
                                                            {user?.scan_product_count}
                                                        </a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Total XP</th>
                                                    <td>{user?.total_xp || '0XP'}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Current XP Balance</th>
                                                    <td>{user?.balance_xp || '0XP'}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">Total Redeemed</th>
                                                    <td>{user?.order_count || '0'}</td>
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
        </div>
    );
};

export default QuickView;
