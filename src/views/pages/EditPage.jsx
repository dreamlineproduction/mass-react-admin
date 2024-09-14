import { CButton, CCard, CCardBody, CCol, CForm, CFormCheck, CFormFloating, CFormInput } from '@coreui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Header from '../../components/form/Header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useForm } from 'react-hook-form';
import { actionFetchData } from '../../actions/actions';
import { API_URL, createSlug } from '../../config';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/auth';

const EditPage = () => {
    const params = useParams()
    const { Auth } =  useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const [isLoading,setLoading] = useState(true);

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
            setLoading(false);
            slugRef.current.value = data.data.slug;
        }
    }

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
                <CForm className="row g-3 needs-validation">
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
                            />
                        </div>
                    </CCol>


                    <CCol md="12">
                        <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="active"
                            label="Active" />
                        <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="inactive"
                            label="Inactive" />
                    </CCol>




                    <CCol xs="12">
                        <CButton color="primary" type="submit">Update Page</CButton>
                    </CCol>
                </CForm>
            </CCardBody>
    </CCard>
    );
};

export default EditPage;