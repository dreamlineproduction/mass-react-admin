import { useCallback, useContext, useEffect, useRef, useState } from "react";     
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { API_URL, removeCountryCode } from "../../config";
import { actionFetchData, actionImageUpload, actionPostData } from "../../actions/actions";
import PageTitle from "../others/PageTitle";
import LoadingButton from "../others/LoadingButton";
import AuthContext from "../../context/auth";

const ProfileSetting = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');

    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fileInput = useRef();
    const [imageData, setImage] = useState('');
    const [imageId, setImageId] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();

    const chooseImage = () => {
        fileInput.current.click();
    }

 

    const onSelectFile = async (event) => {
        const toastId = toast.loading("Please wait...")
        const file = event.target.files[0]
        if (file) {
            let response = await actionImageUpload(file, accessToken);
            response = await response.json();

            if (response.status) {
                setImageId(response.image_id)
                toast.success(response.message, {
                    id: toastId
                });

                const reader = new FileReader()
                reader.onload = (e) => {
                    setImage(e.target.result)
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const fetchUser = async () => {
        setLoading(true);

        let url = `${API_URL}/admin-user`;
        let response = await actionFetchData(url, accessToken);
        response = await response.json();

        if (response.status) {
            setValue('user_id',response.data.id)
            setValue('first_name',response.data.first_name)
            setValue('last_name',response.data.last_name)
            setValue('name',response.data.name)
            setValue('email',response.data.email)
            setValue('phone',removeCountryCode(response.data.phone))
            
           // setUser(response.data)
            setImage(response.data.image_url)
            setLoading(false);
        }
    }

    // Update Offer
    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")
        let postObject = { ...data, imageId}

        try {
            let response = await actionPostData(`${API_URL}/users/${getValues('user_id')}`, accessToken, postObject, 'PUT');
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                //navigate('/users/all-users');
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })

    useEffect(() => {
        fetchUser();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <PageTitle
                title="Profile Setting"
                buttonLink="/change-password"
                buttonLabel="Change Password"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}
                            <form onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="mb-4">
                                    <label className="form-label">Full Name</label>
                                    <input
                                       {...register("name", {
                                        required: "Please enter name",
                                    })}
                                        className={`form-control custom-input ${errors.name && `is-invalid`}`}
                                        type="text"
                                        id="name"
                                        name='name'
                                        placeholder="Enter full name*"
                                    />
                                    <p className="invalid-feedback">{errors.name?.message}</p>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label">Email</label>
                                    <input
                                        {...register("email", {
                                            required: "Please enter email.",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: "Please enter valid email!"
                                            }
                                        })}
                                        className={`form-control custom-input ${errors.email && `is-invalid`}`}
                                        type="email"
                                        id="email"
                                        name='email'
                                        placeholder="Enter email address*"
                                    />
                                    <p className="invalid-feedback">{errors.email?.message}</p>
                                </div>
                                <div className="mb-4">
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
                                <div className="mb-4">
                                    <label className="form-label">Profile Image </label>
                                    <div
                                        className={`base-image-input`}
                                        style={{ width: "200px", height: "200px", borderRadius: "100px", backgroundImage: imageData ? `url(${imageData})` : '' }}
                                        onClick={chooseImage}>
                                        {!imageData &&
                                            <h6>Choose an Image</h6>
                                        }

                                        <input
                                            className={`d-none`}
                                            ref={fileInput}
                                            name="image"
                                            id="image"
                                            type="file"
                                            accept="image/*"
                                            onChange={onSelectFile}
                                        />
                                    </div>
                                </div>

                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Save Changes
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

export default ProfileSetting;