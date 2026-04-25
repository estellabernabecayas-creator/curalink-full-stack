import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {

  const { doctors, changeAvailability, deleteDoctor, editDoctor, aToken, getAllDoctors } = useContext(AdminContext)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    experience: '',
    fees: '',
    about: '',
    speciality: '',
    degree: ''
  })
  const [searchTerm, setSearchTerm] = useState('')

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    if (aToken) {
        getAllDoctors()
    }
  }, [aToken])

  const openDeleteModal = (doctor) => {
    setSelectedDoctor(doctor)
    setShowDeleteModal(true)
  }

  const closeDeleteModal = () => {
    setSelectedDoctor(null)
    setShowDeleteModal(false)
  }

  const confirmDelete = async () => {
    if (selectedDoctor) {
      const success = await deleteDoctor(selectedDoctor._id)
      if (success) {
        closeDeleteModal()
      }
    }
  }

  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor)
    setEditForm({
      name: doctor.name || '',
      email: doctor.email || '',
      experience: doctor.experience || '',
      fees: doctor.fees || '',
      about: doctor.about || '',
      speciality: doctor.speciality || '',
      degree: doctor.degree || ''
    })
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setSelectedDoctor(null)
    setShowEditModal(false)
    setEditForm({
      name: '',
      email: '',
      experience: '',
      fees: '',
      about: '',
      speciality: '',
      degree: ''
    })
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm(prev => ({ ...prev, [name]: value }))
  }

  const confirmEdit = async (e) => {
    e.preventDefault()
    if (selectedDoctor) {
      const success = await editDoctor(selectedDoctor._id, editForm)
      if (success) {
        closeEditModal()
      }
    }
  }

  return (
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4'>
        <h1 className='text-lg font-medium'>All Doctors</h1>
        
        {/* Search Bar */}
        <div className='relative w-full sm:w-72'>
          <input
            type='text'
            placeholder='Search doctor name...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white text-sm'
          />
          <svg className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
          </svg>
        </div>
      </div>

      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {filteredDoctors.map((item, index) => (
          <div className='border border-gray-200 dark:border-white/60 hover:border-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:p-[2px] rounded-xl max-w-56 overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 shadow-md hover:shadow-xl' key={index}>
            <div className='w-full h-full bg-white dark:bg-dark-slate-light rounded-xl overflow-hidden'>
              <div className='bg-[#f8fbff] dark:bg-slate-800'>
                <img className='w-full' src={item.image} alt="" />
              </div>
              <div className='p-4'>
                <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-600 font-medium' : "text-gray-500 dark:text-gray-400"}`}>
                  {item.available ? (
                    <>
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      <span>Available Now</span>
                    </>
                  ) : (
                    <>
                      <p className={`w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400`}></p>
                      <p>Not Available</p>
                    </>
                  )}
                </div>
                <p className='text-gray-900 dark:text-white text-lg font-medium mt-2'>{item.name}</p>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>{item.speciality}</p>
                <div className='mt-2 flex items-center gap-1 text-sm'>
                  <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                  <p>Available</p>
                </div>
                <button
                  onClick={() => openEditModal(item)}
                  className='mt-3 w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white text-sm py-2 rounded-md transition-all duration-300 shadow-md hover:shadow-lg'
                >
                  Edit Doctor
                </button>
                <button
                  onClick={() => openDeleteModal(item)}
                  className='mt-2 w-full bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-md transition-colors duration-200'
                >
                  Remove Doctor
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Doctor Modal */}
      {showEditModal && selectedDoctor && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-slate-800 rounded-xl p-6 max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Edit Doctor</h2>
            
            <form onSubmit={confirmEdit} className='space-y-4'>
              <div className='flex items-center gap-4 mb-4'>
                <img 
                  src={selectedDoctor.image} 
                  alt={selectedDoctor.name}
                  className='w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-slate-600'
                />
                <div>
                  <p className='text-lg font-medium text-gray-900 dark:text-white'>{selectedDoctor.name}</p>
                  <p className='text-gray-600 dark:text-gray-400'>{selectedDoctor.speciality}</p>
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Name</p>
                  <input
                    type='text'
                    name='name'
                    value={editForm.name}
                    onChange={handleEditChange}
                    className='border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                    required
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Email</p>
                  <input
                    type='email'
                    name='email'
                    value={editForm.email}
                    onChange={handleEditChange}
                    className='border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                    required
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Experience</p>
                  <input
                    type='text'
                    name='experience'
                    value={editForm.experience}
                    onChange={handleEditChange}
                    className='border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                    placeholder="e.g. '5' year/s"
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Fee (Php)</p>
                  <input
                    type='number'
                    name='fees'
                    value={editForm.fees}
                    onChange={handleEditChange}
                    className='border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                    required
                  />
                </div>

                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Speciality</p>
                  <select
                    name='speciality'
                    value={editForm.speciality}
                    onChange={handleEditChange}
                    className='border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                  >
                    <option value='General physician'>General physician</option>
                    <option value='Gynecologist'>Gynecologist</option>
                    <option value='Dermatologist'>Dermatologist</option>
                    <option value='Pediatricians'>Pediatricians</option>
                    <option value='Neurologist'>Neurologist</option>
                    <option value='Gastroenterologist'>Gastroenterologist</option>
                  </select>
                </div>

                <div className='flex flex-col gap-1'>
                  <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Degree</p>
                  <input
                    type='text'
                    name='degree'
                    value={editForm.degree}
                    onChange={handleEditChange}
                    className='border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                    placeholder='e.g. MD, MBBS'
                  />
                </div>
              </div>

              <div className='flex flex-col gap-1'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>About</p>
                <textarea
                  name='about'
                  value={editForm.about}
                  onChange={handleEditChange}
                  rows='3'
                  className='border rounded px-3 py-2 dark:bg-slate-700 dark:border-slate-600 dark:text-white'
                />
              </div>

              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={closeEditModal}
                  className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200'
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>Remove Doctor</h2>
            
            <div className='flex items-center gap-4 mb-4'>
              <img 
                src={selectedDoctor.image} 
                alt={selectedDoctor.name}
                className='w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-slate-600'
              />
              <div>
                <p className='text-lg font-medium text-gray-900 dark:text-white'>{selectedDoctor.name}</p>
                <p className='text-gray-600 dark:text-gray-400'>{selectedDoctor.speciality}</p>
                <p className='text-sm text-gray-500 dark:text-gray-500 mt-1'>{selectedDoctor.degree}</p>
              </div>
            </div>

            <p className='text-gray-700 dark:text-gray-300 mb-6'>
              Are you sure you want to remove this doctor?
            </p>

            <div className='flex gap-3'>
              <button
                onClick={closeDeleteModal}
                className='flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors duration-200'
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className='flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorsList