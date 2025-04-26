import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EnhancedImageService from '../services/EnhancedImageService';

// Battle Pass data
const battlePassData = {
  name: "Season 2: Mystic Realms",
  level: 27,
  maxLevel: 100,
  xp: 3500,
  xpNeeded: 5000,
  premiumPurchased: true,
  endDate: "May 30, 2025",
  remainingDays: 34,
};

// Rewards data
const rewardsData = [
  { 
    id: 1, 
    level: 25, 
    premium: false, 
    claimed: true, 
    type: 'currency', 
    amount: 500, 
    name: 'Coins',
    image: 'shopItem/coins'
  },
  { 
    id: 2, 
    level: 26, 
    premium: true, 
    claimed: true, 
    type: 'character', 
    name: 'Luna Character',
    image: 'character/jinx'
  },
  { 
    id: 3, 
    level: 27, 
    premium: false, 
    claimed: false, 
    type: 'card', 
    name: 'Card Pack',
    image: 'shopItem/neon_pack'
  },
  { 
    id: 4, 
    level: 28, 
    premium: true, 
    claimed: false, 
    type: 'card', 
    name: 'Premium Card',
    image: 'shopItem/gold_pack'
  },
  { 
    id: 5, 
    level: 29, 
    premium: false, 
    claimed: false, 
    type: 'currency', 
    amount: 200, 
    name: 'Coins',
    image: 'shopItem/coins'
  },
  { 
    id: 6, 
    level: 30, 
    premium: true, 
    claimed: false, 
    type: 'pet', 
    name: 'Mystic Dragon Pet',
    image: 'pet/dragon'
  },
  {
    id: 7,
    level: 31,
    premium: false,
    claimed: false,
    type: 'card',
    name: 'Card Pack',
    image: 'shopItem/arcane_pack'
  },
  {
    id: 8,
    level: 32,
    premium: true,
    claimed: false,
    type: 'background',
    name: 'Void Background',
    image: 'background/void'
  }
];

// Premium pass options
const premiumOptions = [
  {
    id: 'standard',
    name: 'Battle Pass',
    price: 950,
    description: 'Unlock premium rewards for this season.',
    image: 'shopItem/premium_pass'
  },
  {
    id: 'bundle',
    name: 'Battle Bundle',
    price: 2800,
    description: 'Includes Battle Pass + 25 level skips.',
    image: 'shopItem/neon_pack',
    bestValue: true,
    levelSkip: 25
  }
];

function BattlePass() {
  const navigate = useNavigate();
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);
  const [selectedRange, setSelectedRange] = useState(1);
  const [visibleRewards, setVisibleRewards] = useState([]);

  // Calculate rewards to display based on selected range
  useEffect(() => {
    // Calculate the starting level for the visible rewards
    const startLevel = Math.max(1, battlePassData.level - 2 + (selectedRange - 1) * 5);
    
    // Find rewards that should be visible in this range
    const visible = rewardsData.filter(
      reward => reward.level >= startLevel && reward.level < startLevel + 5
    );
    
    setVisibleRewards(visible);
  }, [selectedRange, battlePassData.level]);

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
          <h1 className="text-2xl font-bold">BATTLE PASS</h1>
        </div>
        <div className="flex items-center">
          <div className="bg-black bg-opacity-60 rounded-full px-3 py-1 flex items-center mr-4">
            <span className="text-yellow-400 mr-1">🪙</span>
            <span className="font-bold">1730</span>
          </div>
          <button 
            className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg shadow-neon"
            onClick={() => navigate('/shop')}
          >
            SHOP
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4">
        {/* Battle Pass Header */}
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
                <h2 className="text-3xl font-bold text-glow">{battlePassData.name}</h2>
                <p className="text-gray-300">Ends in {battlePassData.remainingDays} days</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{battlePassData.level}</div>
                <div className="text-sm text-gray-300">Current Level</div>
              </div>
            </div>
            
            {/* XP Progress bar */}
            <div className="mb-4">
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
            
            {/* Premium status */}
            {battlePassData.premiumPurchased ? (
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-4 py-2 rounded-lg inline-block shadow-neon-strong">
                <span className="font-bold">✓ PREMIUM PASS ACTIVATED</span>
              </div>
            ) : (
              <button 
                className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-4 py-2 rounded-lg font-bold shadow-neon hover-glow"
                onClick={() => setShowPremiumPopup(true)}
              >
                PURCHASE PREMIUM PASS
              </button>
            )}
          </div>
        </div>
        
        {/* Rewards section */}
        <div className="bg-gray-900 bg-opacity-80 rounded-xl p-4 mb-6 shadow-neon-subtle">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">REWARDS</h3>
            
            <div className="flex bg-gray-800 rounded-lg">
              {[1, 2, 3, 4].map(num => (
                <button 
                  key={num} 
                  className={`px-4 py-2 ${selectedRange === num ? 'bg-purple-700 rounded-lg' : ''}`}
                  onClick={() => setSelectedRange(num)}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          {/* Rewards track */}
          <div className="mb-4">
            <div className="h-2 bg-gray-800 w-full mb-2 relative">
              <div 
                className="h-full bg-purple-600" 
                style={{ width: `${(battlePassData.level / battlePassData.maxLevel) * 100}%` }}
              ></div>
              
              {/* Level markers */}
              {Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full bg-gray-600"
                  style={{ left: `${(i * 20)}%` }}
                ></div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm">1</span>
              <span className="text-sm">20</span>
              <span className="text-sm">40</span>
              <span className="text-sm">60</span>
              <span className="text-sm">80</span>
              <span className="text-sm">100</span>
            </div>
          </div>
          
          {/* Reward cards */}
          <div className="grid grid-cols-5 gap-4">
            {visibleRewards.map(reward => (
              <div 
                key={reward.id} 
                className={`relative ${reward.premium ? 'bg-gradient-to-b from-yellow-800 to-yellow-900' : 'bg-gray-800'} rounded-lg p-2 shadow-neon-subtle`}
              >
                <div className="absolute top-0 left-0 bg-gray-900 px-2 py-1 rounded-br-lg">
                  <span className="text-sm font-bold">Lvl {reward.level}</span>
                </div>
                
                {reward.premium && (
                  <div className="absolute top-0 right-0 bg-yellow-600 px-2 py-1 rounded-bl-lg">
                    <span className="text-sm font-bold">PRO</span>
                  </div>
                )}
                
                <div className="mt-6 mb-2 flex justify-center items-center">
                  <img 
                    src={EnhancedImageService.getImage(reward.type, reward.image.split('/')[1])}
                    alt={reward.name}
                    className="h-20 object-contain"
                  />
                </div>
                
                <div className="text-center">
                  <div className="font-bold text-sm truncate">{reward.name}</div>
                  {reward.amount && (
                    <div className="text-yellow-400 text-sm">{reward.amount} {reward.name}</div>
                  )}
                </div>
                
                {reward.level <= battlePassData.level ? (
                  reward.claimed ? (
                    <div className="mt-2 bg-green-700 text-white text-center py-1 rounded">
                      CLAIMED
                    </div>
                  ) : (
                    <button className="mt-2 w-full bg-purple-700 hover:bg-purple-600 text-white text-center py-1 rounded">
                      CLAIM
                    </button>
                  )
                ) : (
                  <div className="mt-2 bg-gray-700 text-gray-400 text-center py-1 rounded">
                    LOCKED
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Premium rewards highlight */}
        {!battlePassData.premiumPurchased && (
          <div className="bg-gray-900 bg-opacity-80 rounded-xl p-4 shadow-neon-subtle">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-yellow-400">PREMIUM REWARDS</h3>
              <p className="text-gray-300">Unlock premium rewards with the Battle Pass</p>
            </div>
            
            <div className="grid grid-cols-4 gap-4 mb-4">
              {rewardsData.filter(r => r.premium).slice(0, 4).map(reward => (
                <div key={reward.id} className="bg-gray-800 bg-opacity-60 rounded-lg p-2 relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="bg-yellow-600 px-3 py-1 rounded-full">
                      <span className="text-sm font-bold">PREMIUM</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center items-center mb-2">
                    <img 
                      src={EnhancedImageService.getImage(reward.type, reward.image.split('/')[1])}
                      alt={reward.name}
                      className="h-20 object-contain opacity-50"
                    />
                  </div>
                  
                  <div className="text-center opacity-50">
                    <div className="font-bold text-sm truncate">{reward.name}</div>
                    <div className="text-xs text-gray-400">Level {reward.level}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button 
                className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg font-bold shadow-neon-strong hover-glow"
                onClick={() => setShowPremiumPopup(true)}
              >
                GET PREMIUM PASS
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Premium purchase popup */}
      <AnimatePresence>
        {showPremiumPopup && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-xl overflow-hidden max-w-lg w-full shadow-neon-strong"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="bg-purple-900 p-4 flex justify-between items-center">
                <h2 className="text-xl font-bold">PREMIUM BATTLE PASS</h2>
                <button onClick={() => setShowPremiumPopup(false)}>
                  <span className="text-2xl">×</span>
                </button>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-glow mb-2">{battlePassData.name}</h3>
                  <p className="text-gray-300">Upgrade to Premium and unlock exclusive rewards!</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {premiumOptions.map(option => (
                    <div 
                      key={option.id} 
                      className={`bg-gray-800 rounded-lg p-4 relative border-2 ${option.bestValue ? 'border-yellow-500 premium-glow' : 'border-gray-700'}`}
                    >
                      {option.bestValue && (
                        <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-yellow-500 text-black font-bold text-xs px-2 py-1 rounded-full rotate-12">
                          BEST VALUE
                        </div>
                      )}
                      
                      <div className="flex justify-center mb-4">
                        <img 
                          src={EnhancedImageService.getImage('shopItem', option.image.split('/')[1])}
                          alt={option.name}
                          className="h-24 object-contain"
                        />
                      </div>
                      
                      <div className="text-center mb-4">
                        <div className="font-bold text-lg">{option.name}</div>
                        <div className="text-gray-300 text-sm">{option.description}</div>
                        {option.levelSkip && (
                          <div className="text-yellow-400 text-sm">+{option.levelSkip} Level Skip</div>
                        )}
                      </div>
                      
                      <button className={`w-full py-2 rounded-lg font-bold ${option.bestValue ? 'bg-yellow-500 text-black' : 'bg-purple-700 text-white'}`}>
                        <span className="mr-1">🪙</span> {option.price}
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg mb-6">
                  <h4 className="font-bold mb-2">PREMIUM REWARDS INCLUDE:</h4>
                  <ul className="grid grid-cols-2 gap-2">
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Exclusive Characters</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Premium Card Packs</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Unique Pets</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Exclusive Backgrounds</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>+20% XP Boost</span>
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-400 mr-2">✓</span>
                      <span>Weekly Premium Quests</span>
                    </li>
                  </ul>
                </div>
                
                <div className="flex justify-between">
                  <button 
                    className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                    onClick={() => setShowPremiumPopup(false)}
                  >
                    MAYBE LATER
                  </button>
                  <button className="bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold shadow-neon hover-glow">
                    PURCHASE PREMIUM
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

export default BattlePass;