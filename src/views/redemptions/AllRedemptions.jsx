import { CButton, CCard, CCardBody, CCardHeader, CForm, CTable, CFormTextarea, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormInput, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from "@coreui/react";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { API_URL } from "../../config";
import Loading from "../../components/Loading";
import NoState from "../../components/NoState";
import Pagination from "../../components/Pagination";

const AllRedemptions = () => {

	const { Auth } = useContext(AuthContext)
	const perPage = 20;
	const accessToken = Auth('accessToken');
	const [orders, setOrder] = useState([])
	const [manageUI, setManageUI] = useState({
		showDispatchedModel: false,
		showDeclinedModel: false
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

	useEffect(() => {
		fetchOrder();
	}, [pageNumber])

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
												</td>
												<td>
													<CDropdown>
														<CDropdownToggle color="dark">More Options</CDropdownToggle>
														<CDropdownMenu>
															<button
																type="button"
																onClick={() => setManageUI({ ...manageUI, showDispatchedModel: true })} className="dropdown-item">
																Dispatched
															</button>
															<button
																type="button"
																className="dropdown-item">
																Delivered
															</button>
															<button
																style={{ color: "#e55353", }}
																type="button"
																onClick={() => setManageUI({ ...manageUI, showDeclinedModel: true })} className="dropdown-item">
																Declined
															</button>
														</CDropdownMenu>
													</CDropdown>
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
				onClose={() => setManageUI({ ...manageUI, showDispatchedModel: false })}
				aria-labelledby="DispatchedModelTitle"
			>
				<CModalHeader>
					<CModalTitle id="DispatchedModelTitle">Dispatch Product Name </CModalTitle>
				</CModalHeader>
				<CModalBody>
					<CForm>
						<CFormInput className="mb-3"
							type="text"
							id="exampleFormControlInput1"
							label="Tracking Number"
							placeholder="Enter tracking number"
							aria-describedby="exampleFormControlInputHelpInline"
						/>
						<CFormInput className="mb-3"
							type="text"
							id="exampleFormControlInput1"
							label="Tracking Partner"
							placeholder="Enter tracking partner name"
							aria-describedby="exampleFormControlInputHelpInline"
						/>
						<CFormInput className="mb-3"
							type="url"
							id="exampleFormControlInput1"
							label="Tracking URL (if any)"
							placeholder="Enter tracking url"
							aria-describedby="exampleFormControlInputHelpInline"
						/>
					</CForm>
				</CModalBody>
				<CModalFooter>

					<CButton color="primary">Submit</CButton>
				</CModalFooter>
			</CModal>


			{/* Decline Modal */}
			<CModal
				backdrop="static"
				alignment="center"
				visible={manageUI.showDeclinedModel}
				onClose={() => setManageUI({ ...manageUI, showDeclinedModel: false })}
				aria-labelledby="DeclinedModelTitle"
			>
				<CModalHeader>
					<CModalTitle id="DeclinedModelTitle">Declined Order</CModalTitle>
				</CModalHeader>
				<CModalBody>
					<div>

						<CTable bordered borderColor="primary">
							<CTableBody>
								<CTableRow>
									<CTableHeaderCell scope="row">Order Number:</CTableHeaderCell>
									<CTableDataCell>548787845</CTableDataCell>

								</CTableRow>
								<CTableRow>
									<CTableHeaderCell scope="row">Item:</CTableHeaderCell>
									<CTableDataCell>iPhone 16</CTableDataCell>

								</CTableRow>
								<CTableRow>
									<CTableHeaderCell scope="row">Customer Name:</CTableHeaderCell>
									<CTableDataCell>Ayan Mukhopadhyay</CTableDataCell>

								</CTableRow>
								<CTableRow>
									<CTableHeaderCell scope="row">Requested On:</CTableHeaderCell>
									<CTableDataCell>06-10-2024 at 7:56PM</CTableDataCell>

								</CTableRow>
							</CTableBody>
						</CTable>

						<CForm>
							<CFormTextarea
								id="exampleFormControlTextarea1"
								label="Reason"
								rows={3}
								text="Enter the reason why you are declining this order."
							></CFormTextarea>
						</CForm>

					</div>
				</CModalBody>
				<CModalFooter>

					<CButton color="primary">Update Status</CButton>
				</CModalFooter>
			</CModal>
		</CCard>


	);
};

export default AllRedemptions;