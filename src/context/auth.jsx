import { createContext,useState } from "react";

export const  AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
    const userInfo = localStorage.getItem('user-info');
    const [user,setUser] = useState(userInfo)

    const login = (user) => {
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('user-info');
        setUser(null)
    }

    const AuthCheck = () => {
        const user = localStorage.getItem('user-info');
        return (user === '' || user === null)? false: true;        
    }

    const Auth = (value = '') => {
        const userInfo = localStorage.getItem('user-info');
        const authUser = JSON.parse(userInfo)

        if(value){
            return authUser[value];
        }
        return authUser
    }

    return (
        <AuthContext.Provider 
            value={{
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

