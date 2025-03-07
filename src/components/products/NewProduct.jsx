import { useCallback, useContext, useEffect, useRef, useState } from "react";
import LoadingButton from "../others/LoadingButton";
import AuthContext from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { useForm,Controller } from "react-hook-form";
import PageTitle from "../others/PageTitle";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { API_URL, configPermission, createSlug } from "../../config";
import toast from "react-hot-toast";
import { actionFetchData, actionImageUpload, actionPostData, translateText } from "../../actions/actions";
import { IoWarningOutline } from "react-icons/io5";


const NewProduct = () => {
    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef(null);
    const fileInput = useRef(null);
    const [imageData, setImage] = useState('');
    const [imageError, setImageError] = useState('');
    const [previewVideo, setPreviewVideo] = useState(null);

    const [sizes,setSize]  = useState([]);
    const [isLoading,setLoading] = useState(true);
    const [tabs,setTab] = useState({
        hindiTab:false,
        banglaTab:false,
        odiaTab:false,
        englishTab:true,
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        setValue,
        getValues,
        trigger,
        formState: {
            errors,
            isSubmitting,
            isSubmitted,
        }
    } = useForm({
        defaultValues: {
            description: "",
            instruction: ""
        }
    });

    const chooseImage = () => {
        fileInput.current.click();
    }


    const removeImage = (e) => {
        e.stopPropagation();
        setImage('')
    }

    const onSelectFile = useCallback(async (event) => {
        const toastId = toast.loading("Please wait...");
        const file = event.target.files[0];

        if (file) {
            try {
                const response = await actionImageUpload(file, accessToken);
                const data = await response.json();

                if (data.status) {
                    setValue('image',data.image_id);

                    //setImageId(prevData => prevData || data.image_id);

                    toast.success(data.message, { id: toastId });

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        setImage(e.target.result);
                    };
                    reader.readAsDataURL(file);
                } else {
                    toast.error("Upload failed.", { id: toastId });
                }
            } catch (error) {
                toast.error("An error occurred during upload.", { id: toastId });
            }
        } else {
            toast.error("No file selected.", { id: toastId });
        }
    }, [accessToken, actionImageUpload]);

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


    const copyContent = (lang) => {
        const name = getValues('name')
        const description = getValues('description')
        const instruction = getValues('instruction')

        if(lang === 'HI'){
          setValue('name_hi',name)
          setValue('description_hi',description)
          setValue('instruction_hi',instruction)
        }
        if(lang === 'BA'){
            setValue('name_ba',name)
            setValue('description_ba',description)
            setValue('instruction_ba',instruction)
        }
        if(lang === 'OD'){
            setValue('name_od',name)
            setValue('description_od',description)
            setValue('instruction_od',instruction)
        }
    }

    const translate = async (lang) => {
        switch(lang){
            case 'HI':
                if(getValues('name_hi')) {
                    const result =  await translateText(getValues('name_hi'),'hi')    
                    setValue('name_hi',result)    
                }
                if(getValues('description_hi')){
                    const result  =  await translateText(getValues('description_hi'),'hi')

                    setValue('description_hi',result)
                }
                if(getValues('instruction_hi')){
                    const result = await translateText(getValues('instruction_hi'),'hi')
                    setValue('instruction_hi',result)
                } 
            return;
            case 'BA' :
                if(getValues('name_ba')) {
                    const result =  await translateText(getValues('name_ba'),'bn')    
                    setValue('name_ba',result)

                }
                if(getValues('description_ba')){
                    const result  =  await translateText(getValues('description_ba'),'bn')
                    setValue('description_ba',result)
                }
                if(getValues('instruction_ba')){
                    const result = await translateText(getValues('instruction_ba'),'bn')
                    setValue('instruction_ba',result)
                } 
            return;

            case 'OD' :
                if(getValues('name_od')) {
                    const result =  await translateText(getValues('name_od'),'or')    
                    setValue('name_od',result)

                }
                if(getValues('description_od')){
                    const result  =  await translateText(getValues('description_od'),'or')
                    setValue('description_od',result)
                }
                if(getValues('instruction_od')){
                    const result = await translateText(getValues('instruction_od'),'or')
                    setValue('instruction_od',result)
                } 
            return;            
        } 
    }

    const handleTab = (activeTabName) => {
        if(activeTabName === 'EN'){
            setTab({
                hindiTab:false,
                banglaTab:false,
                odiaTab:false,
                englishTab:true,
            })
        }
        if(activeTabName === 'HI'){
            setTab({
                hindiTab:true,
                banglaTab:false,
                odiaTab:false,
                englishTab:false,
            })
        }
        if(activeTabName === 'BA'){
            setTab({
                hindiTab:false,
                banglaTab:true,
                odiaTab:false,
                englishTab:false,
            })
        }
        if(activeTabName === 'OD'){
            setTab({
                hindiTab:false,
                banglaTab:false,
                odiaTab:true,
                englishTab:false,
            })
        }      
    }

    const handleValidation = async () => {
        if (!getValues('image')) {
            setImageError('Please select image.')
        } else {
            setImageError('')
        }

        const isValid = await trigger();

        if (isValid) {
            console.log("No Validation errors", errors);
            handleTab('HI')
        } else {
          console.log("Validation errors", errors);
        }
    };


    // Create product
    const submitHandler = useCallback(async (data) => {
        const slug = slugRef.current.value;
        if (!getValues('image')) {
            setImageError('Please select image.')
            return;
        } else {
            setImageError('')
        }

        let postData = { ...data,slug };

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

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const fetchProductSize = async () => {

        let response = await actionFetchData(`${API_URL}/product/sizes`, accessToken);
        response = await response.json();
        if (response.status) {
            setSize(response.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        if(!hasPermission(configPermission.ADD_PRODUCT)){
            navigate('/403')
        }
        fetchProductSize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <PageTitle
                title="Add New Product"
                buttonLink="/products/all-products"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-12">
                    {isSubmitted && Object.keys(errors).length > 0 && (
                        <div className="alert alert-danger fade show d-flex align-items-center" role="alert">
                            <IoWarningOutline className="me-2" size={30} />
                            Please check the form carefully.
                        </div>
                    )}
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}
                            <ul className="nav nav-tabs" id="myTab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button 
                                        onClick={() => handleTab('EN')}
                                        className={`nav-link ${tabs.englishTab ? 'active' : ''}`} 
                                        id="english-tab"  
                                        type="button" 
                                        role="tab" 
                                        aria-controls="english-tab-pane" 
                                        aria-selected={tabs.hindiTab ? 'true':'false'}>English</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button 
                                        onClick={() => handleTab('HI')}
                                        className={`nav-link ${tabs.hindiTab ? 'active' : ''}`} 
                                        id="hindi-tab"  
                                        type="button" 
                                        role="tab" 
                                        aria-controls="hindi-tab-pane" 
                                        aria-selected={tabs.hindiTab ? 'true':'false'}>Hindi</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button 
                                        onClick={() => handleTab('BA')}
                                        className={`nav-link ${tabs.banglaTab ? 'active' : ''}`} 
                                        id="bangla-tab" 
                                        type="button" 
                                        role="tab" 
                                        aria-controls="bangla-tab-pane" 
                                        aria-selected={tabs.banglaTab ? 'true':'false'}>Bangla</button>
                                </li>

                                <li className="nav-item" role="presentation">
                                    <button 
                                        onClick={() => handleTab('OD')}
                                        className={`nav-link ${tabs.odiaTab ? 'active' : ''}`} 
                                        id="odia-tab" 
                                        type="button" 
                                        role="tab" 
                                        aria-controls="odia-tab-pane" 
                                        aria-selected={tabs.odiaTab ? 'true':'false'}>Odia</button>
                                </li>
                            </ul>
                            <form onSubmit={handleSubmit(submitHandler)} method="post" className="mt-4">
                                <div className="tab-content" id="myTabContent">
                                    {/* English */}
                                    <div className={`tab-pane fade ${tabs.englishTab ? 'show active' : ''}`} id="english-tab-pane" role="tabpanel">
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
                                                className={`form-control custom-input ${errors.name && `is-invalid`}`}
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
                                                className={`form-control custom-input`}
                                            />
                                        </div>

                                        <div className="mb-4">

                                            <label className="form-label">Packaging Size</label>
                                            {sizes.length > 0 && sizes.map((item) => {
                                                return (
                                                    <div className="form-check form-check-inline ms-2" key={item.id}>
                                                        <input
                                                            className={`form-check-input ${errors.sizes && 'is-invalid'}`}
                                                            type="checkbox"
                                                            id={`size-${item.id}`}
                                                            value={item.id}
                                                            {...register("sizes", { 
                                                                required: "At least one size must be selected." 
                                                            })}
                                                        />
                                                        <label className="form-check-label" htmlFor={`size-${item.id}`}>
                                                            {item.size_custom}{item.size_in}
                                                        </label>
                                                    </div>
                                                )
                                            })                                            
                                            }
                                            {errors.sizes && (
                                                <p className="invalid-feedback d-block">{errors.sizes.message}</p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                    <label className="form-label">Product Description</label>
                                                </div>                                               
                                            </div>

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
                                            <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                    <label className="form-label">Product Instruction</label>
                                                </div>                                               
                                            </div>

                                            <Controller
                                                name="instruction"
                                                control={control}
                                                defaultValue=""
                                                rules={{ required: "Instruction is required" }}
                                                render={({ field,fieldState}) => (
                                                    <div>
                                                        <ReactQuill
                                                            className={fieldState.error && 'error-editor'}
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            style={{ height: '350px', marginBottom: "45px",borderColor:"red" }}
                                                            modules={{
                                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                            }}
                                                        />
                                                        <div className="invalid-feedback d-block">{fieldState?.error?.message}</div>
                                                    </div>
                                                )}
                                            />

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

                                        <div>
                                            <button onClick={()=>handleValidation('hindiTab')} type="button" className="btn btn-primary" >Save & Next</button>
                                        </div>                                     
                                    </div>

                                    {/* Hindi */}
                                    <div className={`tab-pane fade ${tabs.hindiTab ? 'show active' : ''}`} id="hindi-tab-pane" role="tabpanel">
                                        <div className="d-flex justify-content-end">
                                            <button type="button" className="btn btn-primary me-2" onClick={() => copyContent('HI')}>Copy Content</button>
                                            <button type="button" className="btn btn-primary text-end" onClick={() => translate('HI')}>Translate</button>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">Product Name</label>
                                            <input
                                                {...register("name_hi", {                                                
                                                })}
                                                className={`form-control custom-input`}
                                                type="text"
                                                id="name_hi"
                                                name="name_hi"
                                                placeholder="Enter product name"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                    <label className="form-label">Product Description</label>
                                                </div>                                                
                                            </div>
                                                
                                            <Controller                                            
                                                name="description_hi"
                                                control={control}
                                                defaultValue=""
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <div>
                                                        <ReactQuill
                                                            placeholder="Enter description"
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            style={{ height: '350px', marginBottom: "60px" }}
                                                            modules={{
                                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                    <label className="form-label">Product Instruction</label>
                                                </div>                                               
                                            </div>

                                            <Controller
                                                name="instruction_hi"
                                                control={control}
                                                defaultValue=""
                                                rules={{ required: false }}
                                                render={({ field  }) => (
                                                    <div>
                                                        <ReactQuill
                                                            placeholder="Enter instruction"
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            style={{ height: '350px', marginBottom: "60px" }}
                                                            modules={{
                                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <button onClick={()=>handleTab('BA')} type="button" className="btn btn-primary" >Save & Next</button>
                                        </div>  
                                    </div>

                                    {/* Bangla */}
                                    <div className={`tab-pane fade ${tabs.banglaTab ? 'show active' : ''}`} id="bangla-tab-pane" role="tabpanel">
                                        <div className="d-flex justify-content-end">
                                            <button type="button" className="btn btn-primary me-2" onClick={() => copyContent('BA')}>Copy Content</button>
                                            <button type="button" className="btn btn-primary text-end" onClick={() => translate('BA')}>Translate</button>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">Product Name</label>
                                            <input
                                                {...register("name_ba", {                                                
                                                })}
                                                className={`form-control custom-input`}
                                                type="text"
                                                id="name_ba"
                                                name="name_ba"
                                                placeholder="Enter product name"
                                            />
                                        </div>                                    
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                    <label className="form-label">Product Description</label>
                                                </div>                                                
                                            </div>

                                            <Controller                                            
                                                name="description_ba"
                                                control={control}
                                                defaultValue=""
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <div>
                                                        <ReactQuill
                                                            placeholder="Enter description"
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            style={{ height: '350px', marginBottom: "60px" }}
                                                            modules={{
                                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                    <label className="form-label">Product Instruction</label>
                                                </div>                                               
                                            </div>

                                            <Controller
                                                name="instruction_ba"
                                                control={control}
                                                defaultValue=""
                                                rules={{ required: false }}
                                                render={({ field  }) => (
                                                    <div>
                                                        <ReactQuill
                                                            placeholder="Enter Instruction"
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            style={{ height: '350px', marginBottom: "60px" }}
                                                            modules={{
                                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <button onClick={()=>handleTab('OD')} type="button" className="btn btn-primary" >Save & Next</button>
                                        </div>
                                    </div>

                                    {/* Odia  */}
                                    <div className={`tab-pane fade ${tabs.odiaTab ? 'show active' : ''}`} id="odia-tab-pane" role="tabpanel">
                                        <div className="d-flex justify-content-end">
                                            <button type="button" className="btn btn-primary me-2" onClick={() => copyContent('OD')}>Copy Content</button>
                                            <button type="button" className="btn btn-primary text-end" onClick={() => translate('OD')}>Translate</button>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label">Product Name</label>
                                            <input
                                                {...register("name_od", {                                                
                                                })}
                                                className={`form-control custom-input`}
                                                type="text"
                                                id="name_od"
                                                name="name_od"
                                                placeholder="Enter product name"
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                    <label className="form-label">Product Description</label>
                                                </div>                                                
                                            </div>

                                            <Controller                                            
                                                name="description_od"
                                                control={control}
                                                defaultValue=""
                                                rules={{ required: false }}
                                                render={({ field }) => (
                                                    <div>
                                                        <ReactQuill
                                                            placeholder="Enter description"
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            style={{ height: '350px', marginBottom: "60px" }}
                                                            modules={{
                                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <div className="d-flex justify-content-between mb-3">
                                                <div>
                                                    <label className="form-label">Product Instruction</label>
                                                </div>                                               
                                            </div>

                                            <Controller
                                                name="instruction_od"
                                                control={control}
                                                defaultValue=""
                                                rules={{ required: false }}
                                                render={({ field  }) => (
                                                    <div>
                                                        <ReactQuill
                                                            placeholder="Enter instruction"
                                                            theme="snow"
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            onBlur={field.onBlur}
                                                            style={{ height: '350px', marginBottom: "60px" }}
                                                            modules={{
                                                                toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            />
                                        </div>

                                        <div>
                                            {isSubmitting ?
                                                <LoadingButton />
                                                :
                                                <button type="submit" className="btn  btn-primary large-btn">
                                                    Add Product
                                                </button>
                                            }
                                        </div>
                                    </div>
                                </div>                                
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewProduct;