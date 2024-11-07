import { CButton, CCard, CCardBody, CCardHeader, CCol, CForm, CFormCheck, CFormFloating, CFormInput } from '@coreui/react';
import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth';
import LoadingButton from '../components/LoadingButton';
import toast from 'react-hot-toast';
import { actionFetchData, actionImageUplaod, actionPostData } from '../actions/actions';
import { API_URL } from '../config';

const ProfileSetting = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');

    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fileInput = useRef();
    const [imageData, setImage] = useState('');
    const [imageId, setImageId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();

    const chooseImage = () => {
        fileInput.current.click();
    }

    // const removeImage = (e) => {
    //     e.stopPropagation();
    //     setImage('')
    // }

    const onSelectFile = async (event) => {
        const toastId = toast.loading("Please wait...")
        const file = event.target.files[0]
        if (file) {
            let response = await actionImageUplaod(file, accessToken);
            response = await response.json();

            if (response.status) {
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

    const fetchUser = async () => {
        setLoading(true);

        let url = `${API_URL}/admin-user`;
        let response = await actionFetchData(url, accessToken);
        response = await response.json();

        if (response.status) {
            reset({
                fullName: response.data.name,
                ...response.data
            });
            setUser(response.data)
            setImage(response.data.image_url)
            setLoading(false);
        }
    }

    // Update Offer
    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")
        let postObject = { ...data, imageId, fullName: data.name }

        try {
            let response = await actionPostData(`${API_URL}/users/${user.id}`, accessToken, postObject, 'PUT');
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                //navigate('/users/all-users');
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })

    useEffect(() => {
        fetchUser();
    }, [])

    return (
        <CCard className="mb-5">
            <CCardHeader>
                <div className="d-flex justify-content-between align-items-center py-2">
                    <div>
                        <strong>{'Profile Settings'}</strong>
                    </div>
                    <div>
                        <Link className="btn btn-dark" to={'/change-password'}>Change Password</Link>
                    </div>
                </div>
            </CCardHeader>
            <CCardBody>
                {isLoading && <div className="cover-body"></div>}

                <CForm className="row g-3 needs-validation" onSubmit={handleSubmit(submitHandler)}>
                    <CCol md="12">
                        <CFormFloating>
                            <CFormInput
                                {...register("name", {
                                    required: "Please enter name",
                                })}
                                className={errors.name && 'is-invalid'}
                                type="text"
                                id="name"
                                name='name'
                                floatingLabel="Full Name*"
                                placeholder="Enter full name*"
                            />
                            <p className="invalid-feedback d-block">{errors.name?.message}</p>
                        </CFormFloating>
                    </CCol>
                    <CCol md="12">
                        <CFormFloating>
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
                                name='email'
                                floatingLabel="Email Address*"
                                placeholder="Enter email address*"
                            />
                            <p className="invalid-feedback d-block">{errors.email?.message}</p>
                        </CFormFloating>
                    </CCol>

                    <CCol md="12">
                        <CFormFloating>
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
                                name='phone'
                                floatingLabel="Phone Number*"
                                placeholder="Enter Phone*"
                            />
                            <p className="invalid-feedback d-block">{errors.phone?.message}</p>
                        </CFormFloating>
                    </CCol>
                    <CCol md="12">
                        <label className="mb-3">Profile Image </label>
                        <div
                            className={`base-image-input`}
                            style={{ width: "200px", height: "200px", borderRadius: "100px", backgroundImage: imageData ? `url(${imageData})` : '' }}
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

                    <CCol xs="12">
                        {isSubmitting ?
                            <LoadingButton />
                            :
                            <CButton color="primary" type="submit" >Save Changes</CButton>
                        }
                    </CCol>
                </CForm>
            </CCardBody>
        </CCard>
    );
};

export default ProfileSetting;