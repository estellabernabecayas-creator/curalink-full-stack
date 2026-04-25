import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import axios from 'axios'
import { toast } from 'react-toastify'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

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

        setDocSlots([])

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

        let timeSlots = [];

        while (currentDate < endTime) {
            let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            let day = currentDate.getDate()
            let month = currentDate.getMonth() + 1
            let year = currentDate.getFullYear()

            const slotDate = day + "_" + month + "_" + year
            const slotTime = formattedTime

            const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

            if (isSlotAvailable) {
                timeSlots.push({
                    datetime: new Date(currentDate),
                    time: formattedTime
                })
            }

            currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        setDocSlots([timeSlots])
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

    return docInfo ? (
        <div>

            {/* ---------- Doctor Details ----------- */}
            <div className='flex flex-col sm:flex-row gap-4'>
                <div>
                    <img className='bg-gradient-to-r from-blue-100 to-green-100 dark:from-slate-800 dark:to-slate-700 w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
                </div>

                <div className='flex-1 border border-[#ADADAD] dark:border-slate-600 rounded-lg p-8 py-7 bg-white dark:bg-slate-800/70 backdrop-blur-sm mx-2 sm:mx-0 mt-[-80px] sm:mt-0 shadow-md'>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700 dark:text-white'>{docInfo.name} <img className='w-5' src={assets.verified_icon} alt="" /></p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600 dark:text-gray-300'>
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className='py-0.5 px-2 border dark:border-slate-500 text-xs rounded-full hover:bg-blue-50 dark:hover:bg-slate-700 hover:border-blue-300 transition-colors duration-300'>{docInfo.experience}</button>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] dark:text-gray-200 mt-3'>About <img className='w-3' src={assets.info_icon} alt="" /></p>
                        <p className='text-sm text-gray-600 dark:text-gray-300 max-w-[700px] mt-1'>{docInfo.about}</p>
                    </div>

                    <p className='text-gray-500 dark:text-gray-400 font-medium mt-4'>Appointment fee: <span className='text-gray-600 dark:text-gray-300 font-semibold'>{currencySymbol}{docInfo.fees}</span> </p>
                </div>
            </div>

            {/* Booking slots */}
            <div className='sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656] dark:text-gray-300'>
                <p>Booking slots</p>
                <div className='mt-4 mb-4'>
                    <DatePicker 
                        selected={selectedDate}
                        onChange={(date) => {
                            setSelectedDate(date)
                            setSlotTime('') // Reset selected time when date changes
                            setSlotIndex(0) // Reset to first (and only) slot array
                        }}
                        minDate={new Date()}
                        maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // Max 30 days ahead
                        showOutsideDays={false}
                        filterDate={(date) => date.getDay() !== 0} // Disable Sundays (0 = Sunday)
                        className='border border-gray-300 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white rounded-lg px-4 py-2 w-full'
                        calendarClassName='dark:bg-slate-800 dark:border-slate-600'
                    />
                    <p className='text-sm mt-2 text-gray-500 dark:text-gray-400'>Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                </div>

                <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
                    {docSlots.length > 0 && docSlots[0] && docSlots[0].map((item, index) => (
                        <p onClick={() => setSlotTime(item.time)} key={index} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer transition-all duration-300 ${item.time === slotTime ? 'bg-emerald-100 text-emerald-700 shadow-md' : 'text-[#949494] dark:text-white border border-[#B4B4B4] dark:border-slate-500 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-white'}`}>{item.time.toLowerCase()}</p>
                    ))}
                </div>

                {/* Consultation Type Selection */}
                <div className='mt-6'>
                    <p className='text-sm font-medium text-gray-700 dark:text-gray-200 mb-3'>Preferred Consultation</p>
                    <div className='flex flex-col sm:flex-row gap-3'>
                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-300 ${consultationType === 'onsite' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-emerald-300'}`}>
                            <input
                                type='radio'
                                name='consultationType'
                                value='onsite'
                                checked={consultationType === 'onsite'}
                                onChange={() => setConsultationType('onsite')}
                                className='w-4 h-4 text-emerald-500 focus:ring-emerald-500'
                            />
                            <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>On-site Consultation</p>
                        </label>
                        <label className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-300 ${consultationType === 'online' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-gray-300 dark:border-slate-600 hover:border-emerald-300'}`}>
                            <input
                                type='radio'
                                name='consultationType'
                                value='online'
                                checked={consultationType === 'online'}
                                onChange={() => setConsultationType('online')}
                                className='w-4 h-4 text-emerald-500 focus:ring-emerald-500'
                            />
                            <p className='text-sm font-medium text-gray-700 dark:text-gray-200'>Online Consultation</p>
                        </label>
                    </div>
                </div>

                <button onClick={bookAppointment} className='bg-gradient-to-r from-blue-600 to-emerald-500 text-white text-sm font-light px-20 py-3 rounded-full my-6 hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg'>Book an appointment</button>
            </div>

            {/* Listing Releated Doctors */}
            <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
        </div>
    ) : null
}

export default Appointment