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
                            <button onClick={() => setIsEdit(prev => !prev)} className='px-4 py-1 border border-blue-500 text-sm rounded-full mt-5 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300'>Edit</button>
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

                </div>
            </div>
        </div>
    )
}

export default DoctorProfile