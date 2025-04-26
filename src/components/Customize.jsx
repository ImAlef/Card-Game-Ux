import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import ImageService from '../services/ImageService';

// Sample character customization options
const characters = [
  { id: 'viper', name: 'Viper', level: 15, maxLevel: 50, locked: false },
  { id: 'jinx', name: 'Jinx', level: 8, maxLevel: 50, locked: false },
  { id: 'ekko', name: 'Ekko', level: 3, maxLevel: 50, locked: false },
  { id: 'caitlyn', name: 'Caitlyn', level: 0, maxLevel: 50, locked: true },
  { id: 'jayce', name: 'Jayce', level: 0, maxLevel: 50, locked: true },
];

const cardStyles = [
  { id: 'neon', name: 'Neon Edge', unlockLevel: 5 },
  { id: 'golden', name: 'Golden Luxury', unlockLevel: 10 },
  { id: 'arcane', name: 'Arcane Magic', unlockLevel: 15, premium: true },
  { id: 'standard', name: 'Standard Card', unlockLevel: 1 },
];

const backgrounds = [
  { id: 'piltover', name: 'Piltover City', unlockLevel: 5 },
  { id: 'zaun', name: 'Zaun Underground', unlockLevel: 10 },
  { id: 'arcane', name: 'Arcane Energy', unlockLevel: 15, premium: true },
  { id: 'void', name: 'The Void', unlockLevel: 25, locked: true },
];

const pets = [
  { id: 'none', name: 'None', image: null },
  { id: 'dragon', name: 'Mini Dragon', unlockLevel: 20, premium: true },
  { id: 'poro', name: 'Poro', unlockLevel: 10 },
  { id: 'void', name: 'Void Creature', unlockLevel: 30, locked: true },
];

function Customize() {
  const [selectedCharacter, setSelectedCharacter] = useState(characters[0]);
  const [selectedCardStyle, setSelectedCardStyle] = useState(cardStyles[0]);
  const [selectedBackground, setSelectedBackground] = useState(backgrounds[0]);
  const [selectedPet, setSelectedPet] = useState(pets[0]);
  const [activeTab, setActiveTab] = useState('character');
  const [showPreview, setShowPreview] = useState(false);

  const handleCharacterSelect = (character) => {
    if (character.locked) return;
    setSelectedCharacter(character);
  };

  const handleCardStyleSelect = (style) => {
    if (style.locked || (style.unlockLevel > selectedCharacter.level)) return;
    setSelectedCardStyle(style);
  };
  
  const handleBackgroundSelect = (bg) => {
    if (bg.locked || (bg.unlockLevel > selectedCharacter.level)) return;
    setSelectedBackground(bg);
  };
  
  const handlePetSelect = (pet) => {
    if (pet.locked || (pet.unlockLevel > selectedCharacter.level && pet.id !== 'none')) return;
    setSelectedPet(pet);
  };
  
  const isItemUnlocked = (item) => {
    if (item.locked) return false;
    if (item.unlockLevel > selectedCharacter.level && item.id !== 'none') return false;
    return true;
  };

  return (
    <motion.div 
      className="min-h-screen bg-arcane flex flex-col relative overflow-hidden"
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.6 }}
    >
      {/* Background with selected style */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url(${ImageService.getImage('background', selectedBackground.id)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      
      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      {/* Header with back button */}
      <header className="p-4 flex justify-between items-center relative z-10">
        <Link to="/">
          <motion.button 
            className="bg-gray-800 bg-opacity-70 w-12 h-12 rounded-full flex items-center justify-center shadow-neon hover-glow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white text-xl">←</span>
          </motion.button>
        </Link>
        <h1 className="text-4xl text-yellow-400 font-bold">CHARACTER CUSTOMIZATION</h1>
        <motion.button 
          className="bg-purple-800 bg-opacity-70 px-6 py-2 rounded-lg shadow-neon hover-glow text-white font-bold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? "Back to Edit" : "Preview"}
        </motion.button>
      </header>

      {/* Main content */}
      <div className="flex-1 flex p-4 gap-6 relative z-10">
        {/* Character preview panel */}
        <AnimatePresence mode="wait">
          {showPreview ? (
            <motion.div 
              className="w-full flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="preview"
            >
              <div className="relative w-96 h-96 bg-black bg-opacity-50 rounded-2xl border-2 border-purple-500 shadow-neon overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                  <img 
                    src={ImageService.getImage('background', selectedBackground.id)} 
                    alt={selectedBackground.name} 
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                
                {/* Character */}
                <motion.div 
                  className="absolute top-0 bottom-0 left-0 right-0 flex justify-center"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <img 
                    src={ImageService.getImage('character', selectedCharacter.id)} 
                    alt={selectedCharacter.name} 
                    className="h-full max-w-full object-contain"
                  />
                </motion.div>
                
                {/* Card floating beside character */}
                <motion.div 
                  className="absolute top-1/3 right-10"
                  animate={{ 
                    y: [-5, 5, -5],
                    rotate: [-2, 2, -2],
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ repeat: Infinity, duration: 4 }}
                >
                  <img 
                    src={ImageService.getImage('card', selectedCardStyle.id)} 
                    alt={selectedCardStyle.name} 
                    className="h-40 shadow-neon rotate-6"
                  />
                </motion.div>
                
                {/* Pet if selected */}
                {selectedPet.id !== 'none' && (
                  <motion.div 
                    className="absolute bottom-10 left-10"
                    animate={{ 
                      y: [-3, 3, -3],
                      x: [-3, 0, -3],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                  >
                    <img 
                      src={ImageService.getImage('pet', selectedPet.id)} 
                      alt={selectedPet.name} 
                      className="h-20 w-20 object-contain"
                    />
                  </motion.div>
                )}
                
                {/* Character Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
                  <h2 className="text-2xl text-white font-bold">{selectedCharacter.name}</h2>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400 text-sm">Level {selectedCharacter.level}/{selectedCharacter.maxLevel}</span>
                    <span className="text-sm text-white">{selectedCardStyle.name} • {selectedBackground.name}</span>
                  </div>
                </div>
              </div>
              
              <motion.button 
                className="mt-8 px-10 py-3 bg-green-700 text-white font-bold rounded-lg shadow-neon hover-glow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SAVE & APPLY
              </motion.button>
            </motion.div>
          ) : (
            <motion.div 
              className="flex flex-1 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              key="editor"
            >
              {/* Left character preview panel */}
              <div className="w-1/3 bg-black bg-opacity-50 rounded-lg p-6 flex flex-col items-center shadow-neon">
                <div className="relative w-full h-96 overflow-hidden rounded-lg mb-4">
                  {/* Background */}
                  <div className="absolute inset-0">
                    <img 
                      src={ImageService.getImage('background', selectedBackground.id)} 
                      alt={selectedBackground.name} 
                      className="w-full h-full object-cover opacity-70"
                    />
                  </div>
                  
                  {/* Character */}
                  <motion.div 
                    className="absolute top-0 bottom-0 left-0 right-0 flex justify-center"
                    animate={{ y: [-5, 5, -5] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <img 
                      src={ImageService.getImage('character', selectedCharacter.id)} 
                      alt={selectedCharacter.name} 
                      className="h-full max-w-full object-contain"
                    />
                  </motion.div>
                  
                  {/* Pet if selected */}
                  {selectedPet.id !== 'none' && (
                    <motion.div 
                      className="absolute bottom-5 left-5"
                      animate={{ 
                        y: [-3, 3, -3],
                        x: [-3, 0, -3]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <img 
                        src={ImageService.getImage('pet', selectedPet.id)} 
                        alt={selectedPet.name} 
                        className="h-16 w-16 object-contain"
                      />
                    </motion.div>
                  )}
                </div>
                
                <h3 className="text-xl text-white font-bold">{selectedCharacter.name}</h3>
                <div className="w-full bg-gray-700 h-3 rounded-full mt-2 mb-1">
                  <div 
                    className="bg-yellow-500 h-full rounded-full" 
                    style={{ 
                      width: `${(selectedCharacter.level / selectedCharacter.maxLevel) * 100}%`,
                      boxShadow: '0 0 8px rgba(234, 179, 8, 0.8)' 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between w-full text-sm text-gray-300 mb-4">
                  <span>Level {selectedCharacter.level}</span>
                  <span>{selectedCharacter.maxLevel}</span>
                </div>
                
                <div className="flex justify-center space-x-2 mt-2">
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">CARD</p>
                    <img 
                      src={ImageService.getImage('card', selectedCardStyle.id)} 
                      alt={selectedCardStyle.name} 
                      className="h-20 w-auto mx-auto rounded shadow-sm"
                    />
                    <p className="text-white text-xs mt-1">{selectedCardStyle.name}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">BG</p>
                    <div className="h-20 w-20 overflow-hidden rounded shadow-sm">
                      <img 
                        src={ImageService.getImage('background', selectedBackground.id)} 
                        alt={selectedBackground.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="text-white text-xs mt-1">{selectedBackground.name}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-400 text-xs mb-1">PET</p>
                    <div className="h-20 w-20 rounded shadow-sm bg-gray-800 flex items-center justify-center">
                      {selectedPet.image ? (
                        <img 
                          src={ImageService.getImage('pet', selectedPet.id)} 
                          alt={selectedPet.name} 
                          className="h-16 w-16 object-contain"
                        />
                      ) : (
                        <span className="text-gray-500 text-xs">None</span>
                      )}
                    </div>
                    <p className="text-white text-xs mt-1">{selectedPet.name}</p>
                  </div>
                </div>
              </div>

              {/* Right customization options */}
              <div className="w-2/3 bg-black bg-opacity-50 rounded-lg p-6 shadow-neon">
                {/* Tabs */}
                <div className="flex border-b border-gray-700 mb-6">
                  {['character', 'card', 'background', 'pet'].map((tab) => (
                    <button
                      key={tab}
                      className={`px-6 py-3 font-bold ${
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

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === 'character' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      key="character-tab"
                      className="grid grid-cols-3 gap-4"
                    >
                      {characters.map((character) => (
                        <motion.div
                          key={character.id}
                          className={`relative rounded-lg overflow-hidden cursor-pointer ${
                            character.locked ? 'opacity-60' : ''
                          } ${
                            selectedCharacter.id === character.id
                              ? 'ring-2 ring-yellow-400 shadow-neon'
                              : 'hover:ring-1 hover:ring-purple-400'
                          }`}
                          whileHover={{ scale: character.locked ? 1 : 1.03 }}
                          whileTap={{ scale: character.locked ? 1 : 0.98 }}
                          onClick={() => handleCharacterSelect(character)}
                        >
                          <div className="h-64 bg-gray-800">
                            <img
                              src={ImageService.getImage('character', character.id)}
                              alt={character.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3 bg-gray-900">
                            <h4 className="text-white font-bold">{character.name}</h4>
                            <p className="text-gray-400 text-xs">Level {character.level}/{character.maxLevel}</p>
                          </div>
                          {character.locked && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="bg-black bg-opacity-70 p-2 rounded-full">
                                <span className="text-white text-2xl">🔒</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      key="card-tab"
                      className="grid grid-cols-4 gap-4"
                    >
                      {cardStyles.map((style) => (
                        <motion.div
                          key={style.id}
                          className={`relative rounded-lg overflow-hidden cursor-pointer ${
                            !isItemUnlocked(style) ? 'opacity-60' : ''
                          } ${
                            selectedCardStyle.id === style.id
                              ? 'ring-2 ring-yellow-400 shadow-neon'
                              : 'hover:ring-1 hover:ring-purple-400'
                          }`}
                          whileHover={{ scale: !isItemUnlocked(style) ? 1 : 1.05 }}
                          whileTap={{ scale: !isItemUnlocked(style) ? 1 : 0.97 }}
                          onClick={() => handleCardStyleSelect(style)}
                        >
                          <div className="h-48 bg-gray-800 flex items-center justify-center p-2">
                            <img
                              src={ImageService.getImage('card', style.id)}
                              alt={style.name}
                              className="h-full w-auto object-contain"
                            />
                          </div>
                          <div className="p-3 bg-gray-900">
                            <h4 className="text-white font-bold">{style.name}</h4>
                            {!style.locked && style.unlockLevel > selectedCharacter.level ? (
                              <p className="text-yellow-400 text-xs">Unlock at Level {style.unlockLevel}</p>
                            ) : (
                              <p className="text-gray-400 text-xs">
                                {style.premium ? '💎 Premium' : 'Standard'}
                              </p>
                            )}
                          </div>
                          {!isItemUnlocked(style) && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="bg-black bg-opacity-70 p-2 rounded-full">
                                <span className="text-white text-2xl">
                                  {style.locked ? '🔒' : style.premium ? '💎' : '⬆️'}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'background' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      key="background-tab"
                      className="grid grid-cols-3 gap-4"
                    >
                      {backgrounds.map((bg) => (
                        <motion.div
                          key={bg.id}
                          className={`relative rounded-lg overflow-hidden cursor-pointer ${
                            !isItemUnlocked(bg) ? 'opacity-60' : ''
                          } ${
                            selectedBackground.id === bg.id
                              ? 'ring-2 ring-yellow-400 shadow-neon'
                              : 'hover:ring-1 hover:ring-purple-400'
                          }`}
                          whileHover={{ scale: !isItemUnlocked(bg) ? 1 : 1.05 }}
                          whileTap={{ scale: !isItemUnlocked(bg) ? 1 : 0.97 }}
                          onClick={() => handleBackgroundSelect(bg)}
                        >
                          <div className="h-32 bg-gray-800">
                            <img
                              src={ImageService.getImage('background', bg.id)}
                              alt={bg.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-3 bg-gray-900">
                            <h4 className="text-white font-bold">{bg.name}</h4>
                            {!bg.locked && bg.unlockLevel > selectedCharacter.level ? (
                              <p className="text-yellow-400 text-xs">Unlock at Level {bg.unlockLevel}</p>
                            ) : (
                              <p className="text-gray-400 text-xs">
                                {bg.premium ? '💎 Premium' : 'Standard'}
                              </p>
                            )}
                          </div>
                          {!isItemUnlocked(bg) && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="bg-black bg-opacity-70 p-2 rounded-full">
                                <span className="text-white text-2xl">
                                  {bg.locked ? '🔒' : bg.premium ? '💎' : '⬆️'}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'pet' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      key="pet-tab"
                      className="grid grid-cols-4 gap-4"
                    >
                      {pets.map((pet) => (
                        <motion.div
                          key={pet.id}
                          className={`relative rounded-lg overflow-hidden cursor-pointer ${
                            pet.id !== 'none' && !isItemUnlocked(pet) ? 'opacity-60' : ''
                          } ${
                            selectedPet.id === pet.id
                              ? 'ring-2 ring-yellow-400 shadow-neon'
                              : 'hover:ring-1 hover:ring-purple-400'
                          }`}
                          whileHover={{ scale: pet.id !== 'none' && !isItemUnlocked(pet) ? 1 : 1.05 }}
                          whileTap={{ scale: pet.id !== 'none' && !isItemUnlocked(pet) ? 1 : 0.97 }}
                          onClick={() => handlePetSelect(pet)}
                        >
                          <div className="h-32 bg-gray-800 flex items-center justify-center">
                            {pet.id !== 'none' ? (
                              <img
                                src={ImageService.getImage('pet', pet.id)}
                                alt={pet.name}
                                className="h-24 w-24 object-contain"
                              />
                            ) : (
                              <span className="text-gray-500">No Pet</span>
                            )}
                          </div>
                          <div className="p-3 bg-gray-900">
                            <h4 className="text-white font-bold">{pet.name}</h4>
                            {pet.id !== 'none' && (
                              <>
                                {!pet.locked && pet.unlockLevel > selectedCharacter.level ? (
                                  <p className="text-yellow-400 text-xs">Unlock at Level {pet.unlockLevel}</p>
                                ) : (
                                  <p className="text-gray-400 text-xs">
                                    {pet.premium ? '💎 Premium' : 'Standard'}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                          {pet.id !== 'none' && !isItemUnlocked(pet) && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <div className="bg-black bg-opacity-70 p-2 rounded-full">
                                <span className="text-white text-2xl">
                                  {pet.locked ? '🔒' : pet.premium ? '💎' : '⬆️'}
                                </span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default Customize;