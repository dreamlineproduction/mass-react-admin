import React, { useContext } from 'react'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilLockLocked,
  cilSettings,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../../context/auth'
import toast from 'react-hot-toast'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const {AuthCheck,logout,Auth}  = useContext(AuthContext);
  
  const logoutUser = () => {
      logout();       
      setTimeout(() => {
          toast.success(`You have been logged out!`)
          navigate('/login')
      },500)
  }
  
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        
      
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Profile Setting
        </CDropdownItem>
       
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={logoutUser}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
