import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Default settings
const defaultSettings = {
  account: {
    username: 'ArcanePlayer',
    email: 'player@example.com',
    language: 'en',
    region: 'global',
  },
  gameplay: {
    cardAnimation: true,
    tableEffects: true,
    fastPlay: false,
    autoPlay: false,
    showTimer: true,
    cardHints: true,
  },
  audio: {
    masterVolume: 80,
    musicVolume: 70,
    sfxVolume: 90,
    voiceVolume: 60,
    muteWhenInactive: true,
  },
  graphics: {
    quality: 'high',
    particleEffects: true,
    animationSpeed: 'normal',
    showFPS: false,
    reducedMotion: false,
  },
  notifications: {
    gameInvites: true,
    friendRequests: true,
    achievements: true,
    dailyRewards: true,
    promotions: false,
  },
  privacy: {
    showOnlineStatus: true,
    allowFriendRequests: true,
    allowGameInvites: true,
    allowDirectMessages: true,
    shareGameHistory: true,
  }
};

// Setting categories
const settingCategories = [
  { id: 'account', name: 'Account', icon: '👤' },
  { id: 'gameplay', name: 'Gameplay', icon: '🎮' },
  { id: 'audio', name: 'Audio', icon: '🔊' },
  { id: 'graphics', name: 'Graphics', icon: '🖼️' },
  { id: 'notifications', name: 'Notifications', icon: '🔔' },
  { id: 'privacy', name: 'Privacy', icon: '🔒' },
];

// Quality options
const qualityOptions = ['low', 'medium', 'high', 'ultra'];
const animationSpeedOptions = ['slow', 'normal', 'fast'];
const languageOptions = ['en', 'es', 'fr', 'de', 'ru', 'ar', 'ja', 'zh'];
const regionOptions = ['global', 'americas', 'europe', 'asia', 'oceania'];

function Settings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [activeCategory, setActiveCategory] = useState('account');
  const [isEditing, setIsEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  
  // Handle toggle settings
  const handleToggle = (category, setting) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: !settings[category][setting]
      }
    });
  };
  
  // Handle slider settings
  const handleSlider = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: parseInt(value)
      }
    });
  };
  
  // Handle select settings
  const handleSelect = (category, setting, value) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    });
  };
  
  // Start editing a text field
  const startEditing = (category, field, value) => {
    setIsEditing(true);
    setEditingField(`${category}.${field}`);
    setTempValue(value);
  };
  
  // Save edited value
  const saveEditing = (category, field) => {
    setSettings({
      ...settings,
      [category]: {
        ...settings[category],
        [field]: tempValue
      }
    });
    setIsEditing(false);
    setEditingField(null);
    setTempValue('');
  };
  
  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditingField(null);
    setTempValue('');
  };
  
  // Reset all settings to default
  const resetSettings = () => {
    setSettings(defaultSettings);
    setShowResetConfirm(false);
    // Show confirmation message
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };
  
  // Save settings
  const saveSettings = () => {
    // In a real app, this would send the settings to a server
    console.log('Settings saved:', settings);
    // Show confirmation message
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col"
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
          <h1 className="text-4xl text-yellow-400 font-bold">SETTINGS</h1>
        </div>
        
        <div className="flex gap-2">
          <motion.button 
            className="px-4 py-2 bg-red-700 text-white rounded-lg shadow-neon hover-glow flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowResetConfirm(true)}
          >
            <span className="text-sm">↺</span>
            Reset
          </motion.button>
          
          <motion.button 
            className="px-4 py-2 bg-green-700 text-white rounded-lg shadow-neon hover-glow flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveSettings}
          >
            <span className="text-sm">✓</span>
            Save
          </motion.button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="flex flex-col md:flex-row p-6 gap-6 z-10 flex-1">
        {/* Left sidebar - Categories */}
        <div className="md:w-1/4">
          <div className="bg-black bg-opacity-50 rounded-lg shadow-neon-subtle p-4">
            <h2 className="text-xl text-white font-bold mb-4">Categories</h2>
            
            <div className="space-y-2">
              {settingCategories.map((category) => (
                <motion.button
                  key={category.id}
                  className={`w-full flex items-center p-3 rounded-lg text-left ${
                    activeCategory === category.id
                      ? 'bg-purple-700 text-white shadow-neon'
                      : 'bg-gray-800 bg-opacity-70 text-gray-300 hover:bg-gray-700'
                  }`}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="text-2xl mr-3">{category.icon}</span>
                  <span>{category.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right content - Settings */}
        <div className="md:w-3/4">
          <div className="bg-black bg-opacity-50 rounded-lg shadow-neon p-6">
            <AnimatePresence mode="wait">
              {/* Account Settings */}
              {activeCategory === 'account' && (
                <motion.div
                  key="account-settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl text-white font-bold mb-6">Account Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Username</label>
                        {editingField === 'account.username' ? (
                          <div className="flex items-center">
                            <input 
                              type="text" 
                              className="bg-gray-700 text-white px-2 py-1 rounded mr-2"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                            />
                            <button 
                              className="text-green-400 hover:text-green-300 mr-2"
                              onClick={() => saveEditing('account', 'username')}
                            >
                              ✓
                            </button>
                            <button 
                              className="text-red-400 hover:text-red-300"
                              onClick={cancelEditing}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="text-gray-300 mr-2">{settings.account.username}</span>
                            <button 
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => startEditing('account', 'username', settings.account.username)}
                            >
                              ✎
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Email</label>
                        {editingField === 'account.email' ? (
                          <div className="flex items-center">
                            <input 
                              type="email" 
                              className="bg-gray-700 text-white px-2 py-1 rounded mr-2"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                            />
                            <button 
                              className="text-green-400 hover:text-green-300 mr-2"
                              onClick={() => saveEditing('account', 'email')}
                            >
                              ✓
                            </button>
                            <button 
                              className="text-red-400 hover:text-red-300"
                              onClick={cancelEditing}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <span className="text-gray-300 mr-2">{settings.account.email}</span>
                            <button 
                              className="text-blue-400 hover:text-blue-300"
                              onClick={() => startEditing('account', 'email', settings.account.email)}
                            >
                              ✎
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Language</label>
                        <select 
                          className="bg-gray-700 text-white px-2 py-1 rounded"
                          value={settings.account.language}
                          onChange={(e) => handleSelect('account', 'language', e.target.value)}
                        >
                          {languageOptions.map((lang) => (
                            <option key={lang} value={lang}>
                              {lang === 'en' ? 'English' : 
                               lang === 'es' ? 'Español' : 
                               lang === 'fr' ? 'Français' : 
                               lang === 'de' ? 'Deutsch' : 
                               lang === 'ru' ? 'Русский' : 
                               lang === 'ar' ? 'العربية' : 
                               lang === 'ja' ? '日本語' : 
                               lang === 'zh' ? '中文' : lang}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Region</label>
                        <select 
                          className="bg-gray-700 text-white px-2 py-1 rounded"
                          value={settings.account.region}
                          onChange={(e) => handleSelect('account', 'region', e.target.value)}
                        >
                          {regionOptions.map((region) => (
                            <option key={region} value={region}>
                              {region.charAt(0).toUpperCase() + region.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Password</label>
                        <button className="bg-blue-700 text-white px-3 py-1 rounded text-sm">
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Gameplay Settings */}
              {activeCategory === 'gameplay' && (
                <motion.div
                  key="gameplay-settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl text-white font-bold mb-6">Gameplay Settings</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.gameplay).map(([key, value]) => (
                      <div key={key} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <label className="text-white font-bold">
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, function(str){ return str.toUpperCase(); })}
                          </label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                            <input
                              type="checkbox"
                              id={`toggle-${key}`}
                              className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                              checked={value}
                              onChange={() => handleToggle('gameplay', key)}
                            />
                            <label
                              htmlFor={`toggle-${key}`}
                              className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                                value ? 'bg-purple-600' : 'bg-gray-700'
                              }`}
                            >
                              <span
                                className={`block h-6 w-6 rounded-full transform transition-transform duration-300 ease-in-out bg-white ${
                                  value ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              ></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Audio Settings */}
              {activeCategory === 'audio' && (
                <motion.div
                  key="audio-settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl text-white font-bold mb-6">Audio Settings</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.audio).filter(([key]) => key.includes('Volume')).map(([key, value]) => (
                      <div key={key} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-white font-bold">
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, function(str){ return str.toUpperCase(); })}
                          </label>
                          <span className="text-gray-300">{value}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) => handleSlider('audio', key, e.target.value)}
                          className="w-full"
                        />
                      </div>
                    ))}
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Mute When Inactive</label>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                          <input
                            type="checkbox"
                            id="toggle-muteWhenInactive"
                            className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                            checked={settings.audio.muteWhenInactive}
                            onChange={() => handleToggle('audio', 'muteWhenInactive')}
                          />
                          <label
                            htmlFor="toggle-muteWhenInactive"
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                              settings.audio.muteWhenInactive ? 'bg-purple-600' : 'bg-gray-700'
                            }`}
                          >
                            <span
                              className={`block h-6 w-6 rounded-full transform transition-transform duration-300 ease-in-out bg-white ${
                                settings.audio.muteWhenInactive ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Graphics Settings */}
              {activeCategory === 'graphics' && (
                <motion.div
                  key="graphics-settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl text-white font-bold mb-6">Graphics Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Quality</label>
                        <select 
                          className="bg-gray-700 text-white px-2 py-1 rounded"
                          value={settings.graphics.quality}
                          onChange={(e) => handleSelect('graphics', 'quality', e.target.value)}
                        >
                          {qualityOptions.map((quality) => (
                            <option key={quality} value={quality}>
                              {quality.charAt(0).toUpperCase() + quality.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Animation Speed</label>
                        <select 
                          className="bg-gray-700 text-white px-2 py-1 rounded"
                          value={settings.graphics.animationSpeed}
                          onChange={(e) => handleSelect('graphics', 'animationSpeed', e.target.value)}
                        >
                          {animationSpeedOptions.map((speed) => (
                            <option key={speed} value={speed}>
                              {speed.charAt(0).toUpperCase() + speed.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Particle Effects</label>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                          <input
                            type="checkbox"
                            id="toggle-particleEffects"
                            className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                            checked={settings.graphics.particleEffects}
                            onChange={() => handleToggle('graphics', 'particleEffects')}
                          />
                          <label
                            htmlFor="toggle-particleEffects"
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                              settings.graphics.particleEffects ? 'bg-purple-600' : 'bg-gray-700'
                            }`}
                          >
                            <span
                              className={`block h-6 w-6 rounded-full transform transition-transform duration-300 ease-in-out bg-white ${
                                settings.graphics.particleEffects ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Show FPS</label>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                          <input
                            type="checkbox"
                            id="toggle-showFPS"
                            className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                            checked={settings.graphics.showFPS}
                            onChange={() => handleToggle('graphics', 'showFPS')}
                          />
                          <label
                            htmlFor="toggle-showFPS"
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                              settings.graphics.showFPS ? 'bg-purple-600' : 'bg-gray-700'
                            }`}
                          >
                            <span
                              className={`block h-6 w-6 rounded-full transform transition-transform duration-300 ease-in-out bg-white ${
                                settings.graphics.showFPS ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Reduced Motion</label>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                          <input
                            type="checkbox"
                            id="toggle-reducedMotion"
                            className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                            checked={settings.graphics.reducedMotion}
                            onChange={() => handleToggle('graphics', 'reducedMotion')}
                          />
                          <label
                            htmlFor="toggle-reducedMotion"
                            className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                              settings.graphics.reducedMotion ? 'bg-purple-600' : 'bg-gray-700'
                            }`}
                          >
                            <span
                              className={`block h-6 w-6 rounded-full transform transition-transform duration-300 ease-in-out bg-white ${
                                settings.graphics.reducedMotion ? 'translate-x-6' : 'translate-x-0'
                              }`}
                            ></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {/* Notifications Settings */}
              {activeCategory === 'notifications' && (
                <motion.div
                  key="notifications-settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl text-white font-bold mb-6">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications).map(([key, value]) => (
                      <div key={key} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <label className="text-white font-bold">
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, function(str){ return str.toUpperCase(); })}
                          </label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                            <input
                              type="checkbox"
                              id={`toggle-${key}`}
                              className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                              checked={value}
                              onChange={() => handleToggle('notifications', key)}
                            />
                            <label
                              htmlFor={`toggle-${key}`}
                              className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                                value ? 'bg-purple-600' : 'bg-gray-700'
                              }`}
                            >
                              <span
                                className={`block h-6 w-6 rounded-full transform transition-transform duration-300 ease-in-out bg-white ${
                                  value ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              ></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Privacy Settings */}
              {activeCategory === 'privacy' && (
                <motion.div
                  key="privacy-settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl text-white font-bold mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.privacy).map(([key, value]) => (
                      <div key={key} className="bg-gray-800 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <label className="text-white font-bold">
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, function(str){ return str.toUpperCase(); })}
                          </label>
                          <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                            <input
                              type="checkbox"
                              id={`toggle-${key}`}
                              className="absolute w-6 h-6 opacity-0 z-10 cursor-pointer"
                              checked={value}
                              onChange={() => handleToggle('privacy', key)}
                            />
                            <label
                              htmlFor={`toggle-${key}`}
                              className={`block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-300 ease-in-out ${
                                value ? 'bg-purple-600' : 'bg-gray-700'
                              }`}
                            >
                              <span
                                className={`block h-6 w-6 rounded-full transform transition-transform duration-300 ease-in-out bg-white ${
                                  value ? 'translate-x-6' : 'translate-x-0'
                                }`}
                              ></span>
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <label className="text-white font-bold">Data Usage</label>
                        <button className="bg-blue-700 text-white px-3 py-1 rounded text-sm">
                          Manage Data
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">Manage how your data is used and stored</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Reset confirmation modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-gray-900 p-6 rounded-lg shadow-neon max-w-md w-full"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <h2 className="text-2xl text-yellow-400 font-bold mb-4">Reset Settings</h2>
              <p className="text-white mb-6">Are you sure you want to reset all settings to default? This action cannot be undone.</p>
              
              <div className="flex justify-end gap-4">
                <motion.button 
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </motion.button>
                
                <motion.button 
                  className="px-6 py-2 bg-red-700 text-white rounded-lg shadow-neon"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetSettings}
                >
                  Reset
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Save confirmation toast */}
      <AnimatePresence>
        {showSaveConfirm && (
          <motion.div 
            className="fixed bottom-4 right-4 bg-green-800 text-white p-4 rounded-lg shadow-neon flex items-center gap-3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold">Settings Saved</p>
              <p className="text-sm">Your settings have been updated successfully.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Settings;