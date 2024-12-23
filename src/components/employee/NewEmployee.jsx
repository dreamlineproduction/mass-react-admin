import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { API_URL } from "../../config";
import { actionFetchData, actionPostData } from "../../actions/actions";
import toast from "react-hot-toast";
import AuthContext from "../../context/auth";
import { useForm } from "react-hook-form";
import LoadingButton from "../others/LoadingButton";


const NewEmployee = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();
    const userAvtar = useRef(null);
    const [roles, setRole] = useState([])
    const [isLoading, setLoading] = useState(true);

   

    const createUserAvtar = (event) =>{
        let fullName = event.target.value
        if(fullName !== '') {
            const firstCharacter = fullName.charAt(0);
            const secondCharacterAfterSpace = fullName.split(' ').slice(1).map(word => word.charAt(0)).join('');
            userAvtar.current.innerHTML = (firstCharacter + secondCharacterAfterSpace).toUpperCase();
        } else {
            userAvtar.current.innerHTML = 'AV'
        }         
    }

    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting },
        setError,
    } = useForm();

    const submitHandler = async (data) => {
        const toastId = toast.loading("Please wait...")
       
        let postData = {...data,avtar_name:userAvtar.current.innerHTML};
     
         try {
             let response = await actionPostData(`${API_URL}/employees`, accessToken, postData);
             response = await response.json();
     
             if (response.status === 200) {
                 toast.success(response.message, {
                     id: toastId
                 });                
                 navigate('/employees/all-employee');
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

    // Fetch Data
    const fetchRoles = async () => {
        setLoading(true);

        let response = await actionFetchData(`${API_URL}/roles?page=${1}&perPage=${1000}`, accessToken);
        response = await response.json();
        if (response.status) {
            setRole(response.data.data);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchRoles();        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    
  return (
    <div>
        <PageTitle
            title="Add New Employee"
            buttonLink="/employees/all-employee"
            buttonLabel="Back to List"
        />
        <div className="row">
            <div className="col-12 col-xl-8">
                <div className="card">
                    <div className="card-body">
                    {isLoading && <div className="cover-body"></div>}
                        <form onSubmit={handleSubmit(submitHandler)} method="post">
                            <div className="mb-3">
                                <label className="form-label">Employee Avatar</label>
                                <div 
                                    style={{fontSize:"1.5em"}}
                                    ref={userAvtar}
                                    className="avatar-lg  d-flex justify-content-center align-items-center rounded-5 bg-primary text-white avatar-xl"
                                >
                                    AV
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    {...register("name", {
                                        required: "Please enter name",
                                        minLength: {
                                            value: 6,
                                            message: "Name must be at least 6 characters long!"
                                        }
                                    })}
                                    className={`form-control custom-input ${errors.name && `is-invalid`}` } 
                                    type="text"
                                    id="name"
                                    name="name"
                                    placeholder="Enter name*"
                                    onKeyUp={(e) => createUserAvtar(e)}
                                />
                                <p className="invalid-feedback">{errors.name?.message}</p>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input 
                                    {...register("email", {
                                        required: "Please enter email",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Please enter valid email!"
                                        }
                                    })}
                                    className={`form-control custom-input ${errors.email && `is-invalid`}` } 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    placeholder="Email Address" 
                                />
                                <p className="invalid-feedback">{errors.email?.message}</p>
                            </div>

                            <div className="mb-3">  
                                <label className="form-label">Phone Number</label>
                                <div className="input-group">
                                    <button className="btn btn-primary" type="button">+91</button>
                                    <input 
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
                                        className={`form-control remove-arrows custom-input ${errors.phone && `is-invalid`}` } 
                                        type="number" 
                                        id="phone" 
                                        name="phone"
                                        min={10}
                                        placeholder="Enter phone number" 
                                    />
                                    <p className="invalid-feedback">{errors.phone?.message}</p>
                                </div>
                            </div> 
                            <div className="mb-3">
                                <label className="form-label">Designation</label>
                                <input
                                    {...register("designation", {
                                        required: "Please enter designation",
                                        minLength: {
                                            value: 3,
                                            message: "Designation must be at least 3 characters long!"
                                        }
                                    })}
                                    className={`form-control custom-input ${errors.designation && `is-invalid`}` } 
                                    type="text"
                                    id="designation"
                                    name="designation"
                                    placeholder="Enter designation*"
                                />
                                <p className="invalid-feedback">{errors.designation?.message}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    {...register("address1", {
                                        required: false,
                                        minLength: {
                                            value: 10,
                                            message: "Address must be at least 10 characters long!"
                                        }
                                    })}
                                    className={`form-control custom-input ${errors.address1 && `is-invalid`}` } 
                                    type="text"
                                    id="address1"
                                    name="address1"
                                    placeholder="Enter address"    
                                />
                                <p className="invalid-feedback">{errors.address1?.message}</p>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Role</label>
                                <select 
                                    {...register("role_id", {
                                        required: "Please select role",
                                    })}
                                    className={`form-control custom-input ${errors.role && `is-invalid`}` } 
                                    defaultValue={''} 
                                    name="role_id" 
                                    id="role_id" 
                                    >
                                        <option value="" disabled>Select Role</option>
                                        {roles.map((role) => (
                                            <option key={`role-${role.id}`} value={role.id}>{role.name}</option>
                                        ))}                                        
                                </select>
                                <p className="invalid-feedback">{errors.role?.message}</p>
                            </div>
                            
                            {isSubmitting ?
                                <LoadingButton />
                                :
                                <button type="submit" className="btn  btn-primary large-btn">
                                    Add Employee
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

export default NewEmployee;
