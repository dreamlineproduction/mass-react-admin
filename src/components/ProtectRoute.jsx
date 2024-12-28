import {Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/auth";
import { useContext } from "react";

const ProtectRoute = ({children}) => {
    const location = useLocation()
    const {user} =  useContext(AuthContext);
    if(!user){
        return <Navigate to='/login' state={{path:location.pathname}} />
    }

    return children;
};

export default ProtectRoute;