import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)

    return (
        <section className='py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900'>
            <div className='max-w-7xl mx-auto'>
                {/* Header Section */}
                <div className='text-center mb-12'>
                    <span className='inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full'>
                        Trusted Healthcare
                    </span>
                    <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight'>
                        Doctors to <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500'>Book</span>
                    </h2>
                    <p className='max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400 leading-relaxed'>
                        Connect with our trusted network of verified doctors ready to provide quality healthcare services.
                    </p>
                </div>

                {/* Doctors Grid */}
                <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {doctors.slice(0, 10).map((item, index) => (
                    <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-gray-200 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:p-[2px] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 shadow-md hover:shadow-xl' key={index}>
                        <div className='w-full h-full bg-white dark:bg-dark-slate-light rounded-xl overflow-hidden'>
                            <div className='bg-[#f8fbff] dark:bg-dark-slate'>
                                <img className='w-full' src={item.image} alt="" />
                            </div>
                            <div className='p-4'>
                                <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-600 font-medium' : "text-gray-500 dark:text-gray-400"}`}>
                                    {item.available ? (
                                        <>
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            <span>Available Now</span>
                                        </>
                                    ) : (
                                        <>
                                            <p className={`w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400`}></p>
                                            <p>Not Available</p>
                                        </>
                                    )}
                                </div>
                                <p className='text-gray-900 dark:text-white text-lg font-medium mt-2'>{item.name}</p>
                                <p className='text-gray-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            </div>
        </section>
    )
}

export default TopDoctors