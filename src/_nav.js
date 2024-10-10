import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBasket, cilBell, cilDiamond, cilGift, cilLan, cilNotes, cilQrCode, cilSettings, cilShare, cilSpeedometer, cilUser } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'primary',
      text: 'NEW',
    },
  },

  {
    component: CNavItem,
    name: 'Users',
    to: '/users/all-users',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Products',
    to: '/products/all-products',
    icon: <CIcon icon={cilBasket} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Reward Store',
    to: '/rewards/all-rewards',
    icon: <CIcon icon={cilDiamond} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Offers',
    to: '/offers/all-offers',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'QR Manager',
    to: '/qr-manager/all-qr',
    icon: <CIcon icon={cilQrCode} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'All Redemptions',
    to: '/redemptions/all-redemptions',
    icon: <CIcon icon={cilShare} customClassName="nav-icon" />,

  },
  {
    component: CNavItem,
    name: 'Referrals',
    to: '/referrals/all-referrals',
    icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
  },


  {
    component: CNavTitle,
    name: 'Other',
  },

  {
    component: CNavItem,
    name: 'Notification',
    to: '/notification/all-notifications',
    icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Pages',
    to: '/pages/all-pages',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
]

export default _nav
