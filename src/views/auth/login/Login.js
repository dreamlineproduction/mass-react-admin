import React, { useCallback, useContext, useEffect, useRef } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormCheck,
    CFormInput,
    CImage,
    CInputGroup,
    CInputGroupText,
    CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import toast, { Toaster } from "react-hot-toast";
import { cilLockLocked, cilUser, cilLockUnlocked } from '@coreui/icons'
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from 'react-router-dom';

import AuthContext from '../../../context/auth';
import { API_URL } from '../../../config';

const Login = () => {
    const { AuthCheck, login } = useContext(AuthContext)
    const navigate = useNavigate()
    const location = useLocation()
    const passwordInputRef = useRef();
    const redirectPath = location.state?.path || '/dashboard';

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting
        } } = useForm({
            defaultValues: {
                email: 'admin@admin.com',
            }
        });

    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")
        try{
            await fetch(`${API_URL}/login`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(data),
            })
            .then(res => res.json())
            .then(response => {
                if (response.status) {
                    toast.success('Logged in ', {
                        id: toastId
                    });
    
                    let userInfo = {
                        accessToken: response.token,
                        name: response.data.name,
                        userId: response.data.id
                    }
    
                    localStorage.setItem('user-info', JSON.stringify(userInfo));
                    login(userInfo)
                    reset();
                    navigate(redirectPath, { replace: true });
                } else {
                    toast.error(response.message, {
                        id: toastId
                    });
                }
            })
            .catch((e) =>
                toast.error(e)
            )
        } catch(error){
            toast.error(error)
        }
        
    })

    const showPassword = () => {
        if (passwordInputRef.current.type === 'text') {
            passwordInputRef.current.type = 'password';
        } else {
            passwordInputRef.current.type = 'text';
        }
    }

    useEffect(() => {
        if (AuthCheck()) {
            navigate(redirectPath, { replace: true })
        }
    }, [])

    return (
        <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
            <div className="wrapper min-vh-100 d-flex flex-row align-items-center">
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                />
                <CContainer>
                    <CRow className="justify-content-center">
                        <CCol md="8">
                            <CCardGroup>
                                <CCard className="p-4">
                                    <CCardBody>
                                        <div className="text-center">
                                            <CImage fluid src="/images/logo.svg" width="100" className="mb-2" />
                                        </div>
                                        <CForm onSubmit={handleSubmit(submitHandler)}>
                                            <h1>Login</h1>
                                            <p className="text-body-secondary">Sign In to your account</p>
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>
                                                    <CIcon icon={cilUser} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    className={errors.email && 'is-invalid'}
                                                    {...register("email", {
                                                        required: "Please enter your email",
                                                        pattern: {
                                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                            message: "Please enter valid email!"
                                                        }
                                                    })}
                                                    type="email"
                                                    name='email'
                                                    id="email"
                                                    autoComplete='off'
                                                    floatingLabel="Email address"
                                                    placeholder="Enter email address"
                                                />
                                                <p className="invalid-feedback d-block">{errors.email?.message}</p>


                                            </CInputGroup>
                                            <CInputGroup className="mb-4">
                                                <CInputGroupText>
                                                    <CIcon icon={cilLockLocked} />
                                                </CInputGroupText>
                                                <CFormInput
                                                    {...register("password", {
                                                        required: "Please enter your Password",
                                                        minLength: {
                                                            value: 8,
                                                            message: "Password must be at least 8 characters long!"
                                                        }
                                                    })}
                                                    className={errors.password && 'is-invalid'}
                                                    type="password"
                                                    id="password"
                                                    name='password'
                                                    floatingLabel="Password"
                                                    autoComplete='off'
                                                    placeholder="Enter password"
                                                />
                                                <p className="invalid-feedback d-block">{errors.password?.message}</p>
                                            </CInputGroup>                                           
                                            <CRow>                                                
                                                <CCol xs="6">
                                                    <div className='d-grid'>
                                                    <CButton
                                                        color="primary"
                                                        disabled={isSubmitting}
                                                        type="submit" >
                                                            Login
                                                    </CButton>
                                                    </div>
                                                </CCol>
                                                <CCol xs="6" className="text-end">
                                                    <CButton color="link" className="px-0" type="submit">
                                                        Forgot password?
                                                    </CButton>
                                                </CCol>
                                            </CRow>
                                        </CForm>
                                    </CCardBody>
                                </CCard>
                            </CCardGroup>
                        </CCol>
                    </CRow>
                </CContainer>
            </div>
        </div>
    )
}

export default Login
