import React, { useState } from 'react'
import emailjs from '@emailjs/browser'
import { assets } from '../assets/assets'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitStatus, setSubmitStatus] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus(null)
    if (!validateForm()) return
    setIsSubmitting(true)

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    console.log('EmailJS Config:', { serviceId, templateId, publicKey: publicKey ? '***' : 'missing' })

    if (!serviceId || !templateId || !publicKey) {
      console.error('Missing EmailJS environment variables')
      setSubmitStatus('error')
      setIsSubmitting(false)
      return
    }

    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      time: new Date().toLocaleString()
    }

    console.log('Template Params:', templateParams)

    try {
      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey)
      console.log('EmailJS Success:', result)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setErrors({})
    } catch (error) {
      console.error('EmailJS Error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (errors[name]) setErrors({ ...errors, [name]: '' })
    if (submitStatus) setSubmitStatus(null)
  }

  return (
    <div className='animate-fade-in-up'>

      <div className='my-10 mb-20'>

        {/* Row 1: Office Info + Image */}
        <div className='flex flex-col lg:flex-row gap-10 items-stretch mb-10'>
          <div className='w-full lg:w-1/2'>
            <div className='bg-gray-50 dark:bg-slate-800/70 rounded-xl p-6 shadow-md h-full'>
              <div className='mb-6'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-6'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500'>CONTACT US</span>
              </h2>
              </div>
              <p className='font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
                <svg className='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' />
                </svg>
                OUR OFFICE
              </p>
              <div className='space-y-4 text-sm'>
                <div className='flex items-start gap-3'>
                  <svg className='w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                  </svg>
                  <p className='text-gray-600 dark:text-gray-300'>1139 Dagonoy St<br />Singalong Malate, Manila, Philippines</p>
                </div>

                <div className='flex items-center gap-3'>
                  <svg className='w-5 h-5 text-gray-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                  </svg>
                  <p className='text-gray-600 dark:text-gray-300'>(02) 8424-8070</p>
                </div>

                <div className='flex items-center gap-3'>
                  <svg className='w-5 h-5 text-gray-400 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                  </svg>
                  <p className='text-gray-600 dark:text-gray-300'>curalinkappointment@gmail.com</p>
                </div>
              </div>

              <div className='mt-5 pt-5 border-t border-gray-200 dark:border-slate-600'>
                <p className='font-semibold text-sm text-gray-900 dark:text-white mb-3 flex items-center gap-2'>
                  <svg className='w-5 h-5 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  OFFICE HOURS
                </p>
                <div className='text-sm text-gray-600 dark:text-gray-300 space-y-1'>
                  <p><span className='font-medium'>Monday – Saturday:</span> 10:00 AM – 9:00 PM</p>
                  <p><span className='font-medium'>Sunday:</span> Closed</p>
                  <p><span className='font-medium'>Last appointment:</span> 8:30 PM</p>
                </div>
              </div>

              <div className='mt-5 pt-5 border-t border-gray-200 dark:border-slate-600'>
                <p className='font-semibold text-sm text-gray-900 dark:text-white mb-3'>FOLLOW US</p>
                <div className='flex gap-4'>
                  <a href='https://www.facebook.com/people/Cura-Link/pfbid0whYbvhn7jDd34wDV4bhXozH4z7Eu7m6kPrJBonqsnVdzKGjCM7bnFV2TQrDsY16ql/' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200'>
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                    </svg>
                  </a>
                  <a href='https://www.instagram.com/cur.alink' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors duration-200'>
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z'/>
                    </svg>
                  </a>
                  <a href='https://linkedin.com' target='_blank' rel='noopener noreferrer' className='text-gray-600 dark:text-gray-400 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200'>
                    <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className='w-full lg:w-1/2'>
            <img
              className='w-full h-full object-cover rounded-xl shadow-lg max-h-[500px]'
              src={assets.contact_image}
              alt="Contact CuraLink"
            />
          </div>
        </div>

        {/* Careers Banner */}
        <div className='mb-10'>
          <div className='bg-gradient-to-r from-blue-50 to-green-50 dark:from-slate-800/50 dark:to-slate-800/30 rounded-xl p-6 border border-blue-100 dark:border-slate-700'>
            <h2 className='text-2xl sm:text-3xl font-bold mb-6 text-center'>
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500'>CAREERS AT CURALINK</span>
            </h2>
            <p className='text-gray-600 dark:text-gray-300 text-sm text-center'>Interested in working with us? Contact us to learn more about opportunities at CuraLink.</p>
          </div>
        </div>

        {/* Row 2: Message Form (left 1/2) + Map (right 1/2) */}
        <div className='flex flex-col lg:flex-row gap-10 items-stretch'>

          {/* Left: Message Us Form */}
          <div className='w-full lg:w-1/2'>
            <div className='bg-gray-50 dark:bg-slate-800/70 rounded-xl p-6 shadow-md h-full flex flex-col'>

              <div className='mb-6'>
                <h2 className='text-2xl sm:text-3xl font-bold mb-6'>
                <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-500'>MESSAGE US</span>
              </h2>
                <p className='text-gray-500 dark:text-gray-400 mt-2 text-sm'>Need help or have a concern? Fill out the form below and our team will respond as soon as possible.</p>
              </div>

              {submitStatus === 'success' && (
                <div className='mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3'>
                  <svg className='w-5 h-5 text-green-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                  </svg>
                  <p className='text-green-700 dark:text-green-400 text-sm font-medium'>Your message has been sent successfully. Our team will get back to you shortly.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3'>
                  <svg className='w-5 h-5 text-red-500 flex-shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                  </svg>
                  <p className='text-red-700 dark:text-red-400 text-sm font-medium'>Failed to send message. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className='flex flex-col gap-4 flex-1'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-600 dark:text-gray-300'>Name <span className='text-red-500'>*</span></label>
                    <input
                      type="text"
                      name="name"
                      placeholder='Enter your full name'
                      value={formData.name}
                      onChange={handleChange}
                      className={`border rounded-lg px-4 py-3 focus:outline-none transition-colors dark:bg-slate-700/50 dark:text-white ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-600 focus:border-blue-500'
                      }`}
                    />
                    {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
                  </div>
                  <div className='flex flex-col gap-1'>
                    <label className='text-sm font-medium text-gray-600 dark:text-gray-300'>Email <span className='text-red-500'>*</span></label>
                    <input
                      type="email"
                      name="email"
                      placeholder='example@gmail.com'
                      value={formData.email}
                      onChange={handleChange}
                      className={`border rounded-lg px-4 py-3 focus:outline-none transition-colors dark:bg-slate-700/50 dark:text-white ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-600 focus:border-blue-500'
                      }`}
                    />
                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                  </div>
                </div>

                <div className='flex flex-col gap-1'>
                  <label className='text-sm font-medium text-gray-600 dark:text-gray-300'>Subject <span className='text-red-500'>*</span></label>
                  <input
                    type="text"
                    name="subject"
                    placeholder='What is your message about?'
                    value={formData.subject}
                    onChange={handleChange}
                    className={`border rounded-lg px-4 py-3 focus:outline-none transition-colors dark:bg-slate-700/50 dark:text-white ${
                      errors.subject ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-600 focus:border-blue-500'
                    }`}
                  />
                  {errors.subject && <p className='text-red-500 text-xs mt-1'>{errors.subject}</p>}
                </div>

                <div className='flex flex-col gap-1 flex-1'>
                  <label className='text-sm font-medium text-gray-600 dark:text-gray-300'>Message <span className='text-red-500'>*</span></label>
                  <textarea
                    name="message"
                    placeholder='Type your message here...'
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={`border rounded-lg px-4 py-3 focus:outline-none transition-colors resize-none dark:bg-slate-700/50 dark:text-white ${
                      errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-300 dark:border-slate-600 focus:border-blue-500'
                    }`}
                  />
                  {errors.message && <p className='text-red-500 text-xs mt-1'>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className='bg-gradient-to-r from-blue-600 to-emerald-500 text-white px-8 py-3 rounded-full font-medium hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-auto md:self-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                >
                  {isSubmitting ? (
                    <>
                      <svg className='w-5 h-5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>

            </div>
          </div>

          {/* Right: Map */}
          <div className='w-full lg:w-1/2'>
            <div className='rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-slate-600 h-full min-h-[480px]'>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.5619124151744!2d120.994410274872!3d14.567020485915384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9829d684179%3A0xe2c2ac116dafbaf!2s1139%20Dagonoy%2C%20Malate%2C%20Manila%2C%201004%20Metro%20Manila!5e0!3m2!1sen!2sph!4v1776797247534!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="CuraLink Office Location"
              ></iframe>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

export default Contact