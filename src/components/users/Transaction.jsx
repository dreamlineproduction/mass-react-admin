import { useParams } from "react-router-dom";
import { actionFetchData } from "../../actions/actions";
import { API_URL, configPermission } from "../../config";
import PageTitle from "../others/PageTitle";
import AllOrder from "./AllOrder";
import AllTransaction from "./AllTransaction";
import QuickView from "./QuickView";
import AuthContext from "../../context/auth";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Transaction = () => {

    const params = useParams();
    const { Auth, hasPermission } = useContext(AuthContext)
    const accessToken = Auth('accessToken');
    const [isLoading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        setLoading(true);
        let url = `${API_URL}/users/${params.id}`;
        let response = await actionFetchData(url, accessToken);
        response = await response.json();

        if (response.status) {
            setUser(response.data)
            setLoading(false)            
        }
    }
    useEffect(() => {
        if (!hasPermission(configPermission.VIEW_USER)) {
            navigate('/403')
        }
        //fetchState()
        fetchUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id])

    return (
        <div className="position-relative">
            {isLoading && <div className="cover-body">red</div>}
            
            <div className="mb-3 d-flex align-items-center justify-content-between">
                <h1 className="h3 d-inline align-middle">{`User details of ${user?.name || ''}`}</h1>
                <div className="">
                <Link to={`/users/edit-user/${user?.id}`} className="btn btn-primary btn-lg me-2">
                    Edit User
                    </Link>
                    <a className="btn btn-success btn-lg" href="/users/all-users">Back to List</a>
                   
                    </div>
            </div>

             {/* Quick View */}
            <QuickView
                user={user}
            />
            
            {/* All Transaction */}
            <AllTransaction
                user={user}
                className="mt-4"
                params={params}
                accessToken={accessToken}
            />

            {/* Orders */}
            <AllOrder
                className="mt-4"
                params={params}
                accessToken={accessToken}
            />
        </div>
    );
};

export default Transaction;