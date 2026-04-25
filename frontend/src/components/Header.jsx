import React, { useState } from 'react'
import { assets } from '../assets/assets'
import SelfAssessmentModal from './SelfAssessmentModal'

const Header = () => {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <div className='flex flex-col md:flex-row flex-wrap bg-gray-900 rounded-lg px-4 sm:px-6 md:px-8 lg:px-10 relative overflow-hidden'>

                {/* --------- Header Video Background --------- */}
                <div className='absolute inset-0 w-full h-full'>
                    <video 
                        className='w-full h-full object-cover' 
                        src={assets.hospital_video} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-15'></div>
                </div>

                {/* --------- Header Left --------- */}
                <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px] relative z-10'>
                    <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight'>
                        Book Appointment <br />  With Trusted Doctors
                    </p>
                    <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light'>
                        <img className='w-28' src={assets.group_profiles} alt="" />
                        <p>Simply browse through our extensive list of trusted doctors, <br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
                    </div>
                    <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
                        <a href='#speciality' className='flex items-center justify-center gap-2 bg-white px-6 py-3 rounded-full text-[#595959] text-sm hover:scale-105 transition-all duration-300'>
                            Book appointment <img className='w-3' src={assets.arrow_icon} alt="" />
                        </a>
                        <button 
                            onClick={() => setShowModal(true)}
                            className='flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-blue-500 px-6 py-3 rounded-full text-white text-sm hover:scale-105 transition-all duration-300 shadow-lg'
                        >
                            Self Assessment <img className='w-3 invert' src={assets.arrow_icon} alt="" />
                        </button>
                    </div>
                </div>

                {/* --------- Header Right --------- */}
                <div className='md:w-1/2 relative'>
                </div>
            </div>

            {/* Self Assessment Modal */}
            <SelfAssessmentModal isOpen={showModal} onClose={() => setShowModal(false)} />
        </>
    )
}

export default Header