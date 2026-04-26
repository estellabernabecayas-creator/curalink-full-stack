import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import VideoConsultation from './pages/VideoConsultation'
import ScrollToTop from './components/ScrollToTop'
import BackToTop from './components/BackToTop'

const App = () => {
  useEffect(() => {
    const handleUnhandledError = (event) => {
      console.error('Unhandled error:', event.error);
      event.preventDefault();
    };

    window.addEventListener('error', handleUnhandledError);
    window.addEventListener('unhandledrejection', handleUnhandledError);

    return () => {
      window.removeEventListener('error', handleUnhandledError);
      window.removeEventListener('unhandledrejection', handleUnhandledError);
    };
  }, []);

  return (
    <div className='bg-gradient-to-br from-blue-50 via-green-50 to-white min-h-screen dark:from-slate-900 dark:via-slate-800 dark:to-emerald-900'>
      <ScrollToTop />
      <BackToTop />
      <div className='mx-2 sm:mx-[3%]'>
        <ToastContainer />
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/verify' element={<Verify />} />
          <Route path='/video-consultation/:appointmentId' element={<VideoConsultation />} />
          <Route path='/video-consultation/:appointmentId' element={<VideoConsultation />} />
        </Routes>
        <Footer />
      </div>
    </div>
  )
}

export default App