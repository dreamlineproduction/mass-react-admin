import { useState, useEffect, useContext } from "react";
import PageTitle from "../others/PageTitle";
import AuthContext from "../../context/auth";
import toast from "react-hot-toast";
import { API_URL } from "../../config";
import { actionFetchData, actionPostData } from "../../actions/actions";
import { useForm } from "react-hook-form";
import LoadingButton from "../others/LoadingButton";
import { useNavigate } from "react-router-dom";

const MAX_BODY_LENGTH = 250; // Limit for Notification Description

const NewNotification = () => {
    const { Auth } = useContext(AuthContext);
    const accessToken = Auth("accessToken");
    const navigate = useNavigate();

    const [body, setBody] = useState("");
    const [tokens, setTokens] = useState([]);
    const [isLoading, setLoading] = useState(true);    

    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting },
        setValue,
        setError,
    } = useForm();

    const fetchTokens = async () => {
        setLoading(true);
        let response = await actionFetchData(`${API_URL}/get-user-tokens`,accessToken);
        response = await response.json();
        if (response.status === 200 && response.tokens.length > 0) {
            setTokens(response.tokens);
        }
        setLoading(false);
    };

    const submitHandler = async (data) => {
        const toastId = toast.loading("Please wait...")
       
        let postData = {...data,tokens};
        try {
             let response = await actionPostData(`${API_URL}/send-notification`, accessToken, postData);
             response = await response.json();
     
             if (response.status === 200) {
                 toast.success(response.message, {
                     id: toastId
                 });                
                 navigate('/notification/all-notifications');
             } 
     
             if(response.status === 422){
                 Object.keys(response.errors).forEach((field) => {
                     setError(field, {
                         type: "server",
                         message: response.errors[field],
                     });
                 });
                toast.dismiss(toastId);
             }
         } catch (error) {
             toast.error(error)
         }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const newText = body + pastedText;

        if (newText.length <= MAX_BODY_LENGTH) {
            setBody(newText);
            setValue("body", newText); // Sync with react-hook-form
        } else {
            setBody(newText.substring(0, MAX_BODY_LENGTH)); // Truncate if needed
            setValue("body", newText.substring(0, MAX_BODY_LENGTH));
        }
    };

    const handleChange = (e) => {
        if (e.target.value.length <= MAX_BODY_LENGTH) {
            setBody(e.target.value);
            setValue("body", e.target.value); // Sync with react-hook-form
        }
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    return (
        <div>
            <PageTitle title="New Notification" buttonLink="/notification/all-notifications" buttonLabel="Back To List" />

            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-header">
                            <strong>Create New Notification</strong>
                        </div>
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}
                            <form onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="mb-3">
                                    <label className="form-label">Notification Title</label>
                                    <input 
                                        {...register("title", {
                                            required: "Please enter title",                                            
                                        })}
                                        name="title"
                                        id="title"
                                        type="text" 
                                        className={`form-control custom-input ${errors.title && `is-invalid`}` } 
                                    />
                                    <p className="invalid-feedback">{errors?.title?.message}</p>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Notification Description</label>
                                    <textarea
                                        {...register("body", {
                                            required: "Please enter description",                                            
                                        })}
                                        rows="4"
                                        name="body"
                                        id="body"
                                        maxLength={MAX_BODY_LENGTH}
                                        className={`form-control ${errors.title && `is-invalid`}` } 
                                        onPaste={handlePaste}
                                        onChange={handleChange}
                                    />
                                   
                                    <p className="invalid-feedback mb-0">{errors?.body?.message}</p>
                                    <small className="text-muted text-end d-block w-100">
                                        {body.length}/{MAX_BODY_LENGTH} characters
                                    </small>
                                    
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Notification Name (Label)</label>
                                    <input 
                                        {...register("label", {
                                            required: false,                                            
                                        })}
                                        name="label"
                                        id="label"
                                        type="text" 
                                        className={`form-control custom-input ${errors.label && `is-invalid`}` } 
                                    />
                                    <p className="invalid-feedback">{errors?.label?.message}</p>
                                </div>

                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Send Notification
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

export default NewNotification;
