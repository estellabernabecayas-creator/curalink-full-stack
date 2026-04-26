import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

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

const Doctors = () => {

  const { speciality } = useParams()

  const [filterDoc, setFilterDoc] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [loadingState, setLoadingState] = useState(true)
  const navigate = useNavigate();

  const { doctors, loading } = useContext(AppContext)

  const applyFilter = () => {
    setLoadingState(true);
    if (speciality && speciality !== 'undefined') {
      setFilterDoc(doctors.filter(doc => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
    setLoadingState(false);
  }

  useEffect(() => {
    applyFilter()
  }, [doctors, speciality])

  useEffect(() => {
    if (doctors.length > 0) {
      applyFilter()
    }
  }, [doctors])

  // Scroll to top when component mounts or speciality changes
  useEffect(() => {
    const scrollToTop = () => {
      const headerOffset = 0; // Set to 0px to match desired positioning
      window.scrollTo(0, headerOffset);
      document.documentElement.scrollTop = headerOffset;
      document.body.scrollTop = headerOffset;
    };

    // Immediate scroll
    scrollToTop();
    
    // Fallback scroll after a short delay to ensure it works
    const timeoutId = setTimeout(scrollToTop, 50);
    
    return () => clearTimeout(timeoutId);
  }, [speciality])

  return (
    <div className='mb-20 animate-fade-in-up'>
      <p className='text-gray-600 dark:text-white'>Browse through the doctors specialist.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
        <button onClick={() => setShowFilter(!showFilter)} className={`py-1 px-3 border rounded text-sm  transition-all sm:hidden ${showFilter ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white' : ''}`}>Filters</button>
        <div className={`flex-col gap-4 text-sm text-gray-600 dark:text-white ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
          <p onClick={() => { 
            const targetSpeciality = speciality === 'General physician' ? '' : 'General physician';
            navigate(targetSpeciality ? `/doctors/${targetSpeciality}` : '/doctors');
            // Force scroll to top with header offset
            setTimeout(() => {
              const headerOffset = 100;
              window.scrollTo(0, headerOffset);
              document.documentElement.scrollTop = headerOffset;
              document.body.scrollTop = headerOffset;
            }, 10);
          }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-[#E2E5FF] text-black ' : ''}`}>General physician</p>
          <p onClick={() => { 
            const targetSpeciality = speciality === 'Gynecologist' ? '' : 'Gynecologist';
            navigate(targetSpeciality ? `/doctors/${targetSpeciality}` : '/doctors');
            // Force scroll to top with header offset
            setTimeout(() => {
              const headerOffset = 100;
              window.scrollTo(0, headerOffset);
              document.documentElement.scrollTop = headerOffset;
              document.body.scrollTop = headerOffset;
            }, 10);
          }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gynecologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gynecologist</p>
          <p onClick={() => { 
            const targetSpeciality = speciality === 'Dermatologist' ? '' : 'Dermatologist';
            navigate(targetSpeciality ? `/doctors/${targetSpeciality}` : '/doctors');
            // Force scroll to top with header offset
            setTimeout(() => {
              const headerOffset = 100;
              window.scrollTo(0, headerOffset);
              document.documentElement.scrollTop = headerOffset;
              document.body.scrollTop = headerOffset;
            }, 10);
          }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Dermatologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Dermatologist</p>
          <p onClick={() => { 
            const targetSpeciality = speciality === 'Pediatricians' ? '' : 'Pediatricians';
            navigate(targetSpeciality ? `/doctors/${targetSpeciality}` : '/doctors');
            // Force scroll to top with header offset
            setTimeout(() => {
              const headerOffset = 100;
              window.scrollTo(0, headerOffset);
              document.documentElement.scrollTop = headerOffset;
              document.body.scrollTop = headerOffset;
            }, 10);
          }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Pediatricians' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Pediatricians</p>
          <p onClick={() => { 
            const targetSpeciality = speciality === 'Neurologist' ? '' : 'Neurologist';
            navigate(targetSpeciality ? `/doctors/${targetSpeciality}` : '/doctors');
            // Force scroll to top with header offset
            setTimeout(() => {
              const headerOffset = 100;
              window.scrollTo(0, headerOffset);
              document.documentElement.scrollTop = headerOffset;
              document.body.scrollTop = headerOffset;
            }, 10);
          }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Neurologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Neurologist</p>
          <p onClick={() => { 
            const targetSpeciality = speciality === 'Gastroenterologist' ? '' : 'Gastroenterologist';
            navigate(targetSpeciality ? `/doctors/${targetSpeciality}` : '/doctors');
            // Force scroll to top with header offset
            setTimeout(() => {
              const headerOffset = 100;
              window.scrollTo(0, headerOffset);
              document.documentElement.scrollTop = headerOffset;
              document.body.scrollTop = headerOffset;
            }, 10);
          }} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Gastroenterologist' ? 'bg-[#E2E5FF] text-black ' : ''}`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
          {loading ? (
            [...Array(8)].map((_, i) => <DoctorSkeleton key={i} />)
          ) : (
            filterDoc.map((item, index) => (
              <div onClick={() => { navigate(`/appointment/${item._id}`); scrollTo(0, 0) }} className='border border-gray-200 dark:border-white/60 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:p-[2px] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 shadow-md hover:shadow-xl' key={index}>
                <div className='w-full h-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-xl overflow-hidden'>
                  <div className='bg-[#f8fbff] dark:bg-slate-800'>
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Doctors