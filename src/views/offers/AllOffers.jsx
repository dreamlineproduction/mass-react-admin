import { CButton, CCard, CCardBody, CCardHeader, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck } from "@coreui/react";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth";
import { API_URL, statusBadge } from "../../config";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import Loading from "../../components/Loading";
import NoState from "../../components/NoState";
import Pagination from "../../components/Pagination";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AllOffers = () => {

    const { Auth } = useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');

    const [offers, setOffer] = useState([]);

    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);

    // Delete Data
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionDeleteData(`${API_URL}/offers/${id}`, accessToken)
            response = await response.json();

            if (response.status) {
                const filteredData = offers.filter(item => item.id !== id);
                setOffer(filteredData);
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }


    const deleteOffer = (id) => {
        Swal.fire({
            title: "Delete Confirmation",
            text: "Are you sure you want to delete this?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                actionDelete(id)
            }
        });
    }

    //--Fetch Data
    let finalUrl = `${API_URL}/offers?page=${pageNumber}&perPage=${perPage}`;
    const fetchOffer = async () => {
        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setOffer(response.data.data);
            setPageCount(response.totalPage);
        }
        setLoading(false)
    }

    // Change Status
    const changeStatus = async (id) => {
        const toastId = toast.loading("Please wait...")

        let findedIndex = offers.findIndex(item => item.id === id);
        let status = (offers[findedIndex].status === 1) ? 0 : 1;

        try {
            const postData = { status };
            let response = await actionPostData(`${API_URL}/offers/change-status/${id}`, accessToken, postData, 'PUT');
            response = await response.json();

            if (response.status) {
                offers[findedIndex].status = status;
                setOffer([...offers]);
                toast.success(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    }

    // Bulk Action
    const handleCheckboxChange = (id) => {
        setSelectedItems(prevSelectedItems =>
            prevSelectedItems.includes(id)
                ? prevSelectedItems.filter(itemId => itemId !== id)
                : [...prevSelectedItems, id]
        );
    };

    const deleteSelectedItems = () => {
        //console.log(selectedItems);
        // setUsers(prevItems => prevItems.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
    };


    useEffect(() => {
        fetchOffer();
    }, [pageNumber])

    return (
        <CCard>
            <CCardHeader>
                <div className="d-flex justify-content-between align-items-center">
                    <div><strong>All Offers</strong></div>
                    <div className="d-flex">
                        <div>
                            <Link to={'/offers/new-offer'}>
                                <CButton color="primary" className="me-3">+ Add New Offer</CButton>
                            </Link>
                        </div>
                        {/* <div>
                            <CFormInput v-model="params.search" type="text" placeholder="Search..." />
                        </div> */}
                    </div>
                </div>
            </CCardHeader>

            <CCardBody>
                <div className="table-responsive">
                    {isLoading &&
                        <Loading />
                    }
                    {offers.length > 0 ?
                        <table className="table">
                            <thead>
                                <tr>
                                    <th><CFormCheck id="flexCheckDefault" /></th>
                                    <th>Offer ID</th>
                                    <th>Image</th>
                                    <th>Title</th>
                                    <th>In Homepage ?</th>
                                    <th>Crated At</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    offers.map(item => {
                                        return (
                                            <tr key={item.id}>
                                                <td>
                                                    <CFormCheck
                                                        checked={selectedItems.includes(item.id)}
                                                        onChange={() => handleCheckboxChange(item.id)}
                                                        id="flexCheckDefault"
                                                    />
                                                </td>
                                                <td>{item.id}</td>
                                                <td>
                                                    {item.image &&
                                                        <img src={item.image_url}
                                                            className="img-thumbnail"
                                                            style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                                            alt="Description of image" width={"80"} height={'50'} />
                                                    }
                                                </td>
                                                <td>{item.title}</td>
                                                <td>{(item.is_home === 1) ? 'Yes' : 'No'}</td>
                                                <td>{item.created_at}</td>
                                                <td>
                                                    {statusBadge(item.status)}
                                                </td>
                                                <td>
                                                    <CDropdown >
                                                        <CDropdownToggle className="border-0" caret={false} href="#" color="ghost">...</CDropdownToggle>
                                                        <CDropdownMenu>
                                                            <Link className="dropdown-item" to={`/offers/edit-offer/${item.id}`}>Edit</Link>
                                                            <CDropdownItem onClick={() => changeStatus(item.id)}>
                                                                {item.status === 1 ? 'Inactive' : 'Active'}
                                                            </CDropdownItem>
                                                            <CDropdownItem className="text-danger" onClick={() => deleteOffer(item.id)}>Delete</CDropdownItem>
                                                        </CDropdownMenu>
                                                    </CDropdown>
                                                </td>
                                            </tr>
                                        )
                                    })

                                }
                            </tbody>
                        </table>
                        :
                        <NoState
                            message="No Product"
                        />
                    }
                </div>
                {offers.length > 0 &&
                    <div className='d-flex  align-items-start justify-content-end'>
                        {/* <button className="btn btn-danger text-white"  onClick={deleteSelectedItems} disabled={selectedItems.length === 0}>
                            Delete Selected
                        </button>   */}
                        <Pagination
                            pageCount={pageCount}
                            handlePageChange={(event) => setPageNumber(event.selected + 1)}
                        />

                    </div>

                }
            </CCardBody>
        </CCard>
    );
};

export default AllOffers;