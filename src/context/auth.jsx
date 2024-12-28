import { createContext,useState} from "react";
import { API_URL } from "../config";
import { actionFetchData } from "../actions/actions";
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

    const fetchCurrentUser = async () => {
        const accessToken = Auth('accessToken');
        let url = `${API_URL}/admin-user`;
        let response = await actionFetchData(url, accessToken);
        response = await response.json();

        if (response.status) {
            setPermission(response.permissions)
        }
    }

    const hasPermission = (permission = '') => {
        

        if(permissions.length > 0){
            return permissions.includes(permission);
        }
        return false;
    }

    return (
        <AuthContext.Provider 
            value={{
                permissions,
                fetchCurrentUser,
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




