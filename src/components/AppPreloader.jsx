import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedImageService from '../services/EnhancedImageService';

function AppPreloader({ children, onComplete }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const preloadAssets = async () => {
      try {
        // Set initial progress
        setProgress(10);
        
        // Preload game modes (important for main menu)
        setProgress(20);
        await EnhancedImageService.preloadImages('gameMode', ['hokm', 'poker', 'blackjack']);
        
        // Preload character avatars
        setProgress(40);
        await EnhancedImageService.preloadImages('character', ['viper', 'jinx', 'ekko', 'caitlyn']);
        
        // Preload card designs
        setProgress(60);
        await EnhancedImageService.preloadImages('card', ['neon', 'arcane', 'golden', 'standard']);
        
        // Preload some playing cards
        setProgress(80);
        await EnhancedImageService.preloadImages('playingCard', ['HA', 'HK', 'SA', 'SK', 'DA', 'DK', 'CA', 'CK', 'back']);
        
        // Preload backgrounds
        setProgress(90);
        await EnhancedImageService.preloadImages('background', ['arcane', 'piltover']);
        
        // Wait a bit to avoid flash of content
        setTimeout(() => {
          setProgress(100);
          setLoading(false);
          if (onComplete) onComplete();
        }, 500);
        
      } catch (error) {
        console.error('Error preloading assets:', error);
        // Even if there's an error, we should still show the app
        setProgress(100);
        setLoading(false);
        if (onComplete) onComplete();
      }
    };
    
    preloadAssets();
  }, [onComplete]);
  
  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl text-yellow-400 font-bold mb-4">ARCANE CARDS</h1>
              <p className="text-purple-300 mb-8">Loading the magic...</p>
              
              <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-4">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <p className="text-gray-400 text-sm">{progress}% Complete</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {children}
    </>
  );
}

export default AppPreloader;