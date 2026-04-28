import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import TeamCard from '../components/TeamCard'

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* MAIN CONTENT - Single unified card */}
      <div className="flex flex-col md:flex-row gap-12 items-stretch mb-20">
        
        {/* Left Side - All Content in ONE Card */}
        <div className="md:w-1/2">
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-lg h-full flex flex-col justify-center">
            
            {/* Badge - Matching your aesthetic */}
            <div className="mb-6">
              <span className="inline-block px-4 py-1.5 text-base font-semibold tracking-wider uppercase bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <span className="text-gray-700 dark:text-white">About</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">CuraLink</span>
              </span>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Your Health, Our Priority</span>
            </h2>
            
            {/* Description Paragraphs */}
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                CuraLink is a web-based healthcare appointment platform designed to simplify how 
                patients connect with healthcare providers.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                The system brings together patients, doctors, and administrators into one streamlined 
                platform where booking appointments, managing schedules, and tracking payments happens 
                in just a few clicks.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Learn more about our mission, vision, and the team behind your trusted healthcare platform.
              </p>
            </div>
            
            {/* Quote */}
            <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
              <p className="text-lg italic text-gray-900 dark:text-white font-medium">
                "Smarter Healthcare, Simplified Scheduling"
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl blur-2xl opacity-20"></div>
          <img 
            className="relative w-full h-full object-cover rounded-2xl shadow-xl min-h-[400px]" 
            src={assets.about_image} 
            alt="About CuraLink" 
          />
        </div>
      </div>

      {/* VISION & MISSION SECTION */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        
        {/* Vision Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Our Vision</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            At CuraLink, we envision a future where healthcare is seamless, accessible, and connected 
            for everyone. We strive to bridge the gap between patients and healthcare providers, 
            ensuring that quality care is always within reach, anytime, anywhere.
          </p>
        </div>

        {/* Mission Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
          <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-800/40 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
            <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Our Mission</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Our mission at CuraLink is to simplify and enhance the healthcare experience by providing 
            a reliable digital platform that connects patients with trusted healthcare providers. 
            We are committed to delivering efficient, user-friendly, and technology-driven solutions 
            that empower individuals to take control of their health with ease and confidence.
          </p>
        </div>
      </div>

      {/* WHO WE SERVE SECTION */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Who We Serve</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Three user types, one seamless platform — designed for everyone
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Patients */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-200 to-emerald-300 dark:from-green-900/40 dark:to-emerald-800/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Patients</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Browse doctors, book appointments online, track visits, and manage payments — all from one dashboard.
            </p>
          </div>

          {/* Doctors */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-200 to-emerald-300 dark:from-green-900/40 dark:to-emerald-800/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Doctors</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Manage schedules, view upcoming appointments, update availability, and track patient visits with ease.
            </p>
          </div>

          {/* Administrators */}
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 group">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-200 to-emerald-300 dark:from-green-900/40 dark:to-emerald-800/40 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Administrators</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Oversee operations, manage doctor profiles, monitor appointments, and ensure smooth system performance.
            </p>
          </div>
        </div>
      </div>

      {/* WHY CHOOSE US SECTION */}
      <div className="mb-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Why Choose CuraLink?</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600">Efficiency</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              No more phone calls or long queues. Book appointments in seconds, anytime, anywhere.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600">Convenience</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              One platform for patients, doctors, and admins — fully web-based, no installation needed.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group">
            <div className="flex items-center mb-2">
              <svg className="w-6 h-6 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-600">Clarity</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Transparent scheduling, payment status, and appointment history at a glance.
            </p>
          </div>
        </div>
      </div>

      {/* MEET THE TEAM SECTION */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500">Meet the Team</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Dedicated professionals committed to your health
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          <TeamCard 
            image={assets.pic3 || '/pic3.png'} 
            video={assets.glasseson1}
            name="Carl Isaac Celeste" 
            role="QA Tester" 
            email="isaacceleste4@gmail.com"
            facebook="https://www.facebook.com/isaaccelest"
            instagram="https://www.instagram.com/ice__flakes/?hl=en"
          />
          <TeamCard 
            image={assets.pic1 || '/pic1.png'} 
            video={assets.glasseson3}
            name="John Rupert Rollon" 
            role="Back-end Developer" 
            email="upet2541@gmail.com"
            facebook="https://www.facebook.com/john.r.rollon.1430"
            instagram="https://www.instagram.com/roll_ooon/?hl=en"
          />
          <TeamCard 
            image={assets.pic5 || '/pic5.png'} 
            video={assets.glasseson4}
            name="Jiro Daez" 
            role="UI/UX Designer" 
            email="jirojirodaez2107@gmail.com"
            facebook="https://www.facebook.com/jiro.daez"
            instagram="https://www.instagram.com/jirodaez/?hl=en"
          />
          <TeamCard 
            image={assets.pic2 || '/pic2.png'} 
            video={assets.glasseson5}
            name="John Basty Almario" 
            role="Front-end Developer" 
            email="johnbastyalmario595@gmail.com"
            facebook="https://www.facebook.com/kwentomosaken21"
            instagram="https://www.instagram.com/wewbasty/?hl=en"
          />
          <TeamCard 
            image={assets.pic4 || '/pic4.png'} 
            video={assets.glasseson2}
            name="Nelson Antonino" 
            role="Documentation & Research" 
            email="nelsonantoninomempin@gmail.com"
            facebook="https://www.facebook.com/nxllantonino"
            instagram="https://www.instagram.com/itzz.nelx_/?hl=en"
          />
        </div>
      </div>

    </div>
  )
}

export default About