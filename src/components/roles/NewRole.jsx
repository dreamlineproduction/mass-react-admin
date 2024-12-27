import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import PageTitle from "../others/PageTitle";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";
import { actionFetchData, actionPostData } from "../../actions/actions";
import LoadingButton from "../others/LoadingButton";
import Select from "react-select";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

const NewRole = () => {
  const { Auth } = useContext(AuthContext);
  const accessToken = Auth("accessToken");
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(true);
  const [permissions, setPermission] = useState([]);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const submitHandler = async (data) => {
   const toastId = toast.loading("Please wait...")
  
    const postData = {
        name: data.name,
        permissions: JSON.stringify(data.permissions)
    }

    try {
        let response = await actionPostData(`${API_URL}/roles`, accessToken, postData);
        response = await response.json();

        if (response.status === 200) {
            toast.success(response.message, {
                id: toastId
            });                
            navigate('/roles/all-role');
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
  let finalUrl = `${API_URL}/permissions?page=${1}&perPage=${1000}`;
  const fetchData = async () => {
    setLoading(true);

    let response = await actionFetchData(finalUrl, accessToken);
    response = await response.json();
    if (response.status) {
      const permissionList = response.data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        };
      });
      setPermission(permissionList);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PageTitle
        title="Add New Role"
        buttonLink="/roles/all-role"
        buttonLabel="Back to List"
      />
      <div className="row">
        <div className="col-12 col-xl-8">
          <div className="card">
            <div className="card-body">
              {isLoading && <div className="cover-body"></div>}
              <form onSubmit={handleSubmit(submitHandler)} method="post">
                <div className="mb-4">
                  <label className="form-label">Name</label>
                  <input
                    {...register("name", {
                      required: "Please enter role name.",
                      minLength: {
                        value: 3,
                        message:
                          "Role name must be at least 3 characters long!",
                      },
                    })}
                    className={`form-control custom-input ${
                      errors.name && `is-invalid`
                    }`}
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter role name*"
                  />
                  <p className="invalid-feedback">{errors.name?.message}</p>
                </div>

                <div className="mb-4">
                  <label className="form-label">Permissions</label>
                  <Controller
                    name="permissions"
                    control={control}
                    defaultValue={[]} 
                    rules={{
                      required: "Please select at least one permission",
                    }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={permissions}
                        placeholder="Select permission"
                        isMulti
                        onChange={(selected) => field.onChange(selected)} 
                        value={field.value} 
                        className={`react-select-container ${
                            errors.permissions ? "is-invalid-select" : ""
                        }`}
                        classNamePrefix="react-select"
                      />
                    )}
                  />
                  <p className="invalid-feedback d-block">{errors.permissions?.message}</p>
                </div>

                {isSubmitting ? (
                  <LoadingButton />
                ) : (
                  <button type="submit" className="btn  btn-primary large-btn">
                    Add Role
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRole;
