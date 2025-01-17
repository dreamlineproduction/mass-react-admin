import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { API_URL, configPermission, removeCountryCode } from "../../config";
import { actionFetchData, actionPostData } from "../../actions/actions";
import { useForm } from "react-hook-form";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import AuthContext from "../../context/auth";
import LoadingButton from "../others/LoadingButton";

const EditEmployee = () => {
    const defaultAvtar = 'AV';   
    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();
    const params = useParams();

    const [isLoading, setLoading] = useState(true);
    const [employee, setEmployee] = useState(null);
    const [roles, setRole] = useState([]);

    const userAvtar = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();


    const createUserAvtar = (event) => {

        let fullName = event.target.value;
        if (fullName !== '') {
            const firstCharacter = fullName.charAt(0);
            const secondCharacterAfterSpace = fullName.split(' ').slice(1).map(word => word.charAt(0)).join('');
            userAvtar.current.innerHTML = (firstCharacter + secondCharacterAfterSpace).toUpperCase();
        } else {
            userAvtar.current.innerHTML = defaultAvtar;
        }
    }

    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")

        try {
            let response = await actionPostData(`${API_URL}/employees/${params.id}`, accessToken, data, 'PUT');
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                navigate('/employees/all-employee');
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })

    const fetchData = async () => {
        setLoading(true);
        let response = await actionFetchData(`${API_URL}/employees/${params.id}`, accessToken);
        response = await response.json();

        if (response.status) {
            reset({
                ...response.data,
                phone:removeCountryCode(response.data.phone)
            });
            setEmployee(response.data);
            userAvtar.current.innerHTML = response.data.avtar_name;
            setLoading(false);
        }
    }

    // Fetch Data
    const fetchRoles = async () => {
        setLoading(true);

        let response = await actionFetchData(`${API_URL}/roles?page=${1}&perPage=${1000}`, accessToken);
        response = await response.json();
        if (response.status) {
            setRole(response.data.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        if(!hasPermission(configPermission.EDIT_EMPLOYEE)){
            navigate('/403')
        }
        fetchRoles();
        fetchData();          
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
        <PageTitle
            title="Edit Employee"
            buttonLink="/employees/all-employee"
            buttonLabel="Back to List"
        />
        <div className="row">
            <div className="col-12 col-xl-8">
                <div className="card">
                    <div className="card-body">
                        {isLoading && <div className="cover-body"></div>}
                        <form onSubmit={handleSubmit(submitHandler)} method="post">
                            <div className="mb-3">
                                <label className="form-label">Employee Avatar</label>
                                <div 
                                    style={{fontSize:"1.5em"}}
                                    ref={userAvtar}
                                    className="avatar-lg  d-flex justify-content-center align-items-center rounded-5 bg-primary text-white avatar-xl"
                                >
                                    AV
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    {...register("name", {
                                        required: "Please enter name",
                                        minLength: {
                                            value: 6,
                                            message: "Name must be at least 6 characters long!"
                                        }
                                    })}
                                    className={`form-control custom-input ${errors.name && `is-invalid`}` } 
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter name*"
                                    onKeyUp={(e) => createUserAvtar(e)}
                                />
                                <p className="invalid-feedback">{errors.name?.message}</p>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input 
                                    {...register("email", {
                                        required: "Please enter email",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter valid email!"
                                        }
                                    })}
                                    className={`form-control custom-input ${errors.email && `is-invalid`}` } 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    placeholder="Email Address" 
                                />
                                <p className="invalid-feedback">{errors.email?.message}</p>
                            </div>

                            <div className="mb-3">  
                                <label className="form-label">Phone Number</label>
                                <div className="input-group">
                                    <button className="btn btn-primary" type="button">+91</button>
                                    <input 
                                        {...register("phone", {
                                            required: "Please enter phone number",
                                            minLength: {
                                            value: 10,
                                            message: "Phone number must be at least 10 characters long!"
                                            },
                                            maxLength: {
                                                value: 10,
                                                message: "Phone number must be at least 10 characters long!"
                                            }
                                        })}
                                        className={`form-control remove-arrows custom-input ${errors.phone && `is-invalid`}` } 
                                        type="number" 
                                        id="phone" 
                                        name="phone"
                                        min={10}
                                        placeholder="Enter phone number" 
                                    />
                                    <p className="invalid-feedback">{errors.phone?.message}</p>
                                </div>
                            </div> 
                            <div className="mb-3">
                                <label className="form-label">Designation</label>
                                <input
                                    {...register("designation", {
                                        required: "Please enter designation",
                                        minLength: {
                                            value: 3,
                                            message: "Designation must be at least 3 characters long!"
                                        }
                                    })}
                                    className={`form-control custom-input ${errors.designation && `is-invalid`}` } 
                                    type="text"
                                    id="designation"
                                    name="designation"
                                    placeholder="Enter designation*"
                                />
                                <p className="invalid-feedback">{errors.designation?.message}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    {...register("address1", {
                                        required: false,
                                        minLength: {
                                            value: 10,
                                            message: "Address must be at least 10 characters long!"
                                        }
                                    })}
                                    className={`form-control custom-input ${errors.address1 && `is-invalid`}` } 
                                    type="text"
                                    id="address1"
                                    name="address1"
                                    placeholder="Enter address"    
                                />
                                <p className="invalid-feedback">{errors.address1?.message}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select 
                                    {...register("role_id", {
                                        required: "Please select role",
                                    })}
                                    className={`form-control custom-input ${errors.role && `is-invalid`}` } 
                                    defaultValue={''} 
                                    name="role_id" 
                                    id="role_id" 
                                    >
                                        <option value="" disabled>Select Role</option>
                                        {roles.map((role) => (
                                            <option key={`role-${role.id}`} value={role.id}>{role.name}</option>
                                        ))}                                        
                                </select>
                                <p className="invalid-feedback">{errors.role?.message}</p>
                            </div>
                            {employee && employee.employee_code && (
                                <div className="mb-3">
                                    <label className="form-label">Employee Code</label>
                                    <input 
                                        disabled
                                        className={`form-control custom-input disabled`} 
                                        type="text" 
                                        placeholder="Enter Employee Code" 
                                        value={employee.employee_code}
                                    />
                                </div>
                            )}

                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select 
                                    {...register("status", {
                                        required: "Please select status",
                                    })}
                                    className={`form-control custom-input ${errors.status && `is-invalid`}` } 
                                    defaultValue={''} 
                                    name="status" 
                                    id="status" 
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                            {isSubmitting ?
                                <LoadingButton />
                                :
                                <button type="submit" className="btn  btn-primary large-btn">
                                    Update Employee
                                </button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
};

export default EditEmployee;