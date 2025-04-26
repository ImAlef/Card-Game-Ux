import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function CharacterCustomize() {
  // Character states
  const [character, setCharacter] = useState({
    name: 'پلیر',
    level: 15,
    selectedSkin: 0,
    selectedBackground: 0,
    selectedCardDesign: 0,
    selectedPet: null,
  });
  
  // Available customization options
  const [customOptions, setCustomOptions] = useState({
    skins: [
      { id: 0, name: 'پوسته پایه', level: 1, image: 'https://via.placeholder.com/200x300?text=Base+Skin' },
      { id: 1, name: 'پوسته آرکین', level: 10, image: 'https://via.placeholder.com/200x300?text=Arcane+Skin', locked: false },
      { id: 2, name: 'پوسته نئون', level: 20, image: 'https://via.placeholder.com/200x300?text=Neon+Skin', locked: true },
    ],
    backgrounds: [
      { id: 0, name: 'بک‌گراند پایه', level: 1, image: 'https://via.placeholder.com/100x150?text=Base+BG' },
      { id: 1, name: 'بک‌گراند بنفش', level: 5, image: 'https://via.placeholder.com/100x150?text=Purple+BG', locked: false },
      { id: 2, name: 'بک‌گراند طلایی', level: 30, image: 'https://via.placeholder.com/100x150?text=Golden+BG', locked: true },
    ],
    cardDesigns: [
      { id: 0, name: 'طرح کارت پایه', level: 1, image: 'https://via.placeholder.com/100x150?text=Base+Card' },
      { id: 1, name: 'طرح کارت نئون', level: 15, image: 'https://via.placeholder.com/100x150?text=Neon+Card', locked: false },
      { id: 2, name: 'طرح کارت لاکچری', level: 25, image: 'https://via.placeholder.com/100x150?text=Luxury+Card', locked: true },
    ],
    pets: [
      { id: 0, name: 'اژدهای کوچک', level: 10, image: 'https://via.placeholder.com/100x100?text=Dragon+Pet', locked: false },
      { id: 1, name: 'روح آتش', level: 20, image: 'https://via.placeholder.com/100x100?text=Fire+Spirit', locked: true },
    ],
  });

  // Category state for customization tabs
  const [activeCategory, setActiveCategory] = useState('skins');
  
  // Preview animation variants
  const previewVariants = {
    idle: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Function to select a customization item
  const selectItem = (itemId, category) => {
    const categoryMap = {
      'skins': 'selectedSkin',
      'backgrounds': 'selectedBackground',
      'cardDesigns': 'selectedCardDesign',
      'pets': 'selectedPet',
    };
    
    setCharacter({
      ...character,
      [categoryMap[category]]: itemId
    });
  };
  
  // Function to check if item is available based on level
  const isItemAvailable = (item) => {
    return item.level <= character.level || !item.locked;
  };

  return (
    <motion.div className="min-h-screen bg-arcane flex flex-col items-center p-4 relative overflow-hidden"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
      
      {/* Header & Navigation */}
      <Link to="/" className="absolute top-4 left-4 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-neon hover-glow">
        بازگشت
      </Link>
      <h1 className="text-4xl text-yellow-400 font-bold mb-6">شخصی‌سازی کاراکتر</h1>
      
      {/* Main content area with preview and customization */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        
        {/* Preview section */}
        <div className="w-full md:w-1/3 bg-gray-900 bg-opacity-70 p-4 rounded-lg border border-purple-500 shadow-neon">
          <h2 className="text-2xl text-yellow-400 font-bold mb-4 text-center">پیش‌نمایش</h2>
          
          <div className="relative flex flex-col items-center">
            {/* Character preview */}
            <motion.div 
              className="relative mb-4" 
              variants={previewVariants}
              animate="idle"
            >
              <img 
                src={customOptions.skins[character.selectedSkin]?.image} 
                alt="Character" 
                className="w-40 h-64 object-cover rounded-lg border-2 border-purple-400"
              />
              
              {/* Background */}
              <div className="absolute inset-0 -z-10 opacity-50">
                <img 
                  src={customOptions.backgrounds[character.selectedBackground]?.image} 
                  alt="Background" 
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              
              {/* Pet (if selected) */}
              {character.selectedPet !== null && (
                <div className="absolute -bottom-4 -right-4">
                  <img 
                    src={customOptions.pets.find(pet => pet.id === character.selectedPet)?.image} 
                    alt="Pet" 
                    className="w-16 h-16 object-cover rounded-full border-2 border-yellow-400"
                  />
                </div>
              )}
            </motion.div>
            
            {/* Card preview */}
            <div className="mt-4">
              <img 
                src={customOptions.cardDesigns[character.selectedCardDesign]?.image} 
                alt="Card" 
                className="w-24 h-36 object-cover rounded border-2 border-purple-400"
              />
            </div>
            
            {/* Character info */}
            <div className="mt-4 text-center">
              <h3 className="text-xl text-white">{character.name}</h3>
              <p className="text-yellow-400 text-sm">لِوِل: {character.level}</p>
            </div>
          </div>
        </div>
        
        {/* Customization section */}
        <div className="w-full md:w-2/3 bg-gray-900 bg-opacity-70 p-4 rounded-lg border border-purple-500 shadow-neon">
          {/* Category tabs */}
          <div className="flex justify-center gap-2 mb-6">
            {Object.keys(customOptions).map(category => (
              <motion.button 
                key={category} 
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-2 rounded-lg text-white text-sm ${activeCategory === category ? 'bg-purple-700' : 'bg-gray-700'}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === 'skins' ? 'پوسته‌ها' : 
                 category === 'backgrounds' ? 'بک‌گراند‌ها' : 
                 category === 'cardDesigns' ? 'طرح کارت‌ها' : 'پت‌ها'}
              </motion.button>
            ))}
          </div>
          
          {/* Items grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {customOptions[activeCategory].map(item => (
              <motion.div 
                key={item.id}
                className={`relative bg-gray-800 p-3 rounded-lg cursor-pointer 
                  ${character[activeCategory === 'skins' ? 'selectedSkin' : 
                             activeCategory === 'backgrounds' ? 'selectedBackground' : 
                             activeCategory === 'cardDesigns' ? 'selectedCardDesign' : 'selectedPet'] === item.id 
                    ? 'border-2 border-yellow-400' 
                    : 'border border-purple-500'
                  } ${!isItemAvailable(item) ? 'opacity-50' : ''}`}
                whileHover={{ scale: isItemAvailable(item) ? 1.05 : 1 }}
                whileTap={{ scale: isItemAvailable(item) ? 0.95 : 1 }}
                onClick={() => isItemAvailable(item) && selectItem(item.id, activeCategory)}
              >
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <h4 className="text-sm text-white font-medium truncate">{item.name}</h4>
                <p className="text-yellow-400 text-xs">لِوِل: {item.level}</p>
                
                {/* Lock overlay for unavailable items */}
                {!isItemAvailable(item) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🔒</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Save button */}
      <motion.button 
        className="mt-6 px-8 py-3 bg-purple-800 text-white text-lg rounded-lg shadow-neon hover-glow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ذخیره تغییرات
      </motion.button>
    </motion.div>
  );
}

export default CharacterCustomize;