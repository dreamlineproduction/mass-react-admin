import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useCallback, useContext, useEffect, useState } from "react";
import { API_URL, configPermission } from "../../config";
import AuthContext from "../../context/auth";
import toast from "react-hot-toast";
import { actionFetchData, actionPostData } from "../../actions/actions";
import { useForm } from "react-hook-form";
import LoadingButton from "../others/LoadingButton";

const EditShort = () => {
    const params = useParams()

    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const [caption,setCaption] = useState('')
    const [isLoading, setLoading] = useState(true);
    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();
    // Update Short
    const submitHandler = useCallback(async (data) => {
        try {
            const toastId = toast.loading("Please wait...")
            let response = await actionPostData(`${API_URL}/shorts/${params.id}`, accessToken, data, 'PUT');
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                navigate('/shorts/all-shorts');
            } else {
                toast.error('server error', {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })


    const fetchData = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/shorts/${params.id}`;

        let response = await actionFetchData(apiUrl, accessToken);
        let data = await response.json();

        if (data.status) {
            reset(data.data);
            setLoading(false);
            setCaption(data.data.caption)
        }
    }

    useEffect(() => {
        if(!hasPermission(configPermission.EDIT_SHORT)){
            navigate('/403')
        }
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div>
            <PageTitle 
                title={'Edit Shorts'}
                buttonLink={'/shorts/all-shorts'}
                buttonLabel={'Back to List'}
            />
            <div className="row">
				<div className="col-12 col-xl-8 col-md-8">
                    <form onSubmit={handleSubmit(submitHandler)} method="post">
						<div className="card">
							<div className="card-body">
                                {isLoading && <div className="cover-body"></div>}
								<div className="mb-4">
									<label className="form-label">Title*</label>
									<input
										{...register("title", {
											required: "Please enter title",
											maxLength: {
												value: 30,
												message: "Product Name must be at least 30 characters long!"
											}
										})}
										className={`form-control custom-input ${errors.title && `is-invalid`}`}
										type="text"
										id="title"
										name="title"
										placeholder="Enter short's title"
									/>
									<p className="invalid-feedback">{errors.title?.message}</p>
								</div>
								<div className="mb-4">
									<label className="form-label">Description</label>
									<textarea
										{...register("caption", {
											required: "Please enter description",
											maxLength: {
												value: 250,
												message: "Product Name must be at least 250 characters long!"
											}
										})}
										name='caption'
										id='caption'
										className={`form-control custom-input ${errors.caption && `is-invalid`}`}
										rows="2"
										placeholder="Enter short description"
										maxLength={250}
										onChange={(e) => setCaption(e.target.value)}
									></textarea>
									<p className="invalid-feedback">{errors.caption?.message}</p>

									<div className="text-end">
										{caption.length}/{250}
									</div>
								</div>
								
								<div className="mb-3">
									{isSubmitting ?
										<LoadingButton />
										:
										<button type="submit" className="btn  btn-primary large-btn">
											Update
										</button>
									}
								</div>
							</div>
						</div>
					</form>
				</div>
				
			</div>
        </div>
    );
};

export default EditShort;