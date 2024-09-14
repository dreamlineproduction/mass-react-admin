import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Toaster } from 'react-hot-toast'

const DefaultLayout = () => {
  return (
    <div>
      <Toaster
          position="top-center"
          reverseOrder={false}
      />
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
