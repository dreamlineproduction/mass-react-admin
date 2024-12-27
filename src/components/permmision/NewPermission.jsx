import { useContext } from "react";
import { actionPostData } from "../../actions/actions";
import { API_URL } from "../../config";
import LoadingButton from "../others/LoadingButton";
import PageTitle from "../others/PageTitle";
import { useForm } from "react-hook-form";
import AuthContext from "../../context/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const NewPermission = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm();

    const submitHandler = async (data) => {
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionPostData(`${API_URL}/permissions`, accessToken, data);
            response = await response.json();

            if (response.status === 200) {
                toast.success(response.message, {
                    id: toastId
                });                
                navigate('/permissions/all-permission');
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
    }
    
    
    return (
        <div>
            <PageTitle
                title="Add New Permission"
                buttonLink="/permissions/all-permission"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(submitHandler)} method="post">

                                <div className="mb-4">
                                    <label className="form-label">Name</label>
                                    <input
                                        {...register("name", {
                                        required: "Please enter permission name.",
                                        minLength: {
                                            value: 3,
                                            message: "Permission name must be at least 3 characters long!"
                                        }
                                        })}
                                        className={`form-control custom-input ${errors.name && `is-invalid`}`}
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter permission name*"                                        
                                    />
                                    <p className="invalid-feedback">{errors.name?.message}</p>
                                </div>

                               

                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Add
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

export default NewPermission;
