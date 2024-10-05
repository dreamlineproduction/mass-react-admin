import { CButton, CCard, CCardBody, CCol, CForm, CFormFloating, CFormInput, CFormSwitch, CFormTextarea } from "@coreui/react"
import Header from "../../components/form/Header";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { API_URL, createSlug } from "../../config";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/auth";
import { actionImageUplaod, actionPostData } from "../../actions/actions";
import LoadingButton from "../../components/LoadingButton";

const NewOffer = () => {
    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const fileInput = useRef();
    const slugRef = useRef();
    const [imageData,setImage] = useState('');
    const [imageId,setImageId] = useState(null);
    const [imageError,setImageError] = useState('');

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

    const removeImage = (e) => {    
        e.stopPropagation();    
        setImage('')
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

      
    // Create Offer
    const submitHandler = useCallback(async (data) => {   
        const slug = slugRef.current.value;
        if(imageId === null){
            setImageError('Please select image.')
            return;
        }  
        let postObject = {...data,image:imageId,slug}
        const toastId = toast.loading("Please wait...")

        try{          
            let response =  await actionPostData(`${API_URL}/offers`,accessToken,postObject);
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
   
    return (
        <CCard className="mb-5">
            <Header
                title={'Add New Offer'}
                url={'/offers/all-offers'}
            /> 
            <CCardBody>
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
                                placeholder="Offer description" 
                                id="description"
                                name="description"
                                style={{height:"400px"}}
                                floatingLabel="Offer Description*" 
                               >

                               </CFormTextarea>
                               <p className="invalid-feedback d-block">{errors.description?.message}</p>
                        </CFormFloating>
                    </CCol>
                    <CCol md="12">
                        <label className="mb-3">Offer Image* <small>(Recommended Size 580 X 340 Pixel)</small></label>
                        <div 
                        className={`base-image-input`}                             
                        style={{backgroundImage:imageData ? `url(${imageData})` : '',borderColor:imageError ? '#e55353' : ''}} 
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
                            {imageData &&
                                <button 
                                    onClick={removeImage}
                                    className="btn btn-danger text-white remove-image-button">
                                    RemoveImage
                                </button>
                            }                        
                        </div>
                        {imageError &&
                            <p className="invalid-feedback d-block">{imageError}</p>
                        }
                        
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
                            <CButton color="primary" type="submit" >Create Offer</CButton>
                        }
                    </CCol>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default NewOffer;