import React, { useContext, useEffect, useRef,useState,useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AuthContext from '../../context/auth';
import { Controller, useForm } from 'react-hook-form';
import { API_URL, createSlug } from '../../config';
import { actionFetchData, actionPostData } from '../../actions/actions';
import toast from 'react-hot-toast';
import PageTitle from '../others/PageTitle';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import LoadingButton from '../others/LoadingButton';

const EditPage = () => {
    const params = useParams()
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const slugRef = useRef();
    const [isLoading, setLoading] = useState(true);
    const [description, setDescription] = useState('');
    const [page, setPage] = useState('');

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();

    const handlePaste = (e) => {
        const pastedText = e.target.value;
        if (pastedText)
            slugRef.current.value = createSlug(pastedText);
        else
            slugRef.current.value = '';
    };


    const fetchPage = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/pages/${params.id}`;
        let response = await actionFetchData(apiUrl, accessToken);
        let data = await response.json();

        if (data.status) {
            reset(data.data);
            setDescription(data.data.description);
            setLoading(false);
            setPage(data.data)
            slugRef.current.value = data.data.slug;
        }
    }

    // Update Offer
    const submitHandler = useCallback(async (data) => {
        const slug = slugRef.current.value;
        let postObject = { ...data,  slug }
        const toastId = toast.loading("Please wait...")

        try {
            let response = await actionPostData(`${API_URL}/pages/${params.id}`, accessToken, postObject, 'PUT');
            response = await response.json();

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
        } catch (error) {
            toast.error(error)
        }
    })

   

    useEffect(() => {
        fetchPage();
    }, [])

    return (
        <div>
             <PageTitle 
                title="Edit Page"
                buttonLink="/pages/all-pages"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">               
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}
                            <form  onSubmit={handleSubmit(submitHandler)} method="post">
                                
                                <div className="mb-4">
                                    <label className="form-label">Page Name</label>
                                    <input 
                                       {...register("title", {
                                            required: "Please enter page name",
                                            minLength: {
                                                value: 6,
                                                message: "Page name must be at least 6 characters long!"
                                            }
                                        })}
                                        className={`form-control custom-input ${errors.title && `is-invalid`}` } 
                                        type="text"
                                        id="title"
                                        name='title'
                                        onKeyUp={handlePaste}
                                        placeholder="Enter page name*"
                                    />
                                    <p className="invalid-feedback">{errors.title?.message}</p>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Page Slug</label>
                                    <input 
                                        readOnly
                                        disabled
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        placeholder="Page Slug"
                                        ref={slugRef}
                                        className={`form-control custom-input` } 
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Page Description</label>
                                    <div style={{ height: '350px',marginBottom:"60px" }}> 
                                        <Controller
                                            name="description"
                                            control={control}
                                            rules={{ required: 'Description is required' }}
                                            render={({ field }) => (
                                            <ReactQuill
                                                {...field}
                                                value={field.value || ''} 
                                                onChange={(content) => field.onChange(content)}
                                                placeholder="Enter product description"
                                                modules={{
                                                    toolbar: [['bold', 'italic'], [{ 'list': 'ordered' }, { 'list': 'bullet' }]]
                                                }}
                                                style={{ height: '100%', }} 
                                            />
                                            )}
                                        />    
                                    </div>
                                </div>

                                <div className='mb-4'>
                                    <label className="form-label">Page Description</label>
                                    <select 
                                        {...register("status", {
                                            required: "Please select status",                                           
                                        })}
                                        defaultValue={page.status}
                                        className='form-select'
                                        name="status" 
                                        id="status">
                                        <option value="1">Active </option>
                                        <option value="0">Inactive</option>
                                    </select>
                                </div>                                                

                                {isSubmitting ? 
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Update Page
                                    </button>
                                }
                            </form>
                        </div>
                    </div>
                </div>           
            </div>
        </div> 
    );
};

export default EditPage;