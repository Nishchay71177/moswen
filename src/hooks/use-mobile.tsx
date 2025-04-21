
import { useState, useEffect } from 'react';

export const useIsMobile = () => {
  // Initialize with false to handle server-side rendering
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Set initial value
      setIsMobile(window.innerWidth <= 768);
      
      const handleResize = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return isMobile;
};
