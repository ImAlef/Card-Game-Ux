import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageService from '../services/ImageService';

// Sample profile data
const profileData = {
  username: 'ArcanePlayer',
  level: 15,
  xp: 750,
  nextLevelXp: 1000,
  title: 'Card Master',
  joinDate: 'March 15, 2025',
  totalGames: 127,
  wins: 73,
  losses: 54,
  character: 'viper',
  characterLevel: 8,
  characterMaxLevel: 50,
  cardStyle: 'neon',
  background: 'arcane',
  pet: 'dragon',
  currencies: {
    coins: 1650,
    gems: 50
  },
  gameStats: {
    hokm: {
      played: 48,
      won: 32,
      winRate: 67,
      highestScore: 1250
    },
    poker: {
      played: 35,
      won: 18,
      winRate: 51,
      highestChips: 2500
    },
    blackjack: {
      played: 44,
      won: 23,
      winRate: 52,
      highestStreak: 5
    }
  },
  achievements: [
    { id: 1, name: 'First Victory', description: 'Win your first game', completed: true, date: 'March 16, 2025', icon: '🏆' },
    { id: 2, name: 'Card Collector', description: 'Unlock 5 card designs', completed: true, date: 'March 20, 2025', icon: '🃏' },
    { id: 3, name: 'Hokm Master', description: 'Win 30 games of Hokm', completed: true, date: 'April 10, 2025', icon: '🎮' },
    { id: 4, name: 'Winning Streak', description: 'Win 5 games in a row', completed: false, progress: 3, max: 5, icon: '🔥' },
    { id: 5, name: 'High Roller', description: 'Accumulate 5000 chips in Poker', completed: false, progress: 2500, max: 5000, icon: '💰' },
    { id: 6, name: 'Social Butterfly', description: 'Add 10 friends', completed: false, progress: 6, max: 10, icon: '👥' }
  ],
  recentMatches: [
    { id: 101, game: 'hokm', result: 'win', score: 7, date: 'April 23, 2025', opponents: ['Player1', 'Player2', 'Player3'] },
    { id: 102, game: 'poker', result: 'loss', score: '-250', date: 'April 22, 2025', opponents: ['Player4', 'Player5', 'Player6', 'Player7'] },
    { id: 103, game: 'blackjack', result: 'win', score: '+350', date: 'April 22, 2025', opponents: ['Dealer'] },
    { id: 104, game: 'hokm', result: 'win', score: 7, date: 'April 21, 2025', opponents: ['Player8', 'Player9', 'Player10'] },
    { id: 105, game: 'poker', result: 'win', score: '+580', date: 'April 21, 2025', opponents: ['Player11', 'Player12', 'Player13'] }
  ],
  inventory: [
    { id: 201, type: 'character', name: 'Viper', itemId: 'viper', level: 8, rarity: 'rare', equipped: true },
    { id: 202, type: 'character', name: 'Jinx', itemId: 'jinx', level: 5, rarity: 'rare', equipped: false },
    { id: 203, type: 'character', name: 'Ekko', itemId: 'ekko', level: 3, rarity: 'epic', equipped: false },
    { id: 204, type: 'card', name: 'Neon Edge', itemId: 'neon', rarity: 'common', equipped: true },
    { id: 205, type: 'card', name: 'Golden Luxury', itemId: 'golden', rarity: 'rare', equipped: false },
    { id: 206, type: 'card', name: 'Arcane Magic', itemId: 'arcane', rarity: 'epic', equipped: false },
    { id: 207, type: 'background', name: 'Piltover City', itemId: 'piltover', rarity: 'common', equipped: false },
    { id: 208, type: 'background', name: 'Arcane Energy', itemId: 'arcane', rarity: 'epic', equipped: true },
    { id: 209, type: 'pet', name: 'Mini Dragon', itemId: 'dragon', rarity: 'epic', equipped: true },
    { id: 210, type: 'pet', name: 'Poro', itemId: 'poro', rarity: 'rare', equipped: false }
  ]
};

function Profile() {
  const [profile, setProfile] = useState(profileData);
  const [activeTab, setActiveTab] = useState('stats');
  const [selectedGameMode, setSelectedGameMode] = useState('hokm');
  const [inventoryFilter, setInventoryFilter] = useState('all');
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingData(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filtered inventory based on selected filter
  const filteredInventory = inventoryFilter === 'all' 
    ? profile.inventory 
    : profile.inventory.filter(item => item.type === inventoryFilter);
  
  // Calculate XP progress percentage
  const xpProgressPercentage = (profile.xp / profile.nextLevelXp) * 100;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-purple-900 flex flex-col"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
      style={{
        backgroundImage: `linear-gradient(rgba(76, 29, 149, 0.8), rgba(67, 56, 202, 0.8)), url(${ImageService.getImage('background', profile.background)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <Link to="/">
            <motion.button 
              className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon hover-glow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-xl">←</span>
            </motion.button>
          </Link>
          <h1 className="text-4xl text-yellow-400 font-bold">PROFILE</h1>
        </div>
        
        <div className="flex gap-3">
          <motion.div 
            className="bg-black bg-opacity-70 px-4 py-2 rounded-full text-yellow-400 font-bold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl">🪙</span>
            <span>{profile.currencies.coins}</span>
          </motion.div>
          
          <motion.div 
            className="bg-black bg-opacity-70 px-4 py-2 rounded-full text-cyan-400 font-bold flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-xl">💎</span>
            <span>{profile.currencies.gems}</span>
          </motion.div>
        </div>
      </header>
      
      {/* Loading indicator */}
      {isLoadingData ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4">Loading profile data...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row p-6 gap-6 z-10">
          {/* Left column - Profile info */}
          <div className="md:w-1/3">
            <motion.div 
              className="bg-black bg-opacity-50 rounded-lg shadow-neon overflow-hidden"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Profile header with character background */}
              <div 
                className="h-40 relative"
                style={{
                  backgroundImage: `url(${ImageService.getImage('background', profile.background)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-indigo-800 opacity-70"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-3xl text-white font-bold">{profile.username}</h2>
                </div>
                <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 px-3 py-1 text-sm text-gray-300">
                  Member since {profile.joinDate}
                </div>
              </div>
              
              {/* Character and basic info */}
              <div className="px-6 pt-20 pb-6 relative">
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative w-32 h-32 rounded-full border-4 border-black overflow-hidden">
                    <img 
                      src={ImageService.getImage('character', profile.character)} 
                      alt={profile.character} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <h3 className="text-xl text-white font-bold">{profile.character.charAt(0).toUpperCase() + profile.character.slice(1)}</h3>
                  <p className="text-gray-400">{profile.title}</p>
                </div>
                
                {/* Level and XP */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Level {profile.level}</span>
                    <span className="text-gray-400">{profile.xp}/{profile.nextLevelXp} XP</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300" 
                      style={{ width: `${xpProgressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Character level */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">{profile.character.charAt(0).toUpperCase() + profile.character.slice(1)} Level</span>
                    <span className="text-gray-400">{profile.characterLevel}/{profile.characterMaxLevel}</span>
                  </div>
                  <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-300" 
                      style={{ width: `${(profile.characterLevel / profile.characterMaxLevel) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Basic stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-white font-bold text-xl">{profile.totalGames}</div>
                    <div className="text-gray-400 text-sm">Games</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-green-400 font-bold text-xl">{profile.wins}</div>
                    <div className="text-gray-400 text-sm">Wins</div>
                  </div>
                  <div className="bg-gray-800 p-3 rounded-lg text-center">
                    <div className="text-white font-bold text-xl">{Math.round(profile.wins / profile.totalGames * 100)}%</div>
                    <div className="text-gray-400 text-sm">Win Rate</div>
                  </div>
                </div>
                
                {/* Equipped items */}
                <div>
                  <h4 className="text-white font-bold mb-2">Equipped Items</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-2">👤</span>
                        <span className="text-white text-sm">{profile.character.charAt(0).toUpperCase() + profile.character.slice(1)}</span>
                      </div>
                      <span className="text-xs bg-purple-900 px-2 py-0.5 rounded-full text-purple-200">Lvl {profile.characterLevel}</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-2">🃏</span>
                        <span className="text-white text-sm">
                          {profile.inventory.find(item => item.type === 'card' && item.equipped)?.name}
                        </span>
                      </div>
                      <span className="text-xs bg-purple-900 px-2 py-0.5 rounded-full text-purple-200">Card</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-2">🖼️</span>
                        <span className="text-white text-sm">
                          {profile.inventory.find(item => item.type === 'background' && item.equipped)?.name}
                        </span>
                      </div>
                      <span className="text-xs bg-purple-900 px-2 py-0.5 rounded-full text-purple-200">BG</span>
                    </div>
                    <div className="flex justify-between items-center bg-gray-800 p-2 rounded">
                      <div className="flex items-center">
                        <span className="text-purple-400 mr-2">🐲</span>
                        <span className="text-white text-sm">
                          {profile.inventory.find(item => item.type === 'pet' && item.equipped)?.name}
                        </span>
                      </div>
                      <span className="text-xs bg-purple-900 px-2 py-0.5 rounded-full text-purple-200">Pet</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Link to="/customize">
                    <motion.button 
                      className="px-8 py-3 bg-purple-700 text-white rounded-lg shadow-neon hover-glow"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Customize Character
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Tabs */}
          <div className="md:w-2/3">
            <div className="bg-black bg-opacity-50 rounded-lg shadow-neon overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-800">
                {['stats', 'achievements', 'matches', 'inventory'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-6 py-4 font-bold ${
                      activeTab === tab
                        ? 'text-yellow-400 border-b-2 border-yellow-400'
                        : 'text-gray-400 hover:text-white'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Tab content */}
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {/* Stats tab */}
                  {activeTab === 'stats' && (
                    <motion.div
                      key="stats-tab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="mb-6">
                        <h3 className="text-xl text-white font-bold mb-4">Game Statistics</h3>
                        
                        {/* Game mode selector */}
                        <div className="flex border-b border-gray-700 mb-4">
                          {Object.keys(profile.gameStats).map((mode) => (
                            <button
                              key={mode}
                              className={`px-4 py-2 ${
                                selectedGameMode === mode
                                  ? 'text-yellow-400 border-b-2 border-yellow-400'
                                  : 'text-gray-400 hover:text-white'
                              }`}
                              onClick={() => setSelectedGameMode(mode)}
                            >
                              {mode.charAt(0).toUpperCase() + mode.slice(1)}
                            </button>
                          ))}
                        </div>
                        
                        {/* Stats for selected game mode */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-gray-400 text-sm mb-1">Games Played</p>
                            <p className="text-white font-bold text-2xl">{profile.gameStats[selectedGameMode].played}</p>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-gray-400 text-sm mb-1">Games Won</p>
                            <p className="text-green-400 font-bold text-2xl">{profile.gameStats[selectedGameMode].won}</p>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-gray-400 text-sm mb-1">Win Rate</p>
                            <p className="text-white font-bold text-2xl">{profile.gameStats[selectedGameMode].winRate}%</p>
                          </div>
                          <div className="bg-gray-800 p-4 rounded-lg text-center">
                            <p className="text-gray-400 text-sm mb-1">
                              {selectedGameMode === 'hokm' && 'Highest Score'}
                              {selectedGameMode === 'poker' && 'Highest Chips'}
                              {selectedGameMode === 'blackjack' && 'Highest Streak'}
                            </p>
                            <p className="text-yellow-400 font-bold text-2xl">
                              {selectedGameMode === 'hokm' && profile.gameStats[selectedGameMode].highestScore}
                              {selectedGameMode === 'poker' && profile.gameStats[selectedGameMode].highestChips}
                              {selectedGameMode === 'blackjack' && profile.gameStats[selectedGameMode].highestStreak}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-xl text-white font-bold mb-4">Game Performance</h3>
                        
                        {/* Performance visualization (simplified) */}
                        <div className="bg-gray-800 p-4 rounded-lg h-64 flex items-end justify-around">
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                            <div key={day} className="flex flex-col items-center">
                              <div 
                                className="w-8 bg-gradient-to-t from-purple-600 to-purple-400"
                                style={{ 
                                  height: `${Math.max(20, Math.random() * 180)}px`,
                                  opacity: i === 6 ? 1 : 0.7 // Highlight latest day
                                }}
                              ></div>
                              <p className="text-gray-400 text-xs mt-2">{day}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Achievements tab */}
                  {activeTab === 'achievements' && (
                    <motion.div
                      key="achievements-tab"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-xl text-white font-bold mb-4">Achievements</h3>
                      
                      <div className="space-y-4">
                        {profile.achievements.map((achievement) => (
                          <motion.div
                            key={achievement.id}
                            variants={itemVariants}
                            className={`p-4 rounded-lg ${
                              achievement.completed 
                                ? 'bg-gradient-to-r from-green-900 to-green-800' 
                                : 'bg-gray-800'
                            }`}
                          >
                            <div className="flex items-start">
                              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                <span className="text-2xl">{achievement.icon}</span>
                              </div>
                              
                              <div className="flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-white font-bold">{achievement.name}</h4>
                                    <p className="text-gray-400 text-sm">{achievement.description}</p>
                                  </div>
                                  
                                  {achievement.completed && (
                                    <div className="bg-green-700 px-2 py-1 rounded text-xs text-white">
                                      Completed
                                    </div>
                                  )}
                                </div>
                                
                                {!achievement.completed && achievement.progress !== undefined && (
                                  <div className="mt-2">
                                    <div className="flex justify-between text-xs mb-1">
                                      <span className="text-gray-400">Progress</span>
                                      <span className="text-gray-400">{achievement.progress}/{achievement.max}</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-purple-500" 
                                        style={{ width: `${(achievement.progress / achievement.max) * 100}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                                
                                {achievement.completed && achievement.date && (
                                  <p className="text-gray-400 text-xs mt-2">Completed on {achievement.date}</p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Matches tab */}
                  {activeTab === 'matches' && (
                    <motion.div
                      key="matches-tab"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <h3 className="text-xl text-white font-bold mb-4">Recent Matches</h3>
                      
                      <div className="space-y-3">
                        {profile.recentMatches.map((match) => (
                          <motion.div
                            key={match.id}
                            variants={itemVariants}
                            className={`p-4 rounded-lg flex items-center ${
                              match.result === 'win' 
                                ? 'bg-gradient-to-r from-green-900 to-green-800 bg-opacity-50' 
                                : 'bg-gradient-to-r from-red-900 to-red-800 bg-opacity-50'
                            }`}
                          >
                            <div className="mr-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                match.result === 'win' ? 'bg-green-700' : 'bg-red-700'
                              }`}>
                                {match.result === 'win' ? '✓' : '✗'}
                              </div>
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                  <img 
                                    src={ImageService.getImage('gameMode', match.game)} 
                                    alt={match.game} 
                                    className="w-8 h-8 mr-2 rounded"
                                  />
                                  <div>
                                    <h4 className="text-white font-bold">{match.game.charAt(0).toUpperCase() + match.game.slice(1)}</h4>
                                    <p className="text-gray-400 text-sm">
                                      vs {match.opponents.join(', ')}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="text-right">
                                  <p className={`font-bold ${
                                    match.result === 'win' ? 'text-green-400' : 'text-red-400'
                                  }`}>
                                    {match.result === 'win' ? 'Victory' : 'Defeat'}
                                  </p>
                                  <p className="text-gray-400 text-sm">{match.date}</p>
                                </div>
                              </div>
                              
                              <div className="mt-2 text-sm">
                                <span className="text-gray-400">Score: </span>
                                <span className="text-white">{match.score}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Inventory tab */}
                  {activeTab === 'inventory' && (
                    <motion.div
                      key="inventory-tab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl text-white font-bold">Inventory</h3>
                        
                        <div className="flex space-x-2">
                          {['all', 'character', 'card', 'background', 'pet'].map((filter) => (
                            <button
                              key={filter}
                              className={`px-3 py-1 rounded ${
                                inventoryFilter === filter
                                  ? 'bg-purple-700 text-white'
                                  : 'bg-gray-800 text-gray-400'
                              }`}
                              onClick={() => setInventoryFilter(filter)}
                            >
                              {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1) + 's'}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {filteredInventory.map((item) => (
  <motion.div
    key={item.id}
    className={`bg-gray-800 rounded-lg overflow-hidden ${
      item.equipped ? 'ring-2 ring-yellow-500' : ''
    }`}
    whileHover={{ scale: 1.03 }}
  >
    <div className="h-32 bg-gray-700 flex items-center justify-center relative">
      {/* Placeholder image based on item type */}
      <img 
        src={ImageService.getImage(item.type, item.itemId)}
        alt={item.name} 
        className={`${item.type === 'character' ? 'h-28' : item.type === 'background' ? 'w-full h-full object-cover' : 'h-24 w-auto'}`}
      />
      
      {/* Rarity badge */}
      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs ${
        item.rarity === 'common' 
          ? 'bg-gray-600 text-white' 
          : item.rarity === 'rare'
            ? 'bg-blue-600 text-white'
            : 'bg-purple-600 text-white'
      }`}>
        {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
      </div>
      
      {/* Equipped indicator */}
      {item.equipped && (
        <div className="absolute bottom-2 left-2 bg-yellow-600 px-2 py-0.5 rounded-full text-xs text-black font-bold">
          Equipped
        </div>
      )}
    </div>
    
    <div className="p-3">
      <h4 className="text-white font-bold">{item.name}</h4>
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">
          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
          {item.level ? ` Lvl ${item.level}` : ''}
        </span>
        
        <button className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-2 py-1 rounded">
          {item.equipped ? 'Unequip' : 'Equip'}
        </button>
      </div>
    </div>
  </motion.div>
))}
</div>
                      
                      <div className="mt-6 flex justify-center">
                        <Link to="/shop">
                          <motion.button 
                            className="px-8 py-3 bg-purple-700 text-white rounded-lg shadow-neon hover-glow flex items-center gap-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <span>🛒</span>
                            Visit Shop
                          </motion.button>
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default Profile;