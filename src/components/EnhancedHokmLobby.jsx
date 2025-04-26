import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ImageService from '../services/ImageService';

// Character data with better visuals
const characterData = {
  'Viper': {
    name: 'Viper',
    level: 25,
    ready: false,
    online: true,
    special: 'Poison Master',
    team: 'A',
    cardStyle: 'neon',
    primaryColor: '#4ade80',
    secondaryColor: '#166534',
    avatar: 'viper'
  },
  'Jinx': {
    name: 'Jinx',
    level: 42,
    ready: false,
    online: true,
    special: 'Demolition Expert',
    team: 'A',
    cardStyle: 'arcane',
    primaryColor: '#ec4899',
    secondaryColor: '#9d174d',
    avatar: 'jinx'
  },
  'Ekko': {
    name: 'Ekko',
    level: 18,
    ready: false,
    online: true,
    special: 'Time Shifter',
    team: 'B',
    cardStyle: 'standard',
    primaryColor: '#a78bfa',
    secondaryColor: '#5b21b6',
    avatar: 'ekko'
  },
  'Caitlyn': {
    name: 'Caitlyn',
    level: 31,
    ready: false, 
    online: true,
    special: 'Tactical Planner',
    team: 'B',
    cardStyle: 'golden',
    primaryColor: '#38bdf8',
    secondaryColor: '#0369a1',
    avatar: 'caitlyn'
  }
};

// Default game rules
const gameRules = [
  "Hokm is a trick-taking card game for 4 players in fixed partnerships.",
  "One player is selected as the Hokm Caller who will choose the trump suit.",
  "Each player receives 13 cards (total deck of 52 cards).",
  "Players must follow the suit led if possible.",
  "The highest card of the led suit wins the trick, unless a trump card is played.",
  "The highest trump card wins the trick.",
  "The team that takes 7 tricks first wins the round."
];

// Game settings options
const gameSettings = {
  scoreLimits: [7, 10, 15, 20],
  timePerTurn: [10, 15, 20, 30],
  allowSpectators: [true, false],
  teamMode: ['Fixed Partners', 'Random Teams'],
};

function EnhancedHokmLobby() {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  
  // Player slots - empty fourth slot to start
  const [playerSlots, setPlayerSlots] = useState([
    { id: 1, character: 'Viper', isCurrentUser: true, isEmpty: false },
    { id: 2, character: 'Jinx', isCurrentUser: false, isEmpty: false },
    { id: 3, character: 'Ekko', isCurrentUser: false, isEmpty: false },
    { id: 4, character: null, isCurrentUser: false, isEmpty: true }
  ]);
  
  const [chatMessages, setChatMessages] = useState([
    { sender: 'System', message: 'Welcome to Hokm Lobby!' },
    { sender: 'Jinx', message: 'Hello everyone, ready for a game?' },
    { sender: 'Ekko', message: 'Sure, let\'s play!' },
  ]);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isInviteFriendsOpen, setIsInviteFriendsOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  
  const [settings, setSettings] = useState({
    scoreLimit: 7,
    timePerTurn: 15,
    allowSpectators: true,
    teamMode: 'Fixed Partners',
  });
  
  const [isReady, setIsReady] = useState(false);
  const [isStartingGame, setIsStartingGame] = useState(false);
  const [countdownValue, setCountdownValue] = useState(5);
  const [lobbyInfo, setLobbyInfo] = useState({
    name: `Hokm Lobby ${lobbyId}`,
    host: 'Viper',
    isPrivate: false,
    code: 'XYZ123'
  });
  
  // Sample friends data
  const [friendsList] = useState([
    { id: 'friend1', name: 'ShadowWarrior', avatar: 'vi', status: 'online', level: 38 },
    { id: 'friend2', name: 'CardMaster42', avatar: 'jayce', status: 'online', level: 57 },
    { id: 'friend3', name: 'ArcaneExpert', avatar: 'jinx', status: 'offline', level: 29 },
    { id: 'friend4', name: 'ProGamer123', avatar: 'ekko', status: 'in-game', level: 45 },
    { id: 'friend5', name: 'MysticPlayer', avatar: 'caitlyn', status: 'online', level: 33 },
  ]);
  
  // Invited friends tracking
  const [invitedFriends, setInvitedFriends] = useState([]);
  
  const chatInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Helper function to get character avatar
  const getCharacterAvatar = (character) => {
    if (!character) return '';
    
    // If character is a string (name), get avatar from characterData
    if (typeof character === 'string') {
      return characterData[character]?.avatar || character.toLowerCase();
    }
    
    // If character is an object
    return character.avatar || character.name?.toLowerCase() || '';
  };
  
  // Handle friend invitation
  const inviteFriend = (friendId) => {
    if (!invitedFriends.includes(friendId)) {
      setInvitedFriends([...invitedFriends, friendId]);
      
      // Add system message about invitation
      const friend = friendsList.find(f => f.id === friendId);
      if (friend) {
        setChatMessages([
          ...chatMessages,
          { sender: 'System', message: `Invitation sent to ${friend.name}.` }
        ]);
      }
    }
  };

  useEffect(() => {
    // Scroll chat to bottom when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Initialize character data
  useEffect(() => {
    // Update character data based on slots
    const updatedSlots = playerSlots.map(slot => {
      if (!slot.isEmpty && slot.character) {
        return {
          ...slot,
          ...characterData[slot.character],
          ready: slot.id === 1 ? isReady : Math.random() > 0.5
        };
      }
      return slot;
    });
    
    setPlayerSlots(updatedSlots);
    
    // Simulate other players getting ready randomly
    const randomReadyInterval = setInterval(() => {
      setPlayerSlots(prev => 
        prev.map(slot => {
          if (!slot.isEmpty && !slot.isCurrentUser && Math.random() > 0.9) {
            return { ...slot, ready: !slot.ready };
          }
          return slot;
        })
      );
    }, 5000);
    
    return () => clearInterval(randomReadyInterval);
  }, []);

  const toggleReady = () => {
    setIsReady(!isReady);
    setPlayerSlots(prev => 
      prev.map(slot => {
        if (slot.id === 1) {
          return { ...slot, ready: !isReady };
        }
        return slot;
      })
    );
  };

  const sendMessage = (e) => {
    if (e.key === 'Enter' && chatInputRef.current.value.trim()) {
      const newMessage = {
        sender: 'Viper',
        message: chatInputRef.current.value.trim()
      };
      setChatMessages([...chatMessages, newMessage]);
      chatInputRef.current.value = '';
    }
  };

  const startGameCountdown = () => {
    // Check if at least 3 players are ready (including the current user)
    const readyPlayers = playerSlots.filter(player => !player.isEmpty && player.ready);
    
    if (readyPlayers.length < 3) {
      alert('At least 3 players need to be ready to start the game!');
      return;
    }
    
    setIsStartingGame(true);
    
    // Countdown timer
    const interval = setInterval(() => {
      setCountdownValue(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Navigate to game screen after countdown
          setTimeout(() => {
            navigate('/hokm-game');
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const updateSetting = (setting, value) => {
    setSettings({
      ...settings,
      [setting]: value
    });
  };

  const viewPlayerProfile = (player) => {
    setSelectedPlayer(player);
    setIsProfileOpen(true);
  };

  const leaveSlot = (slotId) => {
    if (slotId === 1) {
      // Current user leaving - should redirect to lobbies
      if (window.confirm("Are you sure you want to leave this lobby?")) {
        navigate('/hokm-lobbies');
      }
    } else {
      // Other player leaving
      setPlayerSlots(prev => 
        prev.map(slot => {
          if (slot.id === slotId) {
            return { ...slot, isEmpty: true, character: null };
          }
          return slot;
        })
      );
      
      setChatMessages([
        ...chatMessages, 
        { sender: 'System', message: `${playerSlots.find(p => p.id === slotId)?.character || 'A player'} has left the lobby.` }
      ]);
    }
  };

  const joinEmptySlot = () => {
    // Find first empty slot
    const emptySlot = playerSlots.find(slot => slot.isEmpty);
    if (emptySlot) {
      // In a real app, this would be the joining player's character
      const joiningCharacter = 'Caitlyn';
      
      setPlayerSlots(prev => 
        prev.map(slot => {
          if (slot.id === emptySlot.id) {
            return { 
              ...slot, 
              isEmpty: false, 
              character: joiningCharacter,
              ...characterData[joiningCharacter],
              ready: false
            };
          }
          return slot;
        })
      );
      
      setChatMessages([
        ...chatMessages, 
        { sender: 'System', message: `${joiningCharacter} has joined the lobby.` }
      ]);
    }
  };

  // Check if enough players are ready to start the game
  const canStartGame = playerSlots.filter(player => !player.isEmpty && player.ready).length >= 3;
  
  // Team distribution
  const teamA = playerSlots.filter(p => !p.isEmpty && p.team === 'A');
  const teamB = playerSlots.filter(p => !p.isEmpty && p.team === 'B');
  
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-purple-900 to-gray-900 flex flex-col relative"
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
      
      {/* Game starting overlay */}
      <AnimatePresence>
        {isStartingGame && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-4xl text-yellow-400 font-bold mb-6">GAME STARTING</h2>
            <motion.div 
              className="text-6xl text-white font-bold"
              key={countdownValue}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {countdownValue}
            </motion.div>
            <p className="text-gray-300 mt-8">Prepare your strategy...</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10 bg-black bg-opacity-50">
        <div className="flex items-center gap-4">
          <Link to="/hokm-lobbies">
            <motion.button 
              className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon hover-glow"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white text-xl">←</span>
            </motion.button>
          </Link>
          <div>
            <h1 className="text-3xl text-yellow-400 font-bold">{lobbyInfo.name}</h1>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center">
                <span className="text-gray-400 text-sm mr-1">Host:</span>
                <span className="text-white text-sm">{lobbyInfo.host}</span>
              </div>
              {lobbyInfo.isPrivate && (
                <div className="flex items-center">
                  <span className="text-gray-400 text-sm mr-1">Code:</span>
                  <span className="text-white text-sm">{lobbyInfo.code}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <motion.button 
            className="px-4 py-2 bg-blue-700 rounded-lg text-white shadow-neon hover-glow flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsRulesOpen(true)}
          >
            <span className="text-lg">📜</span>
            Rules
          </motion.button>
          
          <motion.button 
            className="px-4 py-2 bg-purple-700 rounded-lg text-white shadow-neon hover-glow flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSettingsOpen(true)}
          >
            <span className="text-lg">⚙️</span>
            Settings
          </motion.button>
          
          <motion.button 
            className="px-4 py-2 bg-indigo-700 rounded-lg text-white shadow-neon hover-glow flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsInviteFriendsOpen(true)}
          >
            <span className="text-lg">👥</span>
            Invite Friends
          </motion.button>
          
          <motion.button 
            className="px-4 py-2 bg-green-700 rounded-lg text-white shadow-neon hover-glow flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={joinEmptySlot}
          >
            <span className="text-lg">➕</span>
            Add Bot
          </motion.button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-1 p-6 gap-6 z-10">
        {/* Left side - Players and Teams */}
        <div className="w-2/3 flex flex-col gap-6">
          {/* Teams overview */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4 shadow-neon flex justify-around">
            <div className="text-center">
              <h3 className="text-xl text-blue-400 font-bold mb-2">TEAM A</h3>
              <div className="flex gap-2 justify-center">
                {teamA.map(player => (
                  <div key={player.id} className="flex flex-col items-center">
                    <div 
                      className="w-12 h-12 rounded-full overflow-hidden border-2"
                      style={{ borderColor: player.primaryColor }}
                    >
                      <img 
                        src={ImageService.getImage('character', getCharacterAvatar(player))}
                        alt={player.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white text-xs mt-1">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl text-red-400 font-bold mb-2">TEAM B</h3>
              <div className="flex gap-2 justify-center">
                {teamB.map(player => (
                  <div key={player.id} className="flex flex-col items-center">
                    <div 
                      className="w-12 h-12 rounded-full overflow-hidden border-2"
                      style={{ borderColor: player.primaryColor }}
                    >
                      <img 
                        src={ImageService.getImage('character', getCharacterAvatar(player))}
                        alt={player.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white text-xs mt-1">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Players Grid */}
          <div className="bg-black bg-opacity-50 rounded-lg p-6 shadow-neon flex-1">
            <h2 className="text-2xl text-white font-bold mb-4">PLAYERS</h2>
            
            <div className="grid grid-cols-2 gap-6">
              {playerSlots.map((player) => (
                <motion.div 
                  key={player.id}
                  className={`rounded-lg overflow-hidden ${
                    player.isEmpty 
                      ? 'bg-gray-800 bg-opacity-40 border-2 border-dashed border-gray-600' 
                      : player.ready 
                        ? 'bg-gray-900 border-2 border-green-500 shadow-neon' 
                        : 'bg-gray-900 border border-purple-500'
                  }`}
                  whileHover={{ scale: player.isCurrentUser ? 1.02 : 1 }}
                >
                  {player.isEmpty ? (
                    <div className="h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl text-gray-500 mb-2">👤</div>
                        <p className="text-gray-400">Waiting for player...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex relative">
                      {/* Team indicator */}
                      <div 
                        className="absolute top-2 left-2 px-2 py-1 rounded text-sm font-bold"
                        style={{ 
                          backgroundColor: player.team === 'A' ? 'rgba(37, 99, 235, 0.7)' : 'rgba(220, 38, 38, 0.7)',
                          color: 'white'
                        }}
                      >
                        Team {player.team}
                      </div>
                      
                      {/* Leave button for current user or kick option for others */}
                      <button 
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-800 bg-opacity-70 flex items-center justify-center text-gray-400 hover:text-white"
                        onClick={() => leaveSlot(player.id)}
                      >
                        {player.isCurrentUser ? '🚪' : '❌'}
                      </button>
                      
                      <div 
                        className="w-1/3 p-4" 
                        style={{ 
                          background: `linear-gradient(135deg, ${player.primaryColor}40, ${player.secondaryColor}40)` 
                        }}
                      >
                        {/* Character avatar */}
                        <div 
                          className="h-40 w-full rounded-lg overflow-hidden border-2 cursor-pointer"
                          style={{ borderColor: player.primaryColor }}
                          onClick={() => viewPlayerProfile(player)}
                        >
                          <img 
                            src={ImageService.getImage('character', getCharacterAvatar(player))}
                            alt={player.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="w-2/3 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-white font-bold text-xl">{player.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                                Level {player.level}
                              </span>
                              <span 
                                className="px-2 py-1 rounded text-xs" 
                                style={{ 
                                  backgroundColor: player.primaryColor + '40',
                                  color: player.primaryColor
                                }}
                              >
                                {player.special}
                              </span>
                            </div>
                          </div>
                          
                          {player.cardStyle && (
                            <div className="w-12 h-16 overflow-hidden rounded">
                              <img 
                                src={ImageService.getImage('card', player.cardStyle)} 
                                alt="Card Style" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-4">
                          <div className="bg-gray-800 bg-opacity-50 p-2 rounded mb-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Win Rate:</span>
                              <span className="text-white text-sm">67%</span>
                            </div>
                            <div className="w-full bg-gray-700 h-2 rounded-full mt-1">
                              <div className="bg-green-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                            </div>
                          </div>
                          
                          <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                            <div className="flex justify-between">
                              <span className="text-gray-400 text-sm">Games Played:</span>
                              <span className="text-white text-sm">{46 + player.id * 10}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Ready button for current user */}
                        {player.isCurrentUser && (
                          <motion.button 
                            className={`mt-3 w-full py-2 rounded text-sm font-bold ${
                              isReady ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleReady}
                          >
                            {isReady ? 'READY' : 'CLICK WHEN READY'}
                          </motion.button>
                        )}
                        
                        {/* Ready indicator for other players */}
                        {!player.isCurrentUser && !player.isEmpty && (
                          <div className={`mt-3 w-full py-2 rounded text-sm font-bold text-center ${
                            player.ready ? 'bg-green-600 text-white' : 'bg-gray-700 text-white'
                          }`}>
                            {player.ready ? 'READY' : 'NOT READY'}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-center">
              <motion.button 
                className={`px-8 py-3 rounded-lg text-xl font-bold ${
                  canStartGame
                    ? 'bg-green-600 text-white shadow-neon hover-glow'
                    : 'bg-gray-700 text-gray-300 cursor-not-allowed'
                }`}
                whileHover={
                  canStartGame
                    ? { scale: 1.05 }
                    : {}
                }
                whileTap={
                  canStartGame
                    ? { scale: 0.95 }
                    : {}
                }
                onClick={startGameCountdown}
                disabled={!canStartGame}
              >
                {canStartGame ? 'START GAME' : 'WAITING FOR PLAYERS...'}
              </motion.button>
            </div>
          </div>
        </div>
        
        {/* Right side - Chat and info */}
        <div className="w-1/3 flex flex-col gap-4">
          {/* Game info */}
          <motion.div 
            className="bg-black bg-opacity-50 rounded-lg p-4 shadow-neon"
            whileHover={{ scale: 1.01 }}
          >
            <h3 className="text-xl text-white font-bold mb-2">GAME INFO</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400 block">Score Limit:</span>
                <span className="text-white font-bold">{settings.scoreLimit} points</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400 block">Time per Turn:</span>
                <span className="text-white font-bold">{settings.timePerTurn} seconds</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400 block">Teams:</span>
                <span className="text-white font-bold">{settings.teamMode}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400 block">Spectators:</span>
                <span className="text-white font-bold">{settings.allowSpectators ? 'Allowed' : 'Not Allowed'}</span>
              </div>
            </div>
          </motion.div>
          
          {/* Chat box */}
          <div className="bg-black bg-opacity-50 rounded-lg shadow-neon flex-1 flex flex-col">
            <h3 className="text-xl text-white font-bold p-4 border-b border-gray-800">LOBBY CHAT</h3>
            
            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto max-h-96 scrollbar-hide"
            >
              {chatMessages.map((msg, i) => (
                <div key={i} className="mb-3">
                  <span className={`font-bold ${
                    msg.sender === 'System' 
                      ? 'text-yellow-400' 
                      : playerSlots.find(p => p.name === msg.sender)?.primaryColor 
                        ? `text-[${playerSlots.find(p => p.name === msg.sender)?.primaryColor}]` 
                        : 'text-white'
                  }`}>
                    {msg.sender}:
                  </span>
                  <span className="text-gray-300 ml-2">{msg.message}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-800">
              <div className="flex">
                <input 
                  ref={chatInputRef}
                  type="text" 
                  placeholder="Type a message..." 
                  className="w-full bg-gray-800 text-white p-3 rounded-l focus:outline-none"
                  onKeyDown={sendMessage}
                />
                <motion.button 
                  className="bg-purple-700 text-white px-4 rounded-r"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (chatInputRef.current.value.trim()) {
                      const newMessage = {
                        sender: 'Viper',
                        message: chatInputRef.current.value.trim()
                      };
                      setChatMessages([...chatMessages, newMessage]);
                      chatInputRef.current.value = '';
                    }
                  }}
                >
                  Send
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Rules Modal */}
      <AnimatePresence>
        {isRulesOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg shadow-neon max-w-2xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl text-yellow-400 font-bold">HOKM GAME RULES</h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white"
                    onClick={() => setIsRulesOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <ol className="space-y-3">
                    {gameRules.map((rule, index) => (
                      <li key={index} className="flex text-gray-300">
                        <span className="text-yellow-400 mr-2">{index + 1}.</span> {rule}
                      </li>
                    ))}
                  </ol>
                  
                  <div className="mt-6 bg-gray-800 p-4 rounded-lg">
                    <h3 className="text-white font-bold mb-2">Card Rankings (Highest to Lowest)</h3>
                    <p className="text-gray-300">Ace, King, Queen, Jack, 10, 9, 8, 7, 6, 5, 4, 3, 2</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <motion.button 
                    className="px-8 py-3 bg-purple-700 text-white rounded-lg shadow-neon"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsRulesOpen(false)}
                  >
                    Got It
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      
      
      {/* Invite Friends Modal */}
      <AnimatePresence>
        {isInviteFriendsOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg shadow-neon max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl text-yellow-400 font-bold">INVITE FRIENDS</h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white"
                    onClick={() => setIsInviteFriendsOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search friends..."
                      className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto">
                    {friendsList.map(friend => (
                      <div 
                        key={friend.id} 
                        className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg mb-2"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden relative">
                            <img 
                              src={ImageService.getImage('character', friend.avatar)}
                              alt={friend.name} 
                              className="w-full h-full object-cover"
                            />
                            <div 
                              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-gray-900 ${
                                friend.status === 'online' ? 'bg-green-500' : 
                                friend.status === 'in-game' ? 'bg-blue-500' : 'bg-gray-500'
                              }`}
                            />
                          </div>
                          
                          <div className="ml-3">
                            <div className="text-white font-medium">{friend.name}</div>
                            <div className="text-xs text-gray-400">Level {friend.level}</div>
                          </div>
                        </div>
                        
                        <motion.button
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            invitedFriends.includes(friend.id)
                              ? 'bg-gray-700 text-gray-300'
                              : friend.status === 'offline'
                                ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                                : 'bg-purple-700 text-white'
                          }`}
                          whileHover={
                            !invitedFriends.includes(friend.id) && friend.status !== 'offline'
                              ? { scale: 1.05 }
                              : {}
                          }
                          whileTap={
                            !invitedFriends.includes(friend.id) && friend.status !== 'offline'
                              ? { scale: 0.95 }
                              : {}
                          }
                          onClick={() => {
                            if (friend.status !== 'offline' && !invitedFriends.includes(friend.id)) {
                              inviteFriend(friend.id);
                            }
                          }}
                          disabled={friend.status === 'offline' || invitedFriends.includes(friend.id)}
                        >
                          {invitedFriends.includes(friend.id) ? 'Invited' : (friend.status === 'offline' ? 'Offline' : 'Invite')}
                        </motion.button>
                      </div>
                    ))}
                  </div>
                  
                  {friendsList.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      No friends found. Add friends to play together!
                    </div>
                  )}
                </div>
                
                <div className="mt-6 flex justify-between">
                  <div className="text-sm text-gray-400">
                    {invitedFriends.length} friends invited
                  </div>
                  <motion.button 
                    className="px-6 py-2 bg-purple-700 text-white rounded-lg shadow-neon"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsInviteFriendsOpen(false)}
                  >
                    Done
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg shadow-neon max-w-2xl w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl text-yellow-400 font-bold">GAME SETTINGS</h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white"
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-4 space-y-4">
                  {/* Score Limit */}
                  <div>
                    <label className="block text-white font-bold mb-2">Score Limit</label>
                    <div className="flex gap-2">
                      {gameSettings.scoreLimits.map(limit => (
                        <motion.button
                          key={limit}
                          className={`px-4 py-2 rounded ${
                            settings.scoreLimit === limit
                              ? 'bg-purple-700 text-white'
                              : 'bg-gray-800 text-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateSetting('scoreLimit', limit)}
                        >
                          {limit} pts
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Time per Turn */}
                  <div>
                    <label className="block text-white font-bold mb-2">Time per Turn</label>
                    <div className="flex gap-2">
                      {gameSettings.timePerTurn.map(time => (
                        <motion.button
                          key={time}
                          className={`px-4 py-2 rounded ${
                            settings.timePerTurn === time
                              ? 'bg-purple-700 text-white'
                              : 'bg-gray-800 text-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateSetting('timePerTurn', time)}
                        >
                          {time}s
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Team Mode */}
                  <div>
                    <label className="block text-white font-bold mb-2">Team Mode</label>
                    <div className="flex gap-2">
                      {gameSettings.teamMode.map(mode => (
                        <motion.button
                          key={mode}
                          className={`px-4 py-2 rounded ${
                            settings.teamMode === mode
                              ? 'bg-purple-700 text-white'
                              : 'bg-gray-800 text-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateSetting('teamMode', mode)}
                        >
                          {mode}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Allow Spectators */}
                  <div>
                    <label className="block text-white font-bold mb-2">Allow Spectators</label>
                    <div className="flex gap-2">
                      {gameSettings.allowSpectators.map(value => (
                        <motion.button
                          key={value.toString()}
                          className={`px-4 py-2 rounded ${
                            settings.allowSpectators === value
                              ? 'bg-purple-700 text-white'
                              : 'bg-gray-800 text-gray-300'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => updateSetting('allowSpectators', value)}
                        >
                          {value ? 'Yes' : 'No'}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <motion.button 
                    className="px-8 py-3 bg-purple-700 text-white rounded-lg shadow-neon"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsSettingsOpen(false)}
                  >
                    Save Settings
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Player Profile Modal */}
      <AnimatePresence>
        {isProfileOpen && selectedPlayer && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg shadow-neon max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{ 
                background: `linear-gradient(135deg, ${selectedPlayer.secondaryColor}40, #0f172a)` 
              }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold" style={{ color: selectedPlayer.primaryColor }}>
                    PLAYER PROFILE
                  </h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-1/3">
                      <div 
                        className="w-full aspect-square rounded-lg overflow-hidden border-2"
                        style={{ borderColor: selectedPlayer.primaryColor }}
                      >
                        <img 
                          src={ImageService.getImage('character', getCharacterAvatar(selectedPlayer))}
                          alt={selectedPlayer.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="mt-3 bg-black bg-opacity-40 rounded p-2 text-center">
                        <span className="text-gray-400 text-xs block">LEVEL</span>
                        <span className="text-white text-xl font-bold">{selectedPlayer.level}</span>
                      </div>
                    </div>
                    
                    <div className="w-2/3">
                      <h3 className="text-white text-xl font-bold">{selectedPlayer.name}</h3>
                      <p 
                        className="text-sm font-semibold mt-1 mb-3"
                        style={{ color: selectedPlayer.primaryColor }}
                      >
                        {selectedPlayer.special}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="bg-black bg-opacity-40 p-2 rounded">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Win Rate:</span>
                            <span className="text-white">67%</span>
                          </div>
                        </div>
                        
                        <div className="bg-black bg-opacity-40 p-2 rounded">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Games Played:</span>
                            <span className="text-white">{46 + selectedPlayer.id * 10}</span>
                          </div>
                        </div>
                        
                        <div className="bg-black bg-opacity-40 p-2 rounded">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Preferred Card:</span>
                            <span className="text-white">{selectedPlayer.cardStyle}</span>
                          </div>
                        </div>
                        
                        <div className="bg-black bg-opacity-40 p-2 rounded">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Team:</span>
                            <span className="text-white">Team {selectedPlayer.team}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-white font-bold mb-2">Recent Games</h4>
                    <div className="bg-black bg-opacity-40 rounded p-2 space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Hokm Tournament Finals</span>
                        <span className="text-green-500">Won</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Persian Pro League</span>
                        <span className="text-red-500">Lost</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">Weekend Challenge</span>
                        <span className="text-green-500">Won</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <motion.button 
                    className="px-6 py-3 text-white rounded-lg shadow-neon"
                    style={{ backgroundColor: selectedPlayer.primaryColor }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Close
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

export default EnhancedHokmLobby;