import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Doctor card skeleton (keep as is)
const DoctorSkeleton = () => (
  <div className="animate-pulse">
    <div className="border border-gray-200 dark:border-white/60 rounded-xl overflow-hidden">
      <div className="w-full h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl overflow-hidden">
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

// Specialty icons mapping
const specialtyIcons = {
  'General physician': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  'Gynecologist': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  'Dermatologist': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  'Pediatricians': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  'Neurologist': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
  'Gastroenterologist': (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

// Color variants for each specialty
const specialtyColors = {
  'General physician': 'from-emerald-500 to-teal-500',
  'Gynecologist': 'from-emerald-500 to-teal-500',
  'Dermatologist': 'from-emerald-500 to-teal-500',
  'Pediatricians': 'from-emerald-500 to-teal-500',
  'Neurologist': 'from-emerald-500 to-teal-500',
  'Gastroenterologist': 'from-emerald-500 to-teal-500'
}

const Doctors = () => {

  const { speciality } = useParams()
  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [loadingState, setLoadingState] = useState(true)
  const navigate = useNavigate()
  const { doctors, loading } = useContext(AppContext)

  // Get doctor count per specialty
  const getSpecialtyCount = (specialtyName) => {
    return doctors.filter(doc => doc.speciality === specialtyName).length
  }

  const applyFilter = () => {
    setLoadingState(true)
    if (speciality && speciality !== 'undefined') {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality))
    } else {
      setFilterDoc(doctors)
    }
    setLoadingState(false)
  }

  useEffect(() => {
    if (doctors.length > 0) {
      applyFilter()
    }
  }, [doctors, speciality])

  // Scroll to top when component mounts or speciality changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    
    // Fallback with slight delay to ensure it works
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }, 100)
    
    return () => clearTimeout(timeoutId)
  }, [speciality])

  const specialties = [
    'General physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ]

  return (
    <div className='mb-20 animate-fade-in-up'>
      {/* Header with count */}
      <div className="mb-6">
        <p className="text-gray-600 dark:text-gray-400">Browse through the doctors specialist.</p>
        {!speciality && filterDoc.length > 0 && (
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            Showing {filterDoc.length} doctor{filterDoc.length !== 1 ? 's' : ''} available
          </p>
        )}
      </div>

      <div className='flex flex-col sm:flex-row items-start gap-6 mt-5'>

        {/* Mobile Filter Toggle Button */}
        <button 
          onClick={() => setShowFilter(!showFilter)} 
          className={`w-full sm:hidden flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300 ${
            showFilter 
              ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white border-transparent' 
              : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </span>
          <svg className={`w-5 h-5 transition-transform duration-300 ${showFilter ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Filter Sidebar */}
        <AnimatePresence>
          {(showFilter || window.innerWidth >= 640) && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`w-full sm:w-64 flex-shrink-0 ${showFilter ? 'block' : 'hidden sm:block'}`}
            >
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl p-4 shadow-lg sticky top-24">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Specialties
                </h3>
                
                <div className="space-y-1.5">
                  {/* All Doctors Option */}
                  <div
                    onClick={() => {
                      if (!speciality) return
                      navigate('/doctors')
                      setTimeout(() => {
                        window.scrollTo(0, 100)
                        document.documentElement.scrollTop = 100
                        document.body.scrollTop = 100
                      }, 10)
                    }}
                    className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                      !speciality 
                        ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md' 
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                        !speciality 
                          ? 'bg-white/20' 
                          : 'bg-gray-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="font-medium">All Doctors</span>
                    </div>
                    {doctors.length > 0 && (
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300 ${
                        !speciality 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                      }`}>
                        {doctors.length}
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-slate-600 to-transparent my-3"></div>

                  {/* Specialty List */}
                  {specialties.map((spec) => {
                    const isActive = speciality === spec
                    const count = getSpecialtyCount(spec)
                    const colorGradient = specialtyColors[spec] || 'from-blue-500 to-green-500'
                    
                    return (
                      <motion.div
                        key={spec}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (isActive) return
                          navigate(`/doctors/${spec}`)
                          setTimeout(() => {
                            window.scrollTo(0, 100)
                            document.documentElement.scrollTop = 100
                            document.body.scrollTop = 100
                          }, 10)
                        }}
                        className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                          isActive 
                            ? `bg-gradient-to-r ${colorGradient} text-white shadow-md` 
                            : 'hover:bg-teal-50 dark:hover:bg-teal-900/20 hover:text-teal-600 dark:hover:text-teal-400'
                        }`}
                      >
                        <div className="flex items-center">
                          <span className="font-medium">{spec}</span>
                        </div>
                        {count > 0 && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30'
                          }`}>
                            {count}
                          </span>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Doctors Grid */}
        <div className='flex-1 w-full'>
          {loading ? (
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6'>
              {[...Array(8)].map((_, i) => <DoctorSkeleton key={i} />)}
            </div>
          ) : filterDoc.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 mb-4 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No doctors found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your filter or check back later</p>
              <button 
                onClick={() => navigate('/doctors')}
                className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                View all doctors →
              </button>
            </div>
          ) : (
            <div className='w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 gap-y-6'>
              {filterDoc.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }}
                  className='group relative border border-gray-200 dark:border-white/60 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:p-[2px] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 shadow-md hover:shadow-xl'
                >
                  <div className='w-full h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl overflow-hidden'>
                    <div className='bg-[#f8fbff] dark:bg-slate-800 overflow-hidden'>
                      <img 
                        className='w-full transition-transform duration-500 group-hover:scale-110' 
                        src={item.image} 
                        alt={item.name} 
                      />
                    </div>
                    <div className='p-4'>
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
                      <p className='text-gray-900 dark:text-white text-lg font-medium mt-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                        {item.name}
                      </p>
                      <p className='text-gray-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
                      
                      {/* Fee indicator on hover */}
                      <div className="mt-3 pt-2 border-t border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Consultation Fee: <span className="font-semibold text-green-600">₱{item.fees}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors