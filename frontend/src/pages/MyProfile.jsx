import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const MyProfile = () => {
    const [isEdit, setIsEdit] = useState(false)
    const [image, setImage] = useState(false)
    const [profileCompletion, setProfileCompletion] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const { token, backendUrl, userData, setUserData, loadUserProfileData } = useContext(AppContext)

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

    useEffect(() => {
        if (userData) {
            setProfileCompletion(calculateProfileCompletion(userData))
        }
    }, [userData])

    const updateUserProfileData = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            formData.append('name', userData.name)
            formData.append('phone', userData.phone)
            formData.append('address', JSON.stringify(userData.address))
            formData.append('gender', userData.gender)
            formData.append('dob', userData.dob)
            image && formData.append('image', image)

            const { data } = await axios.post(backendUrl + '/api/user/update-profile', formData, { headers: { token } })

            if (data.success) {
                toast.success(data.message)
                await loadUserProfileData()
                setIsEdit(false)
                setImage(false)
                if (data.profileCompleted) {
                    toast.success('Your profile is now complete!')
                }
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return userData ? (
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {/* Page Header */}
            <div className='mb-8'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>My Profile</h1>
                <p className='text-gray-600 dark:text-gray-400'>Manage your personal information and preferences</p>
            </div>

            {/* Profile Completion Banner */}
            {profileCompletion < 100 && (
                <div className='bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl p-4 mb-8'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center'>
                            <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                            </svg>
                        </div>
                        <div>
                            <p className='font-semibold text-gray-900 dark:text-white'>Complete Your Profile</p>
                            <p className='text-sm text-gray-600 dark:text-gray-400'>Fill in your details for a better healthcare experience</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-4'>
                        <div className='flex-1'>
                            <div className='flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1'>
                                <span>Profile Completion</span>
                                <span className='font-semibold'>{profileCompletion}%</span>
                            </div>
                            <div className='w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2.5'>
                                <div className='bg-gradient-to-r from-blue-500 to-emerald-500 h-2.5 rounded-full transition-all duration-500' style={{ width: `${profileCompletion}%` }}></div>
                            </div>
                        </div>
                        {!isEdit && (
                            <button onClick={() => setIsEdit(true)} className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'>
                                Complete Now
                            </button>
                        )}
                    </div>
                </div>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                {/* Left Column - Profile Header */}
                <div className='lg:col-span-1'>
                    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6 text-center'>
                        {/* Profile Image */}
                        <div className='relative inline-block mb-4'>
                            {isEdit ? (
                                <label htmlFor='image' className='cursor-pointer'>
                                    <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 dark:border-slate-600 relative'>
                                        <img className='w-full h-full object-cover opacity-75' src={image ? URL.createObjectURL(image) : userData.image} alt="Profile" />
                                        <div className='absolute inset-0 bg-black/30 flex items-center justify-center'>
                                            <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
                                            </svg>
                                        </div>
                                    </div>
                                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden accept="image/*" />
                                </label>
                            ) : (
                                <div className='w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100 dark:border-slate-600'>
                                    <img className='w-full h-full object-cover' src={userData.image} alt="Profile" />
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        {isEdit ? (
                            <input className='w-full text-center text-xl font-semibold bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2 mb-2' type="text" onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))} value={userData.name} placeholder='Your Name' />
                        ) : (
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-1'>{userData.name || 'Not set'}</h2>
                        )}

                        <p className='text-gray-500 dark:text-gray-400 text-sm mb-6'>Patient</p>

                        {/* Quick Stats */}
                        <div className='grid grid-cols-2 gap-4 mb-6'>
                            <div className='bg-gray-50 dark:bg-slate-700 rounded-xl p-3'>
                                <p className='text-2xl font-bold text-blue-600'>{profileCompletion}%</p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>Complete</p>
                            </div>
                            <div className='bg-gray-50 dark:bg-slate-700 rounded-xl p-3'>
                                <p className='text-2xl font-bold text-emerald-600'>Active</p>
                                <p className='text-xs text-gray-500 dark:text-gray-400'>Account</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className='space-y-3'>
                            {isEdit ? (
                                <>
                                    <button onClick={updateUserProfileData} disabled={isLoading} className='w-full bg-gradient-to-r from-blue-600 to-emerald-500 hover:from-blue-700 hover:to-emerald-600 text-white py-2.5 rounded-xl font-medium transition-all disabled:opacity-50'>
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                    <button onClick={() => setIsEdit(false)} className='w-full bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 py-2.5 rounded-xl font-medium transition-colors'>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setIsEdit(true)} className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors'>
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Right Column - Profile Details */}
                <div className='lg:col-span-2 space-y-6'>
                    {/* Personal Information Card */}
                    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                            <svg className='w-5 h-5 text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                            </svg>
                            Personal Information
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            {/* Gender */}
                            <div>
                                <label className='text-sm text-gray-500 dark:text-gray-400 mb-1 block'>Gender</label>
                                {isEdit ? (
                                    <select className='w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5' onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))} value={userData.gender}>
                                        <option value="Not Selected">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                ) : (
                                    <p className='text-gray-900 dark:text-white font-medium'>
                                        {userData.gender !== 'Not Selected' ? userData.gender : <span className='text-gray-400 italic'>Not set</span>}
                                    </p>
                                )}
                            </div>

                            {/* Birthday */}
                            <div>
                                <label className='text-sm text-gray-500 dark:text-gray-400 mb-1 block'>Birthday</label>
                                {isEdit ? (
                                    <input className='w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2.5' type='date' onChange={(e) => setUserData(prev => ({ ...prev, dob: e.target.value }))} value={userData.dob !== 'Not Selected' ? userData.dob : ''} />
                                ) : (
                                    <p className='text-gray-900 dark:text-white font-medium'>
                                        {userData.dob !== 'Not Selected' ? userData.dob : <span className='text-gray-400 italic'>Not set</span>}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Card */}
                    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                            <svg className='w-5 h-5 text-emerald-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                            </svg>
                            Contact Information
                        </h3>
                        <div className='space-y-4'>
                            {/* Email */}
                            <div className='flex items-start gap-3'>
                                <svg className='w-5 h-5 text-gray-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                                </svg>
                                <div className='flex-1'>
                                    <label className='text-sm text-gray-500 dark:text-gray-400 block'>Email</label>
                                    <p className='text-gray-900 dark:text-white font-medium'>{userData.email}</p>
                                </div>
                            </div>

                            {/* Phone - Read Only */}
                            <div className='flex items-start gap-3'>
                                <svg className='w-5 h-5 text-gray-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z' />
                                </svg>
                                <div className='flex-1'>
                                    <label className='text-sm text-gray-500 dark:text-gray-400 block'>Phone</label>
                                    <p className='text-gray-900 dark:text-white font-medium'>
                                        {userData.phone !== '000000000' ? userData.phone : <span className='text-gray-400 italic'>Not set</span>}
                                    </p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className='flex items-start gap-3'>
                                <svg className='w-5 h-5 text-gray-400 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                </svg>
                                <div className='flex-1'>
                                    <label className='text-sm text-gray-500 dark:text-gray-400 block'>Address</label>
                                    {isEdit ? (
                                        <div className='space-y-2'>
                                            <input className='w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line1: e.target.value } }))} value={userData.address?.line1 || ''} placeholder='Street address' />
                                            <input className='w-full bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg px-3 py-2' type="text" onChange={(e) => setUserData(prev => ({ ...prev, address: { ...prev.address, line2: e.target.value } }))} value={userData.address?.line2 || ''} placeholder='City, State, ZIP' />
                                        </div>
                                    ) : (
                                        <div className='text-gray-900 dark:text-white font-medium'>
                                            {userData.address?.line1 || userData.address?.line2 ? (
                                                <>
                                                    <p>{userData.address?.line1}</p>
                                                    <p>{userData.address?.line2}</p>
                                                </>
                                            ) : (
                                                <span className='text-gray-400 italic'>Add your address</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Account Settings Card */}
                    <div className='bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-6'>
                        <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2'>
                            <svg className='w-5 h-5 text-purple-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            Account Settings
                        </h3>
                        <div className='flex flex-wrap gap-3'>
                            <button className='flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors'>
                                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                </svg>
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : null
}

export default MyProfile