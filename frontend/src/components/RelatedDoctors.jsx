import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {

    const navigate = useNavigate()
    const { doctors } = useContext(AppContext)
    const [relDoc, setRelDoc] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDoc(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <div className='flex flex-col items-center gap-4 my-16 text-gray-800 dark:text-white'>
            <h1 className='text-3xl font-medium text-gray-900 dark:text-white'>Related Doctors</h1>
            <p className='sm:w-1/3 text-center text-sm text-gray-600 dark:text-gray-300'>Simply browse through our extensive list of trusted doctors.</p>
            <div className='w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0'>
                {relDoc.map((item, index) => (
                    <div
                        onClick={() => { navigate(`/appointment/${item._id}`); window.scrollTo(0, 0) }}
                        key={index}
                        className='relative p-[1.5px] rounded-xl cursor-pointer hover:translate-y-[-8px] transition-all duration-300 hover:shadow-lg'
                        style={{
                            background: 'linear-gradient(135deg, #2563eb, #10b981)'
                        }}
                    >
                        {/* Inner card */}
                        <div className='bg-white dark:bg-slate-800 rounded-[10px] overflow-hidden h-full'>
                            <img
                                className='w-full bg-blue-50 dark:bg-slate-700'
                                src={item.image}
                                alt={item.name}
                            />
                            <div className='p-4'>
                                <div className={`flex items-center gap-2 text-sm ${item.available ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${item.available ? 'bg-green-600 dark:bg-green-400' : 'bg-gray-500 dark:bg-gray-400'}`}></span>
                                    <span>{item.available ? 'Available' : 'Not Available'}</span>
                                </div>
                                <p className='text-gray-900 dark:text-white text-lg font-medium mt-1'>{item.name}</p>
                                <p className='text-gray-600 dark:text-gray-300 text-sm'>{item.speciality}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RelatedDoctors