/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import PageTitle from "../others/PageTitle";
import { actionFetchData } from "../../actions/actions";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import { API_URL } from "../../config/";

const AllOrder = (props) => {
    const {params,accessToken} = props;   

    const [isLoading, setIsLoading] = useState(true);
    const [orders,setOrder] = useState([]);
    const fetchOrder = async () => {
        let url = `${API_URL}/front/orders?userId=${params.id}`;
        let response = await actionFetchData(url, accessToken);
        response = await response.json();

        if (response.status) {
            setOrder(response.data.data);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchOrder()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={props.className}>
            <PageTitle title="All Order" />

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
                                        <th>ID</th>
                                        <th>Item Name</th>
                                        <th>XP Deducted</th>
                                        <th>Requested On</th>
                                        <th>Updated On</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    orders.map(item => {
                                        return (
                                            <tr key={`${item.id}-user`}>
                                                <td scope="row">{item.id}</td>
                                                <td>{item.title}</td>
                                                <td><span className="text-danger">{item?.xp_value} XP</span></td>
                                                <td>{item.order_date}</td>
                                                <td>{item.updated_at}</td>
                                                <td>
                                                    {item.status === 1 &&
                                                        <span className="d-inline-flex px-2 py-1 fw-semibold text-warning-emphasis bg-warning-subtle border border-warning-subtle rounded-2" style={{ fontWeight: "600" }}>Pending</span>
                                                    }

                                                    {item.status === 2 &&
                                                        <span className="d-inline-flex px-2 py-1 fw-semibold text-primary-emphasis bg-primary-subtle border border-primary-subtle rounded-2" style={{ fontWeight: "600" }}>In transit</span>
                                                    }

                                                    {item.status === 3 &&
                                                        <span className="d-inline-flex px-2 py-1 fw-semibold text-success-emphasis bg-success-subtle border border-success-subtle rounded-2" style={{ fontWeight: "600" }}>Delivered</span>
                                                    }
                                                    {item.status === 4 &&
                                                        <span className="d-inline-flex px-2 py-1 fw-semibold text-danger-emphasis bg-danger-subtle border border-danger-subtle rounded-2" style={{ fontWeight: "600" }}>Decline</span>
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

                    
                </div>
            </div>
        </div>
    );
};

export default AllOrder;