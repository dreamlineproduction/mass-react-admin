import { CAvatar, CButton, CCard, CCardBody, CCol, CForm, CFormFloating, CFormInput, CFormSelect } from "@coreui/react";
import Header from "../../components/form/Header";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../context/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import LoadingButton from "../../components/LoadingButton";
import { actionFetchData, actionFetchState, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";
import { API_URL } from "../../config";
import Loading from "../../components/Loading";

const EditUser = () => {
    const params = useParams();
    const defaultAvtar = 'AV';

    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');

    const userAvtar = useRef(null);
    const [states,setState] = useState([]);
    const [isLoading,setLoading] = useState(true);

    const navigate = useNavigate();

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

    
    const createUserAvtar = (event) =>{
        
        let fullName = event.target.value;
        if(fullName !== '') {
            const firstCharacter = fullName.charAt(0);
            const secondCharacterAfterSpace = fullName.split(' ').slice(1).map(word => word.charAt(0)).join('');
            userAvtar.current.innerHTML = (firstCharacter + secondCharacterAfterSpace).toUpperCase();
        } else {
            userAvtar.current.innerHTML = defaultAvtar;
        }         
    }
    
    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")
       
        try{
            let response =  await actionPostData(`${API_URL}/users/${params.id}`,accessToken,data,'PUT');
            response    = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                navigate('/users/all-users');
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }             
        } catch(error){
            toast.error(error)
        }
    })

    const fetchState = async() => {
        let response = await actionFetchState();
        let data        = await response.json();
        if(data.status){
            setState(data.data)
        }
    }

    const fetchUser = async () => {
        setLoading(true);
        
        let url = `${API_URL}/users/${params.id}`;
        let response = await actionFetchData(url,accessToken);
        response     = await response.json();

        if(response.status){
            reset({fullName:response.data.name, 
                ...response.data
            });            
            userAvtar.current.innerHTML = response.data.avtar_name;
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchState()
        fetchUser();        
    },[])

    return (
        <CCard>
                <Header 
                    title={'Edit User'}
                    url={'/users/all-users'}
                />                
                <CCardBody>
                    {isLoading && <div className="cover-body"></div>}                    
                    <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(submitHandler)}>
                        <CCol md="4">
                            <label className="d-block mb-2">User Avatar</label>
                            <CAvatar color="success text-white"  size="xl" ref={userAvtar}>{'AV'}</CAvatar>
                        </CCol>
                        
                        <CCol md="4">
                            <CFormInput
                                {...register("fullName", {
                                    required: "Please enter full name",
                                    minLength: {
                                      value: 6,
                                      message: "Full Name must be at least 6 characters long!"
                                    }
                                })}
                                className={errors.fullName && 'is-invalid'} 
                                type="text" 
                                name="fullName"
                                id="fullName" 
                                floatingLabel="Full Name" 
                                placeholder="Enter name"
                                onKeyUp={(e) => createUserAvtar(e)}
                            />
                            <p className="invalid-feedback d-block">{errors.fullName?.message}</p>
                        </CCol>
                        <CCol md="4">
                            <CFormInput 
                                 {...register("phone", {
                                    required: "Please enter phone number",
                                    minLength: {
                                      value: 10,
                                      message: "Phone number must be at least 10 characters long!"
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Phone number must be at least 10 characters long!"
                                    }
                                })}
                                className={errors.phone && 'is-invalid'} 
                                type="text" 
                                id="phone" 
                                name="phone"
                                floatingLabel="Phone Number"
                                placeholder="Enter phone number" 
                                readOnly
                            />
                            <p className="invalid-feedback d-block">{errors.phone?.message}</p>
                        </CCol>
                        <CCol md="4">
                            <CFormInput 
                                {...register("email", {
                                    required: "Please enter email.",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Please enter valid email!"
                                    }
                                })}
                                className={errors.email && 'is-invalid'} 
                                type="email" 
                                id="email" 
                                name="email"
                                floatingLabel="Email Address (optional)"
                                placeholder="Enter email" 
                                v-model="form.email"
                            />
                            <p className="invalid-feedback d-block">{errors.email?.message}</p>
                        </CCol>
                        <CCol md="4">
                            <CFormInput 
                                {...register("address1", {
                                    required: "Please enter address."                                    
                                })}
                                className={errors.address1 && 'is-invalid'} 
                                type="text" 
                                id="address1" 
                                name="address1"
                                floatingLabel="Address Line 1"
                                placeholder="Enter address" 
                            />
                            <p className="invalid-feedback d-block">{errors.address1?.message}</p>
                        </CCol>
                        <CCol md="4">
                            <CFormInput 
                                {...register("address2", {
                                    required: "Please enter address line 2."                                    
                                })}
                                className={errors.addressLine1 && 'is-invalid'} 
                                type="text" 
                                id="address2" 
                                name="address2"
                                floatingLabel="Address Line 2"
                                placeholder="Enter address line 2" 
                            />
                            <p className="invalid-feedback d-block">{errors.address2?.message}</p>
                        </CCol>
                        <CCol md="4">
                            <CFormInput    
                                {...register("city", {
                                    required: "Please enter city."                                    
                                })}  
                                className={errors.city && 'is-invalid'}                            
                                type="text" 
                                id="city" 
                                name="city" 
                                floatingLabel="City" 
                                placeholder="Enter city" 
                            />
                            <p className="invalid-feedback d-block">{errors.city?.message}</p>
                        </CCol>
                        <CCol md="4">
                            <CFormInput 
                                {...register("pincode", {
                                    required: "Please enter pin code."                                    
                                })}  
                                className={errors.pincode && 'is-invalid'}                                  
                                type="text" 
                                id="pincode"
                                name="pincode" 
                                floatingLabel="Pin Code" 
                                placeholder="Enter address" 
                            />
                            <p className="invalid-feedback d-block">{errors.pincode?.message}</p>
                        </CCol>
                        <CCol md="4">
                            <CFormInput     
                                {...register("near_location", {
                                    required: "Please enter near location."                                    
                                })}  
                                className={errors.near_location && 'is-invalid'}                              
                                type="text" 
                                id="near_location" 
                                name="near_location"
                                floatingLabel="Near Location"
                                placeholder="Enter landmark" 
                            />
                            <p className="invalid-feedback d-block">{errors.near_location?.message}</p>
                        </CCol>
                        <CCol md="4">
                            <CFormInput   
                                {...register("referral_code")}                                
                                type="text" 
                                name="referral_code"
                                id="referral_code" 
                                floatingLabel="Referral Code (if any)"
                                placeholder="Referral Code" 
                                readOnly
                            />                                
                        </CCol>
                        <CCol md="4">
                            <CFormFloating>
                                <CFormSelect 
                                    {...register("state", {
                                        required: "Please enter state."                                    
                                    })} 
                                    className={errors.state && 'is-invalid'}                       
                                    id="state" 
                                    name="state"
                                    floatingLabel="State" 
                                    aria-label="State">
                                    <option value="">Select State</option>
                                    {states.length > 0 &&
                                        states.map(state => {
                                            return ( <option key={state.id} value={state.id}>{state.name}</option>)
                                        })
                                    }
                                </CFormSelect>
                                <p className="invalid-feedback d-block">{errors.state?.message}</p>
                            </CFormFloating>
                        </CCol>
                        <CCol xs="12">
                            {isSubmitting ? 
                                <LoadingButton />
                                :
                                <CButton color="primary" type="submit" >Update User</CButton>
                            }
                        </CCol>
                    </CForm>                   
                  
                    <div>
                       Add new card bellow this card with all XP transactions and product details
                    </div>

                    <div>
                       Add new card bellow this card with all redeemed items details
                    </div>

                </CCardBody>
            </CCard>
            
    );
};

export default EditUser;