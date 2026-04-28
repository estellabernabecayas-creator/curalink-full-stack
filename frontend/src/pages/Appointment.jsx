import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Custom scrollbar and calendar styles
const customStyles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-track {
    background: #1e293b;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #475569;
  }
  .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #64748b;
  }

  /* Dark mode calendar styles */
  .dark .react-datepicker {
    background-color: #1e293b !important;
    border: 1px solid #475569 !important;
    border-radius: 0.75rem !important;
  }
  
  .dark .react-datepicker__header {
    background-color: #334155 !important;
    border-bottom: 1px solid #475569 !important;
    border-radius: 0.75rem 0.75rem 0 0 !important;
  }
  
  .dark .react-datepicker__current-month {
    color: #ffffff !important;
    font-weight: 800 !important;
    font-size: 1.1rem !important;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5) !important;
    letter-spacing: 0.5px !important;
  }
  
  .dark .react-datepicker__day-name {
    color: #e2e8f0 !important;
    font-weight: 700 !important;
    font-size: 0.9rem !important;
    text-shadow: 0 1px 3px rgba(0,0,0,0.4) !important;
  }
  
  .dark .react-datepicker__day {
    color: #ffffff !important;
    background-color: transparent !important;
    border: none !important;
    font-weight: 600 !important;
    text-shadow: 0 2px 4px rgba(0,0,0,0.4) !important;
    font-size: 0.95rem !important;
  }
  
  .dark .react-datepicker__day:hover {
    background-color: #475569 !important;
    color: #ffffff !important;
    border-radius: 0.5rem !important;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
  }
  
  .dark .react-datepicker__day--selected {
    background-color: #3b82f6 !important;
    color: #ffffff !important;
    border-radius: 0.5rem !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 6px rgba(59, 130, 246, 0.3) !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
  }
  
  .dark .react-datepicker__day--keyboard-selected {
    background-color: #2563eb !important;
    color: #ffffff !important;
    border-radius: 0.5rem !important;
    font-weight: 600 !important;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3) !important;
  }
  
  .dark .react-datepicker__day--outside-month {
    color: #94a3b8 !important;
    opacity: 0.6 !important;
  }
  
  .dark .react-datepicker__day--disabled {
    color: #64748b !important;
    opacity: 0.4 !important;
    text-decoration: line-through !important;
  }
  
  .dark .react-datepicker__navigation {
    color: #f1f5f9 !important;
    top: 8px !important;
    font-weight: bold !important;
    opacity: 0.9 !important;
  }
  
  .dark .react-datepicker__navigation:hover {
    color: #ffffff !important;
    opacity: 1 !important;
    background-color: rgba(255,255,255,0.1) !important;
    border-radius: 0.25rem !important;
  }
  
  .dark .react-datepicker__triangle {
    border-bottom-color: #334155 !important;
  }
  
  .dark .react-datepicker__today-button {
    background-color: #334155 !important;
    color: #ffffff !important;
    border-top: 1px solid #475569 !important;
    font-weight: 600 !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.3) !important;
  }
  
  .dark .react-datepicker__today-button:hover {
    background-color: #475569 !important;
    color: #ffffff !important;
  }
`

const Appointment = () => {

    const { docId } = useParams()
    const { doctors, currencySymbol, backendUrl, token, getDoctosData } = useContext(AppContext)
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    const [docInfo, setDocInfo] = useState(false)
    const [docSlots, setDocSlots] = useState([])
    const [slotIndex, setSlotIndex] = useState(0)
    const [slotTime, setSlotTime] = useState('')
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [consultationType, setConsultationType] = useState('onsite') // 'onsite' or 'online'

    const navigate = useNavigate()

    const fetchDocInfo = async () => {
        const docInfo = doctors.find((doc) => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSolts = async () => {
        if (!docInfo || !selectedDate) return

        let currentDate = new Date(selectedDate)
        let today = new Date()
        let endTime = new Date(selectedDate)
        endTime.setHours(21, 0, 0, 0)

        // setting hours based on if it's today or future date
        if (today.getDate() === currentDate.getDate() && today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()) {
            currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
            currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
        } else {
            currentDate.setHours(10)
            currentDate.setMinutes(0)
        }

        let allTimeSlots = [];

        while (currentDate < endTime) {
            let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            allTimeSlots.push({
                datetime: new Date(currentDate),
                time: formattedTime
            })

            currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        setDocSlots([allTimeSlots])
    }

    const bookAppointment = async () => {

        if (!token) {
            toast.warning('Login to book appointment')
            return navigate('/login')
        }

        const date = selectedDate

        let day = date.getDate()
        let month = date.getMonth() + 1
        let year = date.getFullYear()

        const slotDate = day + "_" + month + "_" + year

        try {

            const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime, consultationType }, { headers: { token } })
            if (data.success) {
                toast.success(data.message)
                getDoctosData()
                navigate('/my-appointments')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    useEffect(() => {
        if (doctors.length > 0) {
            fetchDocInfo()
        }
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSolts()
        }
    }, [docInfo, selectedDate])

    useEffect(() => {
        const styleId = 'custom-styles'
        let styleElement = document.getElementById(styleId)
        
        if (!styleElement) {
            styleElement = document.createElement('style')
            styleElement.id = styleId
            styleElement.textContent = customStyles
            document.head.appendChild(styleElement)
        }
        
        return () => {
            if (styleElement && styleElement.parentNode) {
                styleElement.parentNode.removeChild(styleElement)
            }
        }
    }, [])

    return docInfo ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Doctor Info Section - Horizontal Layout */}
                <div className='bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 mb-6'>
                    <div className='flex flex-col md:flex-row gap-6'>
                        {/* Doctor Image */}
                        <div className='flex-shrink-0'>
                            <div className='relative'>
                                <img 
                                    className='w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 object-cover rounded-xl shadow-md' 
                                    src={docInfo.image} 
                                    alt={docInfo.name} 
                                />
                                <div className='absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 shadow-lg'>
                                    <div className='w-3 h-3 bg-white rounded-full'></div>
                                </div>
                            </div>
                        </div>

                        {/* Doctor Details */}
                        <div className='flex-grow'>
                            <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                                <div className='flex-grow'>
                                    <div className='flex items-center gap-2 mb-2'>
                                        <h1 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 dark:from-white dark:to-gray-100 bg-clip-text text-transparent'>
                                            {docInfo.name}
                                        </h1>
                                        <img className='w-5 h-5' src={assets.verified_icon} alt="Verified" />
                                    </div>
                                    
                                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3'>
                                        <p className='text-lg text-gray-600 dark:text-gray-300 font-medium'>{docInfo.degree}</p>
                                        <span className='text-gray-400 dark:text-gray-500 hidden sm:inline'>•</span>
                                        <p className='text-lg font-semibold text-blue-600 dark:text-blue-400'>{docInfo.speciality}</p>
                                    </div>

                                    <div className='flex flex-wrap items-center gap-4 mb-4'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                            <span className='text-sm text-green-600 dark:text-green-400 font-medium'>Available today</span>
                                        </div>
                                        
                                        <span className='px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-300 text-sm font-semibold rounded-full border border-blue-200 dark:border-blue-800/30'>
                                            {docInfo.experience}
                                        </span>
                                    </div>

                                    <div className='mb-4'>
                                        <p className='text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl text-sm'>
                                            {docInfo.about}
                                        </p>
                                    </div>
                                </div>

                                <div className='flex-shrink-0 text-center sm:text-right bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-700/50 dark:to-slate-800/50 rounded-xl p-4 border border-blue-200 dark:border-slate-600'>
                                    <p className='text-sm text-gray-600 dark:text-gray-400 mb-1 font-medium'>Appointment Fee</p>
                                    <p className='text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent'>
                                        {currencySymbol}{docInfo.fees}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Booking Section */}
                <div className='bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6'>
                    <h2 className='text-xl font-bold text-gray-800 dark:text-white mb-6'>Booking Slots</h2>
                    
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        {/* Date and Time Selection */}
                        <div className='space-y-6'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3'>Select Date</label>
                                <DatePicker 
                                    selected={selectedDate}
                                    onChange={(date) => {
                                        setSelectedDate(date)
                                        setSlotTime('')
                                        setSlotIndex(0)
                                    }}
                                    minDate={new Date()}
                                    maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
                                    showOutsideDays={false}
                                    filterDate={(date) => date.getDay() !== 0}
                                    className='w-full border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg px-32 py-6 text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-12 text-center'
                                    calendarClassName='dark:bg-slate-800 dark:border-slate-600'
                                />
                                <p className='text-sm mt-2 text-gray-500 dark:text-gray-400'>
                                    Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </p>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3'>Available Time Slots</label>
                                <div className='grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar'>
                                    {docSlots.length > 0 && docSlots[0] && docSlots[0].map((item, index) => {
                                        // Check if this slot is available
                                        const day = selectedDate.getDate()
                                        const month = selectedDate.getMonth() + 1
                                        const year = selectedDate.getFullYear()
                                        const slotDate = day + "_" + month + "_" + year
                                        const isBooked = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(item.time)

                                        return (
                                            <button 
                                                key={index} 
                                                onClick={() => !isBooked && setSlotTime(item.time === slotTime ? '' : item.time)}
                                                className={`text-sm px-3 py-2 rounded-lg transition-all duration-300 text-center font-medium ${
                                                    isBooked 
                                                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-gray-500 line-through cursor-not-allowed opacity-60 border border-gray-200 dark:border-slate-600' 
                                                        : item.time === slotTime 
                                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105 border border-blue-600' 
                                                            : 'border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer hover:shadow-md'
                                                }`}
                                                disabled={isBooked}
                                            >
                                                {item.time.toLowerCase()}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Consultation Type and Summary */}
                        <div className='space-y-6'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3'>Preferred Consultation</label>
                                <div className='space-y-3'>
                                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                                        consultationType === 'onsite' 
                                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-md' 
                                            : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                                    }`}>
                                        <input
                                            type='radio'
                                            name='consultationType'
                                            value='onsite'
                                            checked={consultationType === 'onsite'}
                                            onChange={() => setConsultationType('onsite')}
                                            className='w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-2 dark:focus:ring-blue-400'
                                        />
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>On-site Consultation</span>
                                        <span className='ml-auto text-xs text-gray-500 dark:text-gray-400'>In-person visit</span>
                                    </label>
                                    <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                                        consultationType === 'online' 
                                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 shadow-md' 
                                            : 'border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                                    }`}>
                                        <input
                                            type='radio'
                                            name='consultationType'
                                            value='online'
                                            checked={consultationType === 'online'}
                                            onChange={() => setConsultationType('online')}
                                            className='w-4 h-4 text-blue-500 focus:ring-blue-500 focus:ring-2 dark:focus:ring-blue-400'
                                        />
                                        <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>Online Consultation</span>
                                        <span className='ml-auto text-xs text-gray-500 dark:text-gray-400'>Video call</span>
                                    </label>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className='bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-700 dark:to-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-600'>
                                <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2'>
                                    <svg className='w-4 h-4 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                                    </svg>
                                    Summary
                                </h3>
                                <div className='space-y-2'>
                                    <div className='flex justify-between text-sm p-2 rounded bg-white dark:bg-slate-800/50'>
                                        <span className='text-gray-600 dark:text-gray-400 font-medium'>
                                            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className='text-gray-800 dark:text-white font-semibold'>
                                            {slotTime || 'Select time'}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-sm p-2 rounded bg-white dark:bg-slate-800/50'>
                                        <span className='text-gray-600 dark:text-gray-400 font-medium'>Consultation</span>
                                        <span className='text-gray-800 dark:text-white font-semibold capitalize'>
                                            {consultationType}
                                        </span>
                                    </div>
                                    <div className='border-t border-gray-200 dark:border-slate-600 pt-2 mt-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg'>
                                        <div className='flex justify-between items-center'>
                                            <span className='text-gray-600 dark:text-gray-400 font-medium'>Total Fee</span>
                                            <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent'>
                                                {currencySymbol}{docInfo.fees}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={bookAppointment} 
                                className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                                disabled={!slotTime}
                            >
                                <span className='flex items-center justify-center gap-2'>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                    </svg>
                                    Book Appointment
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Listing Related Doctors */}
                <div className='mt-8'>
                    <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
                </div>
            </div>
        </div>
    ) : null
}

export default Appointment