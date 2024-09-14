import { useContext } from "react";
import {Navigate, useLocation } from "react-router-dom";
import AuthContext from "./context/auth";

const RequireAuth = ({children}) => {
    const location = useLocation()
    const {user} =  useContext(AuthContext);
    
    if(!user){
        return <Navigate to='/login' state={{path:location.pathname}} />
    }

    return children;
};

export default RequireAuth;