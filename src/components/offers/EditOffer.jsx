import { useCallback, useContext, useEffect, useRef, useState } from "react";
import LoadingButton from "../others/LoadingButton";
import AuthContext from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import PageTitle from "../others/PageTitle";
import { API_URL, configPermission, createSlug } from "../../config";
import toast from "react-hot-toast";
import { actionFetchData, actionImageUpload, actionPostData } from "../../actions/actions";
import ReactQuill from "react-quill";

const EditOffer = () => {

    const params = useParams()
    const { Auth,hasPermission } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const fileInput = useRef();
    const slugRef = useRef();
    const [isLoading,setLoading] = useState(true);
    const [imageData,setImage] = useState('');
    const [imageId,setImageId] = useState(null);    

    const { 
        register, 
        handleSubmit, 
        reset,
        control,
        formState: { 
          errors,
          isSubmitting
        } 
    } = useForm();

    const chooseImage =  () => {
        fileInput.current.click();                
    }   

    const onSelectFile = async (event) => {
        const toastId = toast.loading("Please wait...")
        const file = event.target.files[0]
        if (file) {
            let response = await actionImageUpload(file,accessToken);
            response    = await response.json();
            if(response.status ){
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
        if(pastedText)  
            slugRef.current.value = createSlug(pastedText);
        else 
            slugRef.current.value = '';        
    };

      
    // Update Offer
    const submitHandler = useCallback(async (data) => {   
        if(data.is_home === false){
            data.is_home = null;
        }
        
        const slug = slugRef.current.value;      
        let postObject = {...data,image:imageId,slug}
        const toastId = toast.loading("Please wait...")

        try{          
            let response =  await actionPostData(`${API_URL}/offers/${params.id}`,accessToken,postObject,'PUT');
            response    = await response.json();

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
        } catch(error){
            toast.error(error)
        }
    })

    const fetchOffer = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/offers/${params.id}`;
        let response = await actionFetchData(apiUrl,accessToken);
        let data     = await response.json();
        
        if(data.status){
            reset(data.data); 
            setImage(data.data.image_url)   
            setLoading(false);

            slugRef.current.value = data.data.slug;
        }
    }

    useEffect(() => {
        if(!hasPermission(configPermission.EDIT_OFFER)){
            navigate('/403')
        }
        fetchOffer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])


    return (
        <div>
            <PageTitle
                title="Edit Offer"
                buttonLink="/offers/all-offers"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}    
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
                                    <Controller
                                        name="description"
                                        control={control}
                                        defaultValue=""
                                        rules={{ required: "Description is required" }}
                                        render={({ field,fieldState  }) => (
                                            <div>
                                                <ReactQuill
                                                    className={fieldState.error && 'error-editor'}
                                                    theme="snow"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    onBlur={field.onBlur}
                                                    style={{ height: '350px', marginBottom: "45px" }}
                                                    modules={{
                                                        toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                    }}
                                                />
                                                <p className="invalid-feedback d-block">{fieldState?.error?.message}</p>
                                            </div>
                                        )}
                                    />
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
                                    <label className="form-label">Show In Home</label>
                                    <div className="form-check form-switch">
                                        <input 
                                            {...register("is_home", {
                                                required: false,
                                            })}
                                            className="form-check-input" 
                                            type="checkbox" 
                                            role="switch" 
                                            id="" 
                                            value={1}
                                        />
                                    </div>
                                </div>



                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Update Offer
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

export default EditOffer;