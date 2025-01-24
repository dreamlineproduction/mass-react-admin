import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import PageTitle from "../others/PageTitle";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { actionImageUpload, actionPostData, actionVideoUpload } from '../../actions/actions';
import AuthContext from '../../context/auth';
import { API_URL, configPermission } from '../../config';
import { useForm } from 'react-hook-form';
import LoadingButton from '../others/LoadingButton';

const NewAnnouncement = () => {
	const { Auth, hasPermission } = useContext(AuthContext)
	const accessToken = Auth('accessToken');
	const navigate = useNavigate();

	const [fileData, setFileData] = useState({
		imageUrl:"",
		video:"",
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

		if (fileType.startsWith("video/")) {
			// Upload the validated video
			let response = await actionVideoUpload(file, accessToken);
			response = await response.json();
			handleFileUploadResponse(response, toastId);
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
		reset,
		setValue,
		getValues,
		formState: {
			errors,
			isSubmitting,
		}
	} = useForm();

	// Create Announcement
	const submitHandler = useCallback(async (data) => {		

		try {
			const toastId = toast.loading("Please wait...")
			let response = await actionPostData(`${API_URL}/announcements`, accessToken, data);
			response = await response.json();

			if (response.status === 200) {
				toast.success(response.message, {
					id: toastId
				});
				reset();
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	
	useEffect(() => {
		if (!hasPermission(configPermission.ADD_ANNOUNCEMENT)) {
			navigate('/403')
		}
	}, [])

	return (
		<div>
			<PageTitle
				title={"Add New Announcement"}
				buttonLink={"/announcements/all-announcement"}
				buttonLabel={"Back to List"}
			/>
			<div className="row">
				<div className="col-12 col-xl-8 col-md-8">
					<form onSubmit={handleSubmit(submitHandler)} method="post" className="mt-4">
						<div className="card">
							<div className="card-body">
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
									<label className="form-label">Description*</label>
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
										className={`form-control custom-input ${errors.description && `is-invalid`}`}
										rows="2"
										placeholder="Enter description"
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
												required: "Please select an image file.",
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
											Add Announcement
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

export default NewAnnouncement;
