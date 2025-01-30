import { useParams } from "react-router-dom";
import { actionFetchData } from "../../actions/actions";
import { API_URL, configPermission } from "../../config";
import PageTitle from "../others/PageTitle";
import AllOrder from "./AllOrder";
import AllTransaction from "./AllTransaction";
import AuthContext from "../../context/auth";
import { useContext, useEffect, useState } from "react";

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
    }, [])


    return (
        <div>
            {isLoading && <div className="cover-body"></div>}
            <PageTitle
                title={user?.name}
                buttonLink="/users/all-users"
                buttonLabel="Back to List"
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