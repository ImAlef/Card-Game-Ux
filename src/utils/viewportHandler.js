// src/utils/viewportHandler.js

/**
 * This utility handles mobile viewport issues like orientation,
 * virtual keyboard, and various browser quirks on mobile devices
 */

// Initialize viewport handler
export const initViewportHandler = () => {
    // Fix for iOS Safari 100vh issue
    const setVhProperty = () => {
      // First, get the viewport height and multiply it by 1% to get a value for 1vh unit
      let vh = window.innerHeight * 0.01;
      // Then set the value in the --vh custom property to the root of the document
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
  
    // Fix for virtual keyboard issues
    const handleResize = () => {
      // Update the viewport height variable
      setVhProperty();
      
      // Check orientation
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      document.documentElement.classList.toggle('is-landscape', isLandscape);
      document.documentElement.classList.toggle('is-portrait', !isLandscape);
      
      // Check if it's mobile
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      document.documentElement.classList.toggle('is-mobile', isMobileDevice);
      
      // Check if it's a small screen
      const isSmallScreen = window.innerWidth < 768;
      document.documentElement.classList.toggle('is-small-screen', isSmallScreen);
      
      // Check if it's a low height
      const isLowHeight = window.innerHeight < 500;
      document.documentElement.classList.toggle('is-low-height', isLowHeight);
    };
  
    // Set it up on init
    setVhProperty();
    handleResize();
  
    // Update on resize and orientation change
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Prevent pinch zoom on mobile devices
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Workaround for iOS Safari bottom bar issues
    if (/iPhone|iPod|iPad/.test(navigator.userAgent)) {
      // Add padding to the bottom of the page to account for the bottom bar
      document.body.classList.add('ios-device');
      
      // Handle minimal-ui that might revert to normal mode
      window.addEventListener('resize', () => {
        setTimeout(window.scrollTo.bind(null, 0, 0), 300);
      });
    }
    
    // Prevent bounce scroll on iOS
    document.body.addEventListener('touchmove', (e) => {
      if (e.target === document.body) {
        e.preventDefault();
      }
    }, { passive: false });
    
    // Add utility classes for RTL language support
    if (document.documentElement.lang === 'fa') {
      document.documentElement.classList.add('rtl-support');
      document.body.setAttribute('dir', 'rtl');
      
      // Apply RTL-specific adjustments
      const rtlElements = document.querySelectorAll('.rtl-flip');
      rtlElements.forEach(el => {
        el.style.transform = 'scaleX(-1)';
      });
    }
    
    return {
      cleanup: () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      }
    };
  };