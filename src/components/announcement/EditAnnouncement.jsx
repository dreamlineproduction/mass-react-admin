import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { API_URL, configPermission } from "../../config";
import AuthContext from "../../context/auth";
import toast from "react-hot-toast";
import { actionFetchData, actionImageUpload, actionPostData } from "../../actions/actions";
import { useForm } from "react-hook-form";
import LoadingButton from "../others/LoadingButton";


const EditAnnouncement = () => {

    const params = useParams()

    const { Auth,hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState(true);


    const [fileData, setFileData] = useState({
        imageUrl:"",
        type:"image"
    });

    const fileInput = useRef();
    const chooseImage = () => {
        fileInput.current.click();
    }

    const onSelectFile = async (event) => {
		const maxFileSizeMB = 5;
		const file = event.target.files[0]
		if (!file) return;

		const fileType = file.type;
		const fileSizeMB = file.size / (1024 * 1024); 
		const toastId = toast.loading("Validating file...");

		// Validate file size
		if (fileSizeMB > maxFileSizeMB) {
			toast.error(`File size must be less than ${maxFileSizeMB}MB`, {
			  id: toastId,
			});
			return;
		}

		// Validate file type && !fileType.startsWith("video/")
		if (!fileType.startsWith("image/")) {
			toast.error("The file must be an image.", {
			  id: toastId,
			});
			return;
		}

		if (fileType.startsWith("image/")) {
			const img = new Image();
			img.onload = async () => {
				const { width, height } = img;
				const maxWidth = 1920;
				const maxHeight = 1080; // 1080p
		  
				if (width > maxWidth || height > maxHeight) {
				  toast.error(
					`Image dimensions should not exceed ${maxWidth}x${maxHeight}px.`,
					{ id: toastId }
				  );
				  return;
				}
		  
				// Upload the validated image
				let response = await actionImageUpload(file, accessToken);
				response = await response.json();
				handleFileUploadResponse(response, toastId);
			};
			img.src = URL.createObjectURL(file);

		}			
	}

    const handleFileUploadResponse = (response, toastId) => {
		if (response.status) {
		  setValue("file_id", response.image_id || response.video_id);
		  toast.success(response.message, { id: toastId });
	  
		  setFileData({
			imageUrl: response.image_url,
			type: response.image_id ? "image" : "video",
			video: response.video || "",
		  });
		} else {
		  toast.error("Failed to upload file.", { id: toastId });
		}
	};

    const {
        register,
        handleSubmit,
        setValue,
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
            let response = await actionPostData(`${API_URL}/announcements/${params.id}`, accessToken, data, 'PUT');
            response = await response.json();

            if (response.status === 200) {
                toast.success(response.message, {
                    id: toastId
                });
                navigate('/announcements/all-announcement');
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
    })


    const fetchData = async () => {
        setLoading(true);
        let apiUrl = `${API_URL}/announcements/${params.id}`;

        let response = await actionFetchData(apiUrl, accessToken);
        response = await response.json();

        if (response.status === 200) {
            reset(response.data);
            setFileData({...fileData,imageUrl:response.data.image_url})            
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!hasPermission(configPermission.EDIT_ANNOUNCEMENT)){
            navigate('/403')
        }
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div>
            <PageTitle 
                title={'Edit Announcement'}
                buttonLink={'/announcements/all-announcements'}
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
										placeholder="Enter announcement title"
									/>
									<p className="invalid-feedback">{errors.title?.message}</p>
								</div>
								<div className="mb-4">
									<label className="form-label">Description</label>
									<textarea
										{...register("description", {
											required: "Please enter description",
											maxLength: {
												value: 250,
												message: "Product Name must be at least 250 characters long!"
											}
										})}
										name='description'
										id='description'
										className={`form-control custom-input`}
										rows="2"
										placeholder="Enter short description"
										maxLength={250}
									></textarea>
									<p className="invalid-feedback">{errors.description?.message}</p>									
								</div>
								
                                <div className="mb-4">
									<label className="form-label">Image</label>
									<div
										className={`base-image-input ${errors.file_id && `is-invalid`}`}
										style={{ backgroundImage: fileData.imageUrl ? `url(${fileData.imageUrl})` : '' }}
										onClick={chooseImage}>
										{!fileData.imageUrl &&
											<h6>Choose Image</h6>
										}

										<input
											{...register("file_id", {
												required: false,
												validate: {
												  validImage: (value) => {
													if (fileData.type !== "image") return "Only image files are allowed.";
													return true;
												  },
												},
											})}
											className={`d-none`}
											ref={fileInput}
											name="file"
											id="file"
											type="file"
											accept="image/*"
											onChange={onSelectFile}
										/>
										{fileData.imageUrl &&
											<button
												type='button'
												style={{ zIndex: 1 }}
												onClick={(e) => {
													e.stopPropagation();
													setFileData({
														imageUrl:"",
														video:"",
														type:"image"
													})
												}}
												className="btn btn-danger text-white remove-image-button">
												Remove
											</button>
										}

									</div>	
									{errors.file_id && <p className="invalid-feedback d-block">{errors.file_id.message}</p>}								
								</div>

								<div className="mb-3">
									{isSubmitting ?
										<LoadingButton />
										:
										<button type="submit" className="btn  btn-primary large-btn">
											Update Announcement
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

export default EditAnnouncement;