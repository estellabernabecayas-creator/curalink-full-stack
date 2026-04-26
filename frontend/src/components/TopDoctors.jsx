import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const DoctorSkeleton = () => (
  <div className="animate-pulse">
    <div className="border border-gray-200 dark:border-white/60 rounded-xl overflow-hidden">
      <div className="w-full h-full bg-white dark:bg-dark-slate-light rounded-xl overflow-hidden">
        <div className="bg-[#f8fbff] dark:bg-slate-800 h-48">
          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-slate-700 dark:to-slate-600"></div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-gray-300 dark:bg-slate-600 rounded-full"></div>
            <div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div>
          </div>
          <div className="h-5 w-32 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  </div>
)

const TopDoctors = () => {
    const navigate = useNavigate()
    const { doctors, loading } = useContext(AppContext)

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
                {loading ? (
                    <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
                        {[...Array(8)].map((_, i) => <DoctorSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                    {doctors.slice(0, 10).map((item, index) => (
                    <div 
                      onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} 
                      className="group relative border border-gray-200 dark:border-white/60 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:p-[2px] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 shadow-md hover:shadow-xl"
                      key={index}
                    >
                      <div className="relative w-full h-full bg-white dark:bg-dark-slate-light rounded-xl overflow-hidden">
                        {/* Image container */}
                        <div className="bg-[#f8fbff] dark:bg-slate-800">
                          <img 
                            className="w-full" 
                            src={item.image} 
                            alt={item.name}
                          />
                        </div>
                        
                        {/* Gradient overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        
                        <div className="p-4 relative">
                          {/* Availability Badge with pulse effect */}
                          <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-600 font-medium' : "text-gray-500 dark:text-gray-400"}`}>
                            {item.available ? (
                              <>
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span>Available Now</span>
                              </>
                            ) : (
                              <>
                                <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400"></span>
                                <span>Not Available</span>
                              </>
                            )}
                          </div>
                          
                          <p className="text-gray-900 dark:text-white text-lg font-medium mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.name}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{item.speciality}</p>
                          
                          {/* Fee indicator (optional) */}
                          <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Fee: <span className="font-semibold text-green-600">₱{item.fees}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default TopDoctors