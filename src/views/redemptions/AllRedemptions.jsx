import { CButton, CCard, CCardBody, CCardHeader, CForm, CTable, CFormTextarea, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";
import { useContext, useEffect, useState,useCallback } from "react";
import AuthContext from "../../context/auth";
import { API_URL } from "../../config";
import Loading from "../../components/Loading";
import NoState from "../../components/NoState";
import Pagination from "../../components/Pagination";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { actionPostData } from "../../actions/actions";
import { useForm } from "react-hook-form";
import LoadingButton from "../../components/LoadingButton";

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
        register:registerForm2, 
        handleSubmit:handleSubmitForm2, 
        reset:reset2,
        formState: { 
          errors:errors2,
          isSubmitting:isSubmitting2
        } 
    } = useForm();


	const [singleOrder, setSingleOrder] = useState(null);

	const [orders, setOrder] = useState([])
	const [manageUI, setManageUI] = useState({
		showDispatchedModel: false,
		showDeclinedModel: false,
		showDeclinedReasonModel:false,
		showViewDispatchedModel: false,
		id:0,
		order_id:0,
	})

	const [pageNumber, setPageNumber] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const [isLoading, setLoading] = useState(true);

	// Fetch data
	const fetchOrder = async () => {
		try {
			setLoading(true); // Loading on
			await fetch(`${API_URL}/orders?page=${pageNumber}&perPage=${perPage}`, {
				headers: {
					"Content-Type": "application/json",
					'Authorization': `Bearer ${accessToken}`
				},
				method: "GET",
			})
				.then(res => res.json())
				.then(response => {
					setLoading(false); // Loading off
					if (response.status) {
						setOrder(response.data.data);
						setPageCount(response.totalPage);
					}
				})
				.catch((e) =>
					toast.error(e)
				)
		} catch (error) {
			toast.error(error)
		}
	}

	const updateOrderStatus = async (id,postData) => {

		const toastId = toast.loading("Please wait...")
        let findedIndex = orders.findIndex(item => item.id === id);

        try {
            let response = await actionPostData(`${API_URL}/orders/change-status`, accessToken,postData);
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
	const changeStatus =  (id,order_id) => {
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
				let postObject = {status:3,order_id}
                updateOrderStatus(id,postObject);
            }
        });

       
    }


	// Create Offer
    const submitHandler = useCallback(async (data) => {   
        let postObject = {...data,
			status:2,
			order_id:manageUI.order_id,
		};		

		await updateOrderStatus(manageUI.id,postObject);  
		
		setManageUI({...manageUI,
			showDispatchedModel:false,
			id:0,
			order_id:0
		});
		setSingleOrder(null);
    })


    const submitHandler2 = useCallback(async (data) => {   
        let postObject = {...data,
			status:4,
			order_id:manageUI.order_id,
		};		

		await updateOrderStatus(manageUI.id,postObject);  
		
		setManageUI({...manageUI,
			showDeclinedModel:false,
			id:0,
			order_id:0
		});
		setSingleOrder(null);
		
    })


	useEffect(() => {
		fetchOrder();
	}, [pageNumber])

	//console.log(singleOrder.order);
	return (
		<CCard>
			<CCardHeader>
				<div className="d-flex justify-content-between align-items-center">
					<div><strong>All Redemptions</strong></div>
				</div>
			</CCardHeader>
			<CCardBody>
				<div className="table-responsive">
					{isLoading && orders.length === 0 &&
						<Loading />
					}

					{orders.length > 0 &&
						<table className="table">
							<thead>
								<tr>
									<th>
										<CFormCheck id="flexCheckDefault" />
									</th>
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
												<td>
													<CFormCheck id="flexCheckDefault" />
												</td>
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
														<CDropdown >
															<CDropdownToggle  color="dark">More Options</CDropdownToggle>
															<CDropdownMenu>
																<button
																	type="button"
																	onClick={() => {
																		setSingleOrder(item)
																		reset()
																		setManageUI({ ...manageUI, 
																			showDispatchedModel: true,
																			id:item.id,
																			order_id:item.order_id 
																		})
																		}
																	} 
																	className="dropdown-item">
																	Dispatched
																</button>
																<button
																	onClick={()=> changeStatus(item.id,item.order_id)}
																	type="button"
																	className="dropdown-item">
																	Delivered
																</button>
																<button
																	style={{ color: "#e55353", }}
																	type="button"
																	onClick={() => {
																		reset2()
																		setSingleOrder(item)
																		setManageUI({ ...manageUI, 
																			showDeclinedModel: true,
																			id:item.id,
																			order_id:item.order_id  
																		})}
																	} 
																	className="dropdown-item">
																	Declined
																</button>
															</CDropdownMenu>
														</CDropdown>
													}

													{item.order.status === 2 &&
														<CDropdown >
															<CDropdownToggle  color="dark">More Options</CDropdownToggle>
															<CDropdownMenu>																
																<button
																	onClick={()=> changeStatus(item.id,item.order_id)}
																	type="button"
																	className="dropdown-item">
																	Delivered
																</button>
																<button
																	onClick={() => {
																		setSingleOrder(item)
																		setManageUI({ ...manageUI, 
																			showViewDispatchedModel:true
																		})}
																	} 
																	type="button"
																	className="dropdown-item">
																	View Tracking
																</button>																		
															</CDropdownMenu>															
														</CDropdown>
													}

													{item.order.status === 4 &&
														<CDropdown >
															<CDropdownToggle  color="dark">More Options</CDropdownToggle>
															<CDropdownMenu>																																
																<button
																	onClick={() => {
																		setSingleOrder(item)
																		setManageUI({ ...manageUI, 
																			showDeclinedReasonModel: true,
																		})}
																	} 
																	type="button"
																	className="dropdown-item">
																	View Decline Reason
																</button>																		
															</CDropdownMenu>															
														</CDropdown>
													}
													{item.order.status === 3  &&
														<CButton disabled type="button" color="dark">More Options</CButton>																										
													}
												</td>
											</tr>
										)
									})

								}
							</tbody>
						</table>
					}

					{isLoading === false && orders.length === 0 &&
						<NoState
							message="No User"
						/>
					}
				</div>

				{orders.length > 0 &&
					<div className='d-flex  align-items-start justify-content-end'>
						{/* <button className="btn btn-danger text-white" onClick={deleteSelectedItems} disabled={selectedItems.length === 0}>
							Delete Selected
						</button> */}
						<Pagination
							pageCount={pageCount}
							handlePageChange={(event) => setPageNumber(event.selected + 1)}
						/>
					</div>
				}
			</CCardBody>

			{/* Dispatch Modal */}
			<CModal
				backdrop="static"
				alignment="center"
				visible={manageUI.showDispatchedModel}
				onClose={() => {
					setSingleOrder(null);
					setManageUI({ ...manageUI, 
						showDispatchedModel: false,
						id:0,
						order_id:0 
					})
				}}
				aria-labelledby="DispatchedModelTitle"
			>
				<CForm className="sdas" onSubmit={handleSubmit(submitHandler)}>
				<CModalHeader>
					{singleOrder?.reward?.title &&
						<CModalTitle id="DispatchedModelTitle">Dispatch {singleOrder.reward.short_title} </CModalTitle>
					}
				</CModalHeader>
				<CModalBody>
					<div>
						<CFormInput 
							{...register("tracking_number", {
								required: "Please enter tracking number",								
							})}
							className={`${errors.tracking_number && 'is-invalid'}` } 
							type="text"
							id="tracking_number"
							name="tracking_number"
							label="Tracking Number"
							placeholder="Enter tracking number"
							aria-describedby="exampleFormControlInputHelpInline"
						/>
						<p className="invalid-feedback d-block">{errors.tracking_number?.message}</p>
						<CFormInput 
							{...register("delivery_partner", {
								required: "Please enter tracking partner name",								
							})}
							className={`${errors.delivery_partner && 'is-invalid'}` } 
							type="text"
							id="delivery_partner"
							name="delivery_partner"
							label="Tracking Partner"
							placeholder="Enter tracking partner name"
							aria-describedby="exampleFormControlInputHelpInline"
						/>
						<p className="invalid-feedback d-block">{errors.delivery_partner?.message}</p>
						<CFormInput
							{...register("tracking_url", {
								required: false,								
							})}
							className={`${errors.tracking_url && 'is-invalid'}` } 
							type="url"
							id="tracking_url"
							name="tracking_url"
							label="Tracking URL (if any)"
							placeholder="https://example.com"
							aria-describedby="exampleFormControlInputHelpInline"
						/>
						<p className="invalid-feedback d-block">{errors.tracking_url?.message}</p>
					</div>
				</CModalBody>
				<CModalFooter>
					{isSubmitting ? 
						<LoadingButton />
						:
						<CButton color="primary" type="submit" >Submit</CButton>
					}
				</CModalFooter>
				</CForm>
			</CModal>

			{/* View Dispatch Modal */}
			<CModal
				backdrop="static"
				alignment="center"
				visible={manageUI.showViewDispatchedModel}
				onClose={() => {
					setSingleOrder(null);
					setManageUI({ ...manageUI, 
						showViewDispatchedModel: false,
					})
				}}
				aria-labelledby="DispatchedModelTitle"
			>
				<CModalHeader>
					{singleOrder?.reward?.title && 
						<CModalTitle id="DispatchedModelTitle">Dispatch {singleOrder.reward.short_title} </CModalTitle>
					}
				</CModalHeader>
				{singleOrder &&				
				<CModalBody>
					<div>
						<CFormInput 
							defaultValue={singleOrder.order.tracking_number}
							disabled
							readOnly	
							className="mb-4"
							label="Tracking Number"					
							type="text"
							placeholder="Enter tracking number"
							aria-describedby="exampleFormControlInputHelpInline"
						/>						
						<CFormInput 
							defaultValue={singleOrder.order.delivery_partner}
							disabled
							readOnly	
							className="mb-4"	
							label="Tracking Partner"				
							type="text"
							placeholder="Enter tracking partner name"
							aria-describedby="exampleFormControlInputHelpInline"
						/>
						<CFormInput
							defaultValue={singleOrder.order.tracking_url}
							disabled
							readOnly	
							className="mb-4"
							type="url"
							label="Tracking URL (if any)"
							placeholder="https://example.com"
							aria-describedby="exampleFormControlInputHelpInline"
						/>
					</div>
				</CModalBody>
				}
				<CModalFooter>
					<CButton 
						onClick={() => {
							setSingleOrder(null);
							setManageUI({ ...manageUI, 
								showViewDispatchedModel: false,
							})
						}}
						style={{color:"#fff"}} color="danger" type="button" >Close It
					</CButton>
				</CModalFooter>
			</CModal>



			{/* Decline Modal */}
			<CModal
				backdrop="static"
				alignment="center"
				visible={manageUI.showDeclinedModel}
				onClose={() => setManageUI({ ...manageUI, 
					showDeclinedModel: false,
					id:0,
					order_id:0  
				})}
				aria-labelledby="DeclinedModelTitle"
			>
				<CForm className="sdas" onSubmit={handleSubmitForm2(submitHandler2)}>
					<CModalHeader>
						<CModalTitle id="DeclinedModelTitle">Declined Order</CModalTitle>
					</CModalHeader>
					<CModalBody>
						<div>
							<CTable bordered borderColor="primary">
								{singleOrder && 
									<CTableBody>
										<CTableRow>
											<CTableHeaderCell scope="row">Order Number:</CTableHeaderCell>
											<CTableDataCell>{singleOrder.order_id}</CTableDataCell>

										</CTableRow>
										<CTableRow>
											<CTableHeaderCell scope="row">Item:</CTableHeaderCell>
											<CTableDataCell>{singleOrder.reward.title}</CTableDataCell>

										</CTableRow>
										<CTableRow>
											<CTableHeaderCell scope="row">Customer Name:</CTableHeaderCell>
											<CTableDataCell>{singleOrder.user.name}</CTableDataCell>

										</CTableRow>
										<CTableRow>
											<CTableHeaderCell scope="row">Requested On:</CTableHeaderCell>
											<CTableDataCell>{singleOrder.order.order_date}</CTableDataCell>

										</CTableRow>
									</CTableBody>
								}
								
							</CTable>
								<CFormTextarea
									{...registerForm2("decline_reason", {
										required: "Please enter reason",								
									})}
									className={`${errors2.decline_reason && 'is-invalid'}` } 
									id="decline_reason"
									name="decline_reason"
									label="Reason"
									rows={3}
									text="Enter the reason why you are declining this order."
								></CFormTextarea>
								<p className="invalid-feedback d-block">{errors2.decline_reason?.message}</p>
						</div>
					</CModalBody>
					<CModalFooter>
						{isSubmitting2 ? 
							<LoadingButton />
							:
							<CButton type="submit" color="primary">Update Status</CButton>
						}
						
					</CModalFooter>
				</CForm>
			</CModal>

			{/* Decline Reason Modal */}
			<CModal
				backdrop="static"
				alignment="center"
				visible={manageUI.showDeclinedReasonModel}
				onClose={() => {
					setSingleOrder(null);
					setManageUI({ ...manageUI, 
						showDeclinedReasonModel: false,
					})
				}}
				aria-labelledby="DeclinedReasonModelTitle"
			>
					<CModalHeader>
						<CModalTitle id="DeclinedReasonModelTitle">View Decline Reason</CModalTitle>
					</CModalHeader>
					{singleOrder && 
					<CModalBody>
						<div>
							<CTable bordered borderColor="primary">
									<CTableBody>
										<CTableRow>
											<CTableHeaderCell scope="row">Order Number:</CTableHeaderCell>
											<CTableDataCell>{singleOrder.order_id}</CTableDataCell>

										</CTableRow>
										<CTableRow>
											<CTableHeaderCell scope="row">Item:</CTableHeaderCell>
											<CTableDataCell>{singleOrder.reward.title}</CTableDataCell>

										</CTableRow>
										<CTableRow>
											<CTableHeaderCell scope="row">Customer Name:</CTableHeaderCell>
											<CTableDataCell>{singleOrder.user.name}</CTableDataCell>

										</CTableRow>
										<CTableRow>
											<CTableHeaderCell scope="row">Requested On:</CTableHeaderCell>
											<CTableDataCell>{singleOrder.order.order_date}</CTableDataCell>

										</CTableRow>
									</CTableBody>
							</CTable>
							<CFormTextarea	
								disabled
								readOnly								
								label="Reason"
								rows={3}
								defaultValue={singleOrder.order.decline_reason}
							></CFormTextarea>
						</div>
					</CModalBody>
					}		
					<CModalFooter>
						<CButton 
							onClick={() => {
								setSingleOrder(null);
								setManageUI({ ...manageUI, 
									showDeclinedReasonModel: false,
								})
							}}
							style={{color:"#ffffff"}} 
							type="button" color="danger">Close It</CButton>						
					</CModalFooter>			
			</CModal>
		</CCard>


	);
};

export default AllRedemptions;