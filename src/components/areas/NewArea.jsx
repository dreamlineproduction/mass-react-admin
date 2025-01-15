import { useContext, useEffect, useState } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import { API_URL, configPermission } from "../../config";
import { useForm } from "react-hook-form";
import { actionFetchData, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const NewArea = () => {
    const { Auth, hasPermission } = useContext(AuthContext);
    const accessToken = Auth("accessToken");
     const navigate = useNavigate();

    const [isLoading,setIsLoading] = useState(false)

    const handlePinCode = async (e) => {
        const pinCode = e.target.value;
        if(pinCode.length > 5){
            setIsLoading(true);
            const response = await actionFetchData(`${API_URL}/front/area?pin_code=${pinCode}`)
            const data = await response.json();
            if(data.status === 200){
                setValue('state',data.state)
                setValue('district',data.district)
                setValue('city',data.city)
                setIsLoading(false);
            }
        }
    }

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        formState: { errors },
    } = useForm();
    
    const onSubmit = async (data) => {
        
        try {
            const toastId = toast.loading("Please wait...")
            setIsLoading(true);
            let response = await actionPostData(`${API_URL}/areas`, accessToken, data);
            response = await response.json();
            setIsLoading(false);
            
            if (response.status === 200) {
                toast.success(response.message, {
                    id: toastId
                });                
                navigate('/areas/all-area');
            } 
            
            if (response.status === 203) {
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
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if(!hasPermission(configPermission.ADD_AREA)){
            navigate('/403')
        }
    },[])

    return (
        <div>
            <PageTitle
                title="Add New Area"
                buttonLink={hasPermission(configPermission.ADD_AREA) ? '/areas/all-area' : null}
                buttonLabel={hasPermission(configPermission.ADD_AREA) ? 'Back to list' : null}
            />

            <div className="row">
                <div className="col-12 col-xl-12">
                    <div className="card">
                        <div className="card-body">
                        {isLoading && <div className="cover-body"></div>}
                        <form onSubmit={handleSubmit(onSubmit)} className="card-body">
                            <div className="mb-3">
                                <label className="form-label">Pin Code*</label>
                                <input
                                    {...register("pin_code", {
                                        required: "Pin Code is required",
                                        pattern: {
                                        value: /^[0-9]{6}$/,
                                        message: "Enter a valid 6-digit Pin Code",                                    
                                        },
                                    })}
                                    onChange={handlePinCode}
                                    className={`form-control custom-input ${errors.pin_code ? "is-invalid" : ""}`}
                                    type="text"
                                    id="pin_code"
                                    placeholder="Enter pin code"

                                />
                                {errors.pin_code && <div className="invalid-feedback">{errors.pin_code.message}</div>}
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
                                <input
                                    {...register("area", { required: "Area Name is required" })}
                                    className={`form-control custom-input ${errors.area ? "is-invalid" : ""}`}
                                    type="text"
                                    id="area"
                                    placeholder="Enter Area Name"
                                />
                                {errors.area && <div className="invalid-feedback">{errors.area.message}</div>}
                            </div>

                            <div className="mb-3">
                                <button type="submit" className="btn btn-primary large-btn">
                                Add Area
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default NewArea;