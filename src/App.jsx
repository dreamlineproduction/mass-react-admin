import { BrowserRouter, Routes, Route, Navigate, } from 'react-router-dom';
import Login from './components/auth/Login';
import './assets/js/app';
import './assets/css/style.scss'
import DefaultLayout from './components/layouts/DefaultLayout';
import ProtectRoute from './components/ProtectRoute';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';


function App() {
    return (     
        <BrowserRouter>
            <Routes>
                <Route exact path="/login" name="Login Page" element={<Login />} />
                <Route exact path="/forgot-password" name="Forgot password" element={<ForgotPassword />} />
                <Route exact path="/reset-password" name="Reset password" element={<ResetPassword />} />
                <Route path="/" element={<Navigate to="login" replace />} /> 

                <Route path="*" element={<ProtectRoute><DefaultLayout /></ProtectRoute>} /> 
            
            </Routes>
        </BrowserRouter>     
    )
}

export default App
