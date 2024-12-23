import { useCallback, useContext, useEffect, useRef, useState } from "react";
import LoadingButton from "../others/LoadingButton";
import AuthContext from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import PageTitle from "../others/PageTitle";
import { API_URL, createSlug } from "../../config";
import toast from "react-hot-toast";
import { actionFetchData, actionImageUpload, actionPostData } from "../../actions/actions";


const EditReward = () => {
    const params = useParams()

    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const fileInput = useRef();
    const [isLoading, setLoading] = useState(true);
    const [imageData, setImage] = useState('');
    const [imageId, setImageId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
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

    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")

        const slug = slugRef.current.value;
        const postObject = { ...data, image: imageId, slug };

        try {
            let response = await actionPostData(`${API_URL}/rewards/${params.id}`, accessToken, postObject, 'PUT');
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                navigate('/rewards/all-rewards');
            } else {
                toast.error('server error', {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if (pastedText)
            slugRef.current.value = createSlug(pastedText);
        else
            slugRef.current.value = '';
    };

    const fetchData = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/rewards/${params.id}`;

        let response = await actionFetchData(apiUrl, accessToken);
        let data = await response.json();

        if (data.status) {
            reset(data.data);
            slugRef.current.value = data.data.slug;
            setImage(data.data.image_url)
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <PageTitle
                title="Edit Reward"
                buttonLink="/rewards/all-rewards"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}
                            <form onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="mb-4">
                                    <label className="form-label">Reward Title</label>
                                    <input
                                        {...register("title", {
                                        required: "Please enter reward title.",
                                        minLength: {
                                            value: 6,
                                            message: "Reward Title Name must be at least 6 characters long!"
                                        }
                                        })}
                                        className={`form-control custom-input ${errors.title && `is-invalid`}`}
                                        type="text"
                                        id="title"
                                        name="title"
                                        onKeyUp={handlePaste}
                                        placeholder="Enter reward title*"                                        
                                    />
                                    <p className="invalid-feedback">{errors.title?.message}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Reward Slug</label>
                                    <input
                                        readOnly
                                        disabled
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        placeholder="Reward Slug"
                                        ref={slugRef}
                                        className={`form-control custom-input`}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Reward Description</label>
                                        <textarea 
                                            {...register("description", {
                                                required: "Please enter description",
                                            })}
                                            className={`form-control custom-input ${errors.description && `is-invalid`}`}
                                            placeholder="Reward description"
                                            rows={8} 
                                            style={{ resize:"none"}} 
                                            id="description"
                                            name="description"
                                        >

                                        </textarea>
                                        <p className="invalid-feedback d-block">{errors.description?.message}</p>
                                </div>

                               
                                <div className="mb-4">
                                    <label className="mb-3">Reward Image* <small>(Recommended Size 500 X 500 Pixel)</small></label>
                                    <div
                                        className={`base-image-input`}
                                        style={{ backgroundImage: imageData ? `url(${imageData})` : '' }}
                                        >
                                        <button className="btn btn-secondary remove-image-button" type="button" onClick={chooseImage}>
                                            Replace Image
                                        </button>
                                        {!imageData &&
                                            <>
                                                <h6>Choose an Image</h6>                                            
                                            </>
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
                                
                                <div className="mb-4">
                                    <label className="form-label">XP Required <small>(Numeric Value)*</small></label>
                                    <input
                                        {...register("xp_value", {
                                            required: "Please enter XP",
                                        })}
                                        className={`form-control custom-input ${errors.xp_value && `is-invalid`}`}
                                        type="number"
                                        id="xp_value"
                                        name="xp_value"
                                        placeholder="XP Required"                                     
                                    />
                                    <p className="invalid-feedback">{errors.xp_value?.message}</p>
                                </div>

                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Update Reward
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

export default EditReward;