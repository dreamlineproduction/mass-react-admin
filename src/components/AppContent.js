import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

import Dashboard from '../views/dashboard/Dashboard'
import AllUser from '../views/users/AllUser';
import NewUser from '../views/users/NewUser';
import RequireAuth from '../RequireAuth'
import NewProduct from '../views/products/NewProduct';
import AllProduct from '../views/products/AllProduct';
import EditProduct from '../views/products/EditProduct';
import EditUser from '../views/users/EditUser';
import NewReward from '../views/rewards/NewReward';
import AllReward from '../views/rewards/AllReward';
import EditReward from '../views/rewards/EditReward';
import NewQrs from '../views/qr-manager/NewQrs';
import AllQrs from '../views/qr-manager/AllQrs';
import QrsDetail from '../views/qr-manager/QrsDetail';
import NewOffer from '../views/offers/NewOffer';
import AllOffers from '../views/offers/AllOffers';
import EditOffer from '../views/offers/EditOffer';
import AllPages from '../views/pages/AllPages';
import EditPage from '../views/pages/EditPage';
import AllReferrals from '../views/referrals/AllReferrals';
import NewReferrals from '../views/referrals/NewReferrals';

const AppContent = () => {
    return (
        <CContainer className="px-4" lg>
            <Suspense fallback={<CSpinner color="primary" />}>
                <Routes>
                    <Route path="/" element={<Navigate to="login" replace />} />

                    <Route
                        path='/dashboard'
                        element={
                            <RequireAuth>
                                <Dashboard />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/users/all-users'
                        element={
                            <RequireAuth>
                                <AllUser />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/users/add-user'
                        element={
                            <RequireAuth>
                                <NewUser />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/products/all-products'
                        element={
                            <RequireAuth>
                                <AllProduct />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/products/add-product'
                        element={
                            <RequireAuth>
                                <NewProduct />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/products/edit-product/:id'
                        element={
                            <RequireAuth>
                                <EditProduct />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/users/edit-user/:id'
                        element={
                            <RequireAuth>
                                <EditUser />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/rewards/all-rewards'
                        element={
                            <RequireAuth>
                                <AllReward />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/rewards/new-reward'
                        element={
                            <RequireAuth>
                                <NewReward />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/rewards/edit-reward/:id'
                        element={
                            <RequireAuth>
                                <EditReward />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/offers/all-offers'
                        element={
                            <RequireAuth>
                                <AllOffers />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/referrals/all-referrals'
                        element={
                            <RequireAuth>
                                <AllReferrals />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/referrals/new-referrals'
                        element={
                            <RequireAuth>
                                <NewReferrals />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/offers/edit-offer/:id'
                        element={
                            <RequireAuth>
                                <EditOffer />
                            </RequireAuth>
                        }
                    />


                    <Route
                        path='/offers/new-offer'
                        element={
                            <RequireAuth>
                                <NewOffer />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/qr-manager/all-qr'
                        element={
                            <RequireAuth>
                                <AllQrs />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/qr-manager/generate-qr'
                        element={
                            <RequireAuth>
                                <NewQrs />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/qr-manager/qr-details/:productId/:batchNumber'
                        element={
                            <RequireAuth>
                                <QrsDetail />
                            </RequireAuth>
                        }
                    />

                    <Route
                        path='/pages/all-pages'
                        element={
                            <RequireAuth>
                                <AllPages />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path='/pages/edit-page/:id'
                        element={
                            <RequireAuth>
                                <EditPage />
                            </RequireAuth>
                        }
                    />


                </Routes>
            </Suspense>
        </CContainer>
    )
}

export default React.memo(AppContent)
