import { useCallback, useContext, useRef, useState } from "react";
import LoadingButton from "../others/LoadingButton";
import AuthContext from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import PageTitle from "../others/PageTitle";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { API_URL, createSlug } from "../../config";
import toast from "react-hot-toast";
import { actionImageUpload, actionPostData } from "../../actions/actions";


const NewProduct = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef(null);
    const fileInput = useRef(null);
    const [imageData, setImage] = useState('');
    const [imageId, setImageId] = useState(null);
    const [imageError, setImageError] = useState('');
    const [previewVideo, setPreviewVideo] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: {
        errors,
        isSubmitting,
        }
    } = useForm({
        defaultValues: {
        description: "",
        instruction:""
        }
    });

    const chooseImage = () => {
        fileInput.current.click();
    }

    const handleDescriptionChange = (value) => {
        setValue("description", value, { shouldValidate: true });
    };

    const handleInstructionChange = (value) => {
        setValue("instruction", value, { shouldValidate: true });
    };


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

    const updateVideoPreview = (event) => {
        const input = event.target.value
        const match = input.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
        if (match) {
            setPreviewVideo(match[1])
        } else {
            setPreviewVideo(null)
        }
    }

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if (pastedText)
            slugRef.current.value = createSlug(pastedText);
        else
            slugRef.current.value = '';
    };

    // Create product
    const submitHandler = useCallback(async (data) => {
        const slug = slugRef.current.value;
        if (imageId === null) {
            setImageError('Please select image.')
            return;
        }

        let postData = { ...data, image: imageId, slug };
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionPostData(`${API_URL}/products`, accessToken, postData);
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                id: toastId
                });
                reset();
                navigate('/products/all-products');
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
                title="Add New Product"
                buttonLink="/products/all-products"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">               
                        <div className="card-body">
                            <form  onSubmit={handleSubmit(submitHandler)} method="post">
                                
                                <div className="mb-4">
                                    <label className="form-label">Product Name</label>
                                    <input 
                                       {...register("name", {
                                            required: "Please enter product name",
                                            minLength: {
                                                value: 6,
                                                message: "Product Name must be at least 6 characters long!"
                                            }
                                       })}
                                        className={`form-control custom-input ${errors.name && `is-invalid`}` } 
                                        type="text"
                                        id="name"
                                        name="name"
                                        onKeyUp={handlePaste}
                                        placeholder="Enter product name*"
                                    />
                                    <p className="invalid-feedback">{errors.name?.message}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Product Slug</label>
                                    <input 
                                        readOnly
                                        disabled
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        placeholder="Product Slug"
                                        ref={slugRef}
                                        className={`form-control custom-input` } 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Product Description</label>
                                    <div style={{ height: '350px',marginBottom:"60px" }}> 
                                        <ReactQuill
                                            theme="snow"
                                            onChange={handleDescriptionChange}
                                            placeholder="Enter product description"
                                            style={{ height: '100%', }} 
                                            modules={{
                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label">Product Instruction</label>
                                    <div style={{ height: '350px',marginBottom:"60px" }}> 
                                        <ReactQuill
                                            theme="snow"
                                            onChange={handleInstructionChange}
                                            placeholder="Enter product instruction"
                                            style={{ height: '100%'}} 
                                            modules={{
                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="mb-3">Product Image* <small>(Recommended Size 500 X 500 Pixel)</small></label>
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
                                <div className="mb-4">
                                    <label className="form-label">Product Video Link <small>(Only Youtube)</small></label>
                                    <input 
                                         {...register("video_url")}
                                         className="form-control custom-input"
                                         type="text"
                                         id="video_url"
                                         name="video_url"
                                         onInput={updateVideoPreview}
                                         onPaste={updateVideoPreview}
                                         placeholder="Product Video Link (Only Youtube)"
                                    />
                                    {previewVideo &&
                                    <div className="mt-3">
                                        <div className="video-preview">
                                        <iframe
                                            width={"100%"}
                                            height={"100%"}
                                            src={`https://www.youtube.com/embed/${previewVideo}`}
                                            allowFullScreen={true}></iframe>
                                        </div>
                                    </div>
                                    }
                                </div>
                                
                                {isSubmitting ? 
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Add Product
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

export default NewProduct;