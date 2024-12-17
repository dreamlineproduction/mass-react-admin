import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { useForm } from "react-hook-form";
import { API_URL } from "../../config";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { actionFetchData, actionPostData } from "../../actions/actions";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Pagination from "../others/Pagination";
import BsModal from "../others/BsModal";
import LoadingButton from "../others/LoadingButton";
import PageTitle from "../others/PageTitle";


const AllRedemptions = () => {

	const { Auth } = useContext(AuthContext)
	const perPage = 20;
	const accessToken = Auth('accessToken');

	const {
		register,
		handleSubmit,
		reset,
		formState: {
			errors,
			isSubmitting
		}
	} = useForm();

	const {
		register: registerForm2,
		handleSubmit: handleSubmitForm2,
		reset: reset2,
		formState: {
			errors: errors2,
			isSubmitting: isSubmitting2
		}
	} = useForm();


	const [singleOrder, setSingleOrder] = useState(null);

	const [orders, setOrder] = useState([])
	const [manageUI, setManageUI] = useState({
		showDispatchedModel: false,
		showDeclinedModel: false,
		showDeclinedReasonModel: false,
		showViewDispatchedModel: false,
		id: 0,
		order_id: 0,
	})

	const [pageNumber, setPageNumber] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const [isLoading, setLoading] = useState(true);

	// Fetch data
	const fetchOrder = async () => {
		try {
			setLoading(true); // Loading on
			let response = await actionFetchData(`${API_URL}/orders?page=${pageNumber}&perPage=${perPage}`, accessToken);
			response = await response.json();
			if (response.status) {
				setOrder(response.data.data);
				setPageCount(response.totalPage);
			}
			setLoading(false);
		} catch (error) {
			toast.error(error)
		}
	}

	const updateOrderStatus = async (id, postData) => {

		const toastId = toast.loading("Please wait...")
		let findedIndex = orders.findIndex(item => item.id === id);

		try {
			let response = await actionPostData(`${API_URL}/orders/change-status`, accessToken, postData);
			response = await response.json();

			if (response.status) {
				orders[findedIndex].order.status = postData.status;
				setOrder([...orders]);
				toast.success(response.message, {
					id: toastId
				});

			}
		} catch (error) {
			toast.error(error)
		}
	}

	// Change Status
	const changeStatus = (id, order_id) => {
		Swal.fire({
			title: "Deliver Confirmation",
			text: "Are you sure you want to delivered this?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, Deliver it!"
		}).then((result) => {
			if (result.isConfirmed) {
				// Status 3 Delivered 
				let postObject = { status: 3, order_id }
				updateOrderStatus(id, postObject);
			}
		});


	}


	// Create Offer
	const submitHandler = useCallback(async (data) => {
		let postObject = {
			...data,
			status: 2,
			order_id: singleOrder.id,
		};

		await updateOrderStatus(singleOrder.id, postObject);

		setTimeout(() => {			
			window.location.reload();
		}, 1000);
	})


	const submitHandler2 = useCallback(async (data) => {
		let postObject = {
			...data,
			status: 4,
			order_id: manageUI.order_id,
		};

		await updateOrderStatus(manageUI.id, postObject);
				
		setTimeout(() => {			
			window.location.reload();
		}, 1000);
	})


	useEffect(() => {
		fetchOrder();
	}, [pageNumber])

	//console.log(singleOrder.order);
	return (
		<div>
			<PageTitle title="All Redemptions" />
			<div className="row">
				<div className="col-12">
					<div className="card">  									
					{isLoading &&
						<Loading />
					}
					{!isLoading && orders.length === 0 &&
						<NoState
							message="No orders found."
						/>
					}

					{orders.length > 0 &&
						<table className="table table-striped table-hover mb-0">
							<thead>
								<tr>
									<th> ID</th>
									<th>Item Name</th>
									<th>XP Deducted</th>
									<th>User Name</th>
									<th>Requested On</th>
									<th>Status</th>
									<th>Updated On</th>
									<th>Change Status</th>
								</tr>
							</thead>
							<tbody>
							{
								orders.map((item) => {
									return (
										<tr key={item.id}>													
											<td>{item.order_id}</td>
											<td>
												{item.reward.title}
											</td>
											<td>{item.xp_value || 0}XP</td>
											<td>{item?.user?.name ? item.user.name : 'N/A'}</td>
											<td>{item?.order?.order_date ? item.order.order_date : 'N/A'}</td>
											<td>
												{item?.order?.status === 1 &&
													<span className="badge bg-warning">Pending</span>
												}
												{item?.order?.status === 2 &&
													<span className="badge bg-primary">In transit</span>
												}
												{item?.order?.status === 3 &&
													<span className="badge bg-success">Delivered</span>
												}
												{item?.order?.status === 4 &&
													<span className="badge bg-danger">Declined</span>
												}

											</td>
											<td>
												{item?.order?.updated_at ? item.order.updated_at : 'N/A'}
												{
													item.order.status
												}
											</td>
											<td>
												{item.order.status === 1 &&
													<div className="dropdown">
														<button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
															More Options
														</button>
														<ul className="dropdown-menu">
															<li>
																<button
																	type="button"
																	data-bs-toggle="modal" 
																	data-bs-target="#dispatchModal"
																	onClick={() => {
																		setSingleOrder(item)
																		reset()
																		
																	}
																	}
																	className="dropdown-item">
																	Dispatched
																</button>
																<button
																	onClick={() => changeStatus(item.id, item.order_id)}
																	type="button"
																	className="dropdown-item">
																	Delivered
																</button>
																<button
																	data-bs-toggle="modal" 
																	data-bs-target="#declineReasonModal"
																	style={{ color: "#e55353", }}
																	type="button"
																	onClick={() => {
																		reset2()
																		setSingleOrder(item)																		
																	}
																	}
																	className="dropdown-item">
																	Declined
																</button>
															</li>
															
														</ul>
													</div>															
												}

												{item.order.status === 2 &&
													<div className="dropdown">
														<button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
															More Options
														</button>
														<ul className="dropdown-menu">
															<li>
															<button
																onClick={() => changeStatus(item.id, item.order_id)}
																type="button"
																className="dropdown-item">
																Delivered
															</button>
															<button
																data-bs-toggle="modal" 
																data-bs-target="#viewTrackingModal"
																onClick={() =>  setSingleOrder(item) }
																type="button"
																className="dropdown-item">
																View Tracking
															</button>
															</li>
															
														</ul>
													</div>															
												}

												{item.order.status === 4 &&
													<div className="dropdown">
													<button className="btn btn-dark dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
														More Options
													</button>
													<ul className="dropdown-menu">
														<li>
															<button		
																data-bs-toggle="modal" 
																data-bs-target="#viewDeclineReasonModal"
																onClick={() => setSingleOrder(item)}
																type="button"
																className="dropdown-item">
																View Decline Reason
															</button>
														</li>															
													</ul>
												</div>
													
												}
												{item.order.status === 3 &&
													<button className="btn btn-secondary disabled" disabled>More Options</button>
												}
											</td>
										</tr>
									)
								})

							}
						</tbody>
						</table>
					}
				</div>

				{orders.length > 0 &&
					<div className='d-flex  align-items-start justify-content-end'>
						<Pagination
							pageCount={pageCount}
							handlePageChange={(event) => setPageNumber(event.selected + 1)}
						/>
					</div>
				}
			</div>

			{/* Modals */}
			
			{/* Dispatch Modal */}
			<BsModal
				modalId="dispatchModal"
				title={singleOrder?.reward?.short_title}
				size="md"
			>
				<form onSubmit={handleSubmit(submitHandler)}>
					<div className="mb-3">
						<label htmlFor="tracking_partner" className="form-label">Tracking Number</label>
						<input 
							{...register("tracking_number", {
								required: "Please enter tracking number",
							})}
							className={`form-control ${errors.tracking_number && 'is-invalid'}`}
							type="text"
							id="tracking_number"
							name="tracking_number"
							label="Tracking Number"
							placeholder="Enter tracking number"
						/>
						<p className="invalid-feedback">{errors.tracking_number?.message}</p>
					</div>
					<div className="mb-3">
						<label htmlFor="delivery_partner" className="form-label">Delivery Partner</label>
						<input 
							{...register("delivery_partner", {
								required: "Please enter tracking partner name",
							})}
							className={`form-control ${errors.delivery_partner && 'is-invalid'}`}
							type="text"
							id="delivery_partner"
							name="delivery_partner"
							label="Tracking Partner"
							placeholder="Enter tracking partner name"
						/>
						<p className="invalid-feedback">{errors.tracking_number?.message}</p>
					</div>
					<div className="mb-3">
						<label htmlFor="tracking_url" className="form-label">Tracking Url</label>
						<input 
							{...register("tracking_url", {
								required: "Please enter tracking url",
							})}
							className={`form-control ${errors.tracking_url && 'is-invalid'}`}
							type="text"
							id="tracking_url"
							name="tracking_url"
							label="Tracking Url"
							placeholder="Enter tracking url"
						/>
						<p className="invalid-feedback">{errors.tracking_number?.message}</p>
					</div>
					<div className="d-flex justify-content-start">
						{isSubmitting ?
							<LoadingButton />
							:
							<button type="submit" className="btn btn-primary large-btn">Submit</button>
						}
					</div>
				</form>
			</BsModal>

			{/* View Tracking Modal */}
			<BsModal
				modalId="viewTrackingModal"
				title={singleOrder?.reward?.short_title}
				size="md"
			>
					<div className="mb-3">
						<label htmlFor="tracking_partner" className="form-label">Tracking Number</label>
						<input 
							disabled
							defaultValue={singleOrder?.order?.tracking_number}
							className={`form-control disabled`}
							type="text"							
							placeholder="Enter tracking number"
							readOnly
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="delivery_partner" className="form-label">Delivery Partner</label>
						<input 
							disabled
							defaultValue={singleOrder?.order?.delivery_partner}
							className={`form-control disabled`}
							type="text"							
							placeholder="Enter delivery partner name"
							readOnly
						/>
					</div>
					<div className="mb-3">
						<label htmlFor="tracking_url" className="form-label">Tracking Url <small>(if any)</small></label>
						<input 
							disabled
							defaultValue={singleOrder?.order?.tracking_url}
							className={`form-control disabled`}
							type="text"							
							placeholder="Not Provided"
							readOnly
						/>
						
					</div>
					
			</BsModal>

			{/* Decline Reason Modal */}
			<BsModal
				modalId="declineReasonModal"
				title={'Declined Order'}
				size="md"
			>
				<table className="table table-striped table-hover mb-0 border">
					{singleOrder && (
						<tbody>
						<tr>
							<th scope="row">Order Number:</th>
							<td>{singleOrder.order_id}</td>
						</tr>
						<tr>
							<th scope="row">Item:</th>
							<td>{singleOrder.reward.title}</td>
						</tr>
						<tr>
							<th scope="row">Customer Name:</th>
							<td>{singleOrder.user.name}</td>
						</tr>
						<tr>
							<th scope="row">Requested On:</th>
							<td>{singleOrder.order.order_date}</td>
						</tr>
						</tbody>
					)}
					</table>
					<form onSubmit={handleSubmitForm2(submitHandler2)}>
						<div className="mb-3">
							<label htmlFor="decline_reason" className="form-label">Decline Reason</label>
							<textarea 
								{...registerForm2("decline_reason", {
									required: "Please enter reason",
								})}
								className={`form-control ${errors2.decline_reason && 'is-invalid'}`}
								id="decline_reason"
								name="decline_reason"
								label="Reason"
								rows={5}
							/>
							<small>Enter the reason why you are declining this order.</small>
							<p className="invalid-feedback">{errors2.decline_reason?.message}</p>
						</div>
					<div 
						className="d-flex justify-content-start">
						{isSubmitting2 ?
							<LoadingButton />
							:
							<button type="submit" className="btn btn-primary large-btn">Submit</button>
						}
					</div>
				</form>
			</BsModal>

			{/* View Decline Reason Modal */}
			<BsModal
				modalId="viewDeclineReasonModal"
				title={'View Decline Reason'}
				size="md"
			>
				<table className="table table-striped table-hover mb-0 border">
					{singleOrder && (
						<tbody>
						<tr>
							<th scope="row">Order Number:</th>
							<td>{singleOrder.order_id}</td>
						</tr>
						<tr>
							<th scope="row">Item:</th>
							<td>{singleOrder.reward.title}</td>
						</tr>
						<tr>
							<th scope="row">Customer Name:</th>
							<td>{singleOrder.user.name}</td>
						</tr>
						<tr>
							<th scope="row">Requested On:</th>
							<td>{singleOrder.order.order_date}</td>
						</tr>
						</tbody>
					)}
					</table>
						<div className="mb-3">
							<label htmlFor="decline_reason" className="form-label">Decline Reason</label>
							<textarea 
								disabled
								defaultValue={singleOrder?.order?.decline_reason}
								className={`form-control disabled`}
								rows={5}
							/>
						</div>
			</BsModal>
        	</div>
		</div>
	);
};

export default AllRedemptions;