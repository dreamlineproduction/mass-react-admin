import { CButton, CCard, CCardBody, CCol, CForm, CFormCheck, CFormFloating, CFormInput } from '@coreui/react';
import React, { useContext, useEffect, useRef, useState,useCallback } from 'react';
import Header from '../../components/form/Header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { actionFetchData, actionPostData } from '../../actions/actions';
import { API_URL, createSlug } from '../../config';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/auth';
import toast from 'react-hot-toast';
import LoadingButton from '../../components/LoadingButton';

const EditPage = () => {
    const params = useParams()
    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const [isLoading,setLoading] = useState(true);
    const [description, setDescription] = useState('');



    const { 
        register, 
        handleSubmit, 
        reset,
        formState: { 
          errors,
          isSubmitting
        } 
    } = useForm();

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if(pastedText)  
            slugRef.current.value = createSlug(pastedText);
        else 
            slugRef.current.value = '';        
    };


    const fetchPage = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/pages/${params.id}`;
        let response = await actionFetchData(apiUrl,accessToken);
        let data     = await response.json();
        
        if(data.status){
            reset(data.data); 
            setDescription(data.data.description);
            setLoading(false);
            slugRef.current.value = data.data.slug;
        }
    }

    // Update Offer
    const submitHandler = useCallback(async (data) => {   
        const slug = slugRef.current.value;      
        let postObject = {...data,description,slug}
        const toastId = toast.loading("Please wait...")

        try{          
            let response =  await actionPostData(`${API_URL}/pages/${params.id}`,accessToken,postObject,'PUT');
            response    = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                reset();
                navigate('/pages/all-pages');
            } else {
                toast.error('server error', {
                    id: toastId
                });
            }                
        } catch(error){
            toast.error(error)
        }
    })

    useEffect(() => {
        fetchPage();
    },[])

    return (
        <CCard className="mb-5">
            <Header 
                title={'Edit Page'}
                url={'/pages/all-pages'}
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
                                id="title" 
                                name='title'
                                floatingLabel="Page Name"
                                placeholder="Enter page name*" 
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
                                floatingLabel="Page Slug" 
                                placeholder="Page Slug"
                                disabled
                                readOnly
                                ref={slugRef}
                            />
                        </CFormFloating>
                    </CCol>

                    <CCol md="12" className="editor">
                        <div>
                            <ReactQuill 
                                theme="snow" 
                                toolbar="essential"  
                                placeholder="Enter page content" 
                                style={{ height: '100%' }}
                                value={description}
                                onChange={setDescription}
                            />
                        </div>
                    </CCol>
                    <CCol xs="12">
                        {isSubmitting ? 
                            <LoadingButton />
                        :
                            <CButton color="primary" type="submit" >Update Page</CButton>
                        }
                    </CCol>
                </CForm>
            </CCardBody>
    </CCard>
    );
};

export default EditPage;