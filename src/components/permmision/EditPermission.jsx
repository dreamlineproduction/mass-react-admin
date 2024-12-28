import { useForm } from "react-hook-form";
import PageTitle from "../others/PageTitle";
import LoadingButton from "../others/LoadingButton";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/auth";
import { API_URL, configPermission } from "../../config";
import { actionFetchData, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";

const EditPermission = () => {
    const { Auth,hasPermission } = useContext(AuthContext)    
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const params = useParams();
    const [isLoading, setLoading] = useState(true);

    const { register, handleSubmit,reset, formState: { errors, isSubmitting }, setError } = useForm();

    const submitHandler = async (data) => { 
        const toastId = toast.loading("Please wait...")


        try {
            let response = await actionPostData(`${API_URL}/permissions/${params.id}`, accessToken, data, 'PUT');
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

    const fetchData = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/permissions/${params.id}`;

        let response = await actionFetchData(apiUrl, accessToken);
        let data = await response.json();

        if (data.status) {
            reset(data.data);
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!hasPermission(configPermission.EDIT_PERMISSION)){
            navigate('/403')
        }
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <PageTitle
                title="Edit Permission"
                buttonLink="/permissions/all-permission"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}
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
                                        Update
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

export default EditPermission;