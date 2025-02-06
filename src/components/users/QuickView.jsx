import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "../../context/auth";
import { useForm } from "react-hook-form";

import { actionFetchData, actionPostData } from "../../actions/actions";
import { API_URL, configPermission, removeCountryCode } from "../../config";


const QuickView = () => {

const params = useParams();


const { Auth, hasPermission } = useContext(AuthContext)
const accessToken = Auth('accessToken');

const [isLoading, setLoading] = useState(true);

const [user, setUser] = useState(null);
const [source, setSource] = useState([
{ id: 1, name: "Dealer Meet" },
{ id: 2, name: "One to One Connect" },
{ id: 3, name: "Vendor" },
{ id: 4, name: "Facebook" },
{ id: 5, name: "YouTube" },
{ id: 6, name: "Whatsapp" },
{ id: 7, name: "Other" },
])

const navigate = useNavigate();

const {
handleSubmit,
reset,
setError,
setValue,
getValues,
formState: {
}
} = useForm();




const submitHandler = useCallback(async (data) => {
const toastId = toast.loading("Please wait...")

try {
let response = await actionPostData(`${API_URL}/users/${params.id}`, accessToken, data, 'PUT');
response = await response.json();

if (response.status === 200) {
toast.success(response.message, {
id: toastId
});
navigate('/users/all-users');
}
if(response.status === 404){
toast.error(response.message, {
id: toastId
});
}
if(response.status === 422){
Object.keys(response.errors).forEach((field) => {
setError(field, {
type: "server",
message: response.errors[field],
});
});
toast.dismiss(toastId);
}
} catch (error) {
toast.error(error)
}
})


const handlePinCode = async (pinCode) => {
if (pinCode.length > 5) {
setLoading(true);
const response = await actionFetchData(`${API_URL}/front/area?pin_code=${pinCode}`)
const data = await response.json();
if (data.status === 200) {
setValue('state', data.state)
setValue('district', data.district)
setValue('city', data.city)

setLoading(false);
} else {
setLoading(false);
toast.error(data.message)
}
}
}

const fetchUser = async () => {
setLoading(true);
let url = `${API_URL}/users/${params.id}`;
let response = await actionFetchData(url, accessToken);
response = await response.json();

if (response.status) {
reset({
...response.data,
area_name: response.data.area_id,
phone: removeCountryCode(response.data.phone)
});

handlePinCode(response.data.pincode)
setUser(response.data)


}
}

useEffect(() => {
if (!hasPermission(configPermission.EDIT_USER)) {
navigate('/403')
}
//fetchState()
fetchUser();
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

console.log(user);

return (
<div>
    {isLoading && <div className="cover-body"></div>}


    <div className="row">
        <div className="col-12 col-xl-12">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={handleSubmit(submitHandler)} method="post">
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
                                                    }) : "N/A"}</td>
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
                                                <td><a href="#">125</a></td>
                                            </tr>
                                            <tr>
                                                <th scope="row">Referred By </th>
                                                <td>asdasda <a href="#">(dadkjadskdas)</a></td>
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




                    </form>
                </div>
            </div>
        </div>


    </div>
</div>
);
};

export default QuickView;
