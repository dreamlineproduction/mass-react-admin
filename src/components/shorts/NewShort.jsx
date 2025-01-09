import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import PageTitle from "../others/PageTitle";
import videoUrl from '../../assets/img/sample-video.mp4';
import './phoneframe.scss';
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { actionImageUpload, actionPostData, actionVideoUpload } from '../../actions/actions';
import AuthContext from '../../context/auth';
import { API_URL, configPermission } from '../../config';
import { useForm } from 'react-hook-form';
import LoadingButton from '../others/LoadingButton';

const NewShort = () => {
	const { Auth, hasPermission } = useContext(AuthContext)
	const accessToken = Auth('accessToken');
	const navigate = useNavigate();

	const [caption,setCaption] = useState('')
	const [fileData, setFileData] = useState({
		imageUrl:"",
		video:"",
		type:"image"
	});
	const [imageError, setImageError] = useState('');
	const fileInput = useRef();

	
	const chooseImage = () => {
		fileInput.current.click();
	}

	const onSelectFile = async (event) => {
		const file = event.target.files[0]
		if (file) {
			const fileType = file.type;
			const toastId = toast.loading("Please wait...")

			if (fileType.startsWith("image/")) {
				let response = await actionImageUpload(file, accessToken);
				response = await response.json();
				if (response.status) {
					setValue('file_id',response.image_id)
					toast.success(response.message, {
						id: toastId
					});
					setFileData({
						imageUrl:response.image_url,
						type:'image',
						video:'',
					})
					setImageError('')
				}
			} else if (fileType.startsWith("video/")) {
				let response = await actionVideoUpload(file, accessToken);
				response = await response.json();
				if (response.status) {
					setValue('file_id',response.video_id)
					toast.success(response.message, {
						id: toastId
					});

					setFileData({
						imageUrl:response.image_url,
						type:'video',
						video:response.video,
					})
					setImageError('')
				}
			} else {
				toast.error('The file is neither an image nor a video.', {
					id: toastId
				});
			}
		}
	}

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

	// Create Short
	const submitHandler = useCallback(async (data) => {
		if (!getValues('file_id')) {
			setImageError('Please select video or image file.')
			return;
		} else {
			setImageError('')
		}

		try {
			const toastId = toast.loading("Please wait...")
			let response = await actionPostData(`${API_URL}/shorts`, accessToken, data);
			response = await response.json();

			if (response.status) {
				toast.success(response.message, {
					id: toastId
				});
				reset();
				navigate('/shorts/all-shorts');
			} else {
				toast.error('server error', {
					id: toastId
				});
			}

		} catch (error) {
			toast.error(error)
		}	
		// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	
	useEffect(() => {
		if (!hasPermission(configPermission.ADD_SHORT)) {
			navigate('/403')
		}
	}, [])

	return (
		<div>
			<PageTitle
				title={"Create New Short"}
				buttonLink={"/shorts/all-shorts"}
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
								<div className="mb-4">
									<label className="form-label">Short Video/Image (Recommended Image Ratio 9:16)</label>
									<div
										className={`base-image-input`}
										style={{ backgroundImage: fileData.imageUrl ? `url(${fileData.imageUrl})` : '', borderColor: imageError ? '#e55353' : '' }}
										onClick={chooseImage}>
										{!fileData.imageUrl &&
											<h6>Choose Video/Image</h6>
										}

										<input
											className={`d-none`}
											ref={fileInput}
											name="file"
											id="file"
											type="file"
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
									{imageError &&
										<p className="invalid-feedback d-block">{imageError}</p>
									}
								</div>
								<div className="mb-3">
									{isSubmitting ?
										<LoadingButton />
										:
										<button type="submit" className="btn  btn-primary large-btn">
											Upload Short
										</button>
									}
								</div>
							</div>
						</div>
					</form>
				</div>
				<div className="col-12 col-xl-4 col-md-4">
					<div className="card">
						<div className="card-body">
							<div className="mb-4">
								<label className="form-label">Preview</label>
								<div className="short-preview">
									<div className="phone-frame">
										{fileData.type === 'image' &&
											<img style={{borderRadius:"10px"}} src={fileData.imageUrl ? fileData.imageUrl : 'https://placehold.co/360x640'} alt="" />
										}

										{fileData.type === 'video' &&
											<video className='w-100 h-100'controls poster={fileData.imageUrl} style={{ borderRadius: '20px'}}>
												<source src={fileData.video} type="video/mp4" />
													Your browser does not support the video tag.
											</video>
										}										
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewShort;
