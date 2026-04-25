import React, { useEffect, useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {

  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [paymentFilter, setPaymentFilter] = useState('All') // 'All', 'Online Paid', 'Cash Payment', 'Payment Pending'
  
  // Admin receipt modal state
  const [showAdminReceipt, setShowAdminReceipt] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  
  // Open admin receipt modal
  const openAdminReceipt = (appointment) => {
    setSelectedReceipt(appointment)
    setShowAdminReceipt(true)
  }

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  // Filter appointments based on search and status
  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.docData.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'Pending' && !appointment.cancelled && !appointment.isCompleted) ||
      (statusFilter === 'Completed' && appointment.isCompleted) ||
      (statusFilter === 'Cancelled' && appointment.cancelled)
    
    const matchesPayment = paymentFilter === 'All' ||
      (paymentFilter === 'Online Paid' && appointment.payment && appointment.paymentMethod !== 'cash') ||
      (paymentFilter === 'Cash Payment' && appointment.payment && appointment.paymentMethod === 'cash') ||
      (paymentFilter === 'Payment Pending' && !appointment.payment)
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  return (
    <div className='w-full max-w-6xl m-5 '>

      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
        <p className='text-lg font-medium text-gray-700 dark:text-white'>All Appointments</p>
        
        {/* Search Bar */}
        <div className='relative w-full sm:w-72'>
          <input
            type='text'
            placeholder='Search patient or doctor...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white text-sm'
          />
          <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
        </div>
      </div>

      {/* Status Filters */}
      <div className='flex flex-wrap gap-2 mb-2'>
        <span className='text-xs text-gray-500 dark:text-gray-400 py-2'>Appointment:</span>
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
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Payment Filters */}
      <div className='flex flex-wrap gap-2 mb-4'>
        <span className='text-xs text-gray-500 dark:text-gray-400 py-2'>Payment:</span>
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
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
            }`}
          >
            {payment === 'Cash Payment' ? 'Cash' : payment === 'Online Paid' ? 'Online' : payment === 'Payment Pending' ? 'Pending' : 'All'}
          </button>
        ))}
      </div>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='hidden sm:grid grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1.5fr_1.5fr] grid-flow-col py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Type</p>
          <p>Payment Status</p>
          <p>Appointment Status</p>
        </div>
        {filteredAppointments.map((item, index) => (
          <div className='flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.5fr_3fr_1fr_3fr_3fr_1fr_1fr_1.5fr_1.5fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p className='max-sm:hidden'>{index+1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" /> <p>{item.userData.name}</p>
            </div>
            <p className='max-sm:hidden'>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <div className='flex items-center gap-2'>
              <img src={item.docData.image} className='w-8 rounded-full bg-gray-200' alt="" /> <p>{item.docData.name}</p>
            </div>
            <p className='text-gray-800 dark:text-white/80 text-center hidden md:block'>{currency}{item.amount}</p>
            <div className='text-center'>
              {item.consultationType === 'online' ? (
                <span className='px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full'>
                  Online
                </span>
              ) : (
                <span className='px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium rounded-full'>
                  On-site
                </span>
              )}
            </div>
            <div className='text-center'>
              {item.payment ? (
                <div className='flex flex-col items-center gap-1'>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    item.paymentMethod === 'cash' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}>
                    {item.paymentMethod === 'cash' ? 'Cash Payment' : 'Online Paid'}
                  </span>
                  {item.cashReceiptId && (
                    <span className='text-[10px] text-gray-500 dark:text-gray-400'>
                      {item.cashReceiptId}
                    </span>
                  )}
                  {/* View Receipt button for paid appointments */}
                  {item.payment && (
                    <button 
                      onClick={() => openAdminReceipt(item)}
                      className='text-[10px] text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline mt-1'
                    >
                      View Receipt
                    </button>
                  )}
                </div>
              ) : (
                <span className='px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full'>
                  Payment Pending
                </span>
              )}
            </div>
            <div className='text-center'>
              {item.cancelled ? (
                <span className='px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full'>
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className='px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full'>
                  Completed
                </span>
              ) : (
                <span className='px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 text-xs font-medium rounded-full'>
                  Pending
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Admin Receipt Modal */}
      {showAdminReceipt && selectedReceipt && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white dark:bg-slate-800 rounded-lg p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto'>
            <div className='flex items-center justify-between mb-4 border-b dark:border-slate-600 pb-4'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Payment Receipt</h3>
                <p className='text-xs text-gray-500 dark:text-gray-400'>Admin View - Full Details</p>
              </div>
              <button 
                onClick={() => setShowAdminReceipt(false)}
                className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              >
                <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            
            {/* Receipt Content */}
            <div className='space-y-4'>
              {/* Header */}
              <div className='text-center pb-4 border-b dark:border-slate-600'>
                <h2 className='text-xl font-bold text-gray-900 dark:text-white'>CuraLink</h2>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Medical Appointment System</p>
                <p className='text-xs text-gray-400 mt-1'>1139 Dagonoy St, Malate, Manila</p>
              </div>

              {/* Payment Badge */}
              <div className='flex justify-center'>
                <span className={`px-4 py-1 text-xs font-bold rounded-full ${
                  selectedReceipt.paymentMethod === 'cash' 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                }`}>
                  {selectedReceipt.paymentMethod === 'cash' ? 'CASH PAYMENT' : 'ONLINE PAYMENT'}
                </span>
              </div>

              {/* Amount */}
              <div className='text-center py-2'>
                <p className='text-3xl font-bold text-gray-900 dark:text-white'>{currency}{selectedReceipt.amount}</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>Amount Paid</p>
              </div>

              {/* Patient Details */}
              <div className='bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide'>Patient Information</h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Name:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{selectedReceipt.userData.name}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Email:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{selectedReceipt.userData.email}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Phone:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{selectedReceipt.userData.phone}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Age:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{calculateAge(selectedReceipt.userData.dob)} years old</span>
                  </div>
                  {selectedReceipt.userData.gender && (
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>Gender:</span>
                      <span className='font-medium text-gray-900 dark:text-white'>{selectedReceipt.userData.gender}</span>
                    </div>
                  )}
                  {selectedReceipt.userData.address && (selectedReceipt.userData.address.line1 || selectedReceipt.userData.address.line2) && (
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>Address:</span>
                      <span className='font-medium text-gray-900 dark:text-white text-right max-w-[200px]'>
                        {selectedReceipt.userData.address.line1}{selectedReceipt.userData.address.line1 && selectedReceipt.userData.address.line2 && ', '}{selectedReceipt.userData.address.line2}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div className='bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide'>Appointment Details</h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Doctor:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{selectedReceipt.docData.name} ({selectedReceipt.docData.speciality})</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Date:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{slotDateFormat(selectedReceipt.slotDate)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Time:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{selectedReceipt.slotTime}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Appointment ID:</span>
                    <span className='font-medium text-gray-900 dark:text-white font-mono text-xs'>{selectedReceipt._id.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Consultation Type:</span>
                    <span className={`font-medium ${selectedReceipt.consultationType === 'online' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {selectedReceipt.consultationType === 'online' ? 'Online Consultation' : 'On-site Consultation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className='bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide'>Payment Details</h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Payment Method:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>
                      {selectedReceipt.paymentMethod === 'cash' ? 'Cash Payment' : 'Online Payment (Stripe/PayMongo)'}
                    </span>
                  </div>
                  {selectedReceipt.cashReceiptId && (
                    <div className='flex justify-between'>
                      <span className='text-gray-500 dark:text-gray-400'>Receipt ID:</span>
                      <span className='font-medium text-gray-900 dark:text-white font-mono'>{selectedReceipt.cashReceiptId}</span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Status:</span>
                    <span className='font-medium text-green-600 dark:text-green-400'>Paid</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Issued On:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Revenue Breakdown */}
              <div className='bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide'>Revenue Breakdown (Doctor 80% / Clinic 20%)</h4>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Total Amount:</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{currency}{selectedReceipt.amount}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-500 dark:text-gray-400'>Doctor Earnings (80%):</span>
                    <span className='font-medium text-gray-900 dark:text-white'>{currency}{selectedReceipt.doctorEarnings || selectedReceipt.amount - Math.round(selectedReceipt.amount * 0.20)}</span>
                  </div>
                  <div className='flex justify-between border-t border-gray-200 dark:border-slate-600 pt-2 mt-2'>
                    <span className='text-blue-600 dark:text-blue-400 font-medium'>Clinic Earnings (20%):</span>
                    <span className='font-bold text-blue-700 dark:text-blue-300'>{currency}{selectedReceipt.platformFee || Math.round(selectedReceipt.amount * 0.20)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className='text-center pt-4 border-t dark:border-slate-600'>
                <p className='text-xs text-gray-500 dark:text-gray-400'>This is an official receipt for office records.</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowAdminReceipt(false)}
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

export default AllAppointments