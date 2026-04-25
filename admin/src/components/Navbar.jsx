import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const location = useLocation()

  const navigate = useNavigate()

  // Determine role based on current route
  const isAdminRoute = location.pathname.startsWith('/admin-dashboard') ||
                       location.pathname.startsWith('/all-appointments') ||
                       location.pathname.startsWith('/add-doctor') ||
                       location.pathname.startsWith('/doctor-list')

  const isDoctorRoute = location.pathname.startsWith('/doctor-dashboard') ||
                        location.pathname.startsWith('/doctor-appointments') ||
                        location.pathname.startsWith('/doctor-profile')

  const logout = () => {
    // Only clear the token for the current role, keep the other role's session
    if (isAdminRoute) {
      setAToken('')
      localStorage.removeItem('aToken')
      navigate('/admin-login')
    } else if (isDoctorRoute) {
      setDToken('')
      localStorage.removeItem('dToken')
      navigate('/doctor-login')
    } else {
      navigate('/')
    }
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm'>
      <div className='flex items-center gap-2 text-xs'>
        <img onClick={() => navigate('/')} className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{isAdminRoute ? 'Admin' : 'Doctor'}</p>
      </div>
      <button onClick={() => logout()} className='bg-gradient-to-r from-blue-500 to-green-500 text-white text-sm px-10 py-2 rounded-full hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg'>Logout</button>
    </div>
  )
}

export default Navbar