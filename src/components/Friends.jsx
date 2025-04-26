import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Friends() {
  const [friends] = useState([
    { id: 1, name: 'Friend 1', online: true },
    { id: 2, name: 'Friend 2', online: false },
    { id: 3, name: 'Friend 3', online: true },
    { id: 4, name: 'Friend 4', online: false },
  ]);

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center p-4 relative overflow-hidden"
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
      
      {/* Header & Navigation */}
      <header className="w-full flex justify-between items-center mb-6 z-10">
        <Link to="/">
          <motion.button 
            className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon hover-glow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white text-xl">←</span>
          </motion.button>
        </Link>
        <h1 className="text-4xl text-yellow-400 font-bold">Friends</h1>
        <div className="w-12"></div> {/* Spacer for balance */}
      </header>

      {/* Main content */}
      <div className="w-full max-w-md z-10">
        {/* Search box */}
        <div className="bg-gray-800 bg-opacity-80 rounded-lg p-2 mb-4 flex items-center">
          <input 
            type="text" 
            placeholder="Searching for friends..." 
            className="bg-transparent border-none outline-none text-white w-full px-2"
          />
          <button className="bg-purple-700 p-2 rounded-full">
            <span className="text-white">🔍</span>
          </button>
        </div>

        {/* Friends list */}
        <div className="space-y-3">
          {friends.map(friend => (
            <motion.div 
              key={friend.id} 
              className="bg-gray-800 bg-opacity-80 p-4 rounded-lg border border-purple-500 shadow-neon flex justify-between items-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                    👤
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${friend.online ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                </div>
                <div className="ml-3">
                  <p className="text-lg text-white">{friend.name}</p>
                  <p className="text-sm text-gray-400">{friend.online ? 'Online' : 'Offline'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <motion.button 
                  className="px-3 py-1 bg-purple-800 text-white rounded-lg hover-glow text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Invite
                </motion.button>
                <motion.button 
                  className="px-3 py-1 bg-blue-800 text-white rounded-lg hover-glow text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Message
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add friend button */}
        <motion.button 
          className="mt-6 w-full py-3 bg-green-700 text-white rounded-lg shadow-neon hover-glow flex items-center justify-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="mr-2">+</span>
          Add New Friend
        </motion.button>

        {/* Friend requests */}
        <div className="mt-8">
          <h2 className="text-2xl text-yellow-400 font-bold mb-4">Friend requests</h2>
          
          <div className="bg-gray-800 bg-opacity-80 p-4 rounded-lg border border-purple-500 shadow-neon flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl">
                👤
              </div>
              <div className="ml-3">
                <p className="text-lg text-white">New user</p>
                <p className="text-sm text-gray-400">Friend request</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <motion.button 
                className="px-3 py-1 bg-green-700 text-white rounded-lg hover-glow text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Accept
              </motion.button>
              <motion.button 
                className="px-3 py-1 bg-red-700 text-white rounded-lg hover-glow text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reject
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Friends;