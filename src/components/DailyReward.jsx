import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Daily rewards data
const dailyRewards = [
  { day: 1, reward: { type: 'coins', amount: 100, icon: '🪙' }},
  { day: 2, reward: { type: 'coins', amount: 200, icon: '🪙' }},
  { day: 3, reward: { type: 'card', name: 'Basic Card Style', icon: '🃏' }},
  { day: 4, reward: { type: 'coins', amount: 300, icon: '🪙' }},
  { day: 5, reward: { type: 'gems', amount: 10, icon: '💎' }},
  { day: 6, reward: { type: 'coins', amount: 500, icon: '🪙' }},
  { day: 7, reward: { type: 'character', name: 'Mystery Character', icon: '👤', premium: true }}
];

function DailyReward() {
  const [currentDay, setCurrentDay] = useState(3); // Simulating on day 3 of streak
  const [isOpen, setIsOpen] = useState(false);
  const [isCollected, setIsCollected] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  
  // Simulate confetti on component mount
  useEffect(() => {
    // Small delay to ensure animation plays after component is visible
    const timer = setTimeout(() => {
      setShowConfetti(true);
      
      // Hide confetti after 3 seconds
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleOpenReward = () => {
    setIsOpen(true);
    
    // Show confetti animation
    setShowConfetti(true);
    
    // Hide confetti after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const collectReward = () => {
    setIsCollected(true);
    // In a real app, here you would call an API to actually give the reward
  };
  
  const todayReward = dailyRewards[currentDay - 1];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900 flex flex-col items-center justify-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={`confetti-${i}`}
                className="absolute z-10 w-3 h-3 rounded-full"
                initial={{ 
                  top: '-5%',
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#FCD34D', '#60A5FA', '#34D399', '#F87171', '#A78BFA'][Math.floor(Math.random() * 5)],
                  scale: 0
                }}
                animate={{ 
                  top: '110%', 
                  left: `${Math.random() * 100}%`,
                  rotate: Math.random() * 360,
                  scale: [0, 1, 0.5, 0]
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 2 + Math.random() * 2,
                  ease: "easeOut"
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <Link to="/">
          <motion.button 
            className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon hover-glow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white text-xl">←</span>
          </motion.button>
        </Link>
        
        <h1 className="text-4xl text-yellow-400 font-bold text-center text-glow-gold">DAILY REWARDS</h1>
        
        <motion.button 
          className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon hover-glow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <span className="text-white text-xl">📅</span>
        </motion.button>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 mt-16">
        {isCollected ? (
          <motion.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-6xl mb-6">✅</div>
            <h2 className="text-3xl text-white mb-6">Reward Collected!</h2>
            <p className="text-xl text-gray-300 mb-10">Come back tomorrow for your next reward.</p>
            
            <Link to="/">
              <motion.button 
                className="px-8 py-3 bg-purple-700 text-white text-xl rounded-lg shadow-neon hover-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Game
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <>
            {!isOpen ? (
              <motion.div
                className="bg-black bg-opacity-40 p-10 rounded-2xl flex flex-col items-center shadow-neon max-w-md w-full"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatType: "reverse"
                }}
              >
                <div className="text-6xl mb-6">🎁</div>
                <h2 className="text-3xl text-white mb-2">Your Daily Reward</h2>
                <p className="text-gray-300 mb-6">Day {currentDay} Streak</p>
                
                <motion.button 
                  className="px-8 py-4 bg-yellow-600 text-white text-xl rounded-lg shadow-neon hover-glow"
                  whileHover={{ scale: 1.05, backgroundColor: "#ca8a04" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleOpenReward}
                >
                  OPEN REWARD
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                className="bg-black bg-opacity-60 p-8 rounded-xl flex flex-col items-center shadow-neon max-w-md w-full"
                initial={{ opacity: 0, scale: 0.9, rotateY: 180 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ type: "spring", duration: 0.7 }}
              >
                <div className="relative mb-6">
                  <div className="text-7xl">
                    {todayReward.reward.icon}
                  </div>
                  {todayReward.reward.premium && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-black text-xs font-bold">
                      ⭐
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl text-white mb-2">
                  {todayReward.reward.type === 'coins' && `${todayReward.reward.amount} Coins`}
                  {todayReward.reward.type === 'gems' && `${todayReward.reward.amount} Gems`}
                  {todayReward.reward.type === 'card' && todayReward.reward.name}
                  {todayReward.reward.type === 'character' && todayReward.reward.name}
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Day {currentDay} reward unlocked!
                </p>
                
                <motion.button 
                  className="px-8 py-3 bg-green-600 text-white text-xl rounded-lg shadow-neon hover-glow mb-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={collectReward}
                >
                  COLLECT
                </motion.button>
              </motion.div>
            )}
          </>
        )}
      </div>
      
      {/* Calendar Popup */}
      <AnimatePresence>
        {showCalendar && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 p-6 rounded-xl shadow-neon max-w-lg w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl text-yellow-400 font-bold">WEEKLY REWARDS</h2>
                <button 
                  className="text-gray-400 hover:text-white"
                  onClick={() => setShowCalendar(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-7 gap-2 mb-6">
                {dailyRewards.map((day, index) => (
                  <div 
                    key={day.day} 
                    className={`relative p-4 rounded-lg flex flex-col items-center ${
                      day.day < currentDay 
                        ? 'bg-gray-700 opacity-80' 
                        : day.day === currentDay 
                          ? 'bg-yellow-700 shadow-neon' 
                          : 'bg-gray-800'
                    }`}
                  >
                    <div className="text-sm text-gray-400 mb-1">Day {day.day}</div>
                    <div className="text-2xl mb-2">{day.reward.icon}</div>
                    <div className="text-xs text-white text-center">
                      {day.reward.type === 'coins' && `${day.reward.amount} Coins`}
                      {day.reward.type === 'gems' && `${day.reward.amount} Gems`}
                      {day.reward.type === 'card' && 'Card Style'}
                      {day.reward.type === 'character' && 'Character'}
                    </div>
                    
                    {/* Status indicator */}
                    {day.day < currentDay && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-green-700 rounded-full flex items-center justify-center text-white text-xs">
                        ✓
                      </div>
                    )}
                    
                    {day.reward.premium && (
                      <div className="absolute top-0 left-0 w-5 h-5 bg-yellow-500 rounded-tl-lg flex items-center justify-center text-black text-xs">
                        ⭐
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center">
                <div className="bg-gray-800 p-3 rounded-lg inline-block text-center">
                  <p className="text-white text-sm">Complete 7 days to get special character</p>
                  <div className="w-full bg-gray-700 h-2 rounded-full mt-2">
                    <div 
                      className="bg-yellow-500 h-full rounded-full" 
                      style={{ width: `${(currentDay / 7) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DailyReward;