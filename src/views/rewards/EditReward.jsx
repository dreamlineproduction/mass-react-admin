import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFloating, CFormInput, CFormTextarea } from "@coreui/react"
import Header from "../../components/form/Header";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import AuthContext from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, createSlug } from "../../config";
import { useForm } from "react-hook-form";
import { actionFetchData, actionImageUplaod, actionPostData } from "../../actions/actions";
import LoadingButton from "../../components/LoadingButton";

const EditReward = () => {
    const params = useParams()

    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const fileInput = useRef();
    const [isLoading,setLoading] = useState(true);
    const [imageData,setImage] = useState('');
    const [imageId,setImageId] = useState(null);

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

    // Update product
    const submitHandler = useCallback(async (data) => {           
        const toastId = toast.loading("Please wait...")
        
        const slug = slugRef.current.value;
        const postObject =  {...data,image:imageId,slug};

        try{
            let response =  await actionPostData(`${API_URL}/rewards/${params.id}`,accessToken,postObject,'PUT');
            response    = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
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

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if(pastedText)  
            slugRef.current.value = createSlug(pastedText);
        else 
            slugRef.current.value = '';        
    };

    const fetchData = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/rewards/${params.id}`;

        let response = await actionFetchData(apiUrl,accessToken);
        let data     = await response.json();
        
        if(data.status){
            reset(data.data); 
            slugRef.current.value = data.data.slug;
            setImage(data.data.image_url)   
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData()
    },[])
    return (
        <CCard className="mb-5">
                <Header 
                    title={'Edit Reward'}
                    url={'/rewards/all-rewards'}
                />            
                <CCardBody>
                    {isLoading && <div className="cover-body"></div>}    
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
                                    onKeyUp={(e) => handlePaste(e)}
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
                                    type="text" 
                                    id="slug" 
                                    name="slug"
                                    ref={slugRef}
                                    floatingLabel="Reward Slug" 
                                    placeholder="Reward Slug"
                                />
                                <p className="invalid-feedback d-block">{errors.slug?.message}</p>
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
                        {isSubmitting ? 
                            <LoadingButton />
                            :
                            <CButton color="primary" type="submit" >Update Reward</CButton>
                        }
                        </CCol>
                    </CForm>
                </CCardBody>
        </CCard>
    );
};

export default EditReward;