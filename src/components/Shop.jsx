import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import EnhancedImageService from '../services/EnhancedImageService';

// Categories configuration
const shopCategories = [
  { id: 'featured', name: 'Featured', icon: '⭐' },
  { id: 'characters', name: 'Characters', icon: '👤' },
  { id: 'cardPacks', name: 'Card Packs', icon: '🃏' },
  { id: 'bundles', name: 'Bundles', icon: '🎁' },
  { id: 'backgrounds', name: 'Backgrounds', icon: '🖼️' },
  { id: 'pets', name: 'Pets', icon: '🐉' },
  { id: 'currency', name: 'Currency', icon: '💰' },
];

// Featured items with extra details for carousel
const featuredItems = [
  {
    id: 'nekko_master_bundle',
    name: 'Nekko Master Bundle',
    type: 'bundle',
    rarity: 'legendary',
    description: 'Become the ultimate Nekko Master with this exclusive bundle!',
    price: 2200,
    originalPrice: 3500,
    currency: 'gem',
    imageId: 'ekko_bundle',
    largeImage: true,
    shiny: true,
    onSale: true,
    new: false,
    limited: true,
    endDate: 'April 30, 2025',
    included: [
      { name: 'Nekko Character', type: 'character', imageId: 'ekko' },
      { name: 'Nekko Card Back', type: 'card', imageId: 'golden' },
      { name: 'Time Warped Background', type: 'background', imageId: 'zaun' },
      { name: 'Clock Guardian Pet', type: 'pet', imageId: 'dragon' }
    ]
  },
  {
    id: 'venomous_viper',
    name: 'Venomous Viper',
    type: 'character',
    rarity: 'epic',
    description: 'Master of stealth and poison cards, Viper gives you the edge on trick-taking games.',
    price: 1200,
    currency: 'gem',
    imageId: 'viper_bundle',
    largeImage: false,
    shiny: true,
    onSale: false,
    new: true,
    limited: false,
    abilities: [
      'Poison Tactics: Start with +1 card in trick-taking games',
      'Venom Strike: 10% chance to steal an opponent\'s trump card'
    ]
  },
  {
    id: 'golden_dragon_pet',
    name: 'Golden Dragon Pet',
    type: 'pet',
    rarity: 'legendary',
    description: 'This magnificent creature follows you across all games and brings luck in your matches!',
    price: 1500,
    currency: 'gem',
    imageId: 'pet_pack',
    largeImage: false,
    shiny: true,
    onSale: false,
    new: true,
    limited: true,
    endDate: 'May 15, 2025',
    features: [
      'Animated fire breathing effects',
      'Golden aura visual when winning',
      'Lucky charm: +5% better cards in draws'
    ]
  }
];

// Full shop inventory
const shopInventory = [
  // Characters
  { 
    id: 'jinx_character', 
    name: 'Jinx',
    type: 'character',
    category: 'characters',
    rarity: 'epic',
    description: 'Chaotic and unpredictable, perfect for bluffing games.',
    price: 850,
    currency: 'gem',
    imageId: 'jinx_bundle',
    onSale: false,
    new: false,
    abilities: ['Chaos Theory: Cards cost -5% in Poker', 'Mayhem: Can swap one card with random opponent']
  },
  { 
    id: 'caitlyn_character', 
    name: 'Caitlyn',
    type: 'character',
    category: 'characters',
    rarity: 'rare',
    description: 'Strategic and calculating, excellent for planning moves ahead.',
    price: 500,
    currency: 'coin',
    imageId: 'caitlyn',
    onSale: false,
    new: false,
    abilities: ['Tactical Sight: See one opponent card per game', 'Precision: 5% better accuracy in trick predictions']
  },
  { 
    id: 'vi_character', 
    name: 'Vi',
    type: 'character',
    category: 'characters',
    rarity: 'rare',
    description: 'Powerful and direct, brings strength to aggressive playstyles.',
    price: 500,
    currency: 'coin',
    imageId: 'vi',
    onSale: true,
    originalPrice: 750,
    new: false,
    abilities: ['Power Hand: +10% win chance when all-in', 'Enforcer: Can force one card trade per game']
  },
  
  // Card Packs
  { 
    id: 'neon_card_pack', 
    name: 'Neon Card Pack',
    type: 'cardPack',
    category: 'cardPacks',
    rarity: 'epic',
    description: 'Electrify your games with vibrant neon-styled cards.',
    price: 400,
    currency: 'coin',
    imageId: 'neon_pack',
    onSale: false,
    new: true,
    contents: ['5 Card Designs', '3 Card Backs', 'Animated Shuffle Effect']
  },
  { 
    id: 'arcane_card_pack', 
    name: 'Arcane Magic Pack',
    type: 'cardPack',
    category: 'cardPacks',
    rarity: 'rare',
    description: 'Mystical card designs with arcane runes and magical effects.',
    price: 350,
    currency: 'coin',
    imageId: 'arcane_pack',
    onSale: false,
    new: false,
    contents: ['4 Card Designs', '2 Card Backs', 'Magical Deal Animation']
  },
  { 
    id: 'golden_luxury_pack', 
    name: 'Golden Luxury Pack',
    type: 'cardPack',
    category: 'cardPacks',
    rarity: 'legendary',
    description: 'Premium golden cards with luxurious design. Show off your wealth!',
    price: 1000,
    currency: 'gem',
    imageId: 'gold_pack',
    onSale: true,
    originalPrice: 1500,
    new: false,
    contents: ['7 Gold-Plated Card Designs', '4 Premium Card Backs', 'Gold Shower Win Effect']
  },
  
  // Bundles
  { 
    id: 'starter_bundle', 
    name: 'Starter Bundle',
    type: 'bundle',
    category: 'bundles',
    rarity: 'uncommon',
    description: 'Perfect for new players! Get started with essential items at a discount.',
    price: 500,
    currency: 'coin',
    originalPrice: 1000,
    imageId: 'viper_bundle',
    onSale: true,
    new: false,
    included: [
      { name: 'Random Character', type: 'character' },
      { name: 'Basic Card Pack', type: 'cardPack' },
      { name: '500 Coins', type: 'currency' }
    ]
  },
  { 
    id: 'weekend_special', 
    name: 'Weekend Special',
    type: 'bundle',
    category: 'bundles',
    rarity: 'epic',
    description: 'Limited time weekend offer with exclusive items!',
    price: 1200,
    currency: 'gem',
    imageId: 'jinx_bundle',
    onSale: false,
    new: true,
    limited: true,
    endDate: 'Sunday',
    included: [
      { name: 'Weekend Warrior Character', type: 'character' },
      { name: 'Premium Card Pack', type: 'cardPack' },
      { name: 'Festive Background', type: 'background' },
      { name: '1000 Coins', type: 'currency' }
    ]
  },
  
  // Backgrounds
  { 
    id: 'piltover_bg', 
    name: 'Piltover City',
    type: 'background',
    category: 'backgrounds',
    rarity: 'rare',
    description: 'Elegant cityscape background with animated airships.',
    price: 300,
    currency: 'coin',
    imageId: 'piltover',
    onSale: false,
    new: false,
    features: ['Animated Details', 'Day/Night Cycle', 'Weather Effects']
  },
  { 
    id: 'void_bg', 
    name: 'The Void',
    type: 'background',
    category: 'backgrounds',
    rarity: 'epic',
    description: 'Mysterious void background with eerie animations and sounds.',
    price: 500,
    currency: 'gem',
    imageId: 'void',
    onSale: false,
    new: true,
    features: ['Dynamic Void Effects', 'Ambient Sound', 'Reactive to Game Events']
  },
  
  // Pets
  { 
    id: 'poro_pet', 
    name: 'Fluffy Poro',
    type: 'pet',
    category: 'pets',
    rarity: 'rare',
    description: 'Adorable companion that bounces around during your games.',
    price: 400,
    currency: 'coin',
    imageId: 'poro',
    onSale: false,
    new: false,
    features: ['Follows Cursor', 'Snack Animations', 'Victory Dance']
  },
  { 
    id: 'void_creature', 
    name: 'Void Creature',
    type: 'pet',
    category: 'pets',
    rarity: 'epic',
    description: 'Mysterious creature from the void that phases in and out of reality.',
    price: 650,
    currency: 'gem',
    imageId: 'void',
    onSale: true,
    originalPrice: 900,
    new: false,
    features: ['Portal Animations', 'Shadow Effects', 'Eerie Sound Effects']
  },
  
  // Currency
  { 
    id: 'coins_small', 
    name: 'Small Coin Pack',
    type: 'currency',
    category: 'currency',
    rarity: 'common',
    description: 'A small pack of coins to spend in the shop.',
    price: 99,
    currency: 'real',
    realPrice: '$0.99',
    imageId: 'coins',
    onSale: false,
    new: false,
    amount: 100
  },
  { 
    id: 'coins_medium', 
    name: 'Medium Coin Pack',
    type: 'currency',
    category: 'currency',
    rarity: 'common',
    description: 'A decent amount of coins with a small bonus.',
    price: 499,
    currency: 'real',
    realPrice: '$4.99',
    imageId: 'coins',
    onSale: false,
    new: false,
    amount: 550,
    bonus: 50
  },
  { 
    id: 'gems_small', 
    name: 'Small Gem Pack',
    type: 'currency',
    category: 'currency',
    rarity: 'rare',
    description: 'Premium currency for exclusive items.',
    price: 499,
    currency: 'real',
    realPrice: '$4.99',
    imageId: 'gems',
    onSale: false,
    new: false,
    amount: 500
  },
  { 
    id: 'gems_large', 
    name: 'Large Gem Pack',
    type: 'currency',
    category: 'currency',
    rarity: 'epic',
    description: 'Best value! Large gem pack with a significant bonus.',
    price: 1999,
    currency: 'real',
    realPrice: '$19.99',
    imageId: 'gems',
    onSale: true,
    originalPrice: 2499,
    originalRealPrice: '$24.99',
    new: false,
    amount: 2200,
    bonus: 200
  },
];
// Helper function to get rarity colors
const getRarityColors = (rarity) => {
  switch(rarity) {
    case 'common':
      return { bg: 'from-gray-500 to-gray-700', text: 'text-gray-300', border: 'border-gray-500', glow: 'shadow-gray-500/50' };
    case 'uncommon':
      return { bg: 'from-green-500 to-green-700', text: 'text-green-300', border: 'border-green-500', glow: 'shadow-green-500/50' };
    case 'rare':
      return { bg: 'from-blue-500 to-blue-800', text: 'text-blue-300', border: 'border-blue-500', glow: 'shadow-blue-500/50' };
    case 'epic':
      return { bg: 'from-purple-500 to-purple-900', text: 'text-purple-300', border: 'border-purple-500', glow: 'shadow-purple-500/50' };
    case 'legendary':
      return { bg: 'from-amber-400 to-amber-700', text: 'text-amber-300', border: 'border-amber-400', glow: 'shadow-amber-400/50' };
    default:
      return { bg: 'from-gray-500 to-gray-700', text: 'text-gray-300', border: 'border-gray-500', glow: 'shadow-gray-500/50' };
  }
};

// Main shop component
function Shop() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('featured');
  const [selectedItem, setSelectedItem] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [dailyItemsHours, setDailyItemsHours] = useState(23);
  const [dailyItemsMinutes, setDailyItemsMinutes] = useState(59);
  const [searchTerm, setSearchTerm] = useState('');
  const [showItemPreview, setShowItemPreview] = useState(false);
  
  // Mock user data (would normally come from a context/redux store)
  const [userData, setUserData] = useState({
    coins: 5000,
    gems: 800,
    level: 42,
    inventory: []
  });
  
  const shopRef = useRef(null);
  const featuredRef = useRef(null);
  
  // Handle category change with smooth scroll
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    
    // If we're on mobile, scroll to the section
    if (window.innerWidth < 768) {
      const element = document.getElementById(`section-${categoryId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };
  
  // Filter items by category and search term
  const filteredItems = shopInventory.filter(item => 
    (selectedCategory === 'featured' || item.category === selectedCategory) && 
    (searchTerm === '' || 
     item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Handle item purchase
  const handlePurchase = (item) => {
    let canPurchase = false;
    
    if (item.currency === 'coin' && userData.coins >= item.price) {
      setUserData({
        ...userData,
        coins: userData.coins - item.price,
        inventory: [...userData.inventory, item.id]
      });
      canPurchase = true;
    } else if (item.currency === 'gem' && userData.gems >= item.price) {
      setUserData({
        ...userData,
        gems: userData.gems - item.price,
        inventory: [...userData.inventory, item.id]
      });
      canPurchase = true;
    } else if (item.currency === 'real') {
      // In a real app, this would redirect to a payment processor
      alert(`Redirecting to payment gateway for ${item.realPrice}`);
    }
    
    if (canPurchase) {
      setPurchaseSuccess(true);
      setTimeout(() => {
        setPurchaseSuccess(false);
        setSelectedItem(null);
      }, 3000);
    }
  };
  
  // Daily timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (dailyItemsMinutes > 0) {
        setDailyItemsMinutes(dailyItemsMinutes - 1);
      } else if (dailyItemsHours > 0) {
        setDailyItemsHours(dailyItemsHours - 1);
        setDailyItemsMinutes(59);
      } else {
        // Reset to 24 hours when timer hits zero
        setDailyItemsHours(23);
        setDailyItemsMinutes(59);
        // In a real app, this would refresh the featured items
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(timer);
  }, [dailyItemsHours, dailyItemsMinutes]);
  
  // Preload item images on component mount
  useEffect(() => {
    // Preload featured items first
    featuredItems.forEach(item => {
      if (item.imageId) {
        EnhancedImageService.preloadImage('shopItem', item.imageId);
      }
      
      if (item.included) {
        item.included.forEach(includedItem => {
          if (includedItem.imageId && includedItem.type) {
            EnhancedImageService.preloadImage(includedItem.type, includedItem.imageId);
          }
        });
      }
    });
    
    // Then preload the rest of the inventory in the background
    shopInventory.forEach(item => {
      if (item.imageId) {
        EnhancedImageService.preloadImage('shopItem', item.imageId);
      }
    });
  }, []);

  // Scroll shop to top when category changes
  useEffect(() => {
    if (shopRef.current) {
      shopRef.current.scrollTop = 0;
    }
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-900 to-gray-900 text-white">
      {/* Particles for ambient effect */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 blur-[100px] opacity-30"></div>
        <div className="absolute top-1/3 -right-10 w-60 h-60 bg-blue-600 blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-40 bg-indigo-600 blur-[100px] opacity-20"></div>
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-purple-900 to-indigo-900 shadow-xl">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            {/* Left side - Navigation */}
            <div className="flex items-center space-x-2">
              <motion.button 
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <h1 className="text-2xl font-bold text-white hidden sm:block">ARCANE SHOP</h1>
            </div>
            
            {/* Center - Search bar (visible on larger screens) */}
            <div className="hidden md:block max-w-md w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full bg-gray-800 bg-opacity-90 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Right side - User info */}
            <div className="flex items-center space-x-3">
              {/* Currency displays */}
              <motion.div 
                className="flex items-center bg-gray-800 rounded-full px-3 py-1"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-yellow-400 mr-1">🪙</span>
                <span className="font-bold">{userData.coins.toLocaleString()}</span>
                <motion.button 
                  className="ml-1 w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center text-xs"
                  whileHover={{ scale: 1.2, backgroundColor: '#eab308' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedItem(shopInventory.find(item => item.id === 'coins_medium'))}
                >
                  +
                </motion.button>
              </motion.div>
              
              <motion.div 
                className="flex items-center bg-gray-800 rounded-full px-3 py-1"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-cyan-400 mr-1">💎</span>
                <span className="font-bold">{userData.gems.toLocaleString()}</span>
                <motion.button 
                  className="ml-1 w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center text-xs"
                  whileHover={{ scale: 1.2, backgroundColor: '#0891b2' }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedItem(shopInventory.find(item => item.id === 'gems_small'))}
                >
                  +
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </header>
      {/* Rotating Featured Items Banner */}
      <div className="relative overflow-hidden bg-black bg-opacity-30 border-b border-purple-800" ref={featuredRef}>
        {/* Daily refresh timer */}
        <div className="absolute top-4 right-4 z-10 bg-black bg-opacity-70 rounded-lg px-3 py-1 flex items-center space-x-2">
          <span className="text-yellow-400">🕒</span>
          <span className="text-white font-mono">
            {String(dailyItemsHours).padStart(2, '0')}:{String(dailyItemsMinutes).padStart(2, '0')}
          </span>
        </div>
        
        {/* Mobile search - only visible on small screens */}
        <div className="md:hidden p-3 bg-black bg-opacity-30">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-gray-800 bg-opacity-90 text-white pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="featured-carousel relative">
          {/* Featured item showcase */}
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredItems.map((item, index) => {
                const rarityStyle = getRarityColors(item.rarity);
                
                return (
                  <motion.div 
                    key={item.id}
                    className={`
                      relative overflow-hidden rounded-lg cursor-pointer
                      ${item.largeImage ? 'md:col-span-2 md:row-span-2' : ''}
                      bg-gradient-to-br ${rarityStyle.bg}
                      border ${rarityStyle.border}
                      ${item.shiny ? `shadow-lg ${rarityStyle.glow}` : ''}
                    `}
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: `0 0 20px 0 rgba(168, 85, 247, 0.5)` 
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedItem(item)}
                  >
                    {/* Item image with overlay gradient */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={EnhancedImageService.getImage('shopItem', item.imageId)}
                        alt={item.name}
                        className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
                      
                      {/* Shiny effect for legendary/special items */}
                      {item.shiny && (
                        <div className="absolute inset-0 opacity-20 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                      )}
                      
                      {/* Item badges (new, sale, etc.) */}
                      <div className="absolute top-0 left-0 flex flex-col items-start p-2 gap-1">
                        {item.new && (
                          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">NEW</span>
                        )}
                        {item.onSale && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">SALE</span>
                        )}
                        {item.limited && (
                          <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">LIMITED</span>
                        )}
                      </div>
                      
                      {/* Rarity indicator */}
                      <div className="absolute top-0 right-0 m-2">
                        <div className={`text-xs uppercase font-bold px-2 py-1 rounded bg-black bg-opacity-50 ${rarityStyle.text}`}>
                          {item.rarity}
                        </div>
                      </div>
                    </div>
                    
                    {/* Item details */}
                    <div className="p-4">
                      <h3 className="text-white font-bold text-lg">{item.name}</h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                      
                      {/* Price display */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          {item.onSale && (
                            <span className="text-gray-400 line-through text-sm mr-2">
                              {item.currency === 'coin' && <span>🪙 {item.originalPrice}</span>}
                              {item.currency === 'gem' && <span>💎 {item.originalPrice}</span>}
                              {item.currency === 'real' && <span>{item.originalRealPrice}</span>}
                            </span>
                          )}
                          
                          <span className="text-white font-bold flex items-center">
                            {item.currency === 'coin' && <span className="text-yellow-400"><span className="mr-1">🪙</span>{item.price}</span>}
                            {item.currency === 'gem' && <span className="text-cyan-400"><span className="mr-1">💎</span>{item.price}</span>}
                            {item.currency === 'real' && <span className="text-green-400">{item.realPrice}</span>}
                          </span>
                        </div>
                        
                        {/* Buy button */}
                        <motion.button
                          className="bg-purple-600 hover:bg-purple-500 text-white text-sm px-3 py-1 rounded-full font-bold"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePurchase(item);
                          }}
                        >
                          BUY
                        </motion.button>
                      </div>
                      
                      {/* Limited time indicator */}
                      {item.limited && item.endDate && (
                        <div className="mt-2 text-xs text-amber-400">
                          Available until: {item.endDate}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Category navigation */}
      <div className="sticky top-[57px] z-20 bg-gradient-to-r from-gray-900 to-indigo-900 shadow-md">
        <div className="container mx-auto">
          <div className="flex space-x-1 md:space-x-2 overflow-x-auto scrollbar-hide px-2 py-2">
            {shopCategories.map(category => (
              <motion.button
                key={category.id}
                className={`
                  whitespace-nowrap px-3 py-1.5 rounded-full font-medium text-sm md:text-base
                  ${selectedCategory === category.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCategoryChange(category.id)}
              >
                <span className="mr-1">{category.icon}</span>
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main shop content */}
      <div className="container mx-auto px-4 py-6" ref={shopRef}>
        {/* Featured Section */}
        {selectedCategory === 'featured' && (
          <div id="section-featured" className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <span className="mr-2">⭐</span>
              <span>Featured Items</span>
            </h2>
            
            {/* Already displayed in the carousel above */}
            <div className="text-gray-400 italic">Featured items are displayed above</div>
          </div>
        )}
        
        {/* Items grid with filtering by selected category */}
        <div 
          id={`section-${selectedCategory}`}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4`}
        >
          {filteredItems.map(item => {
            const rarityStyle = getRarityColors(item.rarity);
            
            return (
              <motion.div
                key={item.id}
                className={`
                  rounded-lg overflow-hidden cursor-pointer relative
                  bg-gray-900 border ${rarityStyle.border}
                  ${item.shiny ? `shadow-md ${rarityStyle.glow}` : ''}
                  transition-all duration-300
                `}
                whileHover={{ 
                  scale: 1.03,
                  y: -5,
                  boxShadow: `0 10px 20px 0 rgba(0, 0, 0, 0.2)` 
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedItem(item)}
              >
                {/* Rarity color strip at the top */}
                <div className={`h-1 w-full bg-gradient-to-r ${rarityStyle.bg}`}></div>
                
                {/* Item image */}
                <div className="relative">
                  <div className="aspect-square overflow-hidden bg-gray-800">
                    <img 
                      src={EnhancedImageService.getImage('shopItem', item.imageId)}
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  
                  {/* Overlay badges */}
                  <div className="absolute top-0 left-0 flex flex-col items-start p-2 gap-1">
                    {item.new && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>
                    )}
                    {item.onSale && (
                      <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">SALE</span>
                    )}
                    {item.limited && (
                      <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded">LIMITED</span>
                    )}
                  </div>
                  
                  {/* Rarity indicator */}
                  <div className="absolute top-0 right-0 m-2">
                    <div className={`text-xs uppercase font-bold px-2 py-0.5 rounded bg-black bg-opacity-70 ${rarityStyle.text}`}>
                      {item.rarity}
                    </div>
                  </div>
                </div>
                
                {/* Item details */}
                <div className="p-3">
                  <h3 className="font-bold text-white mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{item.description}</p>
                  
                  {/* Price display */}
                  <div className="flex justify-between items-center mt-auto">
                    <div className="flex items-center">
                      {item.onSale && (
                        <span className="text-gray-500 line-through text-xs mr-2">
                          {item.currency === 'coin' && <span>🪙 {item.originalPrice}</span>}
                          {item.currency === 'gem' && <span>💎 {item.originalPrice}</span>}
                          {item.currency === 'real' && <span>{item.originalRealPrice}</span>}
                        </span>
                      )}
                      
                      <span className="font-bold">
                        {item.currency === 'coin' && <span className="text-yellow-400 flex items-center"><span className="mr-1">🪙</span>{item.price}</span>}
                        {item.currency === 'gem' && <span className="text-cyan-400 flex items-center"><span className="mr-1">💎</span>{item.price}</span>}
                        {item.currency === 'real' && <span className="text-green-400">{item.realPrice}</span>}
                      </span>
                    </div>
                    
                    {/* Quick purchase button */}
                    <motion.button
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-2 py-1 rounded-full"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchase(item);
                      }}
                    >
                      BUY
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-300 mb-2">No items found</h3>
              <p className="text-gray-400">
                Try a different search term or category
              </p>
              {searchTerm && (
                <button 
                  className="mt-4 bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-full"
                  onClick={() => setSearchTerm('')}
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Item detail modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg overflow-hidden w-full max-w-4xl relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-1.5"
                onClick={() => setSelectedItem(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex flex-col md:flex-row">
                {/* Left side - Image preview */}
                <div className="w-full md:w-1/2 relative">
                  {/* Rarity banner */}
                  <div 
                    className={`
                      absolute top-0 left-0 right-0 py-1 px-4
                      bg-gradient-to-r ${getRarityColors(selectedItem.rarity).bg}
                      flex justify-between items-center
                    `}
                  >
                    <div className="flex items-center">
                      <span className="text-white font-bold uppercase text-sm">{selectedItem.rarity}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {selectedItem.new && (
                        <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>
                      )}
                      {selectedItem.onSale && (
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">SALE</span>
                      )}
                      {selectedItem.limited && (
                        <span className="bg-amber-600 text-white text-xs font-bold px-2 py-0.5 rounded">LIMITED</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Main image with parallax effect */}
                  <div className="aspect-square bg-gradient-to-b from-gray-800 to-gray-900 overflow-hidden relative">
                    <motion.div
                      className="w-full h-full flex items-center justify-center p-6"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img 
                        src={EnhancedImageService.getImage('shopItem', selectedItem.imageId)}
                        alt={selectedItem.name}
                        className="max-w-full max-h-full object-contain"
                      />
                      
                      {/* Shiny effect */}
                      {selectedItem.shiny && (
                        <div className="absolute inset-0 pointer-events-none">
                          <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
                          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                        </div>
                      )}
                    </motion.div>
                  </div>
                  
                  {/* 3D preview toggle button */}
                  <button 
                    className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2"
                    onClick={() => setShowItemPreview(true)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
                
                {/* Right side - Details */}
                <div className="w-full md:w-1/2 p-6 flex flex-col h-full">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedItem.name}</h2>
                  <p className="text-gray-300 mb-4">{selectedItem.description}</p>
                  
                  {/* Features list based on item type */}
                  {selectedItem.type === 'character' && selectedItem.abilities && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Special Abilities</h3>
                      <ul className="space-y-1">
                        {selectedItem.abilities.map((ability, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span className="text-gray-300">{ability}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {selectedItem.type === 'pet' && selectedItem.features && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Pet Features</h3>
                      <ul className="space-y-1">
                        {selectedItem.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span className="text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Bundle contents */}
                  {selectedItem.type === 'bundle' && selectedItem.included && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Bundle Contents</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedItem.included.map((item, index) => (
                          <div key={index} className="bg-gray-800 rounded-lg p-2 flex items-center">
                            {item.imageId ? (
                              <img 
                                src={EnhancedImageService.getImage(item.type, item.imageId)}
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded mr-2"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center mr-2">
                                {item.type === 'character' && <span>👤</span>}
                                {item.type === 'cardPack' && <span>🃏</span>}
                                {item.type === 'background' && <span>🖼️</span>}
                                {item.type === 'currency' && <span>💰</span>}
                                {item.type === 'pet' && <span>🐉</span>}
                              </div>
                            )}
                            <div>
                              <div className="text-white text-sm">{item.name}</div>
                              <div className="text-gray-400 text-xs capitalize">{item.type}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Card pack contents */}
                  {selectedItem.type === 'cardPack' && selectedItem.contents && (
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Pack Contents</h3>
                      <ul className="space-y-1">
                        {selectedItem.contents.map((content, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-purple-400 mr-2">•</span>
                            <span className="text-gray-300">{content}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Currency amount display */}
                  {selectedItem.type === 'currency' && (
                    <div className="mb-4 bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">Amount</h3>
                          <div className="text-2xl font-bold">
                            {selectedItem.currencyType === 'coin' ? (
                              <span className="text-yellow-400 flex items-center">
                                <span className="mr-1">🪙</span>{selectedItem.amount.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-cyan-400 flex items-center">
                                <span className="mr-1">💎</span>{selectedItem.amount.toLocaleString()}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {selectedItem.bonus > 0 && (
                          <div className="bg-green-800 rounded-lg p-3">
                            <div className="text-sm text-green-200">BONUS</div>
                            <div className="text-xl font-bold text-green-400">+{selectedItem.bonus}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Time-limited info */}
                  {selectedItem.limited && selectedItem.endDate && (
                    <div className="mb-4 bg-amber-900 bg-opacity-30 border border-amber-700 rounded-lg p-3">
                      <div className="flex items-center">
                        <span className="text-amber-400 mr-2">⏳</span>
                        <div>
                          <div className="text-amber-300 font-semibold">Limited Time Offer</div>
                          <div className="text-amber-400 text-sm">Available until: {selectedItem.endDate}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Purchase section */}
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-gray-400">Price:</div>
                      <div className="flex items-center">
                        {selectedItem.onSale && (
                          <span className="text-gray-500 line-through text-sm mr-3">
                            {selectedItem.currency === 'coin' && <span>🪙 {selectedItem.originalPrice}</span>}
                            {selectedItem.currency === 'gem' && <span>💎 {selectedItem.originalPrice}</span>}
                            {selectedItem.currency === 'real' && <span>{selectedItem.originalRealPrice}</span>}
                          </span>
                        )}
                        
                        <span className="text-2xl font-bold">
                          {selectedItem.currency === 'coin' && (
                            <span className="text-yellow-400 flex items-center">
                              <span className="mr-1">🪙</span>{selectedItem.price}
                            </span>
                          )}
                          {selectedItem.currency === 'gem' && (
                            <span className="text-cyan-400 flex items-center">
                              <span className="mr-1">💎</span>{selectedItem.price}
                            </span>
                          )}
                          {selectedItem.currency === 'real' && (
                            <span className="text-green-400">{selectedItem.realPrice}</span>
                          )}
                        </span>
                      </div>
                    </div>
                    
                    {/* Purchase button */}
                    <div className="flex space-x-2">
                      <button 
                        className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg py-3 px-4 flex-1"
                        onClick={() => setSelectedItem(null)}
                      >
                        CANCEL
                      </button>
                      
                      <motion.button 
                        className={`
                          rounded-lg py-3 px-4 flex-1 font-bold text-white
                          ${
                            (selectedItem.currency === 'coin' && userData.coins < selectedItem.price) ||
                            (selectedItem.currency === 'gem' && userData.gems < selectedItem.price)
                              ? 'bg-gray-600 opacity-50 cursor-not-allowed'
                              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
                          }
                        `}
                        whileHover={
                          (selectedItem.currency === 'coin' && userData.coins < selectedItem.price) ||
                          (selectedItem.currency === 'gem' && userData.gems < selectedItem.price)
                            ? {}
                            : { scale: 1.05 }
                        }
                        whileTap={
                          (selectedItem.currency === 'coin' && userData.coins < selectedItem.price) ||
                          (selectedItem.currency === 'gem' && userData.gems < selectedItem.price)
                            ? {}
                            : { scale: 0.98 }
                        }
                        onClick={() => handlePurchase(selectedItem)}
                        disabled={
                          (selectedItem.currency === 'coin' && userData.coins < selectedItem.price) ||
                          (selectedItem.currency === 'gem' && userData.gems < selectedItem.price)
                        }
                      >
                        {(selectedItem.currency === 'coin' && userData.coins < selectedItem.price) ||
                         (selectedItem.currency === 'gem' && userData.gems < selectedItem.price)
                          ? 'INSUFFICIENT FUNDS'
                          : 'PURCHASE NOW'}
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Item 3D preview modal */}
      <AnimatePresence>
        {showItemPreview && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowItemPreview(false)}
          >
            <motion.div 
              className="bg-gray-900 rounded-lg overflow-hidden w-full max-w-4xl aspect-video relative"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-1.5"
                onClick={() => setShowItemPreview(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* 3D preview content - Mock rotatable view */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative w-3/4 h-3/4 cursor-grab"
                  drag
                  dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                  whileTap={{ cursor: 'grabbing' }}
                >
                  <motion.img 
                    src={EnhancedImageService.getImage('shopItem', selectedItem?.imageId || 'default')}
                    alt={selectedItem?.name || 'Item preview'}
                    className="w-full h-full object-contain"
                    animate={{ rotateY: [0, 360] }}
                    transition={{ 
                      duration: 20,
                      ease: "linear",
                      repeat: Infinity
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-50 pointer-events-none"></div>
                </motion.div>
              </div>
              
              {/* Instructions */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 rounded-full px-4 py-2 text-white text-sm">
                Drag to rotate • Pinch to zoom
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Purchase success notification */}
      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div 
            className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 flex items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="bg-green-500 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <div className="font-bold">Purchase Successful!</div>
              <div className="text-sm">Item added to your inventory</div>
            </div>
            <button 
              className="ml-3 bg-green-700 p-1 rounded-full hover:bg-green-800"
              onClick={() => setPurchaseSuccess(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Footer */}
      <footer className="bg-black bg-opacity-60 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-3 md:mb-0">
              © 2025 Arcane Card Game. All rights reserved.
            </div>
            
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Fixed "Go to top" button - visible when scrolled down */}
      <button 
        className={`fixed bottom-4 right-4 bg-purple-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 ${
          purchaseSuccess ? 'bottom-20' : ''
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
      
      {/* Animation keyframes - in a real app these would be in the CSS file */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default Shop;