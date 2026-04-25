import React, { useEffect, useContext, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const Earnings = () => {
  const { aToken, appointments, getAllAppointments } = useContext(AdminContext)
  const { currency, slotDateFormat } = useContext(AppContext)
  const [dateFilter, setDateFilter] = useState('all') // 'all', 'today', 'week', 'month'

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  // Filter paid appointments based on date
  const paidAppointments = appointments.filter(item => item.payment)
  
  const filteredAppointments = paidAppointments.filter(item => {
    if (dateFilter === 'all') return true
    
    const appointmentDate = new Date(item.date)
    const today = new Date()
    
    if (dateFilter === 'today') {
      return appointmentDate.toDateString() === today.toDateString()
    }
    
    if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      return appointmentDate >= weekAgo
    }
    
    if (dateFilter === 'month') {
      return appointmentDate.getMonth() === today.getMonth() && 
             appointmentDate.getFullYear() === today.getFullYear()
    }
    
    return true
  })

  // Calculate totals
  const totalRevenue = filteredAppointments.reduce((sum, item) => sum + item.amount, 0)
  const totalPlatformFees = filteredAppointments.reduce((sum, item) => sum + (item.platformFee || Math.round(item.amount * 0.20)), 0)
  const totalDoctorEarnings = filteredAppointments.reduce((sum, item) => sum + (item.doctorEarnings || item.amount - Math.round(item.amount * 0.20)), 0)

  // Group by doctor
  const doctorEarnings = {}
  filteredAppointments.forEach(item => {
    const docId = item.docId
    const docName = item.docData.name
    const platformFee = item.platformFee || Math.round(item.amount * 0.20)
    const doctorEarning = item.doctorEarnings || item.amount - platformFee
    
    if (!doctorEarnings[docId]) {
      doctorEarnings[docId] = {
        name: docName,
        totalAppointments: 0,
        totalRevenue: 0,
        platformFees: 0,
        earnings: 0
      }
    }
    
    doctorEarnings[docId].totalAppointments += 1
    doctorEarnings[docId].totalRevenue += item.amount
    doctorEarnings[docId].platformFees += platformFee
    doctorEarnings[docId].earnings += doctorEarning
  })

  return (
    <div className='w-full max-w-6xl m-5'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
        <div>
          <p className='text-lg font-medium text-gray-700 dark:text-white'>Earnings Dashboard</p>
          <p className='text-sm text-gray-500 dark:text-gray-400'>Platform Revenue & Doctor Payouts</p>
        </div>
        
        {/* Date Filter */}
        <select 
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className='px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-700 dark:text-white'
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6'>
        {/* Total Revenue */}
        <div className='bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg p-6'>
          <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>Total Revenue</p>
          <p className='text-2xl font-bold text-gray-800 dark:text-white'>{currency}{totalRevenue.toLocaleString()}</p>
          <p className='text-xs text-gray-400 mt-2'>All paid appointments</p>
        </div>

        {/* Platform Earnings (20%) */}
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6'>
          <p className='text-sm text-blue-600 dark:text-blue-400 mb-1'>Platform Earnings (20%)</p>
          <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>{currency}{totalPlatformFees.toLocaleString()}</p>
          <p className='text-xs text-blue-400 mt-2'>Your commission</p>
        </div>

        {/* Doctor Payouts (80%) */}
        <div className='bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6'>
          <p className='text-sm text-green-600 dark:text-green-400 mb-1'>Doctor Payouts (80%)</p>
          <p className='text-2xl font-bold text-green-700 dark:text-green-300'>{currency}{totalDoctorEarnings.toLocaleString()}</p>
          <p className='text-xs text-green-400 mt-2'>Owed to doctors</p>
        </div>
      </div>

      {/* Split Visualization */}
      <div className='bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg p-6 mb-6'>
        <p className='text-sm font-medium text-gray-700 dark:text-white mb-4'>Revenue Split (80/20)</p>
        <div className='relative h-8 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden'>
          <div className='absolute left-0 top-0 h-full bg-blue-500 w-[20%] flex items-center justify-center text-xs text-white font-medium'>
            20%
          </div>
          <div className='absolute left-[20%] top-0 h-full bg-green-500 w-[80%] flex items-center justify-center text-xs text-white font-medium'>
            80% Doctors
          </div>
        </div>
        <div className='flex justify-between mt-3 text-sm'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
            <span className='text-gray-600 dark:text-gray-300'>Platform: {currency}{totalPlatformFees.toLocaleString()}</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='text-gray-600 dark:text-gray-300'>Doctors: {currency}{totalDoctorEarnings.toLocaleString()}</span>
            <div className='w-3 h-3 bg-green-500 rounded-full'></div>
          </div>
        </div>
      </div>

      {/* Doctor Breakdown */}
      <div className='bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden'>
        <div className='p-4 border-b dark:border-slate-600'>
          <p className='font-medium text-gray-700 dark:text-white'>Earnings by Doctor</p>
        </div>
        
        {Object.keys(doctorEarnings).length === 0 ? (
          <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
            No paid appointments found for this period.
          </div>
        ) : (
          <div className='divide-y dark:divide-slate-600'>
            {Object.entries(doctorEarnings).map(([docId, data]) => (
              <div key={docId} className='p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50'>
                <div className='flex items-center gap-4'>
                  <div className='w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center'>
                    <span className='text-lg font-semibold text-gray-600 dark:text-gray-300'>
                      {data.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className='font-medium text-gray-800 dark:text-white'>{data.name}</p>
                    <p className='text-sm text-gray-500 dark:text-gray-400'>{data.totalAppointments} appointments</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='font-medium text-green-600 dark:text-green-400'>{currency}{data.earnings.toLocaleString()}</p>
                  <p className='text-xs text-gray-400'>Doctor earnings</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className='mt-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-lg overflow-hidden'>
        <div className='p-4 border-b dark:border-slate-600'>
          <p className='font-medium text-gray-700 dark:text-white'>Recent Transactions</p>
        </div>
        
        {filteredAppointments.slice(0, 10).map((item, index) => (
          <div key={index} className='p-4 flex items-center justify-between border-b dark:border-slate-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-slate-700/50'>
            <div className='flex items-center gap-4'>
              <div className='w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center'>
                <span className='text-sm font-semibold text-gray-600 dark:text-gray-300'>
                  {item.userData.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className='font-medium text-gray-800 dark:text-white'>{item.userData.name}</p>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  with Dr. {item.docData.name} • {slotDateFormat(item.slotDate)}
                </p>
              </div>
            </div>
            <div className='text-right'>
              <p className='font-medium text-gray-800 dark:text-white'>{currency}{item.amount}</p>
              <p className='text-xs text-blue-500 dark:text-blue-400'>
                Platform: {currency}{item.platformFee || Math.round(item.amount * 0.20)}
              </p>
            </div>
          </div>
        ))}
        
        {filteredAppointments.length === 0 && (
          <div className='p-8 text-center text-gray-500 dark:text-gray-400'>
            No transactions found for this period.
          </div>
        )}
      </div>
    </div>
  )
}

export default Earnings
