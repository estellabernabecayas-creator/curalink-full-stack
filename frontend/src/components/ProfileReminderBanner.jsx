import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileReminderBanner = ({ profileCompletion, onClose }) => {
  const navigate = useNavigate();

  if (profileCompletion >= 100) return null;

  return (
    <div className='bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-slate-800 dark:to-slate-700 border border-blue-200 dark:border-slate-600 rounded-xl p-4 mb-6 relative'>
      <button 
        onClick={onClose}
        className='absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
      >
        <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
        </svg>
      </button>
      
      <div className='flex items-center gap-3 mb-3 pr-8'>
        <div className='w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center'>
          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
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
          <div className='w-full bg-gray-200 dark:bg-slate-600 rounded-full h-2'>
            <div 
              className='bg-gradient-to-r from-blue-500 to-emerald-500 h-2 rounded-full transition-all duration-500' 
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>
        <button 
          onClick={() => navigate('/my-profile')}
          className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0'
        >
          Complete Now
        </button>
      </div>
    </div>
  );
};

export default ProfileReminderBanner;
