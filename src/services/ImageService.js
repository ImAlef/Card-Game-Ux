// src/services/ImageService.js
// This service creates programmatic SVG images to ensure accessibility

// Helper function to create SVG data URIs
const createSvgDataUri = (svgContent) => {
    const encodedSvg = encodeURIComponent(svgContent);
    return `data:image/svg+xml;utf8,${encodedSvg}`;
  };
  
  // Create a character avatar SVG
  const createCharacterAvatar = (name, color1 = '#6d28d9', color2 = '#4c1d95') => {
    // Get first letter of name for the avatar
    const initial = name.charAt(0).toUpperCase();
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="15" flood-color="#c084fc" flood-opacity="0.7"/>
        </filter>
      </defs>
      <rect width="300" height="400" fill="url(#grad)" />
      <circle cx="150" cy="140" r="80" fill="#0f172a" />
      <text x="150" y="170" font-family="Arial" font-size="100" text-anchor="middle" fill="#eab308" filter="url(#shadow)">${initial}</text>
      <rect x="70" y="260" width="160" height="40" rx="20" fill="#0f172a" />
      <text x="150" y="288" font-family="Arial" font-size="24" text-anchor="middle" fill="#e5e7eb">${name}</text>
      <path d="M20,380 L280,380 L260,400 L40,400 Z" fill="#0f172a" />
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Create a card design SVG
  const createCardDesign = (name, color1 = '#6d28d9', color2 = '#1e40af', pattern = 'hexagon') => {
    let patternDef = '';
    let patternUse = '';
    
    if (pattern === 'hexagon') {
      patternDef = `<pattern id="hexagons" width="50" height="50" patternUnits="userSpaceOnUse" patternTransform="scale(0.6)">
        <path d="M25,0 L50,25 L25,50 L0,25 Z" fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.3" />
      </pattern>`;
      patternUse = `<rect width="200" height="300" fill="url(#hexagons)" />`;
    } else if (pattern === 'circles') {
      patternDef = `<pattern id="circles" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="20" cy="20" r="10" fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.3" />
      </pattern>`;
      patternUse = `<rect width="200" height="300" fill="url(#circles)" />`;
    } else if (pattern === 'grid') {
      patternDef = `<pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M0,0 L20,0 L20,20 L0,20 Z" fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.3" />
      </pattern>`;
      patternUse = `<rect width="200" height="300" fill="url(#grid)" />`;
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
      <defs>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#c084fc" flood-opacity="0.7"/>
        </filter>
        ${patternDef}
      </defs>
      <rect width="200" height="300" rx="10" fill="url(#cardGrad)" filter="url(#cardShadow)" />
      ${patternUse}
      <circle cx="100" cy="70" r="30" fill="#eab308" opacity="0.7" />
      <text x="100" y="160" font-family="Arial" font-size="18" text-anchor="middle" fill="#f8fafc">${name}</text>
      <rect x="30" y="230" width="140" height="30" rx="15" fill="#0f172a" opacity="0.7" />
      <text x="100" y="250" font-family="Arial" font-size="12" text-anchor="middle" fill="#e5e7eb">ARCANE CARDS</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Create a playing card SVG
  const createPlayingCard = (suit, value, color = '#f8fafc') => {
    let suitSymbol;
    let suitColor;
    
    switch(suit) {
      case 'H':
        suitSymbol = '♥';
        suitColor = '#ef4444'; // red
        break;
      case 'D':
        suitSymbol = '♦';
        suitColor = '#ef4444'; // red
        break;
      case 'C':
        suitSymbol = '♣';
        suitColor = '#0f172a'; // black
        break;
      case 'S':
        suitSymbol = '♠';
        suitColor = '#0f172a'; // black
        break;
      default:
        suitSymbol = '★';
        suitColor = '#eab308'; // gold for default/joker
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
      <defs>
        <filter id="cardShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#94a3b8" flood-opacity="0.5"/>
        </filter>
      </defs>
      <rect width="200" height="280" rx="10" fill="${color}" filter="url(#cardShadow)" />
      <rect x="10" y="10" width="180" height="260" rx="5" fill="none" stroke="#6366f1" stroke-width="2" />
      
      <text x="30" y="50" font-family="Arial" font-size="40" fill="${suitColor}">${value}</text>
      <text x="30" y="90" font-family="Arial" font-size="40" fill="${suitColor}">${suitSymbol}</text>
      
      <text x="170" y="230" font-family="Arial" font-size="40" fill="${suitColor}" text-anchor="end">${value}</text>
      <text x="170" y="270" font-family="Arial" font-size="40" fill="${suitColor}" text-anchor="end">${suitSymbol}</text>
      
      <text x="100" y="160" font-family="Arial" font-size="80" text-anchor="middle" fill="${suitColor}">${suitSymbol}</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Create a card back SVG
  const createCardBack = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
      <defs>
        <linearGradient id="backGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4c1d95;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
        <pattern id="cardPattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="url(#backGrad)"/>
          <path d="M0,0 L20,20 M20,0 L0,20" stroke="#a78bfa" stroke-width="1" opacity="0.3" />
        </pattern>
      </defs>
      <rect width="200" height="280" rx="10" fill="url(#cardPattern)" />
      <rect x="15" y="15" width="170" height="250" rx="5" fill="none" stroke="#eab308" stroke-width="2" />
      <circle cx="100" cy="140" r="50" fill="none" stroke="#eab308" stroke-width="2" />
      <text x="100" y="160" font-family="Arial" font-size="40" text-anchor="middle" fill="#eab308">A</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Create a game mode background SVG
  const createGameModeBg = (name, color1 = '#4c1d95', color2 = '#1e3a8a') => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="modeBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="bgGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <rect width="600" height="400" fill="url(#modeBgGrad)" />
      
      <!-- Random particles for background effect -->
      <circle cx="100" cy="80" r="5" fill="#a78bfa" opacity="0.6" />
      <circle cx="200" cy="150" r="7" fill="#a78bfa" opacity="0.4" />
      <circle cx="450" cy="60" r="4" fill="#eab308" opacity="0.5" />
      <circle cx="500" cy="200" r="6" fill="#a78bfa" opacity="0.6" />
      <circle cx="300" cy="300" r="8" fill="#eab308" opacity="0.4" />
      <circle cx="150" cy="250" r="5" fill="#eab308" opacity="0.5" />
      
      <!-- Game mode name -->
      <text x="300" y="200" font-family="Arial" font-size="60" font-weight="bold" text-anchor="middle" fill="#f8fafc" filter="url(#bgGlow)">${name}</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Create a background SVG
  const createBackground = (name, color1 = '#4c1d95', color2 = '#1e3a8a', pattern = 'dots') => {
    let patternDef = '';
    let patternUse = '';
    
    if (pattern === 'dots') {
      patternDef = `<pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="15" cy="15" r="2" fill="#a78bfa" opacity="0.3" />
      </pattern>`;
      patternUse = `<rect width="800" height="400" fill="url(#dots)" />`;
    } else if (pattern === 'lines') {
      patternDef = `<pattern id="lines" width="30" height="30" patternUnits="userSpaceOnUse">
        <line x1="0" y1="15" x2="30" y2="15" stroke="#a78bfa" stroke-width="1" opacity="0.3" />
      </pattern>`;
      patternUse = `<rect width="800" height="400" fill="url(#lines)" />`;
    } else if (pattern === 'grid') {
      patternDef = `<pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M0,0 L30,0 L30,30 L0,30 Z" fill="none" stroke="#a78bfa" stroke-width="1" opacity="0.3" />
      </pattern>`;
      patternUse = `<rect width="800" height="400" fill="url(#grid)" />`;
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        ${patternDef}
      </defs>
      <rect width="800" height="400" fill="url(#bgGrad)" />
      ${patternUse}
      
      <!-- Subtle name watermark -->
      <text x="50" y="350" font-family="Arial" font-size="20" font-weight="bold" fill="#f8fafc" opacity="0.3">${name}</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Create a pet SVG
  const createPet = (name, color = '#6d28d9') => {
    let petPath = '';
    
    // Different pet shapes based on name
    if (name.toLowerCase().includes('dragon')) {
      petPath = `<path d="M50,30 C60,10 90,10 100,30 L120,10 L110,40 C130,45 130,70 110,80 C100,100 70,100 60,80 C40,70 40,45 60,40 L50,10 Z" fill="${color}" />
        <circle cx="70" cy="40" r="5" fill="#eab308" />
        <circle cx="100" cy="40" r="5" fill="#eab308" />`;
    } else if (name.toLowerCase().includes('poro')) {
      petPath = `<circle cx="80" cy="80" r="50" fill="#f8fafc" />
        <circle cx="60" cy="70" r="8" fill="#0f172a" />
        <circle cx="100" cy="70" r="8" fill="#0f172a" />
        <path d="M60,100 Q80,120 100,100" fill="none" stroke="#0f172a" stroke-width="3" />
        <path d="M50,50 L30,30 M110,50 L130,30" fill="none" stroke="#f8fafc" stroke-width="3" />`;
    } else {
      petPath = `<circle cx="80" cy="80" r="40" fill="${color}" />
        <circle cx="65" cy="70" r="6" fill="#eab308" />
        <circle cx="95" cy="70" r="6" fill="#eab308" />
        <path d="M65,95 Q80,105 95,95" fill="none" stroke="#eab308" stroke-width="2" />`;
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <filter id="petGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#c084fc" flood-opacity="0.7"/>
        </filter>
      </defs>
      <rect width="160" height="160" fill="none" />
      <g filter="url(#petGlow)">
        ${petPath}
      </g>
      <text x="80" y="150" font-family="Arial" font-size="14" text-anchor="middle" fill="#f8fafc">${name}</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Create a shop item SVG
  const createShopItem = (name, type = 'bundle', color1 = '#6d28d9', color2 = '#1e40af') => {
    let itemSymbol = '';
    
    // Different symbols based on item type
    if (type === 'bundle') {
      itemSymbol = `<rect x="40" y="40" width="70" height="90" rx="5" fill="#eab308" transform="rotate(-10,40,40)" />
        <rect x="60" y="50" width="70" height="90" rx="5" fill="#f8fafc" transform="rotate(5,60,50)" />
        <rect x="80" y="60" width="70" height="90" rx="5" fill="#6366f1" transform="rotate(15,80,60)" />`;
    } else if (type === 'character') {
      itemSymbol = `<rect x="65" y="40" width="70" height="120" rx="5" fill="#f8fafc" />
        <circle cx="100" cy="70" r="20" fill="#1e40af" />
        <rect x="80" y="100" width="40" height="40" rx="5" fill="#1e40af" />`;
    } else if (type === 'card') {
      itemSymbol = `<rect x="50" y="50" width="50" height="80" rx="5" fill="#eab308" transform="rotate(-10,50,50)" />
        <rect x="70" y="60" width="50" height="80" rx="5" fill="#f8fafc" transform="rotate(5,70,60)" />
        <rect x="90" y="70" width="50" height="80" rx="5" fill="#6366f1" transform="rotate(20,90,70)" />`;
    } else if (type === 'pet') {
      itemSymbol = `<circle cx="100" cy="100" r="30" fill="#eab308" />
        <circle cx="85" cy="90" r="5" fill="#0f172a" />
        <circle cx="115" cy="90" r="5" fill="#0f172a" />
        <path d="M85,115 Q100,125 115,115" fill="none" stroke="#0f172a" stroke-width="3" />`;
    } else if (type.includes('currency')) {
      itemSymbol = `<circle cx="100" cy="100" r="40" fill="#eab308" />
        <text x="100" y="115" font-family="Arial" font-size="50" text-anchor="middle" fill="#0f172a">$</text>`;
    } else {
      itemSymbol = `<rect x="60" y="60" width="80" height="80" rx="10" fill="#eab308" />
        <text x="100" y="115" font-family="Arial" font-size="50" text-anchor="middle" fill="#0f172a">?</text>`;
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <defs>
        <linearGradient id="shopItemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
        <filter id="shopItemGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#c084fc" flood-opacity="0.7"/>
        </filter>
      </defs>
      <rect width="200" height="200" rx="10" fill="url(#shopItemGrad)" />
      <g filter="url(#shopItemGlow)">
        ${itemSymbol}
      </g>
      <rect x="20" y="160" width="160" height="30" rx="5" fill="rgba(0,0,0,0.5)" />
      <text x="100" y="180" font-family="Arial" font-size="12" text-anchor="middle" fill="#f8fafc">${name}</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Character avatars
  const characterAvatars = {
    viper: createCharacterAvatar('Viper', '#4c1d95', '#4338ca'),
    jinx: createCharacterAvatar('Jinx', '#6d28d9', '#1d4ed8'),
    ekko: createCharacterAvatar('Ekko', '#7e22ce', '#1e40af'),
    caitlyn: createCharacterAvatar('Caitlyn', '#6d28d9', '#1e3a8a'),
    jayce: createCharacterAvatar('Jayce', '#5b21b6', '#1e40af'),
    vi: createCharacterAvatar('Vi', '#7e22ce', '#4338ca'),
    default: createCharacterAvatar('Character', '#4c1d95', '#4338ca')
  };
  
  // Card designs
  const cardDesigns = {
    neon: createCardDesign('Neon Edge', '#7e22ce', '#1e40af', 'hexagon'),
    arcane: createCardDesign('Arcane Magic', '#6d28d9', '#1e3a8a', 'circles'),
    golden: createCardDesign('Golden Luxury', '#eab308', '#92400e', 'grid'),
    standard: createCardDesign('Standard Card', '#4c1d95', '#1e40af', 'hexagon'),
    default: createCardDesign('Default Card', '#4c1d95', '#1e40af', 'hexagon')
  };
  
  // Playing cards
  const playingCards = {
    // Hearts
    HA: createPlayingCard('H', 'A'),
    HK: createPlayingCard('H', 'K'),
    HQ: createPlayingCard('H', 'Q'),
    HJ: createPlayingCard('H', 'J'),
    H10: createPlayingCard('H', '10'),
    H9: createPlayingCard('H', '9'),
    H8: createPlayingCard('H', '8'),
    H7: createPlayingCard('H', '7'),
    
    // Spades
    SA: createPlayingCard('S', 'A'),
    SK: createPlayingCard('S', 'K'),
    SQ: createPlayingCard('S', 'Q'),
    SJ: createPlayingCard('S', 'J'),
    S10: createPlayingCard('S', '10'),
    S9: createPlayingCard('S', '9'),
    S8: createPlayingCard('S', '8'),
    S7: createPlayingCard('S', '7'),
    
    // Diamonds
    DA: createPlayingCard('D', 'A'),
    DK: createPlayingCard('D', 'K'),
    DQ: createPlayingCard('D', 'Q'),
    DJ: createPlayingCard('D', 'J'),
    D10: createPlayingCard('D', '10'),
    D9: createPlayingCard('D', '9'),
    D8: createPlayingCard('D', '8'),
    D7: createPlayingCard('D', '7'),
    
    // Clubs
    CA: createPlayingCard('C', 'A'),
    CK: createPlayingCard('C', 'K'),
    CQ: createPlayingCard('C', 'Q'),
    CJ: createPlayingCard('C', 'J'),
    C10: createPlayingCard('C', '10'),
    C9: createPlayingCard('C', '9'),
    C8: createPlayingCard('C', '8'),
    C7: createPlayingCard('C', '7'),
    
    // Hidden card
    back: createCardBack(),
    hidden: createCardBack()
  };
  
  // Game mode images
  const gameModes = {
    hokm: createGameModeBg('HOKM', '#4c1d95', '#1e3a8a'),
    poker: createGameModeBg('POKER', '#6d28d9', '#1e40af'),
    blackjack: createGameModeBg('BLACKJACK', '#5b21b6', '#0e7490'),
    default: createGameModeBg('ARCANE CARDS', '#4c1d95', '#1e3a8a')
  };
  
  // Background images
  const backgrounds = {
    arcane: createBackground('Arcane', '#4c1d95', '#1e3a8a', 'dots'),
    piltover: createBackground('Piltover', '#6d28d9', '#1e40af', 'grid'),
    zaun: createBackground('Zaun', '#5b21b6', '#0e7490', 'lines'),
    void: createBackground('Void', '#3b0764', '#1e1b4b', 'dots'),
    default: createBackground('Default', '#4c1d95', '#1e3a8a', 'dots')
  };
  
  // Pets
  const pets = {
    dragon: createPet('Dragon', '#c026d3'),
    poro: createPet('Poro'),
    void: createPet('Void Creature', '#7e22ce'),
    default: createPet('Pet', '#6d28d9')
  };
  
  // Shop items
  const shopItems = {
    viper_bundle: createShopItem('Viper Bundle', 'bundle', '#4c1d95', '#4338ca'),
    jinx_bundle: createShopItem('Jinx Bundle', 'bundle', '#6d28d9', '#1d4ed8'),
    ekko_bundle: createShopItem('Ekko Bundle', 'bundle', '#7e22ce', '#1e40af'),
    
    neon_pack: createShopItem('Neon Card Pack', 'card', '#7e22ce', '#1e40af'),
    gold_pack: createShopItem('Gold Card Pack', 'card', '#eab308', '#92400e'),
    arcane_pack: createShopItem('Arcane Card Pack', 'card', '#6d28d9', '#1e3a8a'),
    
    coins: createShopItem('Coin Pack', 'currency-coin', '#eab308', '#92400e'),
    gems: createShopItem('Gem Pack', 'currency-gem', '#0ea5e9', '#0e7490'),
    premium_pass: createShopItem('Premium Pass', 'subscription', '#6d28d9', '#1e40af'),
    
    background_pack: createShopItem('Background Pack', 'background', '#6d28d9', '#1e3a8a'),
    pet_pack: createShopItem('Pet Collection', 'pet', '#c026d3', '#9333ea'),
    
    default: createShopItem('Shop Item', 'bundle', '#4c1d95', '#1e3a8a')
  };
  
  // Main function to get image by type and id
  const getImage = (type, id) => {
    const collections = {
      character: characterAvatars,
      card: cardDesigns,
      playingCard: playingCards,
      gameMode: gameModes,
      background: backgrounds,
      pet: pets,
      shopItem: shopItems
    };
    
    // If the collection exists and the id is found, return the image path
    if (collections[type] && collections[type][id]) {
      return collections[type][id];
    }
    
    // Otherwise return default image for that type
    if (collections[type] && collections[type].default) {
      return collections[type].default;
    }
    
    // Fallback to a generic placeholder with the correct dimensions
    return createGenericPlaceholder(type, id);
  };
  
  // Create a generic placeholder for fallback
  const createGenericPlaceholder = (type, id) => {
    let width, height, label;
    
    switch(type) {
      case 'character':
        width = 300;
        height = 400;
        label = `Character: ${id || 'Unknown'}`;
        break;
      case 'card':
        width = 200;
        height = 300;
        label = `Card: ${id || 'Unknown'}`;
        break;
      case 'playingCard':
        width = 200;
        height = 280;
        label = `Card: ${id || 'Unknown'}`;
        break;
      case 'gameMode':
        width = 600;
        height = 400;
        label = `Game Mode: ${id || 'Unknown'}`;
        break;
      case 'background':
        width = 800;
        height = 400;
        label = `Background: ${id || 'Unknown'}`;
        break;
      case 'pet':
        width = 160;
        height = 160;
        label = `Pet: ${id || 'Unknown'}`;
        break;
      case 'shopItem':
        width = 200;
        height = 200;
        label = `Item: ${id || 'Unknown'}`;
        break;
      default:
        width = 200;
        height = 200;
        label = `${type}: ${id || 'Unknown'}`;
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#4c1d95" />
      <rect x="4" y="4" width="${width-8}" height="${height-8}" fill="none" stroke="#a78bfa" stroke-width="2" stroke-dasharray="10,5" />
      <text x="${width/2}" y="${height/2}" font-family="Arial" font-size="${Math.min(width, height) / 15}" fill="#f8fafc" text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Custom placeholder function
  const getCustomPlaceholder = (width, height, text, colorTheme = 'purple') => {
    let color1, color2, textColor;
    
    switch(colorTheme) {
      case 'purple':
        color1 = '#6d28d9';
        color2 = '#4c1d95';
        textColor = '#f8fafc';
        break;
      case 'blue':
        color1 = '#2563eb';
        color2 = '#1e3a8a';
        textColor = '#f8fafc';
        break;
      case 'gold':
        color1 = '#eab308';
        color2 = '#92400e';
        textColor = '#f8fafc';
        break;
      case 'red':
        color1 = '#dc2626';
        color2 = '#7f1d1d';
        textColor = '#f8fafc';
        break;
      default:
        color1 = '#6d28d9';
        color2 = '#4c1d95';
        textColor = '#f8fafc';
    }
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="placeholderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#placeholderGrad)" />
      <rect x="4" y="4" width="${width-8}" height="${height-8}" fill="none" stroke="${textColor}40" stroke-width="2" />
      <text x="${width/2}" y="${height/2}" font-family="Arial" font-size="${Math.min(width, height) / 15}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>`;
    
    return createSvgDataUri(svg);
  };
  
  // Export the service
  export default {
    getImage,
    getCustomPlaceholder,
    characterAvatars,
    cardDesigns,
    playingCards,
    gameModes,
    backgrounds,
    pets,
    shopItems
  };