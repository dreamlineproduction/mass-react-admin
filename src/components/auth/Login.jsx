import { useCallback, useContext, useEffect  } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth";
import { API_URL, encryptData } from "../../config";
import LoadingButton from "../others/LoadingButton";
import { actionPostData } from "../../actions/actions";

const Login = () => {

    const { AuthCheck, login,setPermission } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const redirectPath = location.state?.path || '/dashboard';



    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting
        } 
    } = useForm();

    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")
        try {
            let accessToken = ''
            let response = await actionPostData(`${API_URL}/login`, accessToken, data);
            response = await response.json();

            if (response.status) {
                toast.success('Logged in ', {
                    id: toastId
                });

                let userInfo = {
                    accessToken: response.token,
                    name: response.data.name,
                    userId: response.data.id
                }

                localStorage.setItem('user-info', JSON.stringify(userInfo));
                // Save permissions
                const encryptedPermissions = encryptData(response.permissions)
                localStorage.setItem('permissions', encryptedPermissions)

                login(userInfo)
                reset();
                navigate(redirectPath, { replace: true });
            } else {
                toast.error(response.message, {
                    id: toastId
                });
                reset({
                    password: ''
                });
            }
        } catch (error) {
            toast.error(error)
        }        
    })

    useEffect(() => {
        if (AuthCheck()) {
            navigate(redirectPath, { replace: true })
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
                                        Login
                                    </h1>
                                    <p className="lead">
                                            Sign In to your account
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
                                            <div className="mb-3">
                                                <label className="form-label">Password</label>
                                                <input 
                                                    className={`form-control custom-input ${errors.password && `is-invalid`}`}
                                                     {...register("password", {
                                                        required: "Please enter your Password",
                                                        minLength: {
                                                            value: 8,
                                                            message: "Password must be at least 8 characters long!"
                                                        }
                                                    })}
                                                    type="password" 
                                                    name="password" 
                                                    placeholder="Enter your password" 
                                                />
                                                <p className="invalid-feedback d-block">{errors.password?.message}</p>
                                            </div>                                           
                                            <div className="d-grid gap-2 mt-3">
                                                {
                                                    isSubmitting ? <LoadingButton /> :
                                                    <button 
                                                        disabled={isSubmitting}
                                                        className="btn btn-lg btn-primary large-btn ">
                                                        Sign in
                                                    </button>
                                                }
                                            </div>
                                        </form>

                                        <div className="text-end mt-3">
                                            <Link className="nav-link" href="#">Forgot Password</Link>
                                        </div>
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

export default Login;