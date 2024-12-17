import { useCallback, useContext, useEffect, useRef, useState } from "react";
import LoadingButton from "../others/LoadingButton";
import AuthContext from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import PageTitle from "../others/PageTitle";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { API_URL, createSlug } from "../../config";
import toast from "react-hot-toast";
import { actionFetchData, actionImageUpload, actionPostData } from "../../actions/actions";

const EditProduct = () => {
    const params = useParams()

    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const fileInput = useRef();
    const [isLoading, setLoading] = useState(true);
    const [imageData, setImage] = useState('');
    const [imageId, setImageId] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        control,
        formState: {
        errors,
        isSubmitting
        }
    } = useForm();

    const chooseImage = async () => {
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


    const updateVideoPreview = (event, ytube = '') => {
        let input = event.target.value

        const match = input.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)

        if (match) {
        setPreviewVideo(match[1])
        } else {
        setPreviewVideo(null)
        }
    }

    const youTubePreview = (youtubeUrl) => {
        const match = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)

        if (match) {
        setPreviewVideo(match[1])
        } else {
        setPreviewVideo(null)
        }
    }

 

    // update product
    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")

        const slug = slugRef.current.value;
        const postObject = { ...data, image: imageId, slug };
        try {
        let response = await actionPostData(`${API_URL}/products/${params.id}`, accessToken, postObject, 'PUT');
        response = await response.json();

        if (response.status) {
            toast.success(response.message, {
            id: toastId
            });
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

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if (pastedText)
        slugRef.current.value = createSlug(pastedText);
        else
        slugRef.current.value = '';
    };

    const fetchProduct = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/products/${params.id}`;
        let response = await actionFetchData(apiUrl, accessToken);
        let data = await response.json();

        if (data.status) {
        reset(data.data);

        
        setImage(data.data.image_url)
        setLoading(false);
        if (data.data.video_url) {
            youTubePreview(data.data.video_url)
        }
        slugRef.current.value = data.data.slug;
        }
    }

    useEffect(() => {
        fetchProduct()
    }, [])


    return (
        <div>
            <PageTitle 
                title="Edit Product"
                buttonLink="/products/all-products"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">               
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}

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
                                    <label className="form-label">Product Id <small>(Unique Id)</small></label>
                                    <input 
                                    {...register("unique_id")}
                                      readOnly
                                      disabled
                                      className={`form-control custom-input` } 
                                      type="text"
                                      id="unique_id"
                                      name="unique_id"
                                      placeholder="Enter product id*"
                                    />
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
                                        <Controller
                                            name="description"
                                            control={control}
                                            rules={{ required: 'Description is required' }}
                                            render={({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                value={field.value || ''} 
                                                onChange={(content) => field.onChange(content)}
                                                placeholder="Enter product description"
                                                modules={{
                                                    toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                }}
                                                style={{ height: '100%', }} 
                                            />
                                            )}
                                        />    
                                    </div>
                                </div>
                                
                                <div className="mb-4">
                                    <label className="form-label">Product Instruction</label>
                                    <div style={{ height: '350px',marginBottom:"60px" }}> 
                                        <Controller
                                            name="instruction"
                                            control={control}
                                            rules={{ required: 'Instruction is required' }}
                                            render={({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                value={field.value || ''} 
                                                onChange={(content) => field.onChange(content)}
                                                placeholder="Enter product instruction"
                                                modules={{
                                                    toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                }}
                                                style={{ height: '100%', }} 
                                            />
                                            )}
                                        /> 
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="mb-3">Product Image* <small>(Recommended Size 500 X 500 Pixel)</small></label>
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
                                        Update Product
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

export default EditProduct;