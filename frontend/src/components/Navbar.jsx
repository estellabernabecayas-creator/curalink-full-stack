import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {

  const navigate = useNavigate()

  const [showMenu, setShowMenu] = useState(false)
  const { token, setToken, userData } = useContext(AppContext)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(false)
    navigate('/')
  }

  return (
    <div className='sticky top-0 z-50 -mx-2 sm:-mx-[3%] flex items-center justify-between text-sm py-4 mb-5 border-b border-b-[#ADADAD] dark:border-b-slate-600 bg-gradient-to-br from-blue-50/95 via-green-50/95 to-white/95 dark:from-slate-900/95 dark:via-slate-800/95 dark:to-emerald-900/95 backdrop-blur-sm px-2 sm:px-[3%]'>
      <img onClick={() => navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt="" />
      <ul className='lg:flex items-start gap-5 font-medium hidden absolute left-1/2 transform -translate-x-1/2'>
        <NavLink to='/' >
          <li className='py-1 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-transparent hover:bg-clip-text dark:hover:text-white dark:hover:bg-none transition-all duration-300 cursor-pointer'>HOME</li>
          <hr className='border-none outline-none h-0.5 bg-gradient-to-r from-blue-500 to-green-500 w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/doctors' >
          <li className='py-1 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-transparent hover:bg-clip-text dark:hover:text-white dark:hover:bg-none transition-all duration-300 cursor-pointer'>ALL DOCTORS</li>
          <hr className='border-none outline-none h-0.5 bg-gradient-to-r from-blue-500 to-green-500 w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/about' >
          <li className='py-1 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-transparent hover:bg-clip-text dark:hover:text-white dark:hover:bg-none transition-all duration-300 cursor-pointer'>ABOUT US</li>
          <hr className='border-none outline-none h-0.5 bg-gradient-to-r from-blue-500 to-green-500 w-3/5 m-auto hidden' />
        </NavLink>
        <NavLink to='/contact' >
          <li className='py-1 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-transparent hover:bg-clip-text dark:hover:text-white dark:hover:bg-none transition-all duration-300 cursor-pointer'>CONTACT</li>
          <hr className='border-none outline-none h-0.5 bg-gradient-to-r from-blue-500 to-green-500 w-3/5 m-auto hidden' />
        </NavLink>
      </ul>

      <div className='flex items-center gap-4 '>
        <ThemeToggle />
        {
          token && userData
            ? <div className='flex items-center gap-2 cursor-pointer group relative'>
              <img className='w-8 rounded-full' src={userData.image} alt="" />
              <img className='w-2.5' src={assets.dropdown_icon} alt="" />
              <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 dark:text-gray-300 z-20 hidden group-hover:block'>
                <div className='min-w-48 bg-gray-50 dark:bg-dark-slate-light rounded flex flex-col gap-4 p-4'>
                  <p onClick={() => navigate('/my-profile')} className='hover:text-black dark:hover:text-white cursor-pointer'>My Profile</p>
                  <p onClick={() => navigate('/my-appointments')} className='hover:text-black dark:hover:text-white cursor-pointer'>My Appointments</p>
                  <p onClick={logout} className='hover:text-black dark:hover:text-white cursor-pointer'>Logout</p>
                </div>
              </div>
            </div>
            : <div className='hidden lg:block'>
                <div className='flex items-center gap-3'>
                  <button onClick={() => {
  const currentPath = window.location.pathname;
  if (currentPath === '/login') {
    // If on login page, emit a custom event to switch to Login
    window.dispatchEvent(new CustomEvent('switchToLogin'));
  } else {
    // If on other pages, navigate to login
    navigate('/login', { state: 'Login' });
  }
}} className='border border-blue-500 text-blue-600 dark:text-white dark:hover:bg-blue-900 dark:hover:text-white px-5 py-2 rounded-full font-light hover:bg-blue-50 transition-colors'>Login</button>
                  <button onClick={() => {
  const currentPath = window.location.pathname;
  if (currentPath === '/login') {
    // If on login page, emit a custom event to switch to Sign Up
    window.dispatchEvent(new CustomEvent('switchToSignUp'));
  } else {
    // If on other pages, navigate to login
    navigate('/login');
  }
}} className='bg-gradient-to-r from-blue-500 to-green-500 text-white px-5 py-2 rounded-full font-light hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg'>Create account</button>
                </div>
              </div>
        }
        <img onClick={() => setShowMenu(true)} className='w-6 lg:hidden dark:invert dark:brightness-0' src={assets.menu_icon} alt="" />

        {/* ---- Mobile Menu ---- */}
        <div className={`lg:hidden ${showMenu ? 'fixed w-full h-screen' : 'h-0 w-0'} right-0 top-0 bottom-0 z-[100] overflow-hidden bg-white dark:bg-slate-800 transition-all duration-300`}>
          <div className='flex items-center justify-between px-5 py-6'>
            <img src={assets.logo} className='w-36' alt="" />
            <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className='w-7 dark:invert dark:brightness-0' alt="" />
          </div>
          <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium'>
            <NavLink onClick={() => setShowMenu(false)} to='/' className={({ isActive }) => `px-4 py-2 rounded-full inline-block transition-all duration-300 cursor-pointer ${isActive ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white'}`}>HOME</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/doctors' className={({ isActive }) => `px-4 py-2 rounded-full inline-block transition-all duration-300 cursor-pointer ${isActive ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white'}`}>ALL DOCTORS</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/about' className={({ isActive }) => `px-4 py-2 rounded-full inline-block transition-all duration-300 cursor-pointer ${isActive ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white'}`}>ABOUT US</NavLink>
            <NavLink onClick={() => setShowMenu(false)} to='/contact' className={({ isActive }) => `px-4 py-2 rounded-full inline-block transition-all duration-300 cursor-pointer ${isActive ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white'}`}>CONTACT</NavLink>
            {!token && (
              <div className='flex flex-col gap-3 mt-4 w-full'>
                <button onClick={() => { 
  const currentPath = window.location.pathname;
  if (currentPath === '/login') {
    window.dispatchEvent(new CustomEvent('switchToLogin'));
    setShowMenu(false);
  } else {
    navigate('/login', { state: 'Login' }); 
    setShowMenu(false);
  }
}} className='border border-blue-500 text-blue-600 dark:text-white dark:hover:bg-blue-900 dark:hover:text-white px-6 py-2 rounded-full font-light hover:bg-blue-50 transition-colors'>Login</button>
                <button onClick={() => { 
  const currentPath = window.location.pathname;
  if (currentPath === '/login') {
    window.dispatchEvent(new CustomEvent('switchToSignUp'));
    setShowMenu(false);
  } else {
    navigate('/login'); 
    setShowMenu(false);
  }
}} className='bg-gradient-to-r from-blue-500 to-green-500 text-white px-6 py-2 rounded-full font-light hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg'>Create account</button>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
} 

export default Navbar