import React, { useContext, useEffect, useState } from 'react'
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
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../../context/auth'
import toast from 'react-hot-toast'
import { API_URL } from '../../config'
import { actionFetchData } from '../../actions/actions'

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const {Auth,logout}  = useContext(AuthContext);
  const [profileImage,setProfileImage] = useState(avatar8)

  const getProfileImage = async () => {
      const accessToken =  Auth('accessToken')

      let url = `${API_URL}/admin-user`;
      let response = await actionFetchData(url, accessToken);
      response = await response.json();

      if (response.status) {   
          setProfileImage(response.data.image_url)        
      }
  }

  const logoutUser = () => {
      logout();       
      setTimeout(() => {
          toast.success(`You have been logged out!`)
          navigate('/login')
      },500)
  }

  useEffect(()=>{
    getProfileImage();
  },[])

  
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={profileImage} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        
      
        <CDropdownHeader className="bg-body-secondary fw-semibold my-2">Settings</CDropdownHeader>
        <Link className="dropdown-item" to="/profile">
          <CIcon icon={cilSettings} className="me-2" />
          Profile Setting
        </Link>
       
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
