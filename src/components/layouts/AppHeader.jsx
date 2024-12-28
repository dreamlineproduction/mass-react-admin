import { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/auth";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { User,Power } from "react-feather";

const AppHeader = () => {
    const navigate = useNavigate();
    const {logout,fetchCurrentUser,user}  = useContext(AuthContext);
    

    const logoutUser = () => {
        logout();       
        setTimeout(() => {
            toast.success(`You have been logged out!`)
            navigate('/login')
        },500)
    }
    
    useEffect(()=>{
        fetchCurrentUser();        
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])
    return (
        <nav className="navbar navbar-expand navbar-light navbar-bg">
            <div className="navbar-collapse collapse">
                <ul className="navbar-nav navbar-align">                                       
                    <li className="nav-item dropdown">
                        <a
                            className="nav-link dropdown-toggle d-none d-sm-inline-block"
                            href="#"
                            data-bs-toggle="dropdown"
                        >
                            {user?.image_url ? (
                                <img
                                src={user?.image_url}
                                className="avatar img-fluid rounded me-3"
                                alt="Charles Hall"
                                />
                            ) : (
                                <User className="align-middle me-1" width={50} />
                            )}

                            <span className="text-dark">{user?.name || 'Admin User'}</span>
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                            <Link className="dropdown-item" to="/profile">
                                <User className="align-middle me-1" width={17} />
                                Profile
                            </Link>
                         
                            <div className="dropdown-divider"></div>
                            <button type="button" className="dropdown-item" onClick={logoutUser}>
                                <Power className="align-middle me-1" width={17} /> Log out
                            </button>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default AppHeader;