import { useCallback, useContext, useState } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { actionPostData } from "../../actions/actions";
import { API_URL } from "../../config";
import LoadingButton from "../others/LoadingButton";

const ChangePassword = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const [isLoading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();

    // Update Offer
    const submitHandler = useCallback(async (data) => {
        setLoading(true)
        const toastId = toast.loading("Please wait...")        

        try {
            let response = await actionPostData(`${API_URL}/admin-users/change-password`, accessToken, data);
            response = await response.json();
            reset();
            setLoading(false)
            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });              
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
            setLoading(false)
        }
    })

    return (
        <div>
            <PageTitle
                title="Change Password"
                buttonLink="/dashboard"
                buttonLabel="Back to Dashboard"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}
                            <form onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="mb-4">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        {...register("current_password", {
                                            required: "Please enter current password.",   
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters long!"
                                            }                                 
                                        })}
                                        className={`form-control custom-input ${errors.current_password && `is-invalid`}`}
                                        type="password"
                                        id="current_password"
                                        name='current_password'
                                        placeholder="Enter Current Password*"
                                        autoComplete='off'
                                    />
                                    <p className="invalid-feedback">{errors.current_password?.message}</p>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label">Current Password</label>
                                    <input
                                        {...register("new_password", {
                                            required: "Please enter new password.",   
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters long!"
                                            }                                 
                                        })}
                                        className={`form-control custom-input ${errors.new_password && `is-invalid`}`}
                                        type="password"
                                        id="new_password"
                                        name='new_password'
                                        placeholder="Enter New Password*"
                                        autoComplete='off'
                                    />
                                    <p className="invalid-feedback">{errors.new_password?.message}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Confirm Password</label>
                                    <input
                                        {...register("confirm_password", {
                                            required: "Please enter new password.",   
                                            minLength: {
                                                value: 8,
                                                message: "Password must be at least 8 characters long!"
                                            }                                 
                                        })}
                                        className={`form-control custom-input ${errors.confirm_password && `is-invalid`}`}
                                        type="password"
                                        id="confirm_password"
                                        name='confirm_password'
                                        placeholder="Enter Confirm Password*"
                                        autoComplete='off'
                                    />
                                    <p className="invalid-feedback">{errors.confirm_password?.message}</p>
                                </div>
                                

                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Change Password
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

export default ChangePassword;