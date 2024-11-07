import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormCheck, CFormFloating, CFormInput } from '@coreui/react';
import React, { useContext,  useState, useCallback } from 'react';
import LoadingButton from '../components/LoadingButton';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { actionPostData } from '../actions/actions';
import { API_URL } from '../config';
import AuthContext from '../context/auth';

const ChangePassword = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const [isLoading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();

     // Update Offer
     const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")        

        try {
            let response = await actionPostData(`${API_URL}/admin-users/change-password`, accessToken, data);
            response = await response.json();
            reset();
            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });              
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })

    return (
        <CCard className="mb-5">
            <CCardHeader>
                <div className="d-flex justify-content-between align-items-center py-2">
                    <div>
                        <strong>{'Change Password'}</strong>
                    </div>
                   
                </div>
            </CCardHeader>
            <CCardBody>

                <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(submitHandler)}>
                    <CCol md="12">
                        <CFormFloating>
                            <CFormInput
                                {...register("current_password", {
                                    required: "Please enter current password.",   
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long!"
                                    }                                 
                                })}
                                className={errors.current_password && 'is-invalid'}
                                type="password"
                                id="current_password"
                                name='current_password'
                                floatingLabel="Current Password"
                                placeholder="Enter Current Password*"
                                autoComplete='off'
                            />
                            <p className="invalid-feedback d-block">{errors.current_password?.message}</p>
                        </CFormFloating>
                    </CCol>
                    <CCol md="12">
                        <CFormFloating>
                            <CFormInput
                                {...register("new_password", {
                                    required: "Please enter new password.",  
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long!"
                                    }                                  
                                })}
                                className={errors.new_password && 'is-invalid'}
                                type="password"
                                id="new_password"
                                name='new_password'
                                floatingLabel="New Password"
                                placeholder="Enter New Password*"
                                autoComplete='off'
                            />
                            <p className="invalid-feedback d-block">{errors.new_password?.message}</p>
                        </CFormFloating>
                    </CCol>
                    <CCol md="12">
                        <CFormFloating>
                            <CFormInput
                                {...register("confirm_password", {
                                    required: "Please enter confirm password.",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long!"
                                    },
                                    validate: (value) =>
                                        value === getValues("new_password") || 'Passwords do not match.',
                                    })}
                                className={errors.confirm_password && 'is-invalid'}
                                type="password"
                                id="confirm_password"
                                name='confirm_password'
                                floatingLabel="Confirm Password"
                                placeholder="Enter Confirm Password*"
                                autoComplete='off'
                            />
                            <p className="invalid-feedback d-block">{errors.confirm_password?.message}</p>
                        </CFormFloating>
                    </CCol>
                   
                   
                    <CCol xs="12">
                        {isSubmitting ?
                            <LoadingButton />
                            :
                            <CButton color="primary" type="submit" >Change Password</CButton>
                        }
                    </CCol>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default ChangePassword;