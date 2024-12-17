import { useCallback, useContext, useRef, useState } from "react";
import LoadingButton from "../others/LoadingButton";
import AuthContext from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import PageTitle from "../others/PageTitle";
import { API_URL, createSlug } from "../../config";
import toast from "react-hot-toast";
import { actionImageUpload, actionPostData } from "../../actions/actions";

const NewOffer = () => {

    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const fileInput = useRef();
    const slugRef = useRef();
    const [imageData, setImage] = useState('');
    const [imageId, setImageId] = useState(null);
    const [imageError, setImageError] = useState('');

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

    const removeImage = (e) => {
        e.stopPropagation();
        setImage('')
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

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if (pastedText)
            slugRef.current.value = createSlug(pastedText);
        else
            slugRef.current.value = '';
    };


    // Create Offer
    const submitHandler = useCallback(async (data) => {
        const slug = slugRef.current.value;
        if (imageId === null) {
            setImageError('Please select image.')
            return;
        }
        let postObject = { ...data, image: imageId, slug }
        const toastId = toast.loading("Please wait...")

        try {
            let response = await actionPostData(`${API_URL}/offers`, accessToken, postObject);
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                reset();
                navigate('/offers/all-offers');
            } else {
                toast.error('server error', {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })

    return (
        <div>
            <PageTitle
                title="Add New Offer"
                buttonLink="/offers/all-offers"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="mb-4">
                                    <label className="form-label">Offer Title</label>
                                    <input
                                        {...register("title", {
                                            required: "Please enter offer title.",
                                            minLength: {
                                                value: 6,
                                                message: "Offer title must be at least 6 characters long!"
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
                                    <label className="form-label">Offer Slug</label>
                                    <input
                                        readOnly
                                        disabled
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        placeholder="Offer Slug"
                                        ref={slugRef}
                                        className={`form-control custom-input`}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Offer Description</label>
                                    <textarea
                                        {...register("description", {
                                            required: "Please enter description",
                                        })}
                                        className={`form-control custom-input ${errors.description && `is-invalid`}`}
                                        placeholder="Offer description"
                                        rows={8}
                                        style={{ resize: "none" }}
                                        id="description"
                                        name="description"
                                    >

                                    </textarea>
                                    <p className="invalid-feedback d-block">{errors.description?.message}</p>
                                </div>


                                <div className="mb-4">
                                    <label className="mb-3">Offer Image* <small>(Recommended Size 500 X 500 Pixel)</small></label>
                                    <div
                                        className={`base-image-input`}
                                        style={{ backgroundImage: imageData ? `url(${imageData})` : '', borderColor: imageError ? '#e55353' : '' }}
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
                                        {imageData &&
                                            <button
                                                onClick={removeImage}
                                                className="btn btn-danger text-white remove-image-button">
                                                Remove Image
                                            </button>
                                        }

                                    </div>
                                    {imageError &&
                                        <p className="invalid-feedback d-block">{imageError}</p>
                                    }
                                </div>



                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Add Offer
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

export default NewOffer;