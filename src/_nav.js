import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBarChart, cilBasket, cilDiamond, cilGift, cilLan, cilNotes, cilQrCode, cilSettings, cilShare, cilSpeedometer, cilUser } from '@coreui/icons'
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
    name: 'Redemptions',
    to: '/theme/typography',
    icon: <CIcon icon={cilShare} customClassName="nav-icon" />,

  },
  {
    component: CNavItem,
    name: 'Referrals',
    to: '/referrals/all-referrals',
    icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Report',
    to: '/theme/typography',
    icon: <CIcon icon={cilBarChart} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Other',
  },

  {
    component: CNavItem,
    name: 'App Settings',
    to: '/theme/typography',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Pages',
    to: '/pages/all-pages',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
]

export default _nav
