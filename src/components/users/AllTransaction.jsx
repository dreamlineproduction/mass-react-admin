/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { actionFetchData } from "../../actions/actions";
import Loading from "../others/Loading";
import NoState from "../others/NoState";
import { API_URL } from "../../config";
import { Link } from "react-router-dom";

const AllTransaction = (props) => {
    const {params, accessToken,user} = props;
    const [transactions, setTransaction] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const fetchTransaction= async() => {        
        let url = `${API_URL}/front/transactions?userId=${params.id}`;
        let response = await actionFetchData(url, accessToken);
        response = await response.json();

        if (response.status) {
           setTransaction(response.data.data)
           setLoading(false)
        }
    }

    useEffect(() => {
        fetchTransaction()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <div className={props.className}>
            <div className="mb-3 d-flex align-items-center justify-content-between">
                <h1 className="h3 d-inline align-middle">All Transaction</h1>
                <div className="d-flex">
                    <div className="xp-badge me-2">Total Collected: {user?.total_xp || 0}</div>
                    <div className="xp-badge me-2">Total Redeemed:  {user?.redeem_xp || 0}</div>
                    <div className="xp-badge current-xp-badge text-white me-2">Current Balance: {user?.balance_xp || 0}</div>
                </div> 
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="card">
                       
                        
                        {isLoading &&
                            <Loading />
                        }
                        {!isLoading && transactions.length === 0 &&
                            <NoState
                                message="No transactions found."
                            />
                        }
                        
                        {transactions.length > 0 &&
                            <table className="table table-striped table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Product Name</th>
                                        <th>Size</th>
                                        <th>Unique Code</th>
                                        <th>Batch Number</th>
                                        <th>Date</th>
                                        <th>Activity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                    transactions.map(item => {
                                        return (
                                            <tr key={`${item.id}-user`}>
                                                <td>
                                                    {item.type === 'redeem' && 'Redeem XP'}
                                                    {item.type === 'refund' && 'Refund'}
                                                    {item.type === 'qrcode' && 'Scan Code'}
                                                    {item.type === 'commission' && 'Commission'}
                                                    
                                                </td>
                                                <td>
                                                    {(item.type === 'qrcode' || item.type === 'commission') &&
                                                       
                                                        item.name
                                                    }

                                                    {(item.type === 'refund' || item.type ===  'redeem') && 
                                                        item.title
                                                    }

                                                </td>
                                                <td>
                                                    {item.size_id > 0 ? item.size_id+item.size_in :'N/A' }
                                                </td>
                                                <td>
                                                    {item.unique_id ? 
                                                        <Link  className="btn" to={`/qr-manager/qr-details/${item.product_id}/${item.batch_number}`}>
                                                            {item.unique_id}
                                                        </Link>
                                                    : 'N/A' }
                                                </td>
                                                <td>
                                                    {item.batch_number ?                                                         
                                                        <Link className="btn" to={`/qr-manager/qr-details/${item.product_id}/${item.batch_number}`}>
                                                            {item.batch_number }
                                                        </Link>
                                                        : 'N/A' 
                                                    }
                                                </td>
                                                <td>{item.updated_at}</td>
                                                <td>
                                                    {item.type ===  'redeem' && <span className="text-danger">-{item.xp}XP</span>}
                                                    {(item.type ===  'refund' || item.type === 'qrcode' || item.type === 'commission') &&
                                                        <span className="text-success">+{item.xp}XP</span>
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

export default AllTransaction;