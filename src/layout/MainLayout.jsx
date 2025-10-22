import React from 'react'
import { Outlet } from 'react-router-dom'
import Footer from '../component/common/Footer'

import Header from '../component/common/Header'




const MainLayout = () => {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  )
}

export default MainLayout
