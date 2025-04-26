import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EnhancedImageService from '../services/EnhancedImageService';

// Daily quests data
const dailyQuests = [
  {
    id: 'daily-1',
    title: 'Play 3 games',
    description: 'Play 3 games in any mode',
    progress: 2,
    target: 3,
    reward: { type: 'xp', amount: 500 },
    completed: false,
    category: 'easy',
    gameMode: 'any'
  },
  {
    id: 'daily-2',
    title: 'Win a game of Hokm',
    description: 'Win 1 game in Hokm mode',
    progress: 1,
    target: 1,
    reward: { type: 'currency', amount: 100 },
    completed: true,
    category: 'medium',
    gameMode: 'hokm'
  },
  {
    id: 'daily-3',
    title: 'Play cards in Poker',
    description: 'Play 20 cards in Poker mode',
    progress: 12,
    target: 20,
    reward: { type: 'xp', amount: 300 },
    completed: false,
    category: 'medium',
    gameMode: 'poker'
  },
  {
    id: 'daily-4',
    title: 'Score 21 in Blackjack',
    description: 'Score exactly 21 points in a Blackjack game',
    progress: 0,
    target: 1,
    reward: { type: 'card', name: 'Card Pack' },
    completed: false,
    category: 'hard',
    gameMode: 'blackjack'
  }
];

// Weekly quests data
const weeklyQuests = [
  {
    id: 'weekly-1',
    title: 'Win 5 games',
    description: 'Win 5 games in any mode',
    progress: 3,
    target: 5,
    reward: { type: 'currency', amount: 500 },
    completed: false,
    category: 'medium',
    gameMode: 'any'
  },
  {
    id: 'weekly-2',
    title: 'Play with friends',
    description: 'Play 3 games with friends in your party',
    progress: 2,
    target: 3,
    reward: { type: 'xp', amount: 1000 },
    completed: false,
    category: 'easy',
    gameMode: 'any'
  },
  {
    id: 'weekly-3',
    title: 'Win a ranked game',
    description: 'Win 1 game in ranked mode',
    progress: 0,
    target: 1,
    reward: { type: 'card', name: 'Premium Card Pack' },
    completed: false,
    category: 'hard',
    gameMode: 'ranked'
  },
  {
    id: 'weekly-4',
    title: 'Complete all daily quests',
    description: 'Complete all daily quests for one day',
    progress: 0,
    target: 1,
    reward: { type: 'character', name: 'Character Skin Shard' },
    completed: false,
    category: 'hard',
    gameMode: 'any'
  }
];

// Premium quests (only available with Premium Battle Pass)
const premiumQuests = [
  {
    id: 'premium-1',
    title: 'Premium: Win 3 consecutive games',
    description: 'Win 3 games in a row in any mode',
    progress: 1,
    target: 3,
    reward: { type: 'currency', amount: 1000 },
    completed: false,
    category: 'premium',
    gameMode: 'any'
  },
  {
    id: 'premium-2',
    title: 'Premium: Win without losing tricks',
    description: 'Win a Hokm game without losing any tricks',
    progress: 0,
    target: 1,
    reward: { type: 'pet', name: 'Mini Dragon Pet' },
    completed: false,
    category: 'premium',
    gameMode: 'hokm'
  },
  {
    id: 'premium-3',
    title: 'Premium: Score a Royal Flush',
    description: 'Get a Royal Flush in Poker',
    progress: 0,
    target: 1,
    reward: { type: 'background', name: 'Luxury Background' },
    completed: false,
    category: 'premium',
    gameMode: 'poker'
  }
];

// Event quests data (seasonal/special events)
const eventQuests = [
  {
    id: 'event-1',
    title: 'Mystic Tournament',
    description: 'Participate in the weekend tournament',
    progress: 0,
    target: 1,
    reward: { type: 'currency', amount: 2000 },
    completed: false,
    category: 'event',
    gameMode: 'tournament',
    endTime: '2d 14h',
  },
  {
    id: 'event-2',
    title: 'Season 2 Celebration',
    description: 'Win 5 games with Mystic Realms cards',
    progress: 2,
    target: 5,
    reward: { type: 'character', name: 'Luna Character' },
    completed: false,
    category: 'event',
    gameMode: 'any',
    endTime: '6d 8h',
  }
];

// Battle Pass data
const battlePassData = {
  level: 27,
  xp: 3500,
  xpNeeded: 5000,
  premiumPurchased: true
};

function Quests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('daily');
  const [claimingReward, setClaimingReward] = useState(null);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);
  
  // Function to handle reward claiming
  const claimReward = (questId, category) => {
    // For demonstration purposes, just show the animation
    setClaimingReward(questId);
    
    // Simulate API call delay
    setTimeout(() => {
      setClaimingReward(null);
      
      // Update the quest data (in a real app would update state)
      console.log(`Claimed reward for quest ${questId}`);
    }, 1500);
  };
  
  // Function to get the correct quest list based on active tab
  const getActiveQuests = () => {
    switch(activeTab) {
      case 'daily': return dailyQuests;
      case 'weekly': return weeklyQuests;
      case 'premium': return premiumQuests;
      case 'event': return eventQuests;
      default: return dailyQuests;
    }
  };
  
  // Function to get reward image based on reward type
  const getRewardImage = (reward) => {
    switch(reward.type) {
      case 'xp': return EnhancedImageService.getCustomPlaceholder(60, 60, 'XP', 'blue');
      case 'currency': return EnhancedImageService.getImage('shopItem', 'coins');
      case 'card': return EnhancedImageService.getImage('shopItem', 'neon_pack');
      case 'character': return EnhancedImageService.getImage('character', 'jinx');
      case 'pet': return EnhancedImageService.getImage('pet', 'dragon');
      case 'background': return EnhancedImageService.getImage('background', 'arcane');
      default: return EnhancedImageService.getCustomPlaceholder(60, 60, 'Reward');
    }
  };
  
  return (
    <div className="min-h-screen bg-arcane text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-50 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="mr-4 bg-gray-800 p-2 rounded-full"
            onClick={() => navigate(-1)}
          >
            <span className="text-xl">←</span>
          </button>
          <h1 className="text-2xl font-bold">QUESTS</h1>
        </div>
        <div className="flex items-center">
          <div className="bg-black bg-opacity-60 rounded-full px-3 py-1 flex items-center mr-4">
            <span className="text-yellow-400 mr-1">🪙</span>
            <span className="font-bold">1730</span>
          </div>
          <button 
            className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg shadow-neon"
            onClick={() => navigate('/battlepass')}
          >
            BATTLE PASS
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Battle Pass progress */}
        <div 
          className="relative rounded-xl overflow-hidden mb-6 shadow-neon"
          style={{
            background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${EnhancedImageService.getImage('background', 'arcane')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold">BATTLE PASS PROGRESS</h2>
                <p className="text-gray-300">Complete quests to earn XP and level up your Battle Pass</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{battlePassData.level}</div>
                <div className="text-sm text-gray-300">Current Level</div>
              </div>
            </div>
            
            {/* XP Progress bar */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm">{battlePassData.xp} XP</span>
                <span className="text-sm">{battlePassData.xpNeeded} XP needed for level {battlePassData.level + 1}</span>
              </div>
              <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-blue-500" 
                  style={{ width: `${(battlePassData.xp / battlePassData.xpNeeded) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <TabButton 
            label="DAILY" 
            active={activeTab === 'daily'} 
            onClick={() => setActiveTab('daily')}
            notification={dailyQuests.filter(q => q.completed && q.progress >= q.target).length > 0}
            count={dailyQuests.filter(q => q.completed && q.progress >= q.target).length}
          />
          <TabButton 
            label="WEEKLY" 
            active={activeTab === 'weekly'} 
            onClick={() => setActiveTab('weekly')}
            notification={weeklyQuests.filter(q => q.completed && q.progress >= q.target).length > 0}
            count={weeklyQuests.filter(q => q.completed && q.progress >= q.target).length}
          />
          <TabButton 
            label="PREMIUM" 
            active={activeTab === 'premium'} 
            onClick={() => battlePassData.premiumPurchased ? setActiveTab('premium') : setShowPremiumPrompt(true)}
            special="premium"
          />
          <TabButton 
            label="EVENT" 
            active={activeTab === 'event'} 
            onClick={() => setActiveTab('event')}
            notification={true}
            special="event"
          />
        </div>
        
        {/* Quest lists */}
        <div className="space-y-4 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Quest list heading with timer for daily/weekly */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {activeTab.toUpperCase()} QUESTS
                </h3>
                
                {activeTab === 'daily' && (
                  <div className="bg-gray-800 px-3 py-1 rounded-full">
                    <span className="text-sm">Resets in: <span className="text-yellow-400 font-bold">11h 32m</span></span>
                  </div>
                )}
                
                {activeTab === 'weekly' && (
                  <div className="bg-gray-800 px-3 py-1 rounded-full">
                    <span className="text-sm">Resets in: <span className="text-yellow-400 font-bold">3d 11h</span></span>
                  </div>
                )}
              </div>
              
              {/* Premium pass prompt if trying to see premium quests without pass */}
              {activeTab === 'premium' && !battlePassData.premiumPurchased && (
                <div className="bg-gray-800 rounded-xl p-6 text-center shadow-neon-subtle">
                  <div className="text-yellow-400 text-4xl mb-4">👑</div>
                  <h3 className="text-xl font-bold text-yellow-400 mb-2">PREMIUM QUESTS LOCKED</h3>
                  <p className="text-gray-300 mb-4">Purchase the Premium Battle Pass to unlock exclusive quests and rewards.</p>
                  <button 
                    className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold shadow-neon hover-glow"
                    onClick={() => navigate('/battlepass')}
                  >
                    GET PREMIUM PASS
                  </button>
                </div>
              )}
              
              {/* Quest items */}
              {(activeTab !== 'premium' || battlePassData.premiumPurchased) && 
                getActiveQuests().map((quest) => (
                <div 
                  key={quest.id} 
                  className={`bg-gray-800 rounded-xl p-4 shadow-neon-subtle overflow-hidden ${
                    quest.category === 'premium' ? 'border border-yellow-600' : 
                    quest.category === 'event' ? 'border border-purple-600' : ''
                  }`}
                >
                  <div className="flex flex-wrap md:flex-nowrap">
                    {/* Left: Quest info */}
                    <div className="flex-1 mb-4 md:mb-0 md:mr-4">
                      <div className="flex items-start">
                        <div className="mr-3">
                          {quest.gameMode !== 'any' && (
                            <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center overflow-hidden">
                              <img 
                                src={EnhancedImageService.getImage('gameMode', quest.gameMode)}
                                alt={quest.gameMode}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          {quest.gameMode === 'any' && (
                            <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center">
                              <span className="text-xl">🎮</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{quest.title}</h4>
                          <p className="text-gray-300 text-sm">{quest.description}</p>
                          
                          {quest.category === 'event' && (
                            <div className="mt-1 text-xs text-purple-400">
                              Ends in: {quest.endTime}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Middle: Progress bar */}
                    <div className="w-full md:w-48 flex flex-col justify-center mb-4 md:mb-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{quest.progress}/{quest.target}</span>
                        <span className="text-sm">{((quest.progress / quest.target) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            quest.category === 'premium' ? 'bg-yellow-500' : 
                            quest.category === 'event' ? 'bg-purple-500' : 
                            'bg-blue-500'
                          }`}
                          style={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Right: Reward */}
                    <div className="flex items-center">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-900 mb-1">
                          <img 
                            src={getRewardImage(quest.reward)} 
                            alt="Reward"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="text-xs text-center">
                          {quest.reward.type === 'xp' && (
                            <span className="text-blue-400">{quest.reward.amount} XP</span>
                          )}
                          {quest.reward.type === 'currency' && (
                            <span className="text-yellow-400">{quest.reward.amount} 🪙</span>
                          )}
                          {quest.reward.type !== 'xp' && quest.reward.type !== 'currency' && (
                            <span className="text-purple-400">{quest.reward.name}</span>
                          )}
                        </div>
                      </div>
                      
                      {/* Claim button */}
                      {quest.progress >= quest.target && !quest.completed ? (
                        <button 
                          className={`px-4 py-2 rounded-lg font-bold ${
                            claimingReward === quest.id ? 'bg-gray-600' : 
                            quest.category === 'premium' ? 'bg-yellow-600 hover:bg-yellow-500' : 
                            quest.category === 'event' ? 'bg-purple-600 hover:bg-purple-500' : 
                            'bg-green-600 hover:bg-green-500'
                          }`}
                          onClick={() => claimReward(quest.id, quest.category)}
                          disabled={claimingReward === quest.id}
                        >
                          {claimingReward === quest.id ? 'CLAIMING...' : 'CLAIM'}
                        </button>
                      ) : quest.completed ? (
                        <div className="px-4 py-2 rounded-lg bg-gray-700 text-gray-400 font-bold">
                          CLAIMED
                        </div>
                      ) : (
                        <div className="px-4 py-2 rounded-lg bg-gray-700 text-gray-400 font-bold">
                          IN PROGRESS
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Quest Benefits Section */}
        <div className="bg-gray-900 bg-opacity-80 rounded-xl p-6 shadow-neon-subtle">
          <h3 className="text-xl font-bold mb-4">QUEST BENEFITS</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mr-3">
                  <span className="text-xl">📈</span>
                </div>
                <h4 className="font-bold">FAST PROGRESSION</h4>
              </div>
              <p className="text-sm text-gray-300">Complete quests to earn XP and level up your Battle Pass faster.</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-yellow-900 flex items-center justify-center mr-3">
                  <span className="text-xl">🪙</span>
                </div>
                <h4 className="font-bold">BONUS CURRENCY</h4>
              </div>
              <p className="text-sm text-gray-300">Earn coins to purchase new cards, characters, and cosmetics.</p>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center mr-3">
                  <span className="text-xl">🎁</span>
                </div>
                <h4 className="font-bold">EXCLUSIVE ITEMS</h4>
              </div>
              <p className="text-sm text-gray-300">Unlock special card packs, characters, and backgrounds only available through quests.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Premium prompt popup */}
      <AnimatePresence>
        {showPremiumPrompt && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-xl overflow-hidden max-w-md w-full shadow-neon-strong"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="bg-yellow-900 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold text-yellow-300">PREMIUM QUESTS</h2>
                <button onClick={() => setShowPremiumPrompt(false)}>
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              <div className="p-6 text-center">
                <div className="text-yellow-400 text-5xl mb-4">👑</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">PREMIUM QUESTS LOCKED</h3>
                <p className="text-gray-300 mb-6">Premium quests offer exclusive rewards and are only available with the Premium Battle Pass.</p>
                
                <div className="flex flex-col space-y-2">
                  <button 
                    className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold shadow-neon hover-glow"
                    onClick={() => {
                      navigate('/battlepass');
                      setShowPremiumPrompt(false);
                    }}
                  >
                    GET PREMIUM PASS
                  </button>
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                    onClick={() => setShowPremiumPrompt(false)}
                  >
                    MAYBE LATER
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Tab Button Component
function TabButton({ label, active, onClick, notification = false, count = 0, special = null }) {
  return (
    <button 
      className={`py-3 px-6 font-bold relative ${
        active ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'
      } ${
        special === 'premium' ? 'text-yellow-400 hover:text-yellow-300' : 
        special === 'event' ? 'text-purple-400 hover:text-purple-300' : ''
      }`}
      onClick={onClick}
    >
      {label}
      {notification && (
        <span className={`absolute -top-1 -right-1 w-5 h-5 ${
          special === 'event' ? 'bg-purple-500' : 'bg-yellow-500'
        } rounded-full flex items-center justify-center text-xs font-bold`}>
          {count > 0 ? count : '!'}
        </span>
      )}
    </button>
  );
}

export default Quests;