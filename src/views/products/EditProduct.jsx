import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFloating, CFormInput, CFormTextarea } from "@coreui/react"
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom"
import { API_URL, createSlug } from "../../config";
import AuthContext from "../../context/auth";
import LoadingButton from "../../components/LoadingButton";
import Header from "../../components/form/Header";
import { actionFetchData, actionImageUplaod, actionPostData} from "../../actions/actions";

const EditProduct = () => {    
    const params = useParams()

    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const fileInput = useRef();
    const [isLoading,setLoading] = useState(true);
    const [imageData,setImage] = useState('');
    const [imageId,setImageId] = useState(null);
    const [previewVideo,setPreviewVideo] = useState(null);

    const { 
        register, 
        handleSubmit, 
        reset,
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
            let response = await actionImageUplaod(file,accessToken);
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


    const updateVideoPreview = (event,ytube = '') => {
        let  input = event.target.value
        
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
        const postObject =  {...data,image:imageId,slug};
        try{
            let response =  await actionPostData(`${API_URL}/products/${params.id}`,accessToken,postObject,'PUT');
            response    = await response.json();

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
        } catch(error){
            toast.error(error)
        }
    })

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if(pastedText)  
            slugRef.current.value = createSlug(pastedText);
        else 
            slugRef.current.value = '';        
    };

    const fetchProduct = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/products/${params.id}`;
        let response = await actionFetchData(apiUrl,accessToken);
        let data     = await response.json();
        
        if(data.status){
            reset(data.data);             
            setImage(data.data.image_url)   
            setLoading(false);
            if(data.data.video_url){
                youTubePreview(data.data.video_url)
            }           
            slugRef.current.value = data.data.slug;
        }
    }

    useEffect(() => {
        fetchProduct()
    },[])
    return (
        <CCard className="mb-5">
            <Header 
                title={'Edit Product'}
                url={'/products/all-products'}
            />           
        <CCardBody>
            {isLoading && <div className="cover-body"></div>}    
            <CForm className="row g-3" onSubmit={handleSubmit(submitHandler)}>
                <CCol md="6">
                    <CFormFloating>
                        <CFormInput 
                            {...register("name", {
                                required: "Please enter product name",
                                minLength: {
                                  value: 6,
                                  message: "Product Name must be at least 6 characters long!"
                                }
                            })}
                            onKeyUp={(e) =>handlePaste(e)}
                            className={errors.name && 'is-invalid'} 
                            type="text" 
                            id="name" 
                            name="name"
                            floatingLabel="Product Name"
                            placeholder="Enter product name*" 
                        />
                        <p className="invalid-feedback d-block">{errors.name?.message}</p>
                    </CFormFloating>
                </CCol>  
                <CCol md="6">
                    <CFormFloating>
                        <CFormInput 
                            {...register("unique_id", {
                                required: "Please enter product id"                                
                            })}
                            readOnly
                            disabled
                            className={errors.name && 'is-invalid'} 
                            type="text" 
                            id="unique_id" 
                            name="unique_id"
                            floatingLabel="Product Id"
                            placeholder="Enter product id*" 
                        />
                        <p className="invalid-feedback d-block">{errors.name?.message}</p>
                    </CFormFloating>
                </CCol>                

                <CCol md="12">
                    <CFormFloating>
                        <CFormInput                                                         
                            disabled
                            readOnly
                            type="text" 
                            id="slug" 
                            name="slug"
                            floatingLabel="Product Slug"
                            placeholder="Product Slug" 
                            ref={slugRef}
                        />
                    </CFormFloating>
                </CCol>
                <CCol md="6">
                    <CFormFloating>
                        <CFormTextarea 
                            {...register("description", {
                                required: "Please enter description",                                
                            })}
                            className={errors.description && 'is-invalid'} 
                            placeholder="Product description" 
                            id="description"
                            name="description"
                            style={{height:"400px"}}
                            floatingLabel="Product Description*">
                        </CFormTextarea>
                        <p className="invalid-feedback d-block">{errors.description?.message}</p>
                    </CFormFloating>
                </CCol>
                <CCol md="6">
                    <CFormFloating>
                        <CFormTextarea 
                            {...register("instruction", {
                                required: "Please enter description",                                
                            })}
                            className={errors.instruction && 'is-invalid'} 
                            placeholder="Instruction" 
                            id="instruction"
                            name="instruction"
                            style={{height:"400px"}}
                            floatingLabel="Product Instruction">                                
                        </CFormTextarea>
                        <p className="invalid-feedback d-block">{errors.instruction?.message}</p>
                    </CFormFloating>
                </CCol>

                <CCol md="6">
                    <label className="mb-3">Product Image* <small>(Recommended Size 580 X 340 Pixel)</small></label>
                    <div 
                    className={`base-image-input`}                             
                    style={{backgroundImage:imageData ? `url(${imageData})` : ''}} 
                    onClick={chooseImage}>
                        {!imageData &&
                            <h6>Choose an Image</h6>
                        }

                        <input                            
                            className={`file-input`}                             
                            ref={fileInput} 
                            name="image"
                            id="image"
                            type="file" 
                            accept="image/*" 
                            onChange={onSelectFile}
                        />                                          
                    </div>                   
                </CCol>

                <CCol md="6">
                    <CFormFloating>
                        <CFormInput     
                            {...register("video_url", {
                                required: "Please enter description",                                
                            })}                      
                            className={errors.video_url && 'is-invalid'} 
                            type="text" 
                            id="video_url" 
                            name="video_url"
                            onInput={updateVideoPreview}
                            onPaste={updateVideoPreview}
                            floatingLabel="Product Video Link (Only Youtube)"
                            placeholder="Product Video Link (Optional)"  
                        />
                        <p className="invalid-feedback d-block">{errors.video_url?.message}</p>
                    </CFormFloating>
                    {previewVideo &&
                        <div className="mt-3">
                            <div className="video-preview">
                                <iframe 
                                    src={`https://www.youtube.com/embed/${previewVideo}`}
                                 allowFullScreen={true}></iframe>
                            </div>
                        </div>
                    }    
                </CCol>
                <CCol xs="12">
                    {isSubmitting ? 
                        <LoadingButton />
                        :
                        <CButton color="primary" type="submit" >Update Product</CButton>
                    }
                </CCol>
            </CForm>
        </CCardBody>
        </CCard>
    );
};

export default EditProduct;