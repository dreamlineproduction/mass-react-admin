import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import Login from './components/auth/Login';
import './assets/js/app';
import './assets/css/style.scss'
import NotFoundPage from './components/404/NotFoundPage';
import DefaultLayout from './components/layouts/DefaultLayout';
import { useContext } from 'react';
import AuthContext from './context/auth';
import ProtectRoute from './components/ProtectRoute';


function App() {
    const { AuthCheck } = useContext(AuthContext)
    const isAuthenticated = AuthCheck();
    
    return (     
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="login" replace />} /> 
                <Route exact path="/login" name="Login Page" element={<Login />} />
               
                <Route path="*" element={<ProtectRoute><DefaultLayout /></ProtectRoute>} /> 
            
            </Routes>
        </BrowserRouter>     
    )
}

export default App
