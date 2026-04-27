import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    // Change password states
    const [showChangePassword, setShowChangePassword] = useState(false)
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [changePasswordLoading, setChangePasswordLoading] = useState(false)

    const updateProfile = async () => {
        try {
            const updateData = {
                about: profileData.about,
                experience: profileData.experience,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                setShowConfirmModal(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const handleSaveClick = () => {
        setShowConfirmModal(true)
    }

    const handleConfirmSave = () => {
        updateProfile()
    }

    const handleCancelSave = () => {
        setShowConfirmModal(false)
    }

    const handleCancelEdit = () => {
        setIsEdit(false)
        getProfileData() // Reset to original values
    }

    // Handle password change
    const handleChangePassword = async (e) => {
        e.preventDefault()

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error('Please fill in all password fields')
            return
        }
        if (newPassword.length < 6) {
            toast.error('New password must be at least 6 characters')
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error('New password and confirm password do not match')
            return
        }

        setChangePasswordLoading(true)
        try {
            const { data } = await axios.post(backendUrl + '/api/doctor/change-password', {
                currentPassword,
                newPassword
            }, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setShowChangePassword(false)
                setCurrentPassword('')
                setNewPassword('')
                setConfirmPassword('')
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to change password')
        } finally {
            setChangePasswordLoading(false)
        }
    }

    const cancelChangePassword = () => {
        setShowChangePassword(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='bg-gradient-to-r from-blue-100 to-green-100 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border border-gray-200 rounded-lg p-8 py-7 bg-white shadow-md'>

                    {/* ----- Doc Info : name, degree, experience ----- */}

                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <div className='flex items-center gap-2'>
                            <span className='text-xs text-gray-500'>Experience:</span>
                            {isEdit ? (
                                <input
                                    type='text'
                                    onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                                    value={profileData.experience}
                                    className='py-0.5 px-2 border text-xs rounded-full w-32 border-blue-200 focus:border-blue-400 outline-blue-400'
                                    placeholder="e.g. '5' years"
                                />
                            ) : (
                                <span className='py-0.5 px-2 border text-xs rounded-full bg-gray-50'>{profileData.experience}</span>
                            )}
                        </div>
                    </div>

                    {/* ----- Doc About ----- */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About :</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {
                                isEdit
                                    ? <textarea onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} type='text' className='w-full outline-blue-400 border border-gray-200 focus:border-blue-400 p-2 rounded' rows={8} value={profileData.about} />
                                    : profileData.about
                            }
                        </p>
                    </div>

                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: <span className='text-green-800'>{currency} {profileData.fees}</span>
                        <span className='text-xs text-gray-400 ml-2'>(Set by admin)</span>
                    </p>

                    <div className='flex gap-1 pt-2'>
                        <input type="checkbox" onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} checked={profileData.available} />
                        <label htmlFor="">Available</label>
                    </div>

                    {
                        isEdit ? (
                            <div className='flex gap-3 mt-5'>
                                <button onClick={handleSaveClick} className='px-4 py-1 border border-blue-500 text-sm rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300'>Save</button>
                                <button onClick={handleCancelEdit} className='px-4 py-1 border border-gray-400 text-gray-600 text-sm rounded-full hover:bg-gray-100 transition-all duration-300'>Cancel</button>
                            </div>
                        ) : (
                            <div className='flex gap-3 mt-5'>
                                <button onClick={() => setIsEdit(prev => !prev)} className='px-4 py-1 border border-blue-500 text-sm rounded-full hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300'>Edit</button>
                                <button onClick={() => setShowChangePassword(true)} className='px-4 py-1 border border-gray-400 text-gray-600 text-sm rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center gap-2'>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                                    </svg>
                                    Change Password
                                </button>
                            </div>
                        )
                    }

                    {/* Confirmation Modal */}
                    {showConfirmModal && (
                        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6'>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Confirm Update</h3>
                                <p className='text-gray-600 dark:text-gray-400 mb-6'>Are all the credentials correct?</p>
                                <div className='flex gap-3 justify-end'>
                                    <button onClick={handleCancelSave} className='px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors'>No</button>
                                    <button onClick={handleConfirmSave} className='px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all'>Yes, Continue</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Change Password Modal */}
                    {showChangePassword && (
                        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
                            <div className='bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full p-6'>
                                <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>Change Password</h3>
                                <form onSubmit={handleChangePassword} className='space-y-4'>
                                    {/* Current Password */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Current Password</label>
                                        <div className='relative'>
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className='w-full border rounded px-3 py-2 pr-10'
                                                placeholder='Enter current password'
                                                required
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                            >
                                                {showCurrentPassword ? (
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                                    </svg>
                                                ) : (
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.982-5.568m3.076-1.553A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-3.205 5.326M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3l18 18' />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>New Password</label>
                                        <div className='relative'>
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className='w-full border rounded px-3 py-2 pr-10'
                                                placeholder='Enter new password (min 6 chars)'
                                                minLength={6}
                                                required
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                            >
                                                {showNewPassword ? (
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                                    </svg>
                                                ) : (
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.982-5.568m3.076-1.553A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-3.205 5.326M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3l18 18' />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Confirm New Password */}
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>Confirm New Password</label>
                                        <div className='relative'>
                                            <input
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className='w-full border rounded px-3 py-2 pr-10'
                                                placeholder='Confirm new password'
                                                required
                                            />
                                            <button
                                                type='button'
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                                            >
                                                {showConfirmPassword ? (
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                                                    </svg>
                                                ) : (
                                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.059 10.059 0 013.982-5.568m3.076-1.553A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.059 10.059 0 01-3.205 5.326M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3l18 18' />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className='flex gap-3 pt-2'>
                                        <button
                                            type='button'
                                            onClick={cancelChangePassword}
                                            className='flex-1 px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors'
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type='submit'
                                            disabled={changePasswordLoading}
                                            className='flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                        >
                                            {changePasswordLoading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile