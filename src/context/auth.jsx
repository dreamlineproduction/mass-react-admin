import { createContext,useState} from "react";
import { rolesPermissions } from "../rolesPermissions";
export const  AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const userInfo = localStorage.getItem('user-info');
    const [user,setUser] = useState(userInfo)
    const [permissions, setPermission] = useState([]);


    const login = (user) => {
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('user-info');
        setUser(null)
    }

    const AuthCheck = () => {
        const user = localStorage.getItem('user-info');
        return user ? true : false;      
    }

    const Auth = (value = '') => {
        const userInfo = localStorage.getItem('user-info');
        const authUser = JSON.parse(userInfo)

        if(value.length > 0){
            return authUser[value];
        }
        return authUser
    }

    const hasPermission = (permission = '') => {
    
        return permissions.includes(permission);
    }

    return (
        <AuthContext.Provider 
            value={{
                permissions,
                setPermission,
                hasPermission,
                user,
                AuthCheck,
                Auth,
                login,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    )
}



export default AuthContext;




