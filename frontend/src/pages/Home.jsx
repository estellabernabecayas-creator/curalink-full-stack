import React, { useContext, useState, useEffect } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import ProfileReminderBanner from '../components/ProfileReminderBanner'
import { AppContext } from '../context/AppContext'

const Home = () => {
  const { userData, token } = useContext(AppContext)
  const [showBanner, setShowBanner] = useState(true)

  // Calculate profile completion percentage
  const calculateProfileCompletion = (data) => {
    if (!data) return 0
    let totalFields = 6
    let filledFields = 0
    if (data.name && data.name.trim() !== '') filledFields++
    if (data.email && data.email.trim() !== '') filledFields++
    if (data.phone && data.phone !== '000000000') filledFields++
    if (data.address && (data.address.line1 || data.address.line2)) filledFields++
    if (data.gender && data.gender !== 'Not Selected') filledFields++
    if (data.dob && data.dob !== 'Not Selected') filledFields++
    return Math.round((filledFields / totalFields) * 100)
  }

  const profileCompletion = userData ? calculateProfileCompletion(userData) : 0

  return (
    <div>
      {token && showBanner && (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6'>
          <ProfileReminderBanner 
            profileCompletion={profileCompletion} 
            onClose={() => setShowBanner(false)}
          />
        </div>
      )}
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  )
}

export default Home