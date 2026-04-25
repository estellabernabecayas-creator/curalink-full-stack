import React, { useContext } from 'react'
import { DoctorContext } from './context/DoctorContext';
import { AdminContext } from './context/AdminContext';
import { Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import Earnings from './pages/Admin/Earnings';
import AdminLogin from './pages/Admin/AdminLogin';
import DoctorLogin from './pages/Doctor/DoctorLogin';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import VideoConsultation from './pages/Doctor/VideoConsultation';

const App = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)
  const location = useLocation()

  // Check if current path is a login route - always accessible
  const isLoginRoute = location.pathname === '/' || location.pathname === '/admin-login' || location.pathname === '/doctor-login'

  // Check if current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin-dashboard') ||
                       location.pathname.startsWith('/all-appointments') ||
                       location.pathname.startsWith('/add-doctor') ||
                       location.pathname.startsWith('/doctor-list') ||
                       location.pathname.startsWith('/earnings')

  // Check if current path is a doctor route
  const isDoctorRoute = location.pathname.startsWith('/doctor-dashboard') ||
                        location.pathname.startsWith('/doctor-appointments') ||
                        location.pathname.startsWith('/doctor-profile') ||
                        location.pathname.startsWith('/video-consultation')

  // If on login route, show login routes
  if (isLoginRoute) {
    return (
      <>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<AdminLogin />} />
          <Route path='/admin-login' element={<AdminLogin />} />
          <Route path='/doctor-login' element={<DoctorLogin />} />
        </Routes>
      </>
    )
  }

  // If on admin route and aToken exists in localStorage, show admin routes
  if (isAdminRoute && localStorage.getItem('aToken')) {
    return (
      <div className='bg-gradient-to-br from-blue-50 via-green-50 to-white min-h-screen'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='/earnings' element={<Earnings />} />
          </Routes>
        </div>
      </div>
    )
  }

  // If on doctor route and dToken exists in localStorage, show doctor routes
  if (isDoctorRoute && localStorage.getItem('dToken')) {
    return (
      <div className='bg-gradient-to-br from-blue-50 via-green-50 to-white min-h-screen'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
            <Route path='/video-consultation/:appointmentId' element={<VideoConsultation />} />
          </Routes>
        </div>
      </div>
    )
  }

  // If on admin route but no aToken in localStorage, redirect to admin login
  if (isAdminRoute) {
    window.location.href = '/admin-login'
    return null
  }

  // If on doctor route but no dToken in localStorage, redirect to doctor login
  if (isDoctorRoute) {
    window.location.href = '/doctor-login'
    return null
  }

  // Fallback: check localStorage for tokens
  if (localStorage.getItem('aToken')) {
    return (
      <div className='bg-gradient-to-br from-blue-50 via-green-50 to-white min-h-screen'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/admin-dashboard' element={<Dashboard />} />
            <Route path='/all-appointments' element={<AllAppointments />} />
            <Route path='/add-doctor' element={<AddDoctor />} />
            <Route path='/doctor-list' element={<DoctorsList />} />
            <Route path='/earnings' element={<Earnings />} />
          </Routes>
        </div>
      </div>
    )
  }

  // If dToken exists in localStorage, show doctor routes
  if (localStorage.getItem('dToken')) {
    return (
      <div className='bg-gradient-to-br from-blue-50 via-green-50 to-white min-h-screen'>
        <ToastContainer />
        <Navbar />
        <div className='flex items-start'>
          <Sidebar />
          <Routes>
            <Route path='/' element={<></>} />
            <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
            <Route path='/doctor-appointments' element={<DoctorAppointments />} />
            <Route path='/doctor-profile' element={<DoctorProfile />} />
            <Route path='/video-consultation/:appointmentId' element={<VideoConsultation />} />
          </Routes>
        </div>
      </div>
    )
  }

  // No token, show login routes
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<AdminLogin />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/doctor-login' element={<DoctorLogin />} />
      </Routes>
    </>
  )
}

export default App