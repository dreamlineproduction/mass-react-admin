import { Link, NavLink } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { BsQrCodeScan } from "react-icons/bs";
import { IoDiamondOutline, IoGiftOutline, IoSpeedometerOutline } from "react-icons/io5";

import 'simplebar-react/dist/simplebar.min.css';
import { FiShoppingBag, FiUsers } from 'react-icons/fi';
import { PiShareFat } from 'react-icons/pi';
import { MdOutlineAccountBalance } from 'react-icons/md';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { LuClipboardList } from 'react-icons/lu';


const AppSidebar = () => {
    return (
        <nav className='sidebar'>
            <SimpleBar forceVisible="y">
                <div className="sidebar-content">
                    <Link className="sidebar-brand" to="/dashboard">
                        <span className="align-middle">AdminKit</span>
                    </Link>
                    <ul className="sidebar-nav" id='sidebar'> 
                        <li className="sidebar-header">
                            Modules
                        </li>                      
                        <li className="sidebar-item">
                            <NavLink className="sidebar-link" to="/dashboard">
                                <IoSpeedometerOutline style={{height:"20px",width:"30px"}} /> 
                                <span className="align-middle">Dashboard</span>
                            </NavLink>
                        </li>
                       
                        <li className='sidebar-item'>
                            <a data-bs-target="#users" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                
                                <FiUsers  style={{height:"20px",width:"30px"}} />
                                <span className="align-middle">Users</span>
                            </a>

                            <ul id="users" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="/users/all-users">All User</NavLink>
                                </li>                               
                            </ul>
                        </li>
                        <li className='sidebar-item'>
                            <a data-bs-target="#products" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                
                                <FiShoppingBag  style={{height:"20px",width:"30px"}} />
                                <span className="align-middle">Products</span>
                            </a>

                            <ul id="products" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="/products/all-products">All Product</NavLink>
                                </li>                               
                            </ul>
                        </li>

                        <li className='sidebar-item'>
                            <a data-bs-target="#rewards" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                
                                <IoDiamondOutline style={{height:"20px",width:"30px"}} />
                                <span className="align-middle">Reward Store</span>
                            </a>

                            <ul id="rewards" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="/rewards/all-rewards">All Reward
                                    </NavLink>
                                </li>                               
                            </ul>
                        </li>

                        <li className='sidebar-item'>
                            <a data-bs-target="#offers" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                                                
                                <IoGiftOutline  style={{height:"20px",width:"30px"}} />
                                <span className="align-middle">Offers</span>
                            </a>

                            <ul id="offers" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="/offers/all-offers">All Offer
                                    </NavLink>
                                </li>                               
                            </ul>
                        </li>

                        <li className='sidebar-item'>
                            <a data-bs-target="#qrmanager" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                                                
                                <BsQrCodeScan  style={{height:"20px",width:"30px"}} />
                                <span className="align-middle">QR Manager</span>
                            </a>

                            <ul id="qrmanager" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="/qr-manager/all-qr">QR Codes
                                    </NavLink>
                                </li>                               
                            </ul>
                        </li>

                        <li className='sidebar-item'>
                            <a data-bs-target="#redemptions" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                                                
                                <PiShareFat   style={{height:"20px",width:"30px"}} />

                                <span className="align-middle">All Redemptions</span>
                            </a>

                            <ul id="redemptions" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="redemptions/all-redemptions">Redemptions
                                    </NavLink>
                                </li>                               
                            </ul>
                        </li>
                        <li className='sidebar-item'>
                            <a data-bs-target="#referrals" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                                                
                                <MdOutlineAccountBalance style={{height:"20px",width:"30px"}} />
                                <span className="align-middle">All Referrals</span>
                            </a>

                            <ul id="referrals" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="referrals/all-referrals">Referrals
                                    </NavLink>
                                </li>                               
                            </ul>
                        </li>

                        <li className="sidebar-header">
                            Others
                        </li>
                        <li className='sidebar-item'>
                            <a data-bs-target="#notification" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                                                
                                <IoMdNotificationsOutline  style={{height:"20px",width:"30px"}} />
                                <span className="align-middle">Notifications</span>
                            </a>

                            <ul id="notification" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="notification/all-notifications">Notification
                                    </NavLink>
                                </li>                               
                            </ul>
                        </li>
                        <li className='sidebar-item'>
                            <a data-bs-target="#pages" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                                                
                                <LuClipboardList  style={{height:"20px",width:"30px"}} />
                                <span className="align-middle">Pages</span>
                            </a>

                            <ul id="pages" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <NavLink className="sidebar-link" to="pages/all-pages">Pages
                                    </NavLink>
                                </li>                               
                            </ul>
                        </li>
                        {/* <li className="sidebar-item">
                            <a data-bs-target="#pages" data-bs-toggle="collapse" className="sidebar-link collapsed" aria-expanded="false">                                
                                <Layout width={18} className='align-middle' />
                                <span className="align-middle">Pages</span>
                            </a>
                            <ul id="pages" className="sidebar-dropdown list-unstyled collapse" data-bs-parent="#sidebar">
                                <li className="sidebar-item">
                                    <a className="sidebar-link" href="/pages-settings">Settings</a>
                                </li>
                                <li className="sidebar-item">
                                    <a className="sidebar-link" href="/pages-projects">Projects <span className="sidebar-badge badge bg-primary">Pro</span></a>
                                </li>
                                <li className="sidebar-item">
                                    <a className="sidebar-link" href="/pages-clients">Clients <span className="sidebar-badge badge bg-primary">Pro</span></a>
                                </li>
                                <li className="sidebar-item">
                                    <a className="sidebar-link" href="/pages-orders">Orders <span className="sidebar-badge badge bg-primary">Pro</span></a>
                                </li>
                                <li className="sidebar-item">
                                    <a className="sidebar-link" href="/pages-pricing">Pricing <span className="sidebar-badge badge bg-primary">Pro</span></a>
                                </li>
                                <li className="sidebar-item">
                                    <a className="sidebar-link" href="/pages-chat">Chat <span className="sidebar-badge badge bg-primary">Pro</span></a>
                                </li>
                                <li className="sidebar-item">
                                    <a className="sidebar-link" href="/pages-blank">Blank Page</a>
                                </li>
                            </ul>
                        </li> */}
                        {/* <li className="sidebar-header">
                            Tools & Components
                        </li>
                        <li className="sidebar-item">
                            <a className="sidebar-link" href="ui-buttons.html">
                                <Square width={18} className='align-middle' />
                                <span className="align-middle">Buttons</span>
                            </a>
                        </li> */}
                        
                    </ul>                    
                </div>
            </SimpleBar>
        </nav>
    );
};

export default AppSidebar;