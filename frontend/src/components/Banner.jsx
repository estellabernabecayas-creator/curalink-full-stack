import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Banner = () => {

    const navigate = useNavigate()

    return (
        <div className='flex bg-primary rounded-lg px-4 sm:px-6 md:px-8 lg:px-10 my-20 relative overflow-hidden'>

            {/* --------- Banner Video Background --------- */}
            <div className='absolute inset-0 w-full h-full'>
                <video 
                    className='w-full h-full object-cover' 
                    src={assets.medical_video} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                />
                <div className='absolute inset-0 bg-black bg-opacity-30'></div>
            </div>

            {/* ------- Left Side ------- */}
            <div className='flex-1 py-8 sm:py-10 md:py-16 lg:py-24 lg:pl-5 relative z-10'>
                <div className='text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold text-white'>
                    <p>Book Appointment</p>
                    <p className='mt-4'>With 100+ Trusted Doctors</p>
                </div>
                <button onClick={() => { navigate('/login'); scrollTo(0, 0) }} className='bg-white text-sm sm:text-base text-[#595959] px-8 py-3 rounded-full mt-6 hover:scale-105 transition-all '>Create account</button>
            </div>

            {/* ------- Right Side ------- */}
            <div className='block w-full md:w-1/2 lg:w-[370px] relative z-10 h-32 md:h-auto'>
                <img className='w-full relative md:absolute bottom-0 right-0 max-w-md' src={assets.appointment_img} alt="" />
            </div>
        </div>
    )
}

export default Banner