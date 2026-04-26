import React from 'react'

import { specialityData } from '../assets/assets'

import { Link, useNavigate } from 'react-router-dom'



const SpecialityMenu = () => {

    const navigate = useNavigate();

    return (

        <section id='speciality' className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900'>

            <div className='max-w-7xl mx-auto'>

                {/* Header Section */}

                <div className='text-center mb-16'>

                    <span className='inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-full'>

                        Medical Specialities

                    </span>

                    <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight'>

                        Find by <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500'>Speciality</span>

                    </h2>

                    <p className='max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 leading-relaxed'>

                        Connect with trusted healthcare specialists across various medical fields. 

                        Book appointments seamlessly with verified doctors.

                    </p>

                </div>



                {/* Speciality Cards Grid */}

                <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6'>

                    {specialityData.map((item, index) => (

                        <Link 

                            to={`/doctors/${item.speciality}`} 

                            onClick={() => {
                                setTimeout(() => {
                                    window.scrollTo(0, 0);
                                    document.documentElement.scrollTop = 0;
                                    document.body.scrollTop = 0;
                                }, 10);
                            }} 

                            key={index}

                            className='group relative'

                        >

                            <div className='relative flex flex-col items-center p-6 sm:p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-slate-900/50 transition-all duration-500 ease-out hover:-translate-y-3 hover:border-blue-200 dark:hover:border-blue-800 overflow-hidden'>

                                {/* Gradient Overlay on Hover */}

                                <div className='absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/10 dark:to-cyan-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>

                                

                                {/* Icon Container with Glow Effect */}

                                <div className='relative mb-4 p-4 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 rounded-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out shadow-md group-hover:shadow-blue-200 dark:group-hover:shadow-blue-900/50'>

                                    <img 

                                        className='w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all duration-500' 

                                        src={item.image} 

                                        alt={item.speciality}

                                        loading='lazy'

                                    />

                                </div>

                                

                                {/* Speciality Name */}

                                <h3 className='relative text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 text-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight min-h-[2.5rem] flex items-center justify-center px-1'>

                                    {item.speciality}

                                </h3>

                                

                                {/* Hover Arrow Indicator */}

                                <div className='absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 ease-out shadow-lg'>

                                    <svg xmlns='http://www.w3.org/2000/svg' className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>

                                        <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />

                                    </svg>

                                </div>

                            </div>

                        </Link>

                    ))}

                </div>



                {/* Browse All Doctors Button */}

                <div className='text-center mt-12'>

                    <button 
                        onClick={() => {
                            navigate('/doctors');
                            // Force scroll to top immediately
                            setTimeout(() => {
                                window.scrollTo(0, 0);
                                document.documentElement.scrollTop = 0;
                                document.body.scrollTop = 0;
                            }, 10);
                        }}
                        className='inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5'
                    >
                        <span>Browse All Doctors</span>
                        <svg xmlns='http://www.w3.org/2000/svg' className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M17 8l4 4m0 0l-4 4m4-4H3' />
                        </svg>
                    </button>

                    <p className='mt-3 text-sm text-gray-500 dark:text-gray-400'>

                        Explore doctors across all {specialityData.length} specialities

                    </p>

                </div>

            </div>

        </section>

    )

}



export default SpecialityMenu