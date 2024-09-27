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

const AllProduct = () => {
    const { Auth } =  useContext(AuthContext)
    const perPage = 20;
    const accessToken = Auth('accessToken');
    const [products, setProduct] = useState([])
    const [selectedItems, setSelectedItems] = useState([]);


    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [isLoading,setLoading] = useState(true);

    // Fetch data
    let finalUrl = `${API_URL}/products?page=${pageNumber}&perPage=${perPage}`;
    const fetchProduct = async () => {
        let response = await actionFetchData(finalUrl,accessToken);
        response    = await response.json();
        if (response.status) {
            setProduct(response.data.data);
            setPageCount(response.totalPage);
        }          
        setLoading(false)
    }

    // Delete Data
    const actionDelete = async (id) => {
        const toastId = toast.loading("Please wait...")   
        
        try{
            let response =  await actionDeleteData(`${API_URL}/products/${id}`,accessToken);
            response = await response.json();

            if (response.status) {
                const filteredData = products.filter(item => item.id !==id);
                setProduct(filteredData);
                toast.success(response.message,{
                    id:toastId
                });
            }              
        } catch(error){
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

        try{
            const postData = {status};
            let response =  await actionPostData(`${API_URL}/products/change-status/${id}`,accessToken,postData,'PUT');
            response = await response.json();

            if (response.status) {
                products[findedIndex].status = status;
                setProduct([...products]);
                toast.success(response.message,{
                    id:toastId
                });
            }              
        } catch(error){
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
        fetchProduct()
    }, [pageNumber])

    return (
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
                        {/* <div>
                            <CFormInput  type="text" placeholder="Search..." />
                        </div> */}
                    </div>
                </div>
            </CCardHeader>

            <CCardBody>
                <div>
                    {isLoading && 
                        <Loading />
                    }
                    {products.length > 0 ?
                        <table className="table">
                            <thead>
                                <tr>
                                    <th><CFormCheck  id="flexCheckDefault" /></th>
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
                                        return(
                                            <tr key={product.id} className="align-middle">
                                                <td>
                                                    <CFormCheck 
                                                        checked={selectedItems.includes(product.id)}
                                                        onChange={() => handleCheckboxChange(product.id)}
                                                        id="flexCheckDefault" 
                                                    />
                                                </td>

                                                <td>
                                                    {product.image &&
                                                        <img src={product.image_url} 
                                                            className="img-thumbnail" 
                                                            style={{width:"70px",height:"70px",objectFit:"cover"}}
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
                                                    <CDropdownToggle className="border-0" caret={false} href="#" color="ghost">...</CDropdownToggle>
                                                    <CDropdownMenu>                                                    
                                                        <Link className="dropdown-item" to={`/products/edit-product/${product.id}`}>Edit</Link>
                                                        <CDropdownItem onClick={() => changeStatus(product.id)}>
                                                            {product.status === 1 ? 'Inactive' : 'Active' }
                                                        </CDropdownItem>
                                                        <CDropdownItem className="text-danger" onClick={() =>  deleteProduct(product.id)}>Delete</CDropdownItem>
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
                        {/* <button className="btn btn-danger text-white"  onClick={deleteSelectedItems} disabled={selectedItems.length === 0}>
                            Delete Selected
                        </button>   */}
                        <Pagination 
                            pageCount={pageCount}
                            handlePageChange={(event) => setPageNumber(event.selected+1)}
                        />  
                       
                    </div>  
                                     
                }                      
            </CCardBody>
        </CCard>
    );
};

export default AllProduct;