import { useCallback, useContext, useEffect, useRef, useState } from "react";
import PageTitle from "../others/PageTitle";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthContext from "../../context/auth";
import { useForm } from "react-hook-form";
import LoadingButton from '../others/LoadingButton';

import { actionPostData } from "../../actions/actions";
import { API_URL } from "../../config";

const NewUser = () => {

    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');

    const userAvtar = useRef(null);
    const [states,setState] = useState([]);
    const navigate = useNavigate();

    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { 
          errors,
          isSubmitting
        } 
    } = useForm();


    const createUserAvtar = (event) =>{
        let fullName = event.target.value
        if(fullName !== '') {
            const firstCharacter = fullName.charAt(0);
            const secondCharacterAfterSpace = fullName.split(' ').slice(1).map(word => word.charAt(0)).join('');
            userAvtar.current.innerHTML = (firstCharacter + secondCharacterAfterSpace).toUpperCase();
        } else {
            userAvtar.current.innerHTML = 'AV'
        }         
    }


    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")
        let postObject = {...data,avtar_name:userAvtar.current.innerHTML};
        
        try{
            let response =  await actionPostData(`${API_URL}/users`,accessToken,postObject);
            response    = await response.json();
            
            if (response.status) {
                toast.success('Creaded Successfully.', {
                    id: toastId
                });
                reset();
                navigate('/users/all-users');
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }              
        } catch(error){
            toast.error(error)
        }
    })

    const fetchState = async() => {
        let response = await actionFetchState();
        let data        = await response.json();
        if(data.status){
            setState(data.data)
        }
    }

    useEffect(() => {
        fetchState()
    },[])

    return (
        <div>
             <PageTitle 
                title="Add New User"
                buttonLink="/users/all-users"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">               
                        <div className="card-body">
                            <form  onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="mb-4">
                                    <label className="form-label">User Avatar</label>
                                    <div 
                                        style={{fontSize:"1.5em"}}
                                        ref={userAvtar}
                                        className="avatar-lg  d-flex justify-content-center align-items-center rounded-5 bg-primary text-white avatar-xl"
                                    >
                                        AV
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Full Name</label>
                                    <input 
                                        {...register("fullName", {
                                            required: "Please enter full name",
                                            minLength: {
                                              value: 6,
                                              message: "Full Name must be at least 6 characters long!"
                                            }
                                        })}
                                        className={`form-control custom-input ${errors.fullName && `is-invalid`}` } 
                                        type="text" 
                                        name="fullName"
                                        id="fullName" 
                                        placeholder="Enter Full Name" 
                                        onKeyUp={(e) => createUserAvtar(e)}
                                    />
                                    <p className="invalid-feedback">{errors.fullName?.message}</p>
                                </div>
                                <div class="mb-3">
                                    <label className="form-label">Phone Number</label>
                                    <div class="input-group">
                                        <button class="btn btn-primary" type="button">+91</button>
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
                                        className={`form-control custom-input ${errors.email && `is-invalid`}` } 
                                        type="email" 
                                        id="email" 
                                        name="email"
                                        placeholder="Email Address (optional)" 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Address Line 1</label>
                                    <input 
                                        {...register("address1", {
                                            required: "Please enter address."                                    
                                        })}
                                        className={`form-control custom-input ${errors.address1 && `is-invalid`}` } 
                                        type="text" 
                                        id="address1" 
                                        name="address1"
                                        placeholder="Enter Address Line 1" 
                                    />
                                    <p className="invalid-feedback">{errors.address1?.message}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Address Line 2</label>
                                    <input 
                                        {...register("address2")}
                                        className={`form-control custom-input` } 
                                        type="text" 
                                        id="address2" 
                                        name="address2"
                                        placeholder="Enter address line 2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">City</label>
                                    <input 
                                        {...register("city", {
                                            required: "Please enter city."                                    
                                        })} 
                                        className={`form-control custom-input ${errors.city && `is-invalid`}` } 
                                        type="text" 
                                        id="city" 
                                        name="city" 
                                        placeholder="Enter city" 
                                    />
                                    <p className="invalid-feedback">{errors.city?.message}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Pin Code</label>
                                    <input 
                                        {...register("pincode", {
                                            required: "Please enter pin code."                                    
                                        })} 
                                        className={`form-control custom-input ${errors.pincode && `is-invalid`}` } 
                                        type="text" 
                                        id="pincode"
                                        name="pincode" 
                                        placeholder="Enter Pin Code" 
                                    />
                                    <p className="invalid-feedback">{errors.pincode?.message}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">New Location</label>
                                    <input 
                                        {...register("near_location", {
                                            required: "Please enter near location."                                    
                                        })}
                                        className={`form-control custom-input ${errors.near_location && `is-invalid`}` } 
                                        type="text" 
                                        id="near_location" 
                                        name="near_location"
                                        placeholder="Enter landmark" 
                                    />
                                    <p className="invalid-feedback">{errors.near_location?.message}</p>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">State</label>
                                    <select 
                                        {...register("state", {
                                            required: "Please enter state."                                    
                                        })} 
                                        className={`form-control custom-input ${errors.state && `is-invalid`}` }                     
                                        id="state" 
                                        name="state"
                                        >
                                        <option value="">Select State</option>
                                        {states.length > 0 &&
                                            states.map(state => {
                                                return ( <option key={state.id} value={state.id}>{state.name}</option>)
                                            })
                                        }
                                    </select>
                                    <p className="invalid-feedback">{errors.state?.message}</p>
                                </div>
                                
                                {isSubmitting ? 
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Add User
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

export default NewUser;