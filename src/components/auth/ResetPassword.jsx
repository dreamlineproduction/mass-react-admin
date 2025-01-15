import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { actionPostData } from "../../actions/actions";
import { API_URL } from "../../config";
import LoadingButton from "../others/LoadingButton";

const ResetPassword = () => {

    const { AuthCheck } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation();
        const [isLoading, setLoading] = useState(true);
    

    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    const userId = parseInt(queryParams.get("userId"));

    
    const {
        register,
        handleSubmit,
        reset,
        getValues,
        setError,
        formState: {
            errors,
            isSubmitting
        } 
    } = useForm();

    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")

        const postData ={
            ...data,
            token,
            user_id:userId
        }
        try {
            let accessToken = ''
            let response = await actionPostData(`${API_URL}/update-password`, accessToken, postData);
            response = await response.json();

            if (response.status === 200) {
                toast.success(response.message, {
                    id: toastId
                });    
                
                navigate('/login')
            } 
            if (response.status === 404) {
                toast.error(response.message, {
                    id: toastId
                });    
                navigate('/forgot-password')                   
            } 
            if (response.status === 422) {
                Object.keys(response.errors).forEach((field) => {
                    setError(field, {
                        type: "server",
                        message: response.errors[field],
                    });
                });
               toast.dismiss(toastId);                           
            } 

            reset();
        } catch (error) {
            toast.error(error)
        }        
    })

    const checkTokenAndUid = async() => {
        const postData = {
            token,
            user_id:userId
        }

        let accessToken = '';
        let response = await actionPostData(`${API_URL}/check-token-uid`, accessToken, postData);
        response = await response.json();

        if (response.status !== 200) {
            toast.error(response.message);  
            setTimeout(() => {
                navigate('/forgot-password')
            }, 2000);
        }
        setLoading(false);
    }


    useEffect(() => {
        if(token.length === 0 || userId.length === 0 || !Number.isInteger(userId)){
            navigate('/forgot-password')
        }

        if (AuthCheck()) {
            navigate('/dashboard', { replace: true })
        }

        checkTokenAndUid();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <main className="d-flex w-100">           
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
            <div className="container d-flex flex-column">
                <div className="row vh-100">
                    <div className="col-sm-10 col-md-8 col-lg-6 col-xl-7 mx-auto d-table h-100">
                        <div className="d-table-cell align-middle">

                            <div className="text-center my-4">
                                <div>
                                    <img src="/images/logo.svg" width={150} alt="logo" className="img-fluid" />           
                                </div>                                
                            </div>

                            <div className="card p-4">
                                <div className="card-header">
                                    <h1 className="h1">
                                        Reset your password
                                    </h1>
                                    <p className="lead">
                                        Create your new account password.
                                    </p>
                                </div>
                                <div className="card-body pt-0">                                    
                                    <div className="">
                                        <form onSubmit={handleSubmit(submitHandler)}>                                      
                                            <div className="mb-3">
                                                <label className="form-label">Password</label>
                                                <input
                                                    {...register("password", {
                                                        required: "Password is required",
                                                        minLength: {
                                                            value: 6,
                                                            message: "Password must be at least 6 characters long",
                                                        },
                                                    })}
                                                    className={`form-control custom-input ${errors.password  && `is-invalid`}` } 
                                                    type="password" 
                                                    name="password" 
                                                    id="password"  
                                                />
                                                <p className="invalid-feedback d-block">{errors.password?.message}</p>
                                            </div> 
                                            <div className="mb-3">
                                                <label className="form-label">Confirm Password</label>
                                                <input                                   
                                                    type="password"
                                                    {...register("confirmPassword", {
                                                        required: "Confirm Password is required",
                                                        validate: (value) =>
                                                            (value === getValues('password')) || "Passwords do not match",
                                                        }
                                                    )}
                                                    className={`form-control custom-input ${errors.confirmPassword && `is-invalid`}` } 
                                                    name="confirmPassword" 
                                                    id="confirmPassword"  
                                                />
                                                <p className="invalid-feedback">{errors?.confirmPassword?.message}</p>
                                            </div>                                                                                   
                                            <div className="d-flex justify-content-end gap-2 mt-3">
                                                <button onClick={() => navigate('/login')} className="btn btn-lg large-btn btn-outline-primary" >Cancel</button>                                                                                                    
                                                {
                                                    isSubmitting ? <LoadingButton /> :
                                                    <button 
                                                        disabled={isSubmitting}
                                                        className="btn btn-lg btn-primary large-btn ">
                                                        Change Password
                                                    </button>
                                                }
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>                            
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ResetPassword;