import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormFloating, CFormInput, CFormSelect } from "@coreui/react";
import Header from "../../components/form/Header";
import { actionFetchData, actionPostData } from "../../actions/actions";
import { useCallback, useContext, useEffect, useState } from "react";
import { API_URL } from "../../config";
import AuthContext from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";

const AllReferrals = () => {
    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const [products,setProduct] = useState([]);
    const [isLoading,setLoading] = useState(true);

    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { 
          errors,
          isSubmitting
        } 
    } = useForm();

    const submitHandler = useCallback(async (data) => {    
        const toastId = toast.loading("Please wait...")
        try{
            let response =  await actionPostData(`${API_URL}/qr-codes`,accessToken,data);
            response    = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                reset();
                navigate('/qr-manager/all-qr');
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }             
        } catch(error){
            toast.error(error)
        }
    })


    const fetchProduct = async () => {
        let finalUrl = `${API_URL}/products?page=${1}&perPage=${1000}`;
        let response = await actionFetchData(finalUrl,accessToken);
        response    = await response.json();
        if (response.status) {
            setProduct(response.data.data);
        }          
        setLoading(false)
    }

    console.log(products);
    useEffect(() => {
        fetchProduct();
    },[])
    return (
        <CCard className="mb-3">   
            <Header 
                title={'Add New Referrals'}
                url={'/referrals/all-referrals'}
            />                  
            <CCardBody>
            {isLoading && <div className="cover-body"></div>}    

            <CForm className="row g-3 needs-validation"  onSubmit={handleSubmit(submitHandler)}>
                <CCol md="4">
                    <CFormFloating>
                        <CFormSelect 
                            
                            className={errors.product_id && 'is-invalid'} 
                            id="product_id" 
                            name="product_id"
                            floatingLabel="Select User"
                            aria-label="Floating label select example">
                            <option value={''}>Select User</option>
                            <option value={''}>Select User</option>
                            <option value={''}>Select User</option>
                            <option value={''}>Select User</option>
                            <option value={''}>Select User</option>
                            
                        </CFormSelect>
                        
                    </CFormFloating>
                </CCol>

                <CCol md="4">
                    <CFormFloating>
                        <CFormInput 
                           
                            className={errors.quantity && 'is-invalid'} 
                            type="number" 
                            id="quantity" 
                            name="quantity"
                            floatingLabel="XP Percentage"
                            placeholder="XP Percentage" 
                        />
                        <p className="invalid-feedback d-block">{errors.quantity?.message}</p>
                    </CFormFloating>
                </CCol>
                <CCol md="4">
                    <CFormFloating>
                        <CFormInput 
                           
                            className={errors.xp_value && 'is-invalid'} 
                            type="text" 
                            id="xp_value" 
                            name="xp_value"
                            readOnly="true"
                            floatingLabel="Referral Code"
                            placeholder="Referral Code" 
                        />
                        <p className="invalid-feedback d-block">{errors.xp_value?.message}</p>
                    </CFormFloating>
                </CCol>

           

                <CCol md="4">
                    <CFormFloating>
                        {isSubmitting ? 
                            <LoadingButton />
                            :
                            <CButton color="primary" type="submit" >Generate Code</CButton>
                        }                       
                    </CFormFloating>
                </CCol>

            </CForm>
        </CCardBody>
    </CCard>
    );
};

export default AllReferrals;