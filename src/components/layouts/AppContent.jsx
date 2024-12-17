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


const AppContent = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="login" replace />} />
            <Route
                path='/dashboard'
                element={
                    <ProtectRoute>
                        <Dashboard />
                    </ProtectRoute>
                }
            />            

            <Route
                path='/users/all-users'
                element={
                    <ProtectRoute>
                        <AllUser />
                    </ProtectRoute>
                }
            />
            <Route
                path='/users/add-user'
                element={
                    <ProtectRoute>
                        <NewUser />
                    </ProtectRoute>
                }
            />
            <Route
                path='/users/edit-user/:id'
                element={
                    <ProtectRoute>
                        <EditUser />
                    </ProtectRoute>
                }
            />

            <Route
                path='/users/city-users/:city'
                element={
                    <ProtectRoute>
                        <CityUser />
                    </ProtectRoute>
                }
            />

            <Route
                path='/products/all-products'
                element={
                    <ProtectRoute>
                        <AllProduct />
                    </ProtectRoute>
                }
            />
            <Route
                path='/products/add-product'
                element={
                    <ProtectRoute>
                        <NewProduct />
                    </ProtectRoute>
                }
            />
            <Route
                path='/products/edit-product/:id'
                element={
                    <ProtectRoute>
                        <EditProduct />
                    </ProtectRoute>
                }
            />

            <Route
                path='/rewards/all-rewards'
                element={
                    <ProtectRoute>
                        <AllReward />
                    </ProtectRoute>
                }
            />

            <Route
                path='/rewards/add-reward'
                element={
                    <ProtectRoute>
                        <NewReward />
                    </ProtectRoute>
                }
            />
            <Route
                path='/rewards/edit-reward/:id'
                element={
                    <ProtectRoute>
                        <EditReward />
                    </ProtectRoute>
                }
            />

            <Route
                path='/offers/all-offers'
                element={
                    <ProtectRoute>
                        <AllOffers />
                    </ProtectRoute>
                }
            />

            <Route
                path='/offers/add-offer'
                element={
                    <ProtectRoute>
                        <NewOffer />
                    </ProtectRoute>
                }
            />

            <Route
                path='/offers/edit-offer/:id'
                element={
                    <ProtectRoute>
                        <EditOffer />
                    </ProtectRoute>
                }
            />

            <Route
                path='/qr-manager/all-qr'
                element={
                    <ProtectRoute>
                        <AllQrs />
                    </ProtectRoute>
                }
            />
            
            <Route
                path='/qr-manager/generate-qr'
                element={
                    <ProtectRoute>
                        <NewQrs />
                    </ProtectRoute>
                }
            />
            

            <Route
                path='/qr-manager/qr-details/:productId/:batchNumber'
                element={
                    <ProtectRoute>
                        <QrsDetail />
                    </ProtectRoute>
                }
            />
             <Route
                path='/redemptions/all-redemptions'
                element={
                    <ProtectRoute>
                        <AllRedemptions />
                    </ProtectRoute>
                }
            />

            <Route
                path='/referrals/all-referrals'
                element={
                    <ProtectRoute>
                        <AllReferrals />
                    </ProtectRoute>
                }
            />


            <Route
                path='/pages/all-pages'
                element={
                    <ProtectRoute>
                        <AllPages />
                    </ProtectRoute>
                }
            />
            <Route
                path='/pages/edit-page/:id'
                element={
                    <ProtectRoute>
                        <EditPage />
                    </ProtectRoute>
                }
            />
            <Route
                path='/profile'
                element={
                    <ProtectRoute>
                        <ProfileSetting />
                    </ProtectRoute>
                }
            />
             <Route
                path='/change-password'
                element={
                    <ProtectRoute>
                        <ChangePassword />
                    </ProtectRoute>
                }
            /> 

            <Route
                path='/notification/all-notifications'
                element={
                    <ProtectRoute>
                        <AllNotification />
                    </ProtectRoute>
                }
            />
            <Route
                path='/notification/new-notification'
                element={
                    <ProtectRoute>
                        <NewNotification  />
                    </ProtectRoute>
                }
            />          
        </Routes>
    );
};

export default React.memo(AppContent)