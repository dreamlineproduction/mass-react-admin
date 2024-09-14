import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFloating, CFormInput, CFormTextarea } from "@coreui/react"
import Header from "../../components/form/Header";
import { useCallback, useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import AuthContext from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { API_URL, createSlug } from "../../config";
import { useForm } from "react-hook-form";
import { actionImageUplaod, actionPostData } from "../../actions/actions";

const NewReward = () => {
    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const fileInput = useRef();
    const [imageData,setImage] = useState('');
    const [imageId,setImageId] = useState(null);
    const [imageError,setImageError] = useState('');

    const { 
        register, 
        handleSubmit, 
        reset,
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

    // Create Reward
    const submitHandler = useCallback(async (data) => {    
        const slug = slugRef.current.value;
       

        if(imageId === null){
            setImageError('Please select image.')
            return;
        }  

        let postObject = {...data,image:imageId,slug};

        const toastId = toast.loading("Please wait...")
        try{
            let response =  await actionPostData(`${API_URL}/rewards`,accessToken,postObject);
            response    = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                reset();
                navigate('/rewards/all-rewards');
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
                    title={'Add New Reward'}
                    url={'/rewards/all-rewards'}
                />            
                <CCardBody>
                    <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(submitHandler)}>
                        <CCol md="12">
                            <CFormFloating>
                                <CFormInput 
                                    {...register("title", {
                                        required: "Please enter title.",
                                        minLength: {
                                        value: 6,
                                        message: "Product Name must be at least 6 characters long!"
                                        }
                                    })}
                                    className={errors.title && 'is-invalid'} 
                                    type="text" 
                                    id="title" 
                                    name="title"
                                    onKeyUp={handlePaste}
                                    floatingLabel="Reward Title"
                                    placeholder="Enter reward title*" 
                                />
                                <p className="invalid-feedback d-block">{errors.title?.message}</p>
                            </CFormFloating>
                        </CCol>


                        <CCol md="12">
                            <CFormFloating>
                                <CFormInput  
                                    readOnly
                                    disabled                                    
                                    ref={slugRef}
                                    type="text" 
                                    id="slug" 
                                    name="slug"
                                    floatingLabel="Reward Slug" 
                                    placeholder="Reward Slug"
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
                                    placeholder="Reward description" 
                                    id="description"
                                    name="description"
                                    floatingLabel="Reward Description*" 
                                    style={{height:"200px"}}>

                                </CFormTextarea>
                                <p className="invalid-feedback d-block">{errors.description?.message}</p>
                            </CFormFloating>
                        </CCol>


                        <CCol md="12">
                            <label className="mb-3">Reward Image* <small>(Recommended Size 1000 X 454 Pixel)</small></label>
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
                            <CFormFloating>
                                <CFormInput 
                                    {...register("xp_value", {
                                        required: "Please enter XP",                                
                                    })}
                                    className={errors.xp_value && 'is-invalid'} 
                                    type="number" 
                                    id="xp_value" 
                                    name="xp_value"
                                    floatingLabel="XP Required (Numeric Value)*"
                                    placeholder="XP Required"  
                                />
                                <p className="invalid-feedback d-block">{errors.xp_value?.message}</p>
                            </CFormFloating>
                        </CCol>
                        <CCol xs="12">
                            <CButton color="primary" type="submit">Create Reward</CButton>
                        </CCol>
                    </CForm>
                </CCardBody>
        </CCard>
    );
};

export default NewReward;