import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import html2canvas from 'html2canvas'

const MyAppointments = () => {

    const { backendUrl, token, userData, currencySymbol } = useContext(AppContext)
    const navigate = useNavigate()

    const [appointments, setAppointments] = useState([])
    const [payment, setPayment] = useState('')
    
    // Cash payment states
    const [showCashConfirm, setShowCashConfirm] = useState(false)
    const [showReceipt, setShowReceipt] = useState(false)
    const [showDownloadConfirm, setShowDownloadConfirm] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState(null)
    const [receiptData, setReceiptData] = useState(null)
    
    // Online payment receipt state
    const [showOnlineReceipt, setShowOnlineReceipt] = useState(false)
    const [onlineReceiptAppointment, setOnlineReceiptAppointment] = useState(null)

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    }

    // Getting User Appointments Data Using API
    const getUserAppointments = async () => {
        try {

            const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { token } })
            setAppointments(data.appointments.reverse())

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to cancel appointment Using API
    const cancelAppointment = async (appointmentId) => {

        try {

            const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                getUserAppointments()
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    // Function to make payment using PayMongo
    const appointmentPayMongo = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-paymongo', { appointmentId }, { headers: { token } })
            if (data.success) {
                window.location.replace(data.checkout_url)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Function to make payment using stripe
    const appointmentStripe = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/user/payment-stripe', { appointmentId }, { headers: { token } })
            if (data.success) {
                const { session_url } = data
                window.location.replace(session_url)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Open cash payment confirmation modal
    const openCashConfirm = (appointment) => {
        setSelectedAppointment(appointment)
        setShowCashConfirm(true)
    }

    // Generate cash receipt (preview only, not paid yet)
    const processCashPayment = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/payment-cash', 
                { 
                    appointmentId: selectedAppointment._id,
                    userId: userData._id 
                }, 
                { headers: { token } }
            )
            
            if (data.success) {
                setReceiptData(data)
                setShowCashConfirm(false)
                setShowReceipt(true)
                toast.success('Receipt generated! Please download and save it.')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Confirm cash payment after user downloads receipt
    const confirmCashPayment = async () => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/confirm-cash-payment',
                {
                    appointmentId: selectedAppointment._id,
                    receiptId: receiptData.receiptId,
                    userId: userData._id
                },
                { headers: { token } }
            )

            if (data.success) {
                setShowDownloadConfirm(false)
                setShowReceipt(false)
                setSelectedAppointment(null)
                setReceiptData(null)
                getUserAppointments()
                toast.success('Cash payment confirmed! Status updated to Paid.')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    // Cancel cash payment - close modal and stay pending
    const cancelCashPayment = () => {
        setShowDownloadConfirm(false)
        setShowReceipt(false)
        setSelectedAppointment(null)
        setReceiptData(null)
        toast.info('Receipt cancelled. Payment still pending.')
    }

    // Download receipt as image
    const downloadReceipt = () => {
        const receiptElement = document.getElementById('cash-receipt')
        if (!receiptElement) return

        // Create a canvas from the receipt element
        html2canvas(receiptElement, {
            scale: 2,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const link = document.createElement('a')
            link.download = `Receipt-${receiptData?.receiptId || 'CASH'}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        })
    }

    // Open online payment receipt modal
    const openOnlineReceipt = (item) => {
        setOnlineReceiptAppointment(item)
        setShowOnlineReceipt(true)
    }

    // Download online payment receipt
    const downloadOnlineReceipt = () => {
        const receiptElement = document.getElementById('online-receipt')
        if (!receiptElement) return

        html2canvas(receiptElement, {
            scale: 2,
            backgroundColor: '#ffffff'
        }).then(canvas => {
            const link = document.createElement('a')
            link.download = `Receipt-ONLINE-${onlineReceiptAppointment?._id?.slice(-6) || 'PAYMENT'}.png`
            link.href = canvas.toDataURL('image/png')
            link.click()
        })
    }



    useEffect(() => {
        if (token) {
            getUserAppointments()
        }
    }, [token])

    return (
        <div>
            <p className='pb-3 mt-12 text-lg font-medium text-gray-600 dark:text-gray-300 border-b dark:border-slate-700'>My appointments</p>
            <div className='space-y-4'>
                {appointments.map((item, index) => (
                    <div key={index} className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b border-gray-300 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 rounded-lg p-4 -mx-4 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700'>
                        <div>
                            <img className='w-36 bg-[#EAEFFF]' src={item.docData.image} alt="" />
                        </div>
                        <div className='flex-1 text-sm text-[#5E5E5E] dark:text-gray-300'>
                            <p className='text-[#262626] dark:text-white text-base font-semibold'>{item.docData.name.startsWith('Dr.') ? item.docData.name : `Dr. ${item.docData.name}`} (<span className={item.consultationType === 'online' ? 'text-blue-500 dark:text-blue-400' : 'text-emerald-500 dark:text-emerald-400'}>{item.consultationType === 'online' ? 'Online' : 'On-site'}</span>)</p>
                            <p className='dark:text-gray-400'>{item.docData.speciality}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] dark:text-gray-300 font-medium'>Date & Time:</span></p>
                            <p className='text-sm text-gray-600 dark:text-gray-400 mt-1'>{slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
                            <p className=' mt-1'><span className='text-sm text-[#3C3C3C] dark:text-gray-300 font-medium'>Fee:</span> {currencySymbol}{item.docData.fees}</p>
                        </div>
                        <div></div>
                        <div className='flex flex-col gap-2 justify-end text-sm text-center'>
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => openCashConfirm(item)} className='text-[#696969] dark:text-gray-300 sm:min-w-48 py-2 border dark:border-slate-500 rounded hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300'>Cash Payment</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && <button onClick={() => setPayment(item._id)} className='text-[#696969] dark:text-gray-300 sm:min-w-48 py-2 border dark:border-slate-500 rounded hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300'>Pay Online</button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => setPayment('')} className='w-8 h-8 flex items-center justify-center border dark:border-slate-500 rounded-full text-[#696969] dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white hover:border-transparent transition-all duration-300'>
                              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                              </svg>
                            </button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentStripe(item._id)} className='text-[#696969] dark:text-gray-300 sm:min-w-48 py-2 border dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-20 max-h-5' src={assets.stripe_logo} alt="" /></button>}
                            {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && <button onClick={() => appointmentPayMongo(item._id)} className='text-[#696969] dark:text-gray-300 sm:min-w-48 py-2 border dark:border-slate-500 rounded hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-white transition-all duration-300 flex items-center justify-center'><img className='max-w-28 max-h-6' src={assets.paymongo_logo} alt="PayMongo" /></button>}
                            {!item.cancelled && item.payment && !item.isCompleted && (
                                <div className='flex flex-col gap-2'>
                                    <button className='sm:min-w-48 py-2 border dark:border-slate-500 rounded text-[#696969] dark:text-gray-300 bg-[#EAEFFF] dark:bg-slate-700'>Paid</button>
                                    {item.paymentMethod !== 'cash' && (
                                        <button onClick={() => openOnlineReceipt(item)} className='sm:min-w-48 py-2 border dark:border-slate-500 rounded text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-all duration-300 text-sm font-medium'>View Receipt</button>
                                    )}
                                    {item.consultationType === 'online' && item.meetingId && (
                                        <button onClick={() => navigate(`/video-consultation/${item._id}`)} className='sm:min-w-48 py-2 border dark:border-slate-500 rounded text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2'>
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                            </svg>
                                            Join Video Call
                                        </button>
                                    )}
                                </div>
                            )}

                            {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 dark:border-green-600 rounded text-green-500 dark:text-green-400'>Completed</button>}

                            {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-[#696969] dark:text-gray-300 sm:min-w-48 py-2 border dark:border-slate-500 rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel appointment</button>}
                            {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 dark:border-red-600 rounded text-red-500 dark:text-red-400'>Appointment cancelled</button>}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cash Payment Confirmation Modal */}
            {showCashConfirm && selectedAppointment && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl'>
                        <div className='flex items-center gap-3 mb-4'>
                            <div className='w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center'>
                                <svg className='w-5 h-5 text-blue-600 dark:text-blue-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Confirm Cash Payment</h3>
                        </div>
                        
                        <p className='text-gray-600 dark:text-gray-300 mb-4'>Please review your appointment details:</p>
                        
                        <div className='bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 mb-6 space-y-2 text-sm'>
                            <p className='dark:text-gray-300'><span className='font-medium text-gray-900 dark:text-white'>Doctor:</span> {selectedAppointment.docData.name}</p>
                            <p className='dark:text-gray-300'><span className='font-medium text-gray-900 dark:text-white'>Speciality:</span> {selectedAppointment.docData.speciality}</p>
                            <p className='dark:text-gray-300'>
                                <span className='font-medium text-gray-900 dark:text-white'>Consultation Type:</span>{' '}
                                <span className={selectedAppointment.consultationType === 'online' ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-emerald-600 dark:text-emerald-400 font-medium'}>
                                    {selectedAppointment.consultationType === 'online' ? 'Online Consultation' : 'On-site Consultation'}
                                </span>
                            </p>
                            <p className='dark:text-gray-300'><span className='font-medium text-gray-900 dark:text-white'>Date:</span> {slotDateFormat(selectedAppointment.slotDate)}</p>
                            <p className='dark:text-gray-300'><span className='font-medium text-gray-900 dark:text-white'>Time:</span> {selectedAppointment.slotTime}</p>
                            <p className='dark:text-gray-300'><span className='font-medium text-gray-900 dark:text-white'>Amount:</span> ₱{selectedAppointment.amount}</p>
                        </div>
                        
                        <p className='text-gray-600 dark:text-gray-300 mb-6 text-center font-medium'>Are all these details correct?</p>
                        
                        <div className='flex gap-3'>
                            <button
                                onClick={() => { setShowCashConfirm(false); setSelectedAppointment(null) }}
                                className='flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'
                            >
                                No, I'll Book Again
                            </button>
                            <button
                                onClick={processCashPayment}
                                className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300'
                            >
                                Yes, Proceed
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Modal */}
            {showReceipt && receiptData && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Payment Receipt</h3>
                            <button 
                                onClick={() => setShowReceipt(false)}
                                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            >
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Receipt Card */}
                        <div id='cash-receipt' className='bg-white border-2 border-gray-200 dark:border-slate-600 rounded-lg p-6 mb-6'>
                            <div className='text-center mb-6'>
                                <h2 className='text-xl font-bold text-gray-900'>CuraLink</h2>
                                <p className='text-sm text-gray-500'>Medical Appointment System</p>
                                <p className='text-xs text-gray-400 mt-1'>1139 Dagonoy St, Malate, Manila</p>
                            </div>
                            
                            <div className='border-t border-b border-gray-200 py-4 mb-4'>
                                <div className='text-center mb-4'>
                                    <span className='inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full'>CASH PAYMENT</span>
                                </div>
                                <p className='text-center text-2xl font-bold text-gray-900 mb-1'>₱{receiptData.appointment?.amount || selectedAppointment?.amount}</p>
                                <p className='text-center text-sm text-gray-500'>Amount Due</p>
                            </div>
                            
                            <div className='space-y-2 text-sm mb-4'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Receipt ID:</span>
                                    <span className='font-medium text-gray-900'>{receiptData.receiptId}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Patient:</span>
                                    <span className='font-medium text-gray-900'>{userData?.name}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Doctor:</span>
                                    <span className='font-medium text-gray-900'>{receiptData.appointment?.docData?.name || selectedAppointment?.docData?.name}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Consultation Type:</span>
                                    <span className={`font-medium ${(receiptData.appointment?.consultationType || selectedAppointment?.consultationType) === 'online' ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {(receiptData.appointment?.consultationType || selectedAppointment?.consultationType) === 'online' ? 'Online Consultation' : 'On-site Consultation'}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Appointment Date:</span>
                                    <span className='font-medium text-gray-900'>{slotDateFormat(receiptData.appointment?.slotDate || selectedAppointment?.slotDate)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Appointment Time:</span>
                                    <span className='font-medium text-gray-900'>{receiptData.appointment?.slotTime || selectedAppointment?.slotTime}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Issued On:</span>
                                    <span className='font-medium text-gray-900'>{new Date().toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className='bg-gray-50 rounded-lg p-3 text-center'>
                                <p className='text-xs text-gray-500 mb-1'>Bring this receipt to your appointment</p>
                                <p className='text-xs text-gray-400'>Valid until appointment date</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => { downloadReceipt(); setTimeout(() => setShowDownloadConfirm(true), 500) }}
                            className='w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                            </svg>
                            Download Receipt
                        </button>

                        {/* Download Confirmation */}
                        {showDownloadConfirm && (
                            <div className='mt-6 pt-6 border-t border-gray-200 dark:border-slate-600'>
                                <p className='text-center text-gray-700 dark:text-gray-300 font-medium mb-4'>Done downloading the receipt?</p>
                                <div className='flex gap-3'>
                                    <button
                                        onClick={cancelCashPayment}
                                        className='flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={confirmCashPayment}
                                        className='flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
                                    >
                                        Yes
                                    </button>
                                </div>
                                <p className='text-center text-xs text-gray-500 dark:text-gray-400 mt-4 italic'>* Clicking "Yes" confirms your payment and finalizes this transaction</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Online Payment Receipt Modal */}
            {showOnlineReceipt && onlineReceiptAppointment && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto'>
                        <div className='flex items-center justify-between mb-4'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Payment Receipt</h3>
                            <button 
                                onClick={() => setShowOnlineReceipt(false)}
                                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                            >
                                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Receipt Card */}
                        <div id='online-receipt' className='bg-white border-2 border-gray-200 dark:border-slate-600 rounded-lg p-6 mb-6'>
                            <div className='text-center mb-6'>
                                <h2 className='text-xl font-bold text-gray-900'>CuraLink</h2>
                                <p className='text-sm text-gray-500'>Medical Appointment System</p>
                                <p className='text-xs text-gray-400 mt-1'>1139 Dagonoy St, Malate, Manila</p>
                            </div>
                            
                            <div className='border-t border-b border-gray-200 py-4 mb-4'>
                                <div className='text-center mb-4'>
                                    <span className='inline-block bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full'>ONLINE PAYMENT</span>
                                </div>
                                <p className='text-center text-2xl font-bold text-gray-900 mb-1'>₱{onlineReceiptAppointment?.amount}</p>
                                <p className='text-center text-sm text-gray-500'>Amount Paid</p>
                            </div>
                            
                            <div className='space-y-2 text-sm mb-4'>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Receipt ID:</span>
                                    <span className='font-medium text-gray-900'>ONLINE-{onlineReceiptAppointment?._id?.slice(-8).toUpperCase()}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Patient:</span>
                                    <span className='font-medium text-gray-900'>{userData?.name}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Doctor:</span>
                                    <span className='font-medium text-gray-900'>{onlineReceiptAppointment?.docData?.name}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Consultation Type:</span>
                                    <span className={`font-medium ${onlineReceiptAppointment?.consultationType === 'online' ? 'text-blue-600' : 'text-gray-900'}`}>
                                        {onlineReceiptAppointment?.consultationType === 'online' ? 'Online Consultation' : 'On-site Consultation'}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Appointment Date:</span>
                                    <span className='font-medium text-gray-900'>{slotDateFormat(onlineReceiptAppointment?.slotDate)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Appointment Time:</span>
                                    <span className='font-medium text-gray-900'>{onlineReceiptAppointment?.slotTime}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Payment Method:</span>
                                    <span className='font-medium text-gray-900'>{onlineReceiptAppointment?.paymentMethod === 'online' ? 'Online (Stripe/PayMongo)' : 'Online'}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='text-gray-500'>Issued On:</span>
                                    <span className='font-medium text-gray-900'>{new Date().toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className='bg-gray-50 rounded-lg p-3 text-center'>
                                <p className='text-xs text-gray-500 mb-1'>Thank you for your payment</p>
                                {onlineReceiptAppointment?.consultationType === 'online' ? (
                                    <p className='text-xs text-blue-600'>Video call link will be available in My Appointments</p>
                                ) : (
                                    <p className='text-xs text-gray-400'>Please arrive 15 minutes before your appointment</p>
                                )}
                            </div>
                        </div>
                        
                        <button
                            onClick={downloadOnlineReceipt}
                            className='w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 flex items-center justify-center gap-2'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4' />
                            </svg>
                            Download Receipt
                        </button>

                        <button
                            onClick={() => setShowOnlineReceipt(false)}
                            className='w-full mt-3 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors'
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MyAppointments