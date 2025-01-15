import { useCallback, useContext, useEffect, useRef, useState } from "react";
import LoadingButton from "../others/LoadingButton";
import AuthContext from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import PageTitle from "../others/PageTitle";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { API_URL, configPermission, createSlug } from "../../config";
import toast from "react-hot-toast";
import { actionFetchData, actionImageUpload, actionPostData, translateText } from "../../actions/actions";

const EditProduct = () => {
    const params = useParams()

    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const fileInput = useRef();
    const [isLoading, setLoading] = useState(true);
    const [tabs,setTab] = useState({
        hindiTab:false,
        banglaTab:false,
        odiaTab:false,
        englishTab:true,
    });

    const [imageData, setImage] = useState('');
    const [previewVideo, setPreviewVideo] = useState(null);
    const [sizes,setSize]  = useState([]);
    const [productSizeIds,productSizeId]  = useState([]);

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        control,
        trigger,
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
            setValue('image',response.image_id)
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

    
    const translate = async (lang) => {
        switch(lang){
            case 'HI':
                if(getValues('name_hi')) {
                    const result =  await translateText(getValues('name_hi'),'hi')    
                    setValue('name_hi',result)    
                }
                if(getValues('description_hi')){
                    const result  =  await translateText(getValues('description_hi'),'hi')
                    console.log(result);

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
        

        const isValid = await trigger();

        if (isValid) {
            console.log("No Validation errors", errors);
            handleTab('HI')
        } else {
          console.log("Validation errors", errors);
        }
    };

    // update product
    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")

        const slug = slugRef.current.value;
        const postObject = { ...data, slug };
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

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

    const fetchProduct = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/products/${params.id}`;
        let response = await actionFetchData(apiUrl, accessToken);
        let data = await response.json();
        
        if (data.status) {
            reset(data.data);
            productSizeId(data.data.productSizeIds)
            
            
            setImage(data.data.image_url)
            setLoading(false);
            if (data.data.video_url) {
                youTubePreview(data.data.video_url)
            }
            slugRef.current.value = data.data.slug;

            fetchProductSize();
        }
    }

    const fetchProductSize = async () => {
        setLoading(true);   
        let response = await actionFetchData(`${API_URL}/product/sizes`, accessToken);
        response = await response.json();
        if (response.status) {
            setSize(response.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        if(!hasPermission(configPermission.EDIT_PRODUCT)){
            navigate('/403')
        }
        fetchProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <PageTitle 
                title="Edit Product"
                buttonLink="/products/all-products"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-12">
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
                            <form  onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="tab-content mt-4" id="myTabContent">
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

                                        <label className="form-label">Packaging Size</label>
                                        {sizes.length > 0 && sizes.map((item) => {
                                            return (
                                                <div className="form-check form-check-inline ms-2" key={item.id}>
                                                    <input
                                                        className={`form-check-input ${errors.sizes && 'is-invalid'}`}
                                                        type="checkbox"
                                                        defaultChecked={(productSizeIds && productSizeIds.includes(item.id)) ? 'checkded' : ''}
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
                                        <div>
                                            <button onClick={handleValidation} type="button" className="btn btn-primary" >Save & Next</button>
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
                                                placeholder="Enter product name*"
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
                                                    Update Product
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

export default EditProduct;