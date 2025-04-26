import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import EnhancedImageService from '../services/EnhancedImageService';

// Game modes data
const gameModes = [
  { 
    id: 'hokm',
    name: 'HOKM', 
    description: 'Traditional Persian trick-taking card game',
    type: 'TEAM',
    ranked: false,
    players: '4 Players',
    estimatedTime: '~20 min',
    difficulty: 'Medium',
    icon: '🃏',
    color: '#a855f7',
    image: 'hokm_mode',
    onlinePlayers: 312
  },
  { 
    id: 'poker',
    name: 'POKER', 
    description: 'Test your poker face and betting skills',
    type: 'SOLO',
    ranked: false,
    players: '2-8 Players',
    estimatedTime: '~30 min',
    difficulty: 'Hard',
    icon: '♠️',
    color: '#10b981',
    image: 'poker_mode',
    onlinePlayers: 245
  },
  { 
    id: 'blackjack',
    name: 'BLACKJACK', 
    description: 'Hit or stand your way to 21',
    type: 'SOLO',
    ranked: false,
    players: '1-5 Players',
    estimatedTime: '~15 min',
    difficulty: 'Easy',
    icon: '🎮',
    color: '#f43f5e',
    image: 'blackjack_mode',
    onlinePlayers: 178
  },
  { 
    id: 'ranked_hokm',
    name: 'RANKED HOKM', 
    description: 'Competitive mode with rankings',
    type: 'TEAM',
    ranked: true,
    players: '4 Players',
    estimatedTime: '~25 min',
    difficulty: 'Hard',
    icon: '🏆',
    color: '#eab308',
    image: 'ranked_mode',
    onlinePlayers: 203
  },
  { 
    id: 'tournament',
    name: 'TOURNAMENT', 
    description: 'Compete for rewards in weekend tournaments',
    type: 'SPECIAL',
    ranked: false,
    players: 'Varied',
    estimatedTime: '~60 min',
    difficulty: 'Expert',
    icon: '🎖️',
    color: '#3b82f6',
    image: 'tournament_mode',
    onlinePlayers: 156
  },
  { 
    id: 'custom',
    name: 'CUSTOM ROOM', 
    description: 'Create your own room with custom rules',
    type: 'CUSTOM',
    ranked: false,
    players: '2-8 Players',
    estimatedTime: 'Varied',
    difficulty: 'Any',
    icon: '⚙️',
    color: '#94a3b8',
    image: 'custom_mode',
    onlinePlayers: 89
  },
];

// News items for carousel
const newsItems = [
  {
    id: 1,
    title: 'Season 2 Coming Soon!',
    description: 'Get ready for new characters, cards, and exclusive rewards in Season 2: Mystic Realms.',
    image: 'background/arcane',
    date: 'April 30, 2025'
  },
  {
    id: 2,
    title: 'Weekend Tournament',
    description: 'Join our weekly tournament for a chance to win 5,000 coins and the exclusive Golden Dragon pet!',
    image: 'background/piltover',
    date: 'April 27-28, 2025'
  },
  {
    id: 3,
    title: 'New Character: Luna',
    description: 'The Moonlight Enchantress joins the roster with unique card abilities and a special moon-phase passive.',
    image: 'background/void',
    date: 'Available Now'
  }
];

// Player stats
const playerData = {
  name: "CardMaster42",
  level: 15,
  character: "viper",
  vBucks: 1730,
  battlePassLevel: 27,
  wins: 73,
  gamesPlayed: 127,
};

// Mock friends data
const friendsData = [
  { id: 1, name: "ArcanePlayer", status: "online", character: "jinx", inParty: true, leader: true, level: 42, verified: true },
  { id: 2, name: "CardShark22", status: "online", character: "ekko", inParty: true, level: 18 },
  { id: 3, name: "GameMaster99", status: "away", character: "caitlyn", level: 31 },
  { id: 4, name: "ProGamer123", status: "offline", character: "jayce", level: 26 },
  { id: 5, name: "NeonKnight", status: "ingame", character: "vi", level: 37, verified: true },
  { id: 6, name: "CardQueen", status: "online", character: "jinx", level: 22 },
  { id: 7, name: "TrickMaster", status: "online", character: "viper", level: 15 },
  { id: 8, name: "HokmPro", status: "ingame", character: "ekko", level: 50, verified: true },
];
//Part two
function MainMenu() {
  const navigate = useNavigate();
  const [selectedMode, setSelectedMode] = useState(gameModes[0]);
  const [showPartyOverlay, setShowPartyOverlay] = useState(false);
  const [showFriendsOverlay, setShowFriendsOverlay] = useState(false);
  const [showGameModesOverlay, setShowGameModesOverlay] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState({ quests: 2, battlepass: 1, friends: 3 });
  const [activeTab, setActiveTab] = useState('play');
  const [isLandscape, setIsLandscape] = useState(true);
  const mainContainerRef = useRef(null);

  // Party slot system 
  const [partySlots, setPartySlots] = useState([
    { id: 'player-slot-1', filled: true, playerId: null, character: playerData.character, name: playerData.name, leader: true, isCurrentUser: true, level: playerData.level, ready: true },
    { id: 'player-slot-2', filled: true, playerId: 1, character: "jinx", name: "ArcanePlayer", leader: false, isCurrentUser: false, level: 42, ready: true },
    { id: 'player-slot-3', filled: true, playerId: 2, character: "ekko", name: "CardShark22", leader: false, isCurrentUser: false, level: 18, ready: false },
    { id: 'player-slot-4', filled: false, playerId: null, character: null, name: "", leader: false, isCurrentUser: false, level: 0, ready: false },
  ]);

  // Filter game modes based on search term
  const filteredGameModes = searchTerm 
    ? gameModes.filter(mode => 
        mode.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        mode.description.toLowerCase().includes(searchTerm.toLowerCase()))
    : gameModes;

  // Check screen orientation and set 16:9 aspect ratio
  useEffect(() => {
    function handleResize() {
      // Check if window is landscape
      const isLandscapeOrientation = window.innerWidth > window.innerHeight;
      setIsLandscape(isLandscapeOrientation);
      
      // Apply 16:9 aspect ratio if container exists
      if (mainContainerRef.current) {
        const container = mainContainerRef.current;
        
        if (isLandscapeOrientation) {
          // In landscape mode, maintain 16:9 ratio
          const windowWidth = window.innerWidth;
          const windowHeight = window.innerHeight;
          
          // Calculate ideal dimensions for 16:9 ratio
          const targetHeight = (windowWidth / 16) * 9;
          
          if (windowHeight > targetHeight) {
            // If window is taller than needed, constrain height and use full width
            container.style.height = `${targetHeight}px`;
            container.style.maxHeight = `${targetHeight}px`;
            container.style.width = '100%';
          } else {
            // If window is shorter than ideal, constrain width based on height
            const targetWidth = (windowHeight / 9) * 16;
            
            if (targetWidth <= windowWidth) {
              container.style.width = `${targetWidth}px`;
              container.style.height = `${windowHeight}px`;
            } else {
              // Fall back to full window dimensions
              container.style.width = '100%';
              container.style.height = '100vh';
            }
          }
        } else {
          // For portrait, use full dimensions
          container.style.width = '100%';
          container.style.height = '100vh';
        }
      }
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Preload common assets
    EnhancedImageService.preloadCommonAssets();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div 
      ref={mainContainerRef}
      className="bg-gradient-to-br from-purple-900 to-gray-900 relative overflow-hidden"
      style={{ 
        aspectRatio: '16/9',
        width: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        margin: '0 auto'
      }}
    >
      {/* Orientation warning for portrait mode */}
      {!isLandscape && (
        <div className="absolute inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center text-white p-4">
          <span className="text-5xl mb-4">📱↔️</span>
          <h2 className="text-xl font-bold mb-2">Please rotate your device</h2>
          <p className="text-center">This game is designed to be played in landscape mode for the best experience.</p>
        </div>
      )}
      
      {/* Background with character spotlight effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${EnhancedImageService.backgrounds.arcane})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ 
            backgroundImage: 'radial-gradient(circle at center, rgba(168, 85, 247, 0.4) 0%, rgba(0, 0, 0, 0.7) 70%)',
          }}
        />
      </div>
      {/* Top navigation bar */}
      <div className="relative z-20 flex items-center justify-between px-4 py-2 bg-black bg-opacity-50">
        {/* Left section - Home icon */}
        <button 
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-800 rounded-full transition-colors"
          onClick={() => navigate('/')}
        >
          <span className="text-white text-xl">🏠</span>
        </button>
        
        {/* Center section - Main menu tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
          <NavButton 
            active={activeTab === 'play'} 
            label="PLAY" 
            notification={false} 
            onClick={() => setActiveTab('play')}
          />
          <NavButton 
            active={activeTab === 'locker'} 
            label="LOCKER" 
            notification={true}
            onClick={() => navigate('/customize')}
          />
          <NavButton 
            active={activeTab === 'shop'} 
            label="SHOP" 
            notification={false}
            onClick={() => navigate('/shop')}
          />
          <NavButton 
            active={activeTab === 'quests'} 
            label="QUESTS" 
            notification={notifications.quests > 0} 
            count={notifications.quests}
            onClick={() => navigate('/quests')}
          />

          <NavButton 
            active={activeTab === 'passes'} 
            label="PASSES" 
            notification={false}
            onClick={() => navigate('/battlepass')}
          />

          <NavButton 
            active={activeTab === 'compete'} 
            label="COMPETE" 
            notification={false}
            onClick={() => navigate('/compete')}
          />
          <NavButton 
            active={activeTab === 'career'} 
            label="CAREER" 
            notification={false}
            onClick={() => navigate('/profile')}
          />
        </div>
        
        {/* Right section - Currency & Profile */}
        <div className="flex items-center space-x-2">
          {/* V-Bucks (currency) */}
          <motion.div 
            className="flex items-center bg-black bg-opacity-60 rounded-full px-2 py-1 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/shop')}
          >
            <span className="text-yellow-400 mr-1">🪙</span>
            <span className="text-white font-bold">{playerData.vBucks}</span>
          </motion.div>
          
          {/* Friends button */}
          <motion.button 
            className="w-8 h-8 flex items-center justify-center relative hover:bg-gray-800 rounded-full transition-colors"
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowFriendsOverlay(true)}
          >
            <span className="text-white text-xl">👥</span>
            {notifications.friends > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                {notifications.friends}
              </span>
            )}
          </motion.button>
          
          {/* Profile avatar */}
          <motion.button 
            className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden relative border-2 border-yellow-500"
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate('/profile')}
          >
            <img 
              src={EnhancedImageService.getImage('character', playerData.character)} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-black"></span>
          </motion.button>
        </div>
      </div>
      {/* Main content area */}
      <div className="flex-1 relative z-10 h-[calc(100%-100px)]">
        {/* Character display with improved positioning for 16:9 layout */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Main player container with 16:9 aspect ratio consideration */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Player formation - using absolute positioning for precise 16:9 layout */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Create a "diamond" formation for 4 players */}
              <div className="relative w-full max-w-3xl aspect-video flex items-center justify-center">
                {/* Center floor spotlight */}
                <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-16 bg-purple-600 bg-opacity-50 rounded-full blur-md"></div>
                
                {/* Main player (current user) - TOP position */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20"
                >
                  <div className="relative">
                    <img 
                      src={EnhancedImageService.getImage('character', playerData.character)} 
                      alt="Character" 
                      className="h-64 object-contain"
                    />
                    
                    {/* Ready indicator */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 px-2 py-0.5 rounded-full text-xs text-white font-bold">
                      READY
                    </div>
                  </div>

                  {/* Player name and leader crown */}
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex items-center flex-col z-30">
                    <div className="bg-purple-800 bg-opacity-80 px-3 py-1 rounded-full flex items-center">
                      <span className="text-yellow-400 text-lg mr-1">👑</span>
                      <span className="text-white font-bold">{playerData.name}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Player 2 - LEFT position */}
                {partySlots[1].filled && (
                  <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <div className="relative">
                      <div className="absolute bottom-0 w-24 h-6 bg-blue-600 bg-opacity-30 rounded-full blur-md"></div>
                      <img 
                        src={EnhancedImageService.getImage('character', partySlots[1].character)} 
                        alt={partySlots[1].name}
                        className="h-40 object-contain opacity-90"
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-green-500 px-2 py-0.5 rounded-full text-xs text-white font-bold">
                        READY
                      </div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-800 bg-opacity-80 px-2 py-0.5 rounded-full">
                      <span className="text-white text-xs">{partySlots[1].name}</span>
                    </div>
                  </motion.div>
                )}

                {/* Player 3 - RIGHT position */}
                {partySlots[2].filled && (
                  <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.7 }}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
                  >
                    <div className="relative">
                      <div className="absolute bottom-0 w-24 h-6 bg-blue-600 bg-opacity-30 rounded-full blur-md"></div>
                      <img 
                        src={EnhancedImageService.getImage('character', partySlots[2].character)} 
                        alt={partySlots[2].name}
                        className="h-40 object-contain opacity-90"
                      />
                      {/* Not ready indicator */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 px-2 py-0.5 rounded-full text-xs text-white font-bold">
                        NOT READY
                      </div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-800 bg-opacity-80 px-2 py-0.5 rounded-full">
                      <span className="text-white text-xs">{partySlots[2].name}</span>
                    </div>
                  </motion.div>
                )}

                {/* Player 4 (Empty Slot) - BOTTOM position */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer ${!partySlots[3].filled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                  onClick={() => setShowPartyOverlay(true)}
                >
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full bg-gray-800 bg-opacity-50 border-2 border-dashed border-gray-500 flex items-center justify-center">
                      <span className="text-gray-400 text-2xl">+</span>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-80 px-2 py-0.5 rounded-full">
                      <span className="text-gray-400 text-xs">INVITE</span>
                    </div>
                  </div>
                </motion.div>

                {/* Filled Player 4 - BOTTOM position */}
                {partySlots[3].filled && (
                  <motion.div
                    animate={{ y: [-3, 3, -3] }}
                    transition={{ repeat: Infinity, duration: 2.7, ease: "easeInOut", delay: 0.3 }}
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10"
                  >
                    <div className="relative">
                      <div className="absolute bottom-0 w-24 h-6 bg-blue-600 bg-opacity-30 rounded-full blur-md"></div>
                      <img 
                        src={EnhancedImageService.getImage('character', partySlots[3].character)} 
                        alt={partySlots[3].name}
                        className="h-40 object-contain opacity-90"
                      />
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 px-2 py-0.5 rounded-full text-xs text-white font-bold">
                        NOT READY
                      </div>
                    </div>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-800 bg-opacity-80 px-2 py-0.5 rounded-full">
                      <span className="text-white text-xs">{partySlots[3].name}</span>
                    </div>
                  </motion.div>
                )}
                
                {/* Level indicator */}
                <div className="absolute bottom-0 right-0 transform translate-x-full translate-y-1/4 bg-gray-800 bg-opacity-80 rounded-lg p-1 w-12 h-12 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-gray-400 text-xs">LVL</span>
                    <span className="text-white font-bold block">{playerData.level}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Stats & Battle pass summary - Bottom right */}
        <div className="absolute bottom-20 right-4 w-64 sm:w-80 space-y-2">
          {/* Player stats panel */}
          <div className="bg-black bg-opacity-70 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-bold">STATS</h3>
              <button 
                className="text-gray-400 text-xs bg-gray-800 px-2 py-0.5 rounded hover:bg-gray-700"
                onClick={() => navigate('/profile')}
              >
                VIEW ALL
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded text-center">
                <div className="text-green-400 font-bold">{playerData.wins}</div>
                <div className="text-gray-400 text-xs">Wins</div>
              </div>
              <div className="bg-gray-800 bg-opacity-50 p-2 rounded text-center">
                <div className="text-white font-bold">{playerData.gamesPlayed}</div>
                <div className="text-gray-400 text-xs">Matches</div>
              </div>
            </div>
          </div>
          
          {/* Battle pass progress */}
          <div className="bg-black bg-opacity-70 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-white font-bold">BATTLE PASS</span>
              <span className="text-yellow-400 font-bold">TIER {playerData.battlePassLevel}</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-300" 
                style={{ width: `${(playerData.battlePassLevel / 100) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {/* News banner */}
          <div className="bg-black bg-opacity-70 rounded-lg overflow-hidden">
            <div className="bg-red-700 px-3 py-1 flex justify-between items-center">
              <h3 className="text-white font-bold">NEWS</h3>
              <span className="text-xs text-gray-200 bg-black bg-opacity-30 px-1 rounded">NEW</span>
            </div>
            <div className="p-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={newsItems[0].id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-white"
                >
                  <h4 className="font-bold text-sm">{newsItems[0].title}</h4>
                  <p className="text-xs text-gray-300 truncate">{newsItems[0].description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom game mode selector */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Mode selector trigger bar */}
        <motion.div 
          className="flex justify-between items-center px-4 py-2 bg-gradient-to-r from-purple-900 to-indigo-900 border-t border-purple-700 cursor-pointer"
          onClick={() => setShowModeSelector(!showModeSelector)}
        >
          <div className="flex items-center">
            <span className={`mr-2 text-lg ${selectedMode.ranked ? 'text-yellow-400' : 'text-white'}`}>
              {selectedMode.icon}
            </span>
            <div>
              <h3 className="text-white font-bold text-lg flex items-center">
                {selectedMode.ranked && <span className="text-red-400 mr-1">RANKED:</span>} 
                {selectedMode.name}
              </h3>
              <p className="text-gray-300 text-xs hidden sm:block">{selectedMode.description}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-black bg-opacity-40 rounded-full px-2 py-1 mr-2 hidden sm:block">
              <span className="text-green-400 text-xs">{selectedMode.onlinePlayers} Online</span>
            </div>
            <motion.span 
              className="text-white text-lg"
              animate={{ rotate: showModeSelector ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ▲
            </motion.span>
          </div>
        </motion.div>

        {/* Game mode selector drawer */}
        <AnimatePresence>
          {showModeSelector && (
            <motion.div
              className="bg-black bg-opacity-95 border-t border-purple-700 overflow-hidden"
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Search bar */}
              <div className="p-3 border-b border-gray-800">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search game modes..."
                    className="w-full bg-gray-800 text-white px-3 py-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </span>
                </div>
              </div>

              {/* Game modes grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3 max-h-60 overflow-y-auto">
                {filteredGameModes.map(mode => (
                  <motion.div
                    key={mode.id}
                    className={`bg-gray-800 rounded-lg overflow-hidden cursor-pointer ${
                      selectedMode.id === mode.id ? 'ring-2 ring-yellow-500' : ''
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedMode(mode);
                      setShowModeSelector(false);
                    }}
                  >
                    <div className="flex items-center p-2">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-2"
                        style={{ backgroundColor: mode.color + '40' }}
                      >
                        <span className="text-xl">{mode.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-white font-bold text-sm">
                            {mode.name}
                          </h3>
                          {mode.ranked && (
                            <span className="ml-1 bg-red-600 text-white text-xs px-1 rounded">
                              RANKED
                            </span>
                          )}
                        </div>
                        <div className="flex text-xs">
                          <span className="text-gray-400 mr-2">{mode.players}</span>
                          <span className="text-green-400">{mode.onlinePlayers} Online</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredGameModes.length === 0 && (
                  <div className="col-span-full text-center py-4 text-gray-400">
                    No game modes found matching "{searchTerm}"
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="p-3 border-t border-gray-800 flex justify-between">
                <button 
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm"
                  onClick={() => setShowModeSelector(false)}
                >
                  CLOSE
                </button>
                <motion.button 
                  className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-md font-bold text-sm flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    navigate(`/${selectedMode.id}-lobby`);
                    setShowModeSelector(false);
                  }}
                >
                  PLAY {selectedMode.name}
                  <span className="ml-1">▶</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom navigation */}
        <div className="flex justify-between items-center px-4 py-2 bg-black bg-opacity-70">
          <button 
            className="px-3 py-1 rounded-lg bg-gray-800 text-white text-sm flex items-center hover:bg-gray-700"
            onClick={() => setShowPartyOverlay(true)}
          >
            <span className="mr-1">👪</span>
            <span>Chat (Hold)</span>
          </button>
          
          <button className="px-3 py-1 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700">
            <span>Emote (Hold)</span>
          </button>
          
          <button 
            className="px-3 py-1 rounded-lg bg-gray-800 text-white text-sm hover:bg-gray-700"
            onClick={() => navigate(-1)}
          >
            <span>Back</span>
          </button>
        </div>
      </div>
      {/* Friends overlay (opens from RIGHT side) */}
      <AnimatePresence>
        {showFriendsOverlay && (
          <motion.div 
            className="absolute inset-0 z-40 bg-black bg-opacity-80 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex-1" onClick={() => setShowFriendsOverlay(false)} />
            
            <motion.div 
              className="w-72 sm:w-80 bg-gray-900 h-full"
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="bg-blue-900 p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-white font-bold">FRIENDS</h2>
                  <span className="ml-2 bg-green-700 text-white text-xs px-2 py-0.5 rounded-full">
                    {friendsData.filter(f => f.status === 'online' || f.status === 'away').length} ONLINE
                  </span>
                </div>
                <button onClick={() => setShowFriendsOverlay(false)}>
                  <span className="text-white">✕</span>
                </button>
              </div>
              
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search friends..."
                  className="w-full bg-gray-800 text-white p-2 rounded mb-3"
                />
                
                {/* Online friends section */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">ONLINE</h3>
                    <span className="text-gray-400 text-sm">{friendsData.filter(f => f.status === 'online' || f.status === 'away').length}</span>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto">
                    {friendsData.filter(f => f.status === 'online' || f.status === 'away').map(friend => (
                      <div key={friend.id} className="flex items-center mb-2 bg-gray-800 p-2 rounded">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-2 bg-gray-700 relative">
                          <img 
                            src={EnhancedImageService.getImage('character', friend.character)}
                            alt={friend.name}
                            className="w-full h-full object-cover"
                          />
                          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-800 ${
                            friend.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}></span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-white text-sm">{friend.name}</span>
                            {friend.verified && <span className="ml-1 text-blue-400 text-xs">✓</span>}
                          </div>
                          <div className="flex items-center">
                            <span className={`${
                              friend.status === 'online' ? 'text-green-400' : 'text-yellow-400'
                            } text-xs`}>
                              {friend.status === 'online' ? 'Online' : 'Away'}
                            </span>
                            <span className="text-gray-500 text-xs mx-1">•</span>
                            <span className="text-gray-400 text-xs">Lvl {friend.level}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          <button 
                            className="text-white bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-xs"
                            title="Send Message"
                          >
                            📩
                          </button>
                          <button 
                            className="text-white bg-green-600 w-8 h-8 rounded-full flex items-center justify-center text-xs"
                            title="Invite to Party"
                            onClick={() => {
                              // Logic to add friend to party
                              const emptySlotIndex = partySlots.findIndex(slot => !slot.filled);
                              if (emptySlotIndex !== -1) {
                                const newPartySlots = [...partySlots];
                                newPartySlots[emptySlotIndex] = {
                                  ...newPartySlots[emptySlotIndex],
                                  filled: true,
                                  character: friend.character,
                                  name: friend.name,
                                  level: friend.level,
                                  ready: false
                                };
                                setPartySlots(newPartySlots);
                                setShowFriendsOverlay(false);
                              }
                            }}
                          >
                            ➕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* In-game friends section */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">IN GAME</h3>
                    <span className="text-gray-400 text-sm">{friendsData.filter(f => f.status === 'ingame').length}</span>
                  </div>
                  
                  <div className="max-h-32 overflow-y-auto">
                    {friendsData.filter(f => f.status === 'ingame').map(friend => (
                      <div key={friend.id} className="flex items-center mb-2 bg-gray-800 p-2 rounded">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-2 bg-gray-700 relative">
                          <img 
                            src={EnhancedImageService.getImage('character', friend.character)}
                            alt={friend.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-800 bg-blue-500"></span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-white text-sm">{friend.name}</span>
                            {friend.verified && <span className="ml-1 text-blue-400 text-xs">✓</span>}
                          </div>
                          <div className="flex items-center">
                            <span className="text-blue-400 text-xs">In Game</span>
                            <span className="text-gray-500 text-xs mx-1">•</span>
                            <span className="text-gray-400 text-xs">Lvl {friend.level}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button className="text-white bg-blue-600 px-2 py-0.5 rounded text-xs">
                            JOIN
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Offline friends section */}
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-gray-400 text-sm">OFFLINE</h3>
                    <span className="text-gray-400 text-sm">{friendsData.filter(f => f.status === 'offline').length}</span>
                  </div>
                  
                  <div className="max-h-32 overflow-y-auto">
                    {friendsData.filter(f => f.status === 'offline').map(friend => (
                      <div key={friend.id} className="flex items-center mb-2 bg-gray-800 bg-opacity-60 p-2 rounded">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-2 bg-gray-700 relative">
                          <img 
                            src={EnhancedImageService.getImage('character', friend.character)}
                            alt={friend.name}
                            className="w-full h-full object-cover opacity-60"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-800 bg-gray-500"></span>
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-400 text-sm">{friend.name}</span>
                          <div className="flex items-center">
                            <span className="text-gray-500 text-xs">Offline</span>
                            <span className="text-gray-500 text-xs mx-1">•</span>
                            <span className="text-gray-500 text-xs">Lvl {friend.level}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Friend actions */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button className="bg-gray-700 text-white rounded py-2 text-sm">
                    ADD FRIEND
                  </button>
                  <button className="bg-green-600 text-white rounded py-2 text-sm">
                    FIND PEOPLE
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Party overlay (opens from left) */}
      <AnimatePresence>
        {showPartyOverlay && (
          <motion.div 
            className="absolute inset-0 z-40 bg-black bg-opacity-80 flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-72 sm:w-80 bg-gray-900 h-full"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <div className="bg-purple-900 p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-white font-bold">PARTY</h2>
                  <span className="ml-2 bg-blue-700 text-white text-xs px-2 py-0.5 rounded-full">
                    {partySlots.filter(slot => slot.filled).length}/4
                  </span>
                </div>
                <button onClick={() => setShowPartyOverlay(false)}>
                  <span className="text-white">✕</span>
                </button>
              </div>
              
              <div className="p-3">
                {/* Party slots */}
                <div className="mb-4">
                  <h3 className="text-gray-400 text-sm mb-2">YOUR PARTY</h3>
                  
                  {/* Current player's slot */}
                  <div className="flex items-center mb-2 bg-gray-800 p-2 rounded">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-2 bg-gray-700 border-2 border-yellow-500">
                      <img 
                        src={EnhancedImageService.getImage('character', playerData.character)}
                        alt={playerData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-white">{playerData.name}</span>
                        <span className="ml-1 text-yellow-400 text-xs">👑</span>
                      </div>
                      <span className="text-green-400 text-xs">Party Leader</span>
                    </div>
                    <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
                      READY
                    </div>
                  </div>
                  
                  {/* Other party members */}
                  {partySlots.slice(1).map((slot, index) => 
                    slot.filled ? (
                      <div key={`party-slot-${index}`} className="flex items-center mb-2 bg-gray-800 p-2 rounded">
                        <div className="w-10 h-10 rounded-full overflow-hidden mr-2 bg-gray-700">
                          <img 
                            src={EnhancedImageService.getImage('character', slot.character)}
                            alt={slot.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span className="text-white">{slot.name}</span>
                            {slot.leader && (
                              <span className="ml-1 text-yellow-400 text-xs">👑</span>
                            )}
                          </div>
                          <span className="text-green-400 text-xs">Online</span>
                        </div>
                        <div className={`${slot.ready ? 'bg-green-600' : 'bg-red-600'} text-white text-xs px-2 py-0.5 rounded`}>
                          {slot.ready ? 'READY' : 'NOT READY'}
                        </div>
                      </div>
                    ) : (
                      <div key={`party-slot-${index}`} className="flex items-center mb-2 bg-gray-800 bg-opacity-40 p-2 rounded border border-dashed border-gray-700">
                        <div className="w-10 h-10 rounded-full bg-gray-800 mr-2 flex items-center justify-center">
                          <span className="text-gray-500 text-xl">+</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-gray-500">Empty Slot</span>
                        </div>
                        <button 
                          className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
                          onClick={() => setShowInvite(true)}
                        >
                          INVITE
                        </button>
                      </div>
                    )
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button 
                      className="bg-red-600 text-white rounded py-2 text-sm"
                      onClick={() => setShowPartyOverlay(false)}
                    >
                      LEAVE PARTY
                    </button>
                    <button 
                      className="bg-blue-600 text-white rounded py-2 text-sm"
                      onClick={() => setShowInvite(true)}
                    >
                      INVITE FRIENDS
                    </button>
                  </div>
                </div>
                
                {/* Chat section */}
                <div className="mt-6">
                  <h3 className="text-gray-400 text-sm mb-2">PARTY CHAT</h3>
                  <div className="bg-gray-800 rounded p-2 h-48 mb-2 overflow-y-auto">
                    {/* Chat messages would go here */}
                    <div className="text-yellow-400 text-sm mb-1">System: Party created</div>
                    <div className="text-green-400 text-sm mb-1">{playerData.name}: Hey everyone!</div>
                    <div className="text-white text-sm mb-1">CardShark22: Hello, ready to play?</div>
                    <div className="text-white text-sm mb-1">ArcanePlayer: Let's get started!</div>
                  </div>
                  <div className="flex">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l focus:outline-none"
                    />
                    <button className="bg-blue-600 text-white px-3 py-2 rounded-r">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <div className="flex-1" onClick={() => setShowPartyOverlay(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite overlay */}
      <AnimatePresence>
        {showInvite && (
          <motion.div 
            className="absolute inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg overflow-hidden w-full max-w-md"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="bg-blue-900 p-3 flex justify-between items-center">
                <h2 className="text-white font-bold">INVITE FRIENDS</h2>
                <button onClick={() => setShowInvite(false)}>
                  <span className="text-white">✕</span>
                </button>
              </div>
              
              <div className="p-4">
                <input
                  type="text"
                  placeholder="Search friends..."
                  className="w-full bg-gray-800 text-white p-2 rounded mb-3"
                />
                
                <div className="max-h-64 overflow-y-auto mb-4">
                  {friendsData
                    .filter(f => f.status === 'online' && !f.inParty)
                    .map(friend => (
                    <div key={friend.id} className="flex items-center mb-2 bg-gray-800 p-2 rounded">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-2 bg-gray-700">
                        <img 
                          src={EnhancedImageService.getImage('character', friend.character)}
                          alt={friend.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <span className="text-white text-sm">{friend.name}</span>
                        <span className="text-green-400 text-xs block">Online</span>
                      </div>
                      <button 
                        className="bg-green-600 text-white px-2 py-1 rounded text-xs"
                        onClick={() => {
                          // Logic to add friend to party
                          const emptySlotIndex = partySlots.findIndex(slot => !slot.filled);
                          if (emptySlotIndex !== -1) {
                            const newPartySlots = [...partySlots];
                            newPartySlots[emptySlotIndex] = {
                              ...newPartySlots[emptySlotIndex],
                              filled: true,
                              character: friend.character,
                              name: friend.name,
                              level: friend.level || 1,
                              ready: false
                            };
                            setPartySlots(newPartySlots);
                            setShowInvite(false);
                          }
                        }}
                      >
                        INVITE
                      </button>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-end">
                  <button 
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                    onClick={() => setShowInvite(false)}
                  >
                    CANCEL
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

// NavButton component
function NavButton({ label, active = false, notification = false, count = 0, onClick }) {
  return (
    <motion.div 
      className={`relative px-3 py-1 font-bold cursor-pointer ${active ? 'bg-purple-600 rounded-lg' : 'text-gray-300 hover:bg-gray-800 hover:bg-opacity-50 hover:rounded-lg'}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      <span className="text-white">{label}</span>
      {notification && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center text-black text-xs font-bold">
          {count > 0 ? count : ''}
        </span>
      )}
    </motion.div>
  );
}

export default MainMenu;