import { useCallback, useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { API_URL } from "../../config";
import { actionFetchData, actionPostData } from "../../actions/actions";
import PageTitle from "../others/PageTitle";
import LoadingButton from "../others/LoadingButton";

const NewQrs = () => {
    const { Auth } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const navigate = useNavigate();

    const [products, setProduct] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const {
        register,
        handleSubmit,
        reset,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm();

    const submitHandler = useCallback(async (data) => {
        const toastId = toast.loading("Please wait...")
        try {
            let response = await actionPostData(`${API_URL}/qr-codes`, accessToken, data);
            response = await response.json();

            if (response.status) {
                toast.success(response.message, {
                    id: toastId
                });
                reset();
                navigate('/qr-manager/all-qr');
            } else {
                toast.error(response.message, {
                    id: toastId
                });
            }
        } catch (error) {
            toast.error(error)
        }
    })


    const fetchProduct = async () => {
        let finalUrl = `${API_URL}/products?page=${1}&perPage=${1000}`;
        let response = await actionFetchData(finalUrl, accessToken);
        response = await response.json();
        if (response.status) {
            setProduct(response.data.data);
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProduct();
    }, [])

    return (
        <div>
            <PageTitle
                title="Add New QR Code"
                buttonLink="/qr-manager/all-qr"
                buttonLabel="Back to List"
            />
            <div className="row">
                <div className="col-12 col-xl-8">
                    <div className="card">
                        <div className="card-body">
                            {isLoading && <div className="cover-body"></div>}
                            <form onSubmit={handleSubmit(submitHandler)} method="post">
                                <div className="mb-4">
                                    <label className="form-label">Select Product</label>
                                    <select
                                        {...register("product_id", {
                                            required: "Please select product",
                                            validate: (value) => value > 0 || 'Quantity should be integer',
                                        })}
                                        className={`form-select custom-input ${errors.quantity && `is-invalid`}`}
                                        id="product_id"
                                        name="product_id"
                                    >
                                        <option value={''}>Select product</option>
                                        {products &&
                                            products.map(product => {
                                                return (
                                                    <option key={product.id} value={product.id}>{product.name}</option>
                                                )
                                            })

                                        }
                                    </select>
                                    <p className="invalid-feedback">{errors.product_id?.message}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Package Size</label>
                                    <select className="form-select form-select custom-input" aria-label="Default select example">
                                        <option selected disabled>Open this select menu</option>
                                        <option value="1">250ml</option>
                                        <option value="2">500ml</option>
                                        <option value="3">1 Liter</option>
                                        <option value="3">2 Liter</option>
                                        <option value="3">2.5 Liter</option>
                                        <option value="3">5 Liter</option>
                                    </select>
                                    <p className="invalid-feedback">{errors.product_id?.message}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">QR Code <small>Quantity (Max 3000)</small></label>
                                    <input
                                        {...register("quantity", {
                                            required: "Please enter quantity",
                                            valueAsNumber: true,
                                            validate: (value) => {

                                                if (!Number.isInteger(value)) {
                                                    return "Quantity should be an integer";
                                                }

                                                if (value <= 0) {
                                                    return "Quantity should be greater than 0";
                                                }
                                                if (value > 3000) {
                                                    return "Quantity should be less than or equal to 3000";
                                                }
                                                return true;
                                            },
                                        })}
                                        className={`form-control custom-input ${errors.quantity && `is-invalid`}`}
                                        type="text"
                                        id="quantity"
                                        name="quantity"
                                        placeholder="QR Code Quantity (Max 3000)"
                                    />
                                    <p className="invalid-feedback">{errors.quantity?.message}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">XP per (QR) code</label>
                                    <input
                                        {...register("xp_value", {
                                            required: "Please enter xp value",
                                            valueAsNumber: true,
                                            validate: (value) => value > 0 || 'Xp value should be integer',
                                        })}
                                        className={`form-control custom-input ${errors.xp_value && `is-invalid`}`}
                                        type="text"
                                        id="xp_value"
                                        name="xp_value"
                                        placeholder="XP Per QR Code"
                                    />
                                    <p className="invalid-feedback">{errors.xp_value?.message}</p>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Batch Number</label>
                                    <input
                                        {...register("batch_number", {
                                            required: "Please enter batch number"
                                        })}
                                        className={`form-control custom-input ${errors.batch_number && `is-invalid`}`}
                                        type="text"
                                        id="batch_number"
                                        name="batch_number"
                                        placeholder="Batch Number"
                                    />
                                    <p className="invalid-feedback">{errors.batch_number?.message}</p>
                                </div>

                                {isSubmitting ?
                                    <LoadingButton />
                                    :
                                    <button type="submit" className="btn  btn-primary large-btn">
                                        Generate QR Code
                                    </button>
                                }
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewQrs;