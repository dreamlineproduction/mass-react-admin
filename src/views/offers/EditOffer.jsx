import { CButton, CCard, CCardBody, CCol, CForm, CFormFloating, CFormInput, CFormSwitch, CFormTextarea } from "@coreui/react"
import Header from "../../components/form/Header";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { API_URL, createSlug } from "../../config";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../context/auth";
import { actionFetchData, actionImageUplaod, actionPostData } from "../../actions/actions";
import LoadingButton from "../../components/LoadingButton";

const EditOffer = () => {
    const params = useParams()
    const { Auth } =  useContext(AuthContext)
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
        watch,
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

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if(pastedText)  
            slugRef.current.value = createSlug(pastedText);
        else 
            slugRef.current.value = '';        
    };

      
    // Update Offer
    const submitHandler = useCallback(async (data) => {   
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
        fetchOffer();
    },[])
    return (
        <CCard className="mb-5">
            <Header
                title={'Edit New Offer'}
                url={'/offers/all-offers'}
            /> 
            <CCardBody>
                {isLoading && <div className="cover-body"></div>}    
                <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(submitHandler)}>
                    <CCol md="12">
                        <CFormFloating>
                            <CFormInput 
                                {...register("title", {
                                    required: "Please enter title",
                                    minLength: {
                                        value: 6,
                                        message: "Title must be at least 6 characters long!"
                                    }
                                })}
                                className={errors.title && 'is-invalid'} 
                                onKeyUp={(e) => handlePaste(e)}
                                type="text" 
                                name="title"
                                id="title" 
                                floatingLabel="Offer Title"
                                placeholder="Enter offer title*" 
                            />
                            <p className="invalid-feedback d-block">{errors.title?.message}</p>
                        </CFormFloating>
                    </CCol>



                    <CCol md="12">
                        <CFormFloating>
                            <CFormInput 
                                className={errors.slug && 'is-invalid'} 
                                type="text" 
                                name="slug"
                                id="slug" 
                                floatingLabel="Offer Slug" 
                                placeholder="Offer Slug"
                                disabled
                                readOnly
                                ref={slugRef}
                            />
                        </CFormFloating>
                    </CCol>
                    <CCol md="12">
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
                                floatingLabel="Product Description*" 
                               >

                               </CFormTextarea>
                               <p className="invalid-feedback d-block">{errors.description?.message}</p>
                        </CFormFloating>
                    </CCol>
                    <CCol md="12">
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

                    <CCol md="12">
                        <CFormSwitch 
                            {...register("is_home")}
                            className={errors.description && 'is-invalid'} 
                            label="Enabled in home screen" 
                            id="is_home" 
                            name="is_home"
                            value={1}
                            defaultChecked={false}
                        />
                    </CCol>
                    <CCol xs="12">
                        {isSubmitting ? 
                            <LoadingButton />
                            :
                            <CButton color="primary" type="submit" >Update Offer</CButton>
                        }
                    </CCol>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default EditOffer;