import React from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {

  const navigate = useNavigate()

  return (
    <div className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-4 m-auto items-center p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-gray-700 text-sm shadow-lg bg-white/80 backdrop-blur-sm'>
        <p className='text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent'>Select Login Type</p>
        <p className='text-center'>Choose your login type to proceed</p>
        
        <button 
          onClick={() => navigate('/admin-login')}
          className='bg-gradient-to-r from-blue-500 to-green-500 text-white w-full py-3 rounded-md text-base hover:from-blue-600 hover:to-green-600 transition-all duration-300 shadow-md hover:shadow-lg'
        >
          Admin Login
        </button>
        
        <button 
          onClick={() => navigate('/doctor-login')}
          className='bg-gradient-to-r from-green-500 to-blue-500 text-white w-full py-3 rounded-md text-base hover:from-green-600 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg'
        >
          Doctor Login
        </button>
      </div>
    </div>
  )
}

export default Login