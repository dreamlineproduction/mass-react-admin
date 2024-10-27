import { CButton, CCard, CCardBody, CCardHeader, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormCheck, CFormInput } from "@coreui/react"
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth";
import toast from "react-hot-toast";
import Loading from "../../components/Loading";
import { API_URL, statusBadge } from "../../config";
import Pagination from "../../components/Pagination";
import Swal from "sweetalert2";
import NoState from "../../components/NoState";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

const AllProduct = () => {
  const { Auth } = useContext(AuthContext)
  const perPage = 20;
  const accessToken = Auth('accessToken');
  const [products, setProduct] = useState([])
  const [search, setSearchinput] = useState('')



  const [pageNumber, setPageNumber] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setLoading] = useState(true);

  // Fetch data
  let finalUrl = `${API_URL}/products?page=${pageNumber}&perPage=${perPage}`;
  const fetchProduct = async () => {
    setLoading(true);
    let response = await actionFetchData(finalUrl, accessToken);
    response = await response.json();
    if (response.status) {
      setProduct(response.data.data);
      setPageCount(response.totalPage);
    }
    setLoading(false)
  }

  // Delete Data
  const actionDelete = async (id) => {
    const toastId = toast.loading("Please wait...")

    try {
      let response = await actionDeleteData(`${API_URL}/products/${id}`, accessToken);
      response = await response.json();

      if (response.status) {
        const filteredData = products.filter(item => item.id !== id);
        setProduct(filteredData);
        toast.success(response.message, {
          id: toastId
        });
      }
    } catch (error) {
      toast.error(error)
    }
  }

  const deleteProduct = (id) => {
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

  // Change Status
  const changeStatus = async (id) => {
    const toastId = toast.loading("Please wait...")

    let findedIndex = products.findIndex(product => product.id === id);
    let status = (products[findedIndex].status === 1) ? 0 : 1;

    try {
      const postData = { status };
      let response = await actionPostData(`${API_URL}/products/change-status/${id}`, accessToken, postData, 'PUT');
      response = await response.json();

      if (response.status) {
        products[findedIndex].status = status;
        setProduct([...products]);
        toast.success(response.message, {
          id: toastId
        });
      }
    } catch (error) {
      toast.error(error)
    }
  }


  const handlerSearch = () => {
    if (search.trim() !== '') {
      finalUrl += `&search=${search}`
      fetchProduct();
    }
  };

  useEffect(() => {
    fetchProduct()
  }, [pageNumber])

  return (
    <main>
      <div className="mb-4 d-flex justify-content-end  gap-3">
        <div className="search-input-outer">
          <input
            onChange={(e) => {
              setSearchinput(e.target.value)
              if (e.target.value === '') {
                fetchProduct()
              }
            }}
            value={search}
            className="form-control"
            type="text"
            placeholder="Search..."
          />
        </div>

        <div>
          <CButton onClick={handlerSearch} color="primary" className="me-3">
            <CIcon icon={cilSearch} /> Search
          </CButton>
        </div>
      </div>

      <CCard>
        <CCardHeader>
          <div className="d-flex justify-content-between align-items-center">
            <div><strong>All Products</strong></div>
            <div className="d-flex">
              <div>
                <Link to={'/products/add-product'}>
                  <CButton color="primary" className="me-3">+ Add New Product</CButton>
                </Link>
              </div>
            </div>
          </div>
        </CCardHeader>

        <CCardBody>
          <div className="table-responsive">
            {isLoading &&
              <Loading />
            }
            {products.length > 0 ?
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product ID</th>
                    <th>Product Name</th>
                    <th>Created At</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    products.map(product => {
                      return (
                        <tr key={product.id} className="align-middle">
                          <td>
                            {product.image &&
                              <img src={product.image_url}
                                className="img-thumbnail"
                                style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                alt="Description of image" width={"15%"} />
                            }

                          </td>
                          <td>{product.unique_id}</td>
                          <td>{product.name}</td>
                          <td>{product.created_at}</td>
                          <td>
                            {statusBadge(product.status)}
                          </td>
                          <td>

                            <CDropdown >
                              <CDropdownToggle color="primary" href="#" >More Option</CDropdownToggle>
                              <CDropdownMenu>
                                <Link className="dropdown-item" to={`/products/edit-product/${product.id}`}>Edit</Link>
                                <CDropdownItem onClick={() => changeStatus(product.id)}>
                                  {product.status === 1 ? 'Inactive' : 'Active'}
                                </CDropdownItem>
                                <CDropdownItem className="text-danger" onClick={() => deleteProduct(product.id)}>Delete</CDropdownItem>
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
          {products.length > 0 &&
            <div className='d-flex  align-items-start justify-content-end'>
              <Pagination
                pageCount={pageCount}
                handlePageChange={(event) => setPageNumber(event.selected + 1)}
              />

            </div>

          }
        </CCardBody>
      </CCard>
    </main>
  );
};

export default AllProduct;
