import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    // Multiple scroll methods to ensure compatibility across browsers
    const scrollToTop = () => {
      // Use different offsets based on the page
      const isDoctorsPage = pathname.includes('/doctors');
      const isContactPage = pathname === '/contact';
      const headerOffset = isDoctorsPage ? 100 : (isContactPage ? -40 : 0);
      
      window.scrollTo(0, headerOffset);
      document.documentElement.scrollTop = headerOffset;
      document.body.scrollTop = headerOffset;
      
      // Also try scrolling any scrollable containers
      const scrollableElements = document.querySelectorAll('[data-scrollable="true"]');
      scrollableElements.forEach(el => {
        el.scrollTop = headerOffset;
      });
    };

    // Immediate scroll
    scrollToTop();
    
    // Fallback scroll after a short delay to ensure it works
    const timeoutId = setTimeout(scrollToTop, 50);
    
    return () => clearTimeout(timeoutId);
  }, [pathname]);
  
  return null;
}
