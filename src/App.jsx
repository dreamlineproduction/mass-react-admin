import { BrowserRouter, Routes, Route, } from 'react-router-dom';
import Login from './components/auth/Login';
import DefaultLayout from './components/layouts/DefaultLayout';
import './assets/js/app';
import './assets/css/style.scss'
function App() {

    return (     
        <BrowserRouter>
            <Routes>
                <Route exact path="/login" name="Login Page" element={<Login />} />
                <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
        </BrowserRouter>     
    )
}

export default App
