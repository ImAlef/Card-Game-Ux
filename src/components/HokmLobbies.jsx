import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import ImageService from '../services/ImageService';

// Sample lobbies data
const sampleLobbies = [
  {
    id: 'lobby-1',
    name: 'Pro Players Only',
    host: 'Arcane Master',
    hostLevel: 42,
    hostCharacter: 'Jinx',
    players: 2,
    maxPlayers: 4,
    isPrivate: false,
    settings: {
      scoreLimit: 7,
      timePerTurn: 15
    }
  },
  {
    id: 'lobby-2',
    name: 'Beginners Welcome',
    host: 'Card Shark',
    hostLevel: 18,
    hostCharacter: 'Ekko',
    players: 1,
    maxPlayers: 4,
    isPrivate: false,
    settings: {
      scoreLimit: 10,
      timePerTurn: 20
    }
  },
  {
    id: 'lobby-3',
    name: 'Fast Games',
    host: 'SpeedMaster',
    hostLevel: 36,
    hostCharacter: 'Caitlyn',
    players: 3,
    maxPlayers: 4,
    isPrivate: false,
    settings: {
      scoreLimit: 5,
      timePerTurn: 10
    }
  },
  {
    id: 'lobby-4',
    name: 'Tournament Practice',
    host: 'ProPlayer99',
    hostLevel: 67,
    hostCharacter: 'Jayce',
    players: 2,
    maxPlayers: 4,
    isPrivate: true,
    settings: {
      scoreLimit: 15,
      timePerTurn: 30
    }
  },
  {
    id: 'lobby-5',
    name: 'Casual Play',
    host: 'ChillGamer',
    hostLevel: 25,
    hostCharacter: 'Vi',
    players: 1,
    maxPlayers: 4,
    isPrivate: false,
    settings: {
      scoreLimit: 7,
      timePerTurn: 20
    }
  }
];

function HokmLobbies() {
  const [lobbies, setLobbies] = useState(sampleLobbies);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinPassword, setJoinPassword] = useState('');
  const [selectedLobby, setSelectedLobby] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [filterOption, setFilterOption] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  
  // Filter lobbies based on selected option and search query
  const filteredLobbies = lobbies.filter(lobby => {
    // Apply filter option
    if (filterOption === 'available' && lobby.players >= lobby.maxPlayers) return false;
    if (filterOption === 'public' && lobby.isPrivate) return false;
    
    // Apply search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        lobby.name.toLowerCase().includes(query) || 
        lobby.host.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  // Handle join lobby
  const handleJoinLobby = (lobby) => {
    if (lobby.isPrivate) {
      setSelectedLobby(lobby);
      setShowPasswordModal(true);
    } else {
      // Navigate to lobby
      navigate(`/hokm-lobby/${lobby.id}`);
    }
  };
  
  // Handle password submission
  const handlePasswordSubmit = () => {
    // In a real app, you would verify the password here
    if (joinPassword === '1234') {
      setShowPasswordModal(false);
      navigate(`/hokm-lobby/${selectedLobby.id}`);
    } else {
      alert('Incorrect password');
    }
  };
  
  // Create lobby settings
  const [newLobby, setNewLobby] = useState({
    name: 'My Hokm Lobby',
    isPrivate: false,
    password: '',
    scoreLimit: 7,
    timePerTurn: 15,
    allowSpectators: true,
    teamMode: 'Fixed Partners'
  });
  
  // Handle create lobby submission
  const handleCreateLobby = () => {
    // In a real app, you would send this to the server
    const createdLobby = {
      id: `lobby-${Date.now()}`,
      name: newLobby.name,
      host: 'Player One', // Current user
      hostLevel: 25,
      hostCharacter: 'Viper',
      players: 1,
      maxPlayers: 4,
      isPrivate: newLobby.isPrivate,
      settings: {
        scoreLimit: newLobby.scoreLimit,
        timePerTurn: newLobby.timePerTurn
      }
    };
    
    setLobbies([createdLobby, ...lobbies]);
    setShowCreateModal(false);
    navigate(`/hokm-lobby/${createdLobby.id}`);
  };
  
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
      
      {/* Header */}
      <header className="p-4 flex justify-between items-center z-10 bg-black bg-opacity-50">
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
          <h1 className="text-4xl text-yellow-400 font-bold">HOKM LOBBIES</h1>
        </div>
        
        <div className="flex gap-3">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search lobbies..."
              className="bg-gray-800 text-white px-4 py-3 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>
          
          {/* Create Lobby Button */}
          <motion.button 
            className="px-6 py-3 bg-green-700 rounded-lg text-white shadow-neon hover-glow flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
          >
            <span className="text-lg">+</span>
            Create Lobby
          </motion.button>
          
          {/* Lobby Filters */}
          <div className="flex rounded-lg overflow-hidden">
            <button 
              className={`px-4 py-2 ${filterOption === 'all' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300'}`}
              onClick={() => setFilterOption('all')}
            >
              All
            </button>
            <button 
              className={`px-4 py-2 ${filterOption === 'available' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300'}`}
              onClick={() => setFilterOption('available')}
            >
              Available
            </button>
            <button 
              className={`px-4 py-2 ${filterOption === 'public' ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300'}`}
              onClick={() => setFilterOption('public')}
            >
              Public
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex-1 p-6 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLobbies.map((lobby) => (
            <motion.div 
              key={lobby.id}
              className="bg-black bg-opacity-50 rounded-lg overflow-hidden shadow-neon"
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                <div>
                  <h3 className="text-xl text-white font-bold">{lobby.name}</h3>
                  <p className="text-gray-400 text-sm">Hosted by {lobby.host}</p>
                </div>
                {lobby.isPrivate && (
                  <span className="bg-yellow-900 text-yellow-300 text-xs px-2 py-1 rounded flex items-center">
                    <span className="mr-1">🔒</span> Private
                  </span>
                )}
              </div>
              
              <div className="p-5 flex">
                <div className="w-1/4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500">
                    <img 
                      src={ImageService.getImage('character', lobby.hostCharacter.toLowerCase())} 
                      alt={lobby.hostCharacter} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="w-3/4">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                    <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                      <span className="text-gray-400 block">Players:</span>
                      <span className="text-white">{lobby.players}/{lobby.maxPlayers}</span>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                      <span className="text-gray-400 block">Score Limit:</span>
                      <span className="text-white">{lobby.settings.scoreLimit}</span>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                      <span className="text-gray-400 block">Time/Turn:</span>
                      <span className="text-white">{lobby.settings.timePerTurn}s</span>
                    </div>
                    <div className="bg-gray-800 bg-opacity-50 p-2 rounded">
                      <span className="text-gray-400 block">Host Level:</span>
                      <span className="text-white">{lobby.hostLevel}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-900 flex justify-between items-center">
                <div className="flex">
                  {Array.from({ length: lobby.players }).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-green-700 border-2 border-black -ml-2 first:ml-0 flex items-center justify-center text-xs text-white">
                      {i === 0 ? 'H' : i+1}
                    </div>
                  ))}
                  {Array.from({ length: lobby.maxPlayers - lobby.players }).map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-700 border-2 border-black -ml-2 flex items-center justify-center text-xs text-white">
                      {i + lobby.players + 1}
                    </div>
                  ))}
                </div>
                
                <motion.button 
                  className={`px-4 py-2 rounded ${lobby.players < lobby.maxPlayers ? 'bg-purple-700 text-white' : 'bg-gray-700 text-gray-300 cursor-not-allowed'}`}
                  whileHover={lobby.players < lobby.maxPlayers ? { scale: 1.05 } : {}}
                  whileTap={lobby.players < lobby.maxPlayers ? { scale: 0.95 } : {}}
                  onClick={() => lobby.players < lobby.maxPlayers && handleJoinLobby(lobby)}
                  disabled={lobby.players >= lobby.maxPlayers}
                >
                  {lobby.players < lobby.maxPlayers ? 'Join' : 'Full'}
                </motion.button>
              </div>
            </motion.div>
          ))}
          
          {filteredLobbies.length === 0 && (
            <motion.div 
              className="col-span-full bg-black bg-opacity-30 rounded-lg p-10 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-4xl mb-4">🃏</div>
              <h3 className="text-2xl text-gray-400 mb-4">No lobbies found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or create your own lobby</p>
              <motion.button 
                className="px-6 py-3 bg-purple-700 rounded-lg text-white shadow-neon hover-glow inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
              >
                <span className="text-lg">+</span>
                Create New Lobby
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Create Lobby Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
                  <h2 className="text-2xl text-yellow-400 font-bold">CREATE HOKM LOBBY</h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white"
                    onClick={() => setShowCreateModal(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-4 space-y-4">
                  {/* Lobby Name */}
                  <div>
                    <label className="block text-white font-bold mb-2">Lobby Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={newLobby.name}
                      onChange={(e) => setNewLobby({...newLobby, name: e.target.value})}
                    />
                  </div>
                  
                  {/* Privacy Setting */}
                  <div>
                    <label className="block text-white font-bold mb-2">Privacy</label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="public" 
                          className="mr-2" 
                          checked={!newLobby.isPrivate}
                          onChange={() => setNewLobby({...newLobby, isPrivate: false})}
                        />
                        <label htmlFor="public" className="text-white">Public</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="private" 
                          className="mr-2" 
                          checked={newLobby.isPrivate}
                          onChange={() => setNewLobby({...newLobby, isPrivate: true})}
                        />
                        <label htmlFor="private" className="text-white">Private</label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Password (if private) */}
                  {newLobby.isPrivate && (
                    <div>
                      <label className="block text-white font-bold mb-2">Password</label>
                      <input 
                        type="password" 
                        className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={newLobby.password}
                        onChange={(e) => setNewLobby({...newLobby, password: e.target.value})}
                      />
                    </div>
                  )}
                  
                  {/* Game Settings */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-bold mb-2">Score Limit</label>
                      <select 
                        className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={newLobby.scoreLimit}
                        onChange={(e) => setNewLobby({...newLobby, scoreLimit: parseInt(e.target.value)})}
                      >
                        <option value="7">7 points</option>
                        <option value="10">10 points</option>
                        <option value="15">15 points</option>
                        <option value="20">20 points</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-bold mb-2">Time per Turn</label>
                      <select 
                        className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={newLobby.timePerTurn}
                        onChange={(e) => setNewLobby({...newLobby, timePerTurn: parseInt(e.target.value)})}
                      >
                        <option value="10">10 seconds</option>
                        <option value="15">15 seconds</option>
                        <option value="20">20 seconds</option>
                        <option value="30">30 seconds</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-bold mb-2">Allow Spectators</label>
                      <div className="flex gap-4">
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="allow" 
                            className="mr-2" 
                            checked={newLobby.allowSpectators}
                            onChange={() => setNewLobby({...newLobby, allowSpectators: true})}
                          />
                          <label htmlFor="allow" className="text-white">Yes</label>
                        </div>
                        <div className="flex items-center">
                          <input 
                            type="radio" 
                            id="disallow" 
                            className="mr-2" 
                            checked={!newLobby.allowSpectators}
                            onChange={() => setNewLobby({...newLobby, allowSpectators: false})}
                          />
                          <label htmlFor="disallow" className="text-white">No</label>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white font-bold mb-2">Team Mode</label>
                      <select 
                        className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                        value={newLobby.teamMode}
                        onChange={(e) => setNewLobby({...newLobby, teamMode: e.target.value})}
                      >
                        <option value="Fixed Partners">Fixed Partners</option>
                        <option value="Random Teams">Random Teams</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <motion.button 
                    className="px-8 py-3 bg-purple-700 text-white rounded-lg shadow-neon"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateLobby}
                  >
                    Create Lobby
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
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
                  <h2 className="text-2xl text-yellow-400 font-bold">PRIVATE LOBBY</h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-4">
                  <p className="text-white mb-4">This lobby requires a password to join.</p>
                  
                  <div className="mb-4">
                    <label className="block text-white font-bold mb-2">Password</label>
                    <input 
                      type="password" 
                      className="w-full bg-gray-800 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={joinPassword}
                      onChange={(e) => setJoinPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <motion.button 
                      className="px-8 py-3 bg-purple-700 text-white rounded-lg shadow-neon"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePasswordSubmit}
                    >
                      Join Lobby
                    </motion.button>
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

export default HokmLobbies;