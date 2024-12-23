import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import ProtectRoute from '../ProtectRoute';
import AllUser from '../users/AllUser';
import NewUser from '../users/NewUser';
import EditUser from '../users/EditUser';
import AllProduct from '../products/AllProduct';
import NewProduct from '../products/NewProduct';
import EditProduct from '../products/EditProduct';
import AllReward from '../rewards/AllReward';
import NewReward from '../rewards/NewReward';
import EditReward from '../rewards/EditReward';
import AllOffers from '../offers/AllOffers';
import NewOffer from '../offers/NewOffer';
import EditOffer from '../offers/EditOffer';
import AllQrs from '../qr-manager/AllQrs';
import NewQrs from '../qr-manager/NewQrs';
import QrsDetail from '../qr-manager/QrsDetail';
import AllPages from '../pages/AllPages';
import EditPage from '../pages/EditPage';
import AllReferrals from '../referrals/AllReferrals';
import AllRedemptions from '../redemptions/AllRedemptions';
import CityUser from '../users/CityUser';
import ProfileSetting from '../account/ProfileSetting';
import ChangePassword from '../account/ChangePassword';
import NewNotification from '../notification/NewNotification';
import AllNotification from '../notification/AllNotification';
import AllEmployee from '../employee/AllEmployee';
import NewEmployee from '../employee/NewEmployee';
import AllRole from '../roles/AllRole';
import NewRole from '../roles/NewRole';
import EditRole from '../roles/EditRole';
import AllPermission from '../permmision/AllPermission';
import NewPermission from '../permmision/NewPermission';
import EditPermission from '../permmision/EditPermission';
import EditEmployee from '../employee/EditEmployee';

const AppContent = () => {
    const routes = [
        { path: '/dashboard', element: <Dashboard /> },
        { path: '/users/all-users', element: <AllUser /> },
        { path: '/users/add-user', element: <NewUser /> },
        { path: '/users/edit-user/:id', element: <EditUser /> },
        { path: '/users/city-users/:city', element: <CityUser /> },
        { path: '/products/all-products', element: <AllProduct /> },
        { path: '/products/add-product', element: <NewProduct /> },
        { path: '/products/edit-product/:id', element: <EditProduct /> },
        { path: '/rewards/all-rewards', element: <AllReward /> },
        { path: '/rewards/add-reward', element: <NewReward /> },
        { path: '/rewards/edit-reward/:id', element: <EditReward /> },
        { path: '/offers/all-offers', element: <AllOffers /> },
        { path: '/offers/add-offer', element: <NewOffer /> },
        { path: '/offers/edit-offer/:id', element: <EditOffer /> },
        { path: '/qr-manager/all-qr', element: <AllQrs /> },
        { path: '/qr-manager/generate-qr', element: <NewQrs /> },
        { path: '/qr-manager/qr-details/:productId/:batchNumber', element: <QrsDetail /> },
        { path: '/redemptions/all-redemptions', element: <AllRedemptions /> },
        { path: '/referrals/all-referrals', element: <AllReferrals /> },
        { path: '/pages/all-pages', element: <AllPages /> },
        { path: '/pages/edit-page/:id', element: <EditPage /> },
        { path: '/profile', element: <ProfileSetting /> },
        { path: '/change-password', element: <ChangePassword /> },
        { path: '/notification/all-notifications', element: <AllNotification /> },
        { path: '/notification/new-notification', element: <NewNotification /> },
        { path: '/employees/all-employee', element: <AllEmployee /> },
        { path: '/employees/add-employee', element: <NewEmployee /> },
        { path: '/employees/edit-employee/:id', element: <EditEmployee /> },
        { path: '/roles/all-role', element: <AllRole /> },
        { path: '/roles/new-role', element: <NewRole /> },
        { path: '/roles/edit-role/:id', element: <EditRole /> },
        { path: '/permissions/all-permission', element: <AllPermission /> },
        { path: '/permissions/new-permission', element: <NewPermission /> },
        { path: '/permissions/edit-permission/:id', element: <EditPermission /> },
    ];
      
    return (
        <Routes>
            <Route path="/" element={<Navigate to="login" replace />} />
            {routes.map(({ path, element }) => (
                <Route
                    key={path}
                    path={path}
                    element={<ProtectRoute>{element}</ProtectRoute>}
                />
            ))}
        </Routes>        
    );
};

export default React.memo(AppContent)