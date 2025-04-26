import React, { useState, useEffect } from 'react';

const OrientationHandler = ({ children }) => {
  const [isLandscape, setIsLandscape] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile and determine orientation
  useEffect(() => {
    // Detect if device is mobile
    const checkMobile = () => {
      const userAgent = 
        navigator.userAgent || navigator.vendor || window.opera;
      
      // Regular expression to check for mobile devices
      const mobileRegex = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      
      setIsMobile(mobileRegex.test(userAgent));
    };

    // Check orientation
    const checkOrientation = () => {
      if (window.matchMedia("(orientation: landscape)").matches) {
        setIsLandscape(true);
      } else {
        setIsLandscape(false);
      }
    };

    // Initial checks
    checkMobile();
    checkOrientation();

    // Add event listener for orientation changes
    window.addEventListener("resize", checkOrientation);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  // If device is mobile and not in landscape mode, show overlay
  if (isMobile && !isLandscape) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center text-center p-6">
        <div className="animate-pulse mb-6">
          <img 
            src="/api/placeholder/150/100" 
            alt="Rotate device" 
            className="w-20 h-20 mx-auto mb-4"
          />
        </div>
        <h2 className="text-yellow-400 text-2xl font-bold mb-3">Please Rotate Your Device</h2>
        <p className="text-white mb-8">
          Arcane Card Game requires landscape orientation for the best gaming experience.
        </p>
        <div className="animate-bounce text-4xl">↺</div>
      </div>
    );
  }

  // Otherwise, render children normally
  return <>{children}</>;
};

export default OrientationHandler;