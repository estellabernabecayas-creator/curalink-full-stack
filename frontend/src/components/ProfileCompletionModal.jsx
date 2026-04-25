import React, { useEffect, useState } from 'react';

const ProfileCompletionModal = ({ isOpen, onClose, onContinue, profileCompletion = 20 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scrolling when modal is open
      document.body.style.overflow = 'hidden';
      // Small delay for fade-in animation
      const timer = setTimeout(() => setIsVisible(true), 50);
      return () => {
        clearTimeout(timer);
      };
    } else {
      // Restore body scrolling when modal closes
      document.body.style.overflow = '';
      setIsVisible(false);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    }
  };

  const handleLater = () => {
    // Store in session storage to prevent immediate re-show
    sessionStorage.setItem('profileModalDismissed', 'true');
    onClose();
  };

  return (
    <div 
      className={`fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center transition-all duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.98) 0%, rgba(16, 185, 129, 0.98) 100%)',
        backdropFilter: 'blur(8px)',
        width: '100vw',
        height: '100vh',
        position: 'fixed'
      }}
    >
      <div 
        className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-8 sm:p-10 text-center transition-all duration-500 ease-out transform ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Illustration / Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg 
              className="w-10 h-10 sm:w-12 sm:h-12 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Complete Your Profile
        </h2>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-6 max-w-md mx-auto">
          To provide better healthcare services, please complete your profile information.
        </p>

        {/* Benefits - Horizontal on desktop, stacked on mobile */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mb-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center justify-center sm:justify-start gap-1">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Faster booking</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Better care</span>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-1">
            <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Personalized</span>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-slate-700 dark:to-slate-600 rounded-xl p-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
            <span className="font-medium">Profile Completion</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{profileCompletion}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-slate-600 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleContinue}
            className="flex-1 bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-3.5 px-6 rounded-xl font-semibold text-base hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Continue
          </button>
          <button
            onClick={handleLater}
            className="flex-1 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 text-gray-600 dark:text-gray-300 py-3.5 px-6 rounded-xl font-semibold text-base hover:bg-gray-50 dark:hover:bg-slate-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
