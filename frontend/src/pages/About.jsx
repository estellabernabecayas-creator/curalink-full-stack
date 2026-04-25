import React from 'react'
import { assets } from '../assets/assets'
import TeamCard from '../components/TeamCard'

const About = () => {
  return (
    <div>

      {/* ABOUT US SECTION */}
      <div className='text-center text-2xl pt-10 text-[#707070] dark:text-white'>
        <p>ABOUT <span className='text-gray-700 dark:text-white font-semibold'>US</span></p>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12'>
        <img className='w-full md:max-w-[420px] rounded-xl shadow-lg' src={assets.about_image} alt="" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-500 dark:text-gray-400'>
          <p>CuraLink is a web-based healthcare appointment platform designed to simplify how patients connect with healthcare providers.</p>
          <p>The system brings together patients, doctors, and administrators into one streamlined platform where booking appointments, managing schedules, and tracking payments happens in just a few clicks.</p>
          <p className='text-gray-500 dark:text-gray-400 italic'>Smarter Healthcare, Simplified Scheduling</p>
        </div>
      </div>

      {/* VISION & MISSION SECTION */}
      <div className='mb-16'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white p-8 rounded-xl'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Our Vision</h3>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>At CuraLink, we envision a future where healthcare is seamless, accessible, and connected for everyone. We strive to bridge the gap between patients and healthcare providers, ensuring that quality care is always within reach, anytime, anywhere.</p>
          </div>
          <div className='bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white p-8 rounded-xl'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Our Mission</h3>
            <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>Our mission at CuraLink is to simplify and enhance the healthcare experience by providing a reliable digital platform that connects patients with trusted healthcare providers. We are committed to delivering efficient, user-friendly, and technology-driven solutions that empower individuals to take control of their health with ease and confidence.</p>
          </div>
        </div>
      </div>

      {/* WHO WE SERVE SECTION */}
      <div className='mb-16'>
        <div className='text-center mb-8'>
          <p className='text-xl text-gray-900 dark:text-white font-semibold'>WHO WE SERVE</p>
          <p className='text-gray-500 dark:text-gray-400 text-sm mt-1'>Three user types, one seamless platform</p>
          <div className='w-12 h-0.5 bg-gray-900 dark:bg-white mx-auto mt-3'></div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='border border-gray-200 dark:border-white p-6 rounded-xl text-center hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' /></svg>
            </div>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Patients</h4>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Browse doctors, book appointments online, track visits, and manage payments — all from one dashboard.</p>
          </div>
          <div className='border border-gray-200 dark:border-white p-6 rounded-xl text-center hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' /></svg>
            </div>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Doctors</h4>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Manage schedules, view upcoming appointments, update availability, and track patient visits with ease.</p>
          </div>
          <div className='border border-gray-200 dark:border-white p-6 rounded-xl text-center hover:shadow-lg transition-all'>
            <div className='w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg className='w-6 h-6 text-purple-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /></svg>
            </div>
            <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>Administrators</h4>
            <p className='text-sm text-gray-500 dark:text-gray-400'>Oversee operations, manage doctor profiles, monitor appointments, and ensure smooth system performance.</p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US SECTION */}
      <div className='mb-16'>
        <div className='text-center mb-8'>
          <p className='text-xl text-gray-900 dark:text-white font-semibold'>WHY CHOOSE US</p>
          <div className='w-12 h-0.5 bg-gray-900 dark:bg-white mx-auto mt-3'></div>
        </div>
        <div className='flex flex-col md:flex-row'>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300 text-gray-600 dark:text-white cursor-pointer'>
            <b>EFFICIENCY:</b>
            <p className='text-gray-500 dark:text-gray-400'>No more phone calls or long queues. Book appointments in seconds, anytime.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300 text-gray-600 dark:text-white cursor-pointer'>
            <b>CONVENIENCE:</b>
            <p className='text-gray-500 dark:text-gray-400'>One platform for patients, doctors, and admins — fully web-based, no installation needed.</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300 text-gray-600 dark:text-white cursor-pointer'>
            <b>CLARITY:</b>
            <p className='text-gray-500 dark:text-gray-400'>Transparent scheduling, payment status, and appointment history at a glance.</p>
          </div>
        </div>
      </div>

      {/* MEET THE TEAM SECTION */}
      <div className='mb-20'>
        <div className='text-center mb-10'>
          <p className='text-2xl text-gray-900 dark:text-white font-semibold tracking-wider'>MEET THE TEAM</p>
          <p className='text-gray-500 dark:text-gray-400 mt-1'>The people behind CuraLink</p>
          <div className='w-16 h-0.5 bg-gray-900 dark:bg-white mx-auto mt-3'></div>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
          <TeamCard 
            image={assets.pic1 || '/pic1.png'} 
            name="John Rupert Rollon" 
            role="Back-end Developer" 
            email="upet2541@gmail.com"
            facebook="https://www.facebook.com/john.r.rollon.1430"
            instagram="https://www.instagram.com/roll_ooon/?hl=en"
          />
          <TeamCard 
            image={assets.pic2 || '/pic2.png'} 
            name="John Basty Almario" 
            role="Front-end Developer" 
            email="johnbastyalmario595@gmail.com"
            facebook="https://www.facebook.com/kwentomosaken21"
            instagram="https://www.instagram.com/wewbasty/?hl=en"
          />
          <TeamCard 
            image={assets.pic3 || '/pic3.png'} 
            name="Carl Isaac Celeste" 
            role="QA Tester" 
            facebook="https://www.facebook.com/isaaccelest"
            instagram="https://www.instagram.com/ice__flakes/?hl=en"
          />
          <TeamCard 
            image={assets.pic4 || '/pic4.png'} 
            name="Nelson Antonino" 
            role="Documentation & Research" 
            email="nelsonantoninomempin@gmail.com"
            facebook="https://www.facebook.com/nxllantonino"
            instagram="https://www.instagram.com/itzz.nelx_/?hl=en"
          />
          <TeamCard 
            image={assets.pic5 || '/pic5.png'} 
            name="Jiro Daez" 
            role="UI/UX Designer" 
            email="jirojirodaez2107@gmail.com"
            facebook="https://www.facebook.com/jiro.daez"
            instagram="https://www.instagram.com/jirodaez/?hl=en"
          />
        </div>
      </div>

    </div>
  )
}

export default About
