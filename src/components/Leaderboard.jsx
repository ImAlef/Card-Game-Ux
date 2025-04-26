import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Sample leaderboard data
const leaderboardData = {
  weekly: [
    { rank: 1, name: 'CardMaster95', score: 8750, character: 'Viper', level: 28, avatar: 'https://via.placeholder.com/60x60?text=CM', change: 'up' },
    { rank: 2, name: 'ArcaneQueen', score: 7980, character: 'Jinx', level: 42, avatar: 'https://via.placeholder.com/60x60?text=AQ', change: 'same' },
    { rank: 3, name: 'You', score: 6540, character: 'Ekko', level: 15, avatar: 'https://via.placeholder.com/60x60?text=You', change: 'up', isPlayer: true },
    { rank: 4, name: 'PokerKing', score: 6245, character: 'Ekko', level: 17, avatar: 'https://via.placeholder.com/60x60?text=PK', change: 'down' },
    { rank: 5, name: 'BlackjackPro', score: 5780, character: 'Caitlyn', level: 31, avatar: 'https://via.placeholder.com/60x60?text=BP', change: 'up' },
    { rank: 6, name: 'HokmMaster', score: 5420, character: 'Jayce', level: 25, avatar: 'https://via.placeholder.com/60x60?text=HM', change: 'down' },
    { rank: 7, name: 'CardShark22', score: 4950, character: 'Jayce', level: 19, avatar: 'https://via.placeholder.com/60x60?text=CS', change: 'down' },
    { rank: 8, name: 'GoldenCard', score: 4780, character: 'Jinx', level: 22, avatar: 'https://via.placeholder.com/60x60?text=GC', change: 'same' },
    { rank: 9, name: 'RoyalFlush', score: 4650, character: 'Viper', level: 20, avatar: 'https://via.placeholder.com/60x60?text=RF', change: 'up' },
    { rank: 10, name: 'CardCollector', score: 4320, character: 'Caitlyn', level: 18, avatar: 'https://via.placeholder.com/60x60?text=CC', change: 'down' },
  ],
  monthly: [
    { rank: 1, name: 'ArcaneQueen', score: 32450, character: 'Jinx', level: 42, avatar: 'https://via.placeholder.com/60x60?text=AQ', change: 'up' },
    { rank: 2, name: 'CardMaster95', score: 29780, character: 'Viper', level: 28, avatar: 'https://via.placeholder.com/60x60?text=CM', change: 'down' },
    { rank: 3, name: 'BlackjackPro', score: 25600, character: 'Caitlyn', level: 31, avatar: 'https://via.placeholder.com/60x60?text=BP', change: 'up' },
    { rank: 4, name: 'PokerKing', score: 24120, character: 'Ekko', level: 17, avatar: 'https://via.placeholder.com/60x60?text=PK', change: 'same' },
    { rank: 5, name: 'HokmMaster', score: 22450, character: 'Jayce', level: 25, avatar: 'https://via.placeholder.com/60x60?text=HM', change: 'up' },
    { rank: 6, name: 'You', score: 21870, character: 'Ekko', level: 15, avatar: 'https://via.placeholder.com/60x60?text=You', change: 'up', isPlayer: true },
    { rank: 7, name: 'GoldenCard', score: 19450, character: 'Jinx', level: 22, avatar: 'https://via.placeholder.com/60x60?text=GC', change: 'down' },
    { rank: 8, name: 'CardShark22', score: 18740, character: 'Jayce', level: 19, avatar: 'https://via.placeholder.com/60x60?text=CS', change: 'down' },
    { rank: 9, name: 'RoyalFlush', score: 17900, character: 'Viper', level: 20, avatar: 'https://via.placeholder.com/60x60?text=RF', change: 'same' },
    { rank: 10, name: 'CardCollector', score: 16780, character: 'Caitlyn', level: 18, avatar: 'https://via.placeholder.com/60x60?text=CC', change: 'up' },
  ],
  allTime: [
    { rank: 1, name: 'ArcaneQueen', score: 124750, character: 'Jinx', level: 42, avatar: 'https://via.placeholder.com/60x60?text=AQ', change: 'same' },
    { rank: 2, name: 'CardMaster95', score: 115980, character: 'Viper', level: 28, avatar: 'https://via.placeholder.com/60x60?text=CM', change: 'same' },
    { rank: 3, name: 'BlackjackPro', score: 98540, character: 'Caitlyn', level: 31, avatar: 'https://via.placeholder.com/60x60?text=BP', change: 'up' },
    { rank: 4, name: 'HokmMaster', score: 85620, character: 'Jayce', level: 25, avatar: 'https://via.placeholder.com/60x60?text=HM', change: 'up' },
    { rank: 5, name: 'PokerKing', score: 82450, character: 'Ekko', level: 17, avatar: 'https://via.placeholder.com/60x60?text=PK', change: 'down' },
    { rank: 6, name: 'GoldenCard', score: 76900, character: 'Jinx', level: 22, avatar: 'https://via.placeholder.com/60x60?text=GC', change: 'same' },
    { rank: 7, name: 'RoyalFlush', score: 65420, character: 'Viper', level: 20, avatar: 'https://via.placeholder.com/60x60?text=RF', change: 'up' },
    { rank: 8, name: 'CardShark22', score: 59780, character: 'Jayce', level: 19, avatar: 'https://via.placeholder.com/60x60?text=CS', change: 'down' },
    { rank: 9, name: 'CardCollector', score: 54320, character: 'Caitlyn', level: 18, avatar: 'https://via.placeholder.com/60x60?text=CC', change: 'up' },
    { rank: 10, name: 'You', score: 48950, character: 'Ekko', level: 15, avatar: 'https://via.placeholder.com/60x60?text=You', change: 'down', isPlayer: true },
  ]
};

// Game modes 
const gameModes = [
  { id: 'all', name: 'All Modes' },
  { id: 'hokm', name: 'Hokm' },
  { id: 'poker', name: 'Poker' },
  { id: 'blackjack', name: 'Blackjack' },
];

function Leaderboard() {
  const [leaderboardType, setLeaderboardType] = useState('weekly');
  const [gameMode, setGameMode] = useState('all');
  const [showPlayerCard, setShowPlayerCard] = useState(false);
  const [highlightedPlayer, setHighlightedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Find the player's rank in the current leaderboard
  const playerRank = leaderboardData[leaderboardType].find(entry => entry.isPlayer)?.rank || null;
  
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
      className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 flex flex-col"
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
          <h1 className="text-4xl text-yellow-400 font-bold">LEADERBOARD</h1>
        </div>
        
        {playerRank && (
          <motion.button 
            className="flex items-center bg-purple-800 bg-opacity-80 px-4 py-2 rounded-lg shadow-neon"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowPlayerCard(true)}
          >
            <span className="text-white mr-2">Your Rank:</span>
            <span className="text-yellow-400 text-xl font-bold">#{playerRank}</span>
          </motion.button>
        )}
      </header>
      
      {/* Filter options */}
      <div className="p-4 flex flex-wrap gap-4 z-10">
        {/* Time period selector */}
        <div className="flex bg-gray-900 bg-opacity-70 rounded-lg overflow-hidden shadow-neon-subtle">
          {['weekly', 'monthly', 'allTime'].map((type) => (
            <button
              key={type}
              className={`px-4 py-2 font-bold ${
                leaderboardType === type
                  ? 'bg-purple-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setLeaderboardType(type)}
            >
              {type === 'weekly' ? 'This Week' : type === 'monthly' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
        
        {/* Game mode selector */}
        <div className="flex bg-gray-900 bg-opacity-70 rounded-lg overflow-hidden shadow-neon-subtle">
          {gameModes.map((mode) => (
            <button
              key={mode.id}
              className={`px-4 py-2 font-bold ${
                gameMode === mode.id
                  ? 'bg-purple-700 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              onClick={() => setGameMode(mode.id)}
            >
              {mode.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Leaderboard table */}
      <div className="flex-1 p-4 z-10">
        <div className="bg-black bg-opacity-50 rounded-lg shadow-neon overflow-hidden">
          {/* Table header */}
          <div className="bg-gray-900 px-6 py-3 flex">
            <div className="w-16 text-gray-400 font-bold">RANK</div>
            <div className="flex-1 text-gray-400 font-bold">PLAYER</div>
            <div className="w-32 text-right text-gray-400 font-bold">SCORE</div>
          </div>
          
          {/* Table content */}
          {isLoading ? (
            <div className="p-10 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-white mt-4">Loading leaderboard...</p>
              </div>
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {leaderboardData[leaderboardType].map((entry) => (
                <motion.div 
                  key={entry.rank}
                  variants={itemVariants}
                  className={`px-6 py-3 flex items-center border-b border-gray-800 ${
                    entry.isPlayer 
                      ? 'bg-purple-900 bg-opacity-40' 
                      : entry.rank <= 3 
                        ? 'bg-gray-800 bg-opacity-30' 
                        : ''
                  } hover:bg-gray-800 hover:bg-opacity-50 transition-colors duration-200`}
                  onClick={() => setHighlightedPlayer(entry)}
                >
                  <div className="w-16 flex items-center">
                    {entry.rank <= 3 ? (
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 
                          ? 'bg-yellow-500 text-black' 
                          : entry.rank === 2 
                            ? 'bg-gray-400 text-black' 
                            : 'bg-yellow-800 text-white'
                      }`}>
                        {entry.rank}
                      </div>
                    ) : (
                      <div className="text-gray-400 font-bold">{entry.rank}</div>
                    )}
                    
                    <div className="ml-2">
                      {entry.change === 'up' && <span className="text-green-500">▲</span>}
                      {entry.change === 'down' && <span className="text-red-500">▼</span>}
                      {entry.change === 'same' && <span className="text-gray-500">•</span>}
                    </div>
                  </div>
                  
                  <div className="flex-1 flex items-center">
                    <img 
                      src={entry.avatar} 
                      alt={entry.name} 
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-white font-bold">{entry.name}</div>
                      <div className="text-gray-400 text-sm">Lvl {entry.level} • {entry.character}</div>
                    </div>
                    
                    {entry.isPlayer && (
                      <div className="ml-2 text-xs bg-purple-700 px-2 py-1 rounded-full text-white">
                        YOU
                      </div>
                    )}
                  </div>
                  
                  <div className="w-32 text-right">
                    <div className="text-white font-bold">{entry.score.toLocaleString()}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Player details modal */}
      <AnimatePresence>
        {highlightedPlayer && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg shadow-neon max-w-md w-full overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="relative h-32 bg-gradient-to-r from-blue-800 to-purple-800">
                <button 
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
                  onClick={() => setHighlightedPlayer(null)}
                >
                  ✕
                </button>
                
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                  <div className="relative">
                    <img 
                      src={highlightedPlayer.avatar} 
                      alt={highlightedPlayer.name} 
                      className="w-32 h-32 rounded-full border-4 border-gray-900"
                    />
                    {highlightedPlayer.rank <= 3 && (
                      <div className={`absolute -top-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        highlightedPlayer.rank === 1 
                          ? 'bg-yellow-500 text-black' 
                          : highlightedPlayer.rank === 2 
                            ? 'bg-gray-400 text-black' 
                            : 'bg-yellow-800 text-white'
                      }`}>
                        {highlightedPlayer.rank}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-20 px-6 pb-6 text-center">
                <h2 className="text-2xl text-white font-bold">{highlightedPlayer.name}</h2>
                <p className="text-gray-400">Level {highlightedPlayer.level} • {highlightedPlayer.character}</p>
                
                <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                  <div className="text-3xl text-yellow-400 font-bold mb-1">{highlightedPlayer.score.toLocaleString()}</div>
                  <p className="text-gray-400 text-sm">Total Score</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-white text-lg font-bold">127</p>
                    <p className="text-gray-400 text-xs">Games</p>
                  </div>
                  
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-white text-lg font-bold">84</p>
                    <p className="text-gray-400 text-xs">Wins</p>
                  </div>
                  
                  <div className="bg-gray-800 p-3 rounded-lg">
                    <p className="text-white text-lg font-bold">66%</p>
                    <p className="text-gray-400 text-xs">Win Rate</p>
                  </div>
                </div>
                
                {!highlightedPlayer.isPlayer && (
                  <div className="mt-6 flex gap-4">
                    <motion.button 
                      className="flex-1 px-4 py-2 bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm">👤</span>
                      Add Friend
                    </motion.button>
                    
                    <motion.button 
                      className="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-sm">🎮</span>
                      Invite to Game
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Player rank card */}
      <AnimatePresence>
        {showPlayerCard && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPlayerCard(false)}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg shadow-neon max-w-lg w-full overflow-hidden"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-40 bg-gradient-to-r from-purple-800 to-indigo-800">
                <button 
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black bg-opacity-50 flex items-center justify-center text-white"
                  onClick={() => setShowPlayerCard(false)}
                >
                  ✕
                </button>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <h2 className="text-3xl text-white font-bold mb-2">YOUR RANKING</h2>
                  <div className="bg-black bg-opacity-40 px-6 py-2 rounded-lg">
                    <span className="text-yellow-400 text-4xl font-bold">#{playerRank}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between mb-6">
                  <div className="text-center">
                    <h3 className="text-gray-400 text-sm mb-1">WEEKLY</h3>
                    <p className="text-white text-lg font-bold">
                      #{leaderboardData.weekly.find(e => e.isPlayer)?.rank || '-'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-gray-400 text-sm mb-1">MONTHLY</h3>
                    <p className="text-white text-lg font-bold">
                      #{leaderboardData.monthly.find(e => e.isPlayer)?.rank || '-'}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-gray-400 text-sm mb-1">ALL TIME</h3>
                    <p className="text-white text-lg font-bold">
                      #{leaderboardData.allTime.find(e => e.isPlayer)?.rank || '-'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-black bg-opacity-30 p-4 rounded-lg">
                  <h3 className="text-white font-bold mb-2">RECENT ACHIEVEMENTS</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center text-gray-300">
                      <span className="text-yellow-400 mr-2">🏆</span>
                      Reached weekly top 5
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-yellow-400 mr-2">🃏</span>
                      Played 50 games of Hokm
                    </li>
                    <li className="flex items-center text-gray-300">
                      <span className="text-yellow-400 mr-2">🎯</span>
                      3-game winning streak
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <motion.button 
                    className="px-6 py-3 bg-purple-700 text-white rounded-lg shadow-neon hover-glow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPlayerCard(false)}
                  >
                    CLOSE
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Leaderboard;