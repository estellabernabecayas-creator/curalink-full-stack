import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const DoctorAppointments = () => {
  const navigate = useNavigate()

  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [cancellationReason, setCancellationReason] = useState('')

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [paymentFilter, setPaymentFilter] = useState('All')
  
  // Doctor receipt modal state
  const [showDoctorReceipt, setShowDoctorReceipt] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  
  // Open doctor receipt modal
  const openDoctorReceipt = (appointment) => {
    setSelectedReceipt(appointment)
    setShowDoctorReceipt(true)
  }

  useEffect(() => {
    if (dToken) {
      getAppointments()
    }
  }, [dToken])

  // Filter appointments based on search and filters
  const filteredAppointments = appointments.filter(item => {
    // Search by patient name only
    const matchesSearch = item.userData?.name?.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    let matchesStatus = true
    if (statusFilter === 'Completed') {
      matchesStatus = item.isCompleted
    } else if (statusFilter === 'Cancelled') {
      matchesStatus = item.cancelled
    } else if (statusFilter === 'Pending') {
      matchesStatus = !item.cancelled && !item.isCompleted
    }

    // Payment filter
    let matchesPayment = true
    if (paymentFilter === 'Online Paid') {
      matchesPayment = item.payment === true && item.paymentMethod !== 'cash'
    } else if (paymentFilter === 'Cash Payment') {
      matchesPayment = item.payment === true && item.paymentMethod === 'cash'
    } else if (paymentFilter === 'Payment Pending') {
      matchesPayment = item.payment === false
    }

    return matchesSearch && matchesStatus && matchesPayment
  })

  const handleCompleteClick = (appointmentId) => {
    setSelectedAppointment(appointmentId)
    setShowCompleteModal(true)
  }

  const handleCancelClick = (appointmentId) => {
    setSelectedAppointment(appointmentId)
    setCancellationReason('')
    setShowCancelModal(true)
  }

  const confirmComplete = () => {
    if (selectedAppointment) {
      completeAppointment(selectedAppointment)
      setShowCompleteModal(false)
      setSelectedAppointment(null)
    }
  }

  const confirmCancel = () => {
    if (selectedAppointment) {
      cancelAppointment(selectedAppointment, cancellationReason)
      setShowCancelModal(false)
      setSelectedAppointment(null)
      setCancellationReason('')
    }
  }

  return (
    <div className='w-full max-w-6xl m-5 '>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
        <p className='text-lg font-medium text-gray-700'>My Appointments</p>

        {/* Search Bar */}
        <div className='relative w-full sm:w-72'>
          <input
            type='text'
            placeholder='Search patient...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
          />
          <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
        </div>
      </div>

      {/* Status Filters (Completed, Cancelled) */}
      <div className='flex flex-wrap gap-2 mb-2'>
        <span className='text-xs text-gray-500 py-2'>Appointment:</span>
        {['All', 'Pending', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              statusFilter === status
                ? status === 'Completed'
                  ? 'bg-green-500 text-white shadow-md'
                  : status === 'Cancelled'
                    ? 'bg-red-500 text-white shadow-md'
                    : status === 'Pending'
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Payment Filters */}
      <div className='flex flex-wrap gap-2 mb-4'>
        <span className='text-xs text-gray-500 py-2'>Payment:</span>
        {['All', 'Online Paid', 'Cash Payment', 'Payment Pending'].map((payment) => (
          <button
            key={payment}
            onClick={() => setPaymentFilter(payment)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              paymentFilter === payment
                ? payment === 'Online Paid'
                  ? 'bg-green-500 text-white shadow-md'
                  : payment === 'Cash Payment'
                    ? 'bg-amber-500 text-white shadow-md'
                    : payment === 'Payment Pending'
                      ? 'bg-yellow-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {payment === 'Cash Payment' ? 'Cash' : payment === 'Online Paid' ? 'Online' : payment === 'Payment Pending' ? 'Pending' : 'All'}
          </button>
        ))}
      </div>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='max-sm:hidden grid grid-cols-[0.5fr_2fr_1fr_3fr_1fr_1.5fr_1fr_1.5fr] gap-1 py-3 px-6 border-b items-center text-center'>
          <p className='text-left'>#</p>
          <p className='text-left'>Patient</p>
          <p className='text-left'>Age</p>
          <p className='text-left'>Date & Time</p>
          <p>Your Earnings</p>
          <p>Payment Status</p>
          <p>Type</p>
          <p>Appointment Status</p>
        </div>
        {filteredAppointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-5 max-sm:text-base sm:grid sm:grid-cols-[0.5fr_2fr_1fr_3fr_1fr_1.5fr_1fr_1.5fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p className='text-green-600 font-medium text-center'>{currency}{item.doctorEarnings || Math.round(item.amount * 0.8)}</p>
            <div>
              {item.payment ? (
                <div className='flex flex-col items-center'>
                  <span className={`text-xs inline border px-3 py-1 rounded-full font-medium ${
                    item.paymentMethod === 'cash'
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : 'border-green-500 bg-green-50 text-green-600'
                  }`}>
                    {item.paymentMethod === 'cash' ? 'Cash Payment' : 'Online Paid'}
                  </span>
                  {item.cashReceiptId && (
                    <span className='text-[9px] text-gray-500 mt-1'>{item.cashReceiptId}</span>
                  )}
                  {/* View Receipt button for paid appointments */}
                  <button 
                    onClick={() => openDoctorReceipt(item)}
                    className='text-[10px] text-blue-500 hover:text-blue-700 underline mt-1'
                  >
                    View Receipt
                  </button>
                </div>
              ) : (
                <span className='text-xs inline border border-yellow-500 bg-yellow-50 text-yellow-600 px-3 py-1 rounded-full font-medium'>
                  Payment Pending
                </span>
              )}
            </div>
            <div className='text-center'>
              {item.consultationType === 'online' ? (
                <div className='flex flex-col items-center gap-1'>
                  <span className='text-xs inline border border-blue-500 bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium'>
                    Online
                  </span>
                  {item.payment && !item.cancelled && !item.isCompleted && item.meetingId && (
                    <button 
                      onClick={() => navigate(`/video-consultation/${item._id}`)}
                      className='text-[10px] bg-emerald-500 text-white px-2 py-1 rounded hover:bg-emerald-600 transition-colors'
                    >
                      Join Call
                    </button>
                  )}
                </div>
              ) : (
                <span className='text-xs inline border border-emerald-300 bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-medium'>
                  On-site
                </span>
              )}
            </div>
            {item.cancelled
              ? <p className='text-red-400 text-xs font-medium text-center'>Cancelled</p>
              : item.isCompleted
                ? <p className='text-green-500 text-xs font-medium text-center'>Completed</p>
                : <div className='flex justify-center'>
                  <img onClick={() => handleCancelClick(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                  <img onClick={() => handleCompleteClick(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                </div>
            }
          </div>
        ))}
      </div>

      {/* Complete Appointment Confirmation Modal */}
      {showCompleteModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl'>
            <h3 className='text-lg font-semibold mb-4 text-gray-800'>Complete Appointment</h3>
            <p className='text-gray-600 mb-6'>Would you like to proceed to mark this appointment as completed?</p>
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => setShowCompleteModal(false)}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
              <button
                onClick={confirmComplete}
                className='px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors'
              >
                Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Appointment Confirmation Modal */}
      {showCancelModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl'>
            <h3 className='text-lg font-semibold mb-4 text-gray-800'>Cancel Appointment</h3>
            <p className='text-gray-600 mb-4'>Please provide a reason for cancelling this appointment. This will be shared with the patient.</p>
            
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="e.g., Emergency surgery, Personal emergency, Patient requested, etc."
              className='w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none'
              rows={3}
            />
            
            <div className='flex justify-end gap-3'>
              <button
                onClick={() => {
                  setShowCancelModal(false)
                  setCancellationReason('')
                }}
                className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
              >
                No, Keep It
              </button>
              <button
                onClick={confirmCancel}
                disabled={!cancellationReason.trim()}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  cancellationReason.trim() 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Receipt Modal */}
      {showDoctorReceipt && selectedReceipt && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4 border-b pb-4'>
              <div>
                <h3 className='text-lg font-semibold text-gray-800'>Payment Receipt</h3>
                <p className='text-xs text-gray-500'>Doctor View - Patient Details</p>
              </div>
              <button 
                onClick={() => setShowDoctorReceipt(false)}
                className='text-gray-400 hover:text-gray-600'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            
            {/* Receipt Content */}
            <div className='space-y-6'>
              {/* Header */}
              <div className='text-center pb-4 border-b'>
                <h2 className='text-xl font-bold text-gray-800'>CuraLink</h2>
                <p className='text-xs text-gray-400 mt-1'>1139 Dagonoy St, Malate, Manila</p>
              </div>

              {/* Patient Information */}
              <div>
                <h4 className='font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide'>Patient Information</h4>
                <div className='space-y-1 text-sm'>
                  <p><span className='text-gray-500'>Name:</span> <span className='font-medium text-gray-800'>{selectedReceipt.userData.name}</span></p>
                  <p><span className='text-gray-500'>Age:</span> <span className='font-medium text-gray-800'>{calculateAge(selectedReceipt.userData.dob)}</span> {selectedReceipt.userData.gender && <span className='text-gray-500'>| <span className='font-medium text-gray-800'>{selectedReceipt.userData.gender}</span></span>}</p>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h4 className='font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wide'>Appointment Details</h4>
                <div className='space-y-1 text-sm'>
                  <p><span className='text-gray-500'>Date:</span> <span className='font-medium text-gray-800'>{slotDateFormat(selectedReceipt.slotDate)}</span></p>
                  <p><span className='text-gray-500'>Time:</span> <span className='font-medium text-gray-800'>{selectedReceipt.slotTime}</span></p>
                  <p><span className='text-gray-500'>Appointment ID:</span> <span className='font-medium text-gray-800 font-mono text-xs'>{selectedReceipt._id.slice(-8).toUpperCase()}</span></p>
                  <p>
                    <span className='text-gray-500'>Consultation Type:</span>{' '}
                    <span className={`font-medium ${selectedReceipt.consultationType === 'online' ? 'text-blue-600' : selectedReceipt.consultationType === 'onsite' ? 'text-emerald-600' : 'text-gray-500'}`}>
                      {selectedReceipt.consultationType === 'online' ? 'Online Consultation' : selectedReceipt.consultationType === 'onsite' ? 'On-site Consultation' : 'Not specified'}
                    </span>
                  </p>
                </div>
              </div>

              {/* Payment Status & Earnings */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='flex justify-between items-center mb-3'>
                  <span className='text-gray-600'>Payment Status:</span>
                  <span className='px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full'>Paid</span>
                </div>
                <div className='flex justify-between items-center pt-3 border-t border-gray-200'>
                  <span className='text-green-700 font-semibold'>Your Earnings:</span>
                  <span className='text-xl font-bold text-green-700'>{currency}{selectedReceipt.doctorEarnings || Math.round(selectedReceipt.amount * 0.8)}</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDoctorReceipt(false)}
              className='w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default DoctorAppointments