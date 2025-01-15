import { useCallback, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import {  useNavigate } from "react-router-dom";
import { actionPostData } from "../../actions/actions";
import AuthContext from "../../context/auth";
import LoadingButton from "../others/LoadingButton";
import { API_URL } from "../../config";

const ForgotPassword = () => {
    const { AuthCheck } = useContext(AuthContext)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: {
            errors,
            isSubmitting
        } 
    } = useForm();

    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")
        const postData = {...data,user_type:"BACKEND"}

        try {
            let accessToken = ''
            let response = await actionPostData(`${API_URL}/forgot-password`, accessToken, postData);
            response = await response.json();

            if (response.status === 200) {
                toast.success(response.message, {
                    id: toastId
                });               
            } 
            if (response.status === 404) {
                toast.error(response.message, {
                    id: toastId
                });                              
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

    useEffect(() => {
        if (AuthCheck()) {
            navigate('/dashboard', { replace: true })
        }
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
                                        Find Your Account
                                    </h1>
                                    <p className="lead">
                                        Please enter your email address to search for your account.
                                    </p>
                                </div>
                                <div className="card-body pt-0">                                    
                                    <div className="">
                                        <form onSubmit={handleSubmit(submitHandler)}>                                      
                                            <div className="mb-3">
                                                <label className="form-label">Email</label>
                                                <input 
                                                    className={`form-control custom-input ${errors.email && `is-invalid`}`}
                                                    {...register("email", {
                                                        required: "Please enter your email",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Please enter valid email!"
                                                        }
                                                    })}
                                                    type="email"
                                                    name='email'
                                                    id="email"
                                                    autoComplete='off'
                                                    placeholder="Enter email address" 
                                                />
                                                <p className="invalid-feedback d-block">{errors.email?.message}</p>
                                            </div>                                                                                     
                                            <div className="d-flex justify-content-end gap-2 mt-3">
                                                <button onClick={() => navigate('/login')} className="btn btn-lg large-btn btn-outline-primary" >Cancel</button>                                                                                                    
                                                {
                                                    isSubmitting ? <LoadingButton /> :
                                                    <button 
                                                        disabled={isSubmitting}
                                                        className="btn btn-lg btn-primary large-btn ">
                                                        Search
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

export default ForgotPassword;