import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PageTitle from "../others/PageTitle";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "../../context/auth";
import { useForm } from "react-hook-form";
import LoadingButton from '../others/LoadingButton';

import { actionFetchData, actionPostData } from "../../actions/actions";
import { API_URL, configPermission, removeCountryCode } from "../../config";
import AllTransaction from "./AllTransaction";
import AllOrder from "./AllOrder";

const EditUser = () => {

    const params = useParams();

    const defaultAvtar = 'AV';
    const { Auth, hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');

    const userAvtar = useRef(null);
    const [areas, setArea] = useState([]);
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
        register,
        handleSubmit,
        reset,
        setError,
        setValue,
        getValues,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();



    const createUserAvtar = (event) => {
        let firstName = getValues('first_name');
        let lastName = getValues('last_name');

        if (firstName !== '' && lastName !== '') {
            let firstCharacter = firstName.charAt(0) + lastName.charAt(0);
            userAvtar.current.innerHTML = (firstCharacter).toUpperCase();
        } else {
            userAvtar.current.innerHTML = defaultAvtar;
        }
    }

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
                setArea(data.data)
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
            userAvtar.current.innerHTML = response.data.avtar_name;
          
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
    
    return (
        <div>
            {isLoading && <div className="cover-body"></div>}

            <PageTitle
                title={`Edit User (${user?.name})`}
                buttonLink="/users/all-users"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="mb-4">
                                    <label className="form-label">User Avatar</label>
                                    <div
                                        style={{ fontSize: "1.5em" }}
                                        ref={userAvtar}
                                        className="avatar-lg  d-flex justify-content-center align-items-center rounded-5 bg-primary text-white avatar-xl"
                                    >
                                        AV
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">First Name*</label>
                                    <input
                                        {...register("first_name", {
                                            required: "Please enter full name",
                                            minLength: {
                                                value: 6,
                                                message: "Full Name must be at least 6 characters long!"
                                            }
                                        })}
                                        className={`form-control custom-input ${errors.first_name && `is-invalid`}`}
                                        type="text"
                                        name="first_name"
                                        id="first_name"
                                        placeholder="Enter Full Name"
                                        onKeyUp={(e) => createUserAvtar(e)}
                                    />
                                    <p className="invalid-feedback">{errors.first_name?.message}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Last Name*</label>
                                    <input
                                        {...register("last_name", {
                                            required: "Please enter last name",
                                            minLength: {
                                                value: 3,
                                                message: "Last Name must be at least 3 characters long!"
                                            }
                                        })}
                                        className={`form-control custom-input ${errors.last_name && `is-invalid`}`}
                                        type="text"
                                        name="last_name"
                                        id="last_name"
                                        placeholder="Enter Last Name"
                                        onKeyUp={(e) => createUserAvtar(e)}
                                    />
                                    <p className="invalid-feedback">{errors.last_name?.message}</p>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="gender">Gender*</label>
                                    <div className="mt-2">
                                        <div className="form-check form-check-inline">
                                            <input
                                                {...register("gender", { required: "Gender is required" })}
                                                className="form-check-input"
                                                type="radio"
                                                id="male"
                                                value="Male"
                                            />
                                            <label className="form-check-label" htmlFor="male">
                                                Male
                                            </label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input
                                                {...register("gender", { required: "Gender is required" })}
                                                className="form-check-input"
                                                type="radio"
                                                id="female"
                                                value="Female"
                                            />
                                            <label className="form-check-label" htmlFor="female">
                                                Female
                                            </label>
                                        </div>
                                    </div>
                                    {errors.gender && (
                                        <p className="text-danger">{errors.gender.message}</p>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone Number*</label>
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
                                            className={`form-control remove-arrows custom-input ${errors.phone && `is-invalid`}`}
                                            type="number"
                                            id="phone"
                                            name="phone"
                                            min={10}
                                            placeholder="Enter phone number"
                                        />
                                        <p className="invalid-feedback">{errors.phone?.message}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Email</label>
                                    <input
                                        {...register("email", {
                                            required: false,
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Please enter valid email!"
                                            }
                                        })}
                                        className={`form-control custom-input ${errors.email && `is-invalid`}`}
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Email Address (optional)"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Employee code</label>
                                    <input
                                        {...register("employee_code", {
                                            required: false,
                                            minLength: {
                                                value: 8,
                                                message: 'Employee code you are entering is not correct.'
                                            },                                                
                                        })}
                                        id="employee_code"
                                        name="employee_code"
                                        type="text"
                                        className={`form-control custom-input ${errors.employee_code && `is-invalid`}`}
                                        placeholder="Enter Employee code"
                                    />
                                    {errors.employee_code && <p className="invalid-feedback">{errors.employee_code.message}</p>}
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Referral code</label>
                                    <input
                                        {...register("referral_code", {
                                            required: false,                                                
                                            minLength: {
                                                value: 8,
                                                message: 'Referral code you are entering is not correct.'
                                            },
                                        })}
                                        id="referral_code"
                                        name="referral_code"
                                        type="text"
                                        className={`form-control custom-input ${errors.employee_code && `is-invalid`}`}
                                        placeholder="Enter Referral code code"
                                    />
                                    {errors.referral_code && <p className="invalid-feedback">{errors.referral_code.message}</p>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Source</label>
                                    <select
                                        {...register("source", {
                                            required: "Source is required"
                                        })}
                                        className={`form-select custom-input ${errors.source ? "is-invalid" : ""}`}
                                        name="source"
                                        defaultValue={''}
                                        id="source">

                                        <option value="">Select Source</option>
                                        {source.map((item, i) =>
                                            <option selected={item.name === user?.source} key={i} value={item.id}>{item.name}</option>
                                        )}

                                    </select>
                                    {errors.source && <div className="invalid-feedback">{errors.source.message}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Date of Birth*</label>
                                    <input
                                        {...register("date_of_birth", {
                                            required: "Date of Birth is required",
                                        })}
                                        className={`form-control custom-input ${errors.date_of_birth ? "is-invalid" : ""}`}
                                        type="date"
                                        id="date_of_birth"
                                        name="date_of_birth"
                                        placeholder="Enter date of birth"

                                    />
                                    {errors.date_of_birth && <div className="invalid-feedback">{errors.date_of_birth.message}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Pin Code*</label>
                                    <input
                                        {...register("pincode", {
                                            required: "Pin Code is required",
                                            pattern: {
                                                value: /^[0-9]{6}$/,
                                                message: "Enter a valid 6-digit Pin Code",
                                            },
                                        })}
                                        onChange={(e) => handlePinCode(e.target.value)}
                                        className={`form-control custom-input ${errors.pincode ? "is-invalid" : ""}`}
                                        type="text"
                                        id="pin_code"
                                        placeholder="Enter pin code"

                                    />
                                    {errors.pincode && <div className="invalid-feedback">{errors.pincode.message}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">State*</label>
                                    <input
                                        {...register("state", {
                                            required: "State is required"
                                        })}
                                        className={`form-control disabled custom-input ${errors.state ? "is-invalid" : ""}`}
                                        disabled
                                        type="text"
                                        name="state"
                                        id="state"
                                        placeholder="Enter state"
                                    />
                                    {errors.state && <div className="invalid-feedback">{errors.state.message}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">District*</label>
                                    <input
                                        {...register("district", {
                                            required: "District is required"
                                        })}
                                        className={`form-control disabled custom-input ${errors.district ? "is-invalid" : ""}`}
                                        disabled
                                        type="text"
                                        name="district"
                                        id="district"
                                        placeholder="Enter district"
                                    />
                                    {errors.district && <div className="invalid-feedback">{errors.district.message}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">City*</label>
                                    <input
                                        {...register("city", {
                                            required: "City is required"
                                        })}
                                        className={`form-control disabled custom-input ${errors.city ? "is-invalid" : ""}`}
                                        disabled
                                        type="text"
                                        name="city"
                                        id="city"
                                        placeholder="Enter city"
                                    />
                                    {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Area Name*</label>
                                    <select
                                        {...register("area_name", { required: "Area Name is required" })}
                                        className={`form-select custom-input ${errors.area_name ? "is-invalid" : ""}`}
                                        name="area_name"
                                        defaultValue={''}
                                        id="area_name">

                                        <option value="">Select Area</option>
                                        {areas.map((item, i) =>
                                            <option selected={item.id === user?.area_id} key={i} value={item.id}>{item.area}</option>
                                        )}

                                    </select>
                                    {errors.area_name && <div className="invalid-feedback">{errors.area_name.message}</div>}
                                </div>

                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Update User
                                    </button>
                                }



                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4">

                </div>
            </div>    
        </div>
    );
};

export default EditUser;