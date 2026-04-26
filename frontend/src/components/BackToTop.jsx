import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    const toggleVisibility = () => {
      // Show button earlier on mobile devices (200px vs 500px on desktop)
      const isMobileDevice = window.innerWidth < 640;
      const scrollThreshold = isMobileDevice ? 200 : 500;
      
      // Use multiple scroll detection methods for mobile compatibility
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      
      setIsVisible(scrollY > scrollThreshold);
    };
    
    // Initial checks
    checkMobile();
    toggleVisibility();
    
    // Add event listeners
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    window.addEventListener('resize', () => {
      checkMobile();
      toggleVisibility();
    });
    
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      window.removeEventListener('resize', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9999] p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
