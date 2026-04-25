import axios from 'axios'
import React, { useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { DoctorContext } from '../../context/DoctorContext'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { setAToken } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
    if (data.success) {
      setAToken(data.token)
      localStorage.setItem('aToken', data.token)
      navigate('/admin-dashboard')
    } else {
      toast.error(data.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center' autoComplete="off">
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-700 text-sm shadow-lg bg-white/80 backdrop-blur-sm'>
        {/* Hidden dummy fields to trick browser autofill */}
        <input type="text" style={{ display: 'none' }} autoComplete="off" />
        <input type="password" style={{ display: 'none' }} autoComplete="off" />
        
        <p className='text-2xl font-semibold m-auto'><span className='bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'>Admin</span> Login</p>
        <div className='w-full '>
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} className='border border-blue-200 rounded w-full p-2 mt-1 focus:border-blue-400 focus:outline-none transition-colors' type="email" required autoComplete="nope" />
        </div>
        <div className='w-full'>
          <p>Password</p>
          <div className='relative mt-1'>
            <input onChange={(e) => setPassword(e.target.value)} value={password} className='border border-blue-200 rounded w-full p-2 pr-10 focus:border-blue-400 focus:outline-none transition-colors' type={showPassword ? 'text' : 'password'} required autoComplete="nope" />
            <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors'>
              {showPassword ? (
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88' />
                </svg>
              ) : (
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={1.5} stroke='currentColor' className='w-5 h-5'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z' />
                  <path strokeLinecap='round' strokeLinejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                </svg>
              )}
            </button>
          </div>
        </div>
        <button className='bg-gradient-to-r from-blue-500 to-green-500 text-white w-full py-2 rounded-md text-base hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg'>Login</button>
      </div>
    </form>
  )
}

export default AdminLogin
