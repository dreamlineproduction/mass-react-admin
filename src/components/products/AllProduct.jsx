import { Link } from "react-router-dom";
import PageTitle from "../others/PageTitle";
import { useContext, useEffect,  useState } from "react";
import { actionDeleteData, actionFetchData, actionPostData } from "../../actions/actions";
import { API_URL } from "../../config";
import AuthContext from "../../context/auth";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import Status from "../others/Status";
import Pagination from "../others/Pagination";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

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
        <div>
            <PageTitle
                title="All Products"
                buttonLink="/products/add-product"
                buttonLabel="Add New Product"
            />

            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="my-4 d-flex justify-content-end gap-3">
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
                                <button
                                    type="button"
                                    onClick={handlerSearch}
                                    className="btn btn-primary me-3">
                                    Search
                                </button>
                            </div>
                        </div>

                        {isLoading &&
                            <Loading />
                        }
                        {!isLoading && products.length === 0 &&
                            <NoState
                                message="No products found."
                            />
                        }

                        {products.length > 0 &&
                            <table className="table table-striped table-hover mb-0">
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
                                                            <img
                                                                src={product.image_url}
                                                                className="img-thumbnail"
                                                                style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                                                alt={product.name}
                                                            />
                                                        }

                                                    </td>
                                                    <td>{product.unique_id}</td>
                                                    <td>{product.name}</td>
                                                    <td>{product.created_at}</td>
                                                    <td>
                                                        <Status status={product.status} />
                                                    </td>
                                                    <td>
                                                        <div className="dropdown">
                                                            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                More Options
                                                            </button>
                                                            <ul className="dropdown-menu">
                                                                <li>
                                                                    <Link className="dropdown-item" to={`/products/edit-product/${product.id}`}>
                                                                        Edit
                                                                    </Link>
                                                                </li>
                                                                <li>
                                                                    <button type="button" className="dropdown-item" onClick={() => changeStatus(product.id)}>
                                                                        {product.status === 1 ? 'Inactive' : 'Active'}
                                                                    </button>
                                                                </li>
                                                                <li>
                                                                    <button type="button" className="dropdown-item" onClick={() => deleteProduct(product.id)}>
                                                                        Delete
                                                                    </button>
                                                                </li>
                                                            </ul>
                                                        </div>

                                                    </td>
                                                </tr>
                                            )
                                        })

                                    }
                                </tbody>
                            </table>
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
                </div>
            </div>
        </div>
    );
};

export default AllProduct;