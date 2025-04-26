import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Sample player data
const players = [
  { 
    id: 1, 
    name: 'You', 
    chips: 1500, 
    character: 'Viper',
    avatar: 'https://via.placeholder.com/60x60?text=You',
    cards: ['AD', 'KH'], // Ace of Diamonds, King of Hearts
    position: 'bottom',
    bet: 0,
    hasFolded: false,
    isPlayer: true,
    isTurn: true,
  },
  { 
    id: 2, 
    name: 'CardMaster95', 
    chips: 2200, 
    character: 'Jinx',
    avatar: 'https://via.placeholder.com/60x60?text=CM',
    cards: ['??', '??'], // Hidden cards
    position: 'top-left',
    bet: 50,
    hasFolded: false,
    isTurn: false,
  },
  { 
    id: 3, 
    name: 'PokerKing', 
    chips: 980, 
    character: 'Ekko',
    avatar: 'https://via.placeholder.com/60x60?text=PK',
    cards: ['??', '??'], // Hidden cards
    position: 'top',
    bet: 50,
    hasFolded: false,
    isTurn: false,
  },
  { 
    id: 4, 
    name: 'BlackjackPro', 
    chips: 1750, 
    character: 'Caitlyn',
    avatar: 'https://via.placeholder.com/60x60?text=BP',
    cards: ['??', '??'], // Hidden cards
    position: 'top-right',
    bet: 0,
    hasFolded: true,
    isTurn: false,
  },
  { 
    id: 5, 
    name: 'ArcaneQueen', 
    chips: 3000, 
    character: 'Jayce',
    avatar: 'https://via.placeholder.com/60x60?text=AQ',
    cards: ['??', '??'], // Hidden cards
    position: 'right',
    bet: 50,
    hasFolded: false,
    isTurn: false,
  },
  { 
    id: 6, 
    name: 'CardShark22', 
    chips: 500, 
    character: 'Vi',
    avatar: 'https://via.placeholder.com/60x60?text=CS',
    cards: ['??', '??'], // Hidden cards
    position: 'left',
    bet: 50,
    hasFolded: false,
    isTurn: false,
  },
];

// Community cards
const communityCards = ['10S', 'JC', 'QH', '??', '??']; // Ten of Spades, Jack of Clubs, Queen of Hearts, 2 unknown

// Card images
const cardImages = {
  'AD': 'https://via.placeholder.com/120x180?text=A♦',
  'KH': 'https://via.placeholder.com/120x180?text=K♥',
  '10S': 'https://via.placeholder.com/120x180?text=10♠',
  'JC': 'https://via.placeholder.com/120x180?text=J♣',
  'QH': 'https://via.placeholder.com/120x180?text=Q♥',
  '??': 'https://via.placeholder.com/120x180?text=?',
};

// Card back image
const cardBack = 'https://via.placeholder.com/120x180?text=CARD';

function PokerTable() {
  const [tablePlayers, setTablePlayers] = useState(players);
  const [potAmount, setPotAmount] = useState(250);
  const [currentBet, setCurrentBet] = useState(50);
  const [betAmount, setBetAmount] = useState(50);
  const [gamePhase, setGamePhase] = useState('flop'); // preflop, flop, turn, river, showdown
  const [isShowingControls, setIsShowingControls] = useState(true);
  const [showActionModal, setShowActionModal] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [chatMessages, setChatMessages] = useState([
    { player: 'System', message: 'Welcome to the Poker table!' },
    { player: 'CardMaster95', message: 'Good luck everyone!' },
    { player: 'PokerKing', message: 'Let\'s play!' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  
  // Handle player actions
  const handlePlayerAction = (action) => {
    let newBet = 0;
    let message = '';
    
    switch (action) {
      case 'fold':
        // Update player status
        setTablePlayers(prev => prev.map(p => 
          p.isPlayer ? { ...p, hasFolded: true, isTurn: false } : p
        ));
        
        // Set next player's turn
        setTimeout(() => {
          setTablePlayers(prev => {
            const activePlayerIndex = prev.findIndex(p => !p.hasFolded && !p.isPlayer);
            return prev.map((p, i) => ({
              ...p,
              isTurn: i === activePlayerIndex
            }));
          });
        }, 1000);
        
        message = 'You folded';
        break;
        
      case 'check':
        // Update player status
        setTablePlayers(prev => prev.map(p => 
          p.isPlayer ? { ...p, isTurn: false } : p
        ));
        
        // Set next player's turn
        setTimeout(() => {
          setTablePlayers(prev => {
            const activePlayerIndex = prev.findIndex(p => !p.hasFolded && !p.isPlayer);
            return prev.map((p, i) => ({
              ...p,
              isTurn: i === activePlayerIndex
            }));
          });
        }, 1000);
        
        message = 'You checked';
        break;
        
      case 'call':
        // Update player chips and bet
        newBet = currentBet;
        setTablePlayers(prev => prev.map(p => 
          p.isPlayer ? { 
            ...p, 
            bet: newBet,
            chips: p.chips - (newBet - p.bet),
            isTurn: false 
          } : p
        ));
        
        // Update pot
        setPotAmount(prev => prev + (newBet - tablePlayers.find(p => p.isPlayer).bet));
        
        // Set next player's turn
        setTimeout(() => {
          setTablePlayers(prev => {
            const activePlayerIndex = prev.findIndex(p => !p.hasFolded && !p.isPlayer);
            return prev.map((p, i) => ({
              ...p,
              isTurn: i === activePlayerIndex
            }));
          });
        }, 1000);
        
        message = `You called ${newBet}`;
        break;
        
      case 'raise':
        // Update player chips and bet
        newBet = betAmount;
        setTablePlayers(prev => prev.map(p => 
          p.isPlayer ? { 
            ...p, 
            bet: newBet,
            chips: p.chips - (newBet - p.bet),
            isTurn: false 
          } : p
        ));
        
        // Update pot and current bet
        setPotAmount(prev => prev + (newBet - tablePlayers.find(p => p.isPlayer).bet));
        setCurrentBet(newBet);
        
        // Set next player's turn
        setTimeout(() => {
          setTablePlayers(prev => {
            const activePlayerIndex = prev.findIndex(p => !p.hasFolded && !p.isPlayer);
            return prev.map((p, i) => ({
              ...p,
              isTurn: i === activePlayerIndex
            }));
          });
        }, 1000);
        
        message = `You raised to ${newBet}`;
        break;
        
      default:
        return;
    }
    
    // Add action to chat
    setChatMessages(prev => [...prev, { player: 'You', message }]);
    
    // Show action modal
    setLastAction({ type: action, amount: newBet });
    setShowActionModal(true);
    setTimeout(() => setShowActionModal(false), 2000);
    
    // Hide controls after action
    setIsShowingControls(false);
    setTimeout(() => setIsShowingControls(true), 2000);
    
    // Simulate next game phase after all players had their turn
    setTimeout(() => {
      if (gamePhase === 'flop') {
        // Reveal turn card (4th community card)
        setGamePhase('turn');
      } else if (gamePhase === 'turn') {
        // Reveal river card (5th community card)
        setGamePhase('river');
      }
    }, 5000);
  };
  
  // Handle bet slider
  const handleBetSliderChange = (e) => {
    setBetAmount(parseInt(e.target.value));
  };
  
  // Send chat message
  const sendChatMessage = () => {
    if (chatInput.trim()) {
      setChatMessages(prev => [...prev, { player: 'You', message: chatInput }]);
      setChatInput('');
      
      // Simulate reply after a delay
      setTimeout(() => {
        const randomPlayer = tablePlayers.find(p => !p.isPlayer && !p.hasFolded);
        if (randomPlayer) {
          setChatMessages(prev => [...prev, { 
            player: randomPlayer.name, 
            message: ['Nice play!', 'Good luck!', 'Interesting move...'][Math.floor(Math.random() * 3)] 
          }]);
        }
      }, 2000);
    }
  };
  
  // Get position style for player
  const getPlayerPosition = (position) => {
    switch (position) {
      case 'bottom':
        return 'bottom-0 left-1/2 transform -translate-x-1/2';
      case 'top':
        return 'top-0 left-1/2 transform -translate-x-1/2';
      case 'left':
        return 'left-0 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'right-0 top-1/2 transform -translate-y-1/2';
      case 'top-left':
        return 'top-0 left-0';
      case 'top-right':
        return 'top-0 right-0';
      default:
        return '';
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-green-900 to-gray-900 flex flex-col"
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
      
      {/* Header with game info */}
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
          <h1 className="text-3xl text-yellow-400 font-bold">POKER TABLE</h1>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-gray-800 bg-opacity-70 px-4 py-2 rounded-lg">
            <span className="text-gray-400 mr-2">Game:</span>
            <span className="text-white font-bold">Texas Hold'em</span>
          </div>
          
          <div className="bg-gray-800 bg-opacity-70 px-4 py-2 rounded-lg">
            <span className="text-gray-400 mr-2">Blinds:</span>
            <span className="text-white font-bold">25/50</span>
          </div>
          
          <motion.button 
            className="w-12 h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon hover-glow"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowChat(!showChat)}
          >
            <span className="text-white text-xl">💬</span>
          </motion.button>
        </div>
      </header>
      
      {/* Main game area */}
      <div className="flex-1 relative z-10">
        {/* Poker table */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[700px] h-[400px]">
            {/* Table background */}
            <div className="absolute inset-0 bg-green-800 rounded-[50%] shadow-2xl border-8 border-brown-800 card-table"></div>
            
            {/* Pot amount */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-60 px-4 py-2 rounded-full text-white font-bold">
              Pot: {potAmount} chips
            </div>
            
            {/* Community cards */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
              {communityCards.map((card, index) => (
                <motion.div 
                  key={`community-${index}`}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <img 
                    src={index <= 2 || (index === 3 && gamePhase !== 'flop') || gamePhase === 'river' ? cardImages[card] : cardBack} 
                    alt={card === '??' ? 'Hidden card' : card}
                    className="w-16 h-24 rounded-md shadow-md"
                  />
                </motion.div>
              ))}
            </div>
            
            {/* Players */}
            {tablePlayers.map((player) => (
              <div 
                key={player.id}
                className={`absolute ${getPlayerPosition(player.position)}`}
              >
                <motion.div 
                  className={`flex flex-col items-center ${player.hasFolded ? 'opacity-50' : ''}`}
                  initial={{ scale: 0.9 }}
                  animate={player.isTurn ? { 
                    scale: [0.9, 1.05, 0.9],
                    transition: { repeat: Infinity, duration: 2 }
                  } : { scale: 0.9 }}
                >
                  {/* Player avatar and info */}
                  <div className={`relative mb-2 ${player.position === 'bottom' ? 'order-last mt-2' : 'order-first'}`}>
                    <div className={`p-1 rounded-full ${player.isTurn ? 'bg-yellow-500' : 'bg-gray-800'}`}>
                      <img 
                        src={player.avatar} 
                        alt={player.name} 
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div className="absolute -bottom-1 right-0 bg-gray-900 px-2 py-0.5 rounded-full text-white text-xs">
                      {player.chips}
                    </div>
                    
                    {player.hasFolded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 rounded-full">
                        <span className="text-white font-bold text-xs">FOLD</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Player name */}
                  <div className="bg-black bg-opacity-70 px-2 py-1 rounded text-center">
                    <p className="text-white text-sm">{player.name}</p>
                  </div>
                  
                  {/* Player bet */}
                  {player.bet > 0 && (
                    <div className="bg-yellow-600 bg-opacity-80 px-2 py-1 rounded-full text-black text-xs font-bold mt-1">
                      {player.bet}
                    </div>
                  )}
                  
                  {/* Player cards */}
                  <div className={`flex ${player.position === 'left' || player.position === 'right' ? 'flex-col -space-y-6' : '-space-x-4'} mt-2`}>
                    {player.cards.map((card, i) => (
                      <div 
                        key={`player-${player.id}-card-${i}`} 
                        className={`${(player.position === 'left' || player.position === 'right') ? 'rotate-90' : ''}`}
                      >
                        <img 
                          src={player.isPlayer ? cardImages[card] : cardBack} 
                          alt={player.isPlayer ? card : 'Hidden card'}
                          className="w-10 h-15 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}
            
            {/* Player's betting controls */}
            <AnimatePresence>
              {isShowingControls && tablePlayers.find(p => p.isPlayer)?.isTurn && (
                <motion.div 
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-gray-900 bg-opacity-90 p-4 rounded-lg shadow-neon"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                >
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Current bet: {currentBet}</span>
                      <span className="text-white font-bold">{betAmount}</span>
                    </div>
                    <input 
                      type="range" 
                      min={currentBet} 
                      max={tablePlayers.find(p => p.isPlayer).chips + tablePlayers.find(p => p.isPlayer).bet} 
                      value={betAmount}
                      onChange={handleBetSliderChange}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button 
                      className="px-4 py-2 bg-red-700 text-white rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePlayerAction('fold')}
                    >
                      Fold
                    </motion.button>
                    
                    {currentBet === tablePlayers.find(p => p.isPlayer).bet && (
                      <motion.button 
                        className="px-4 py-2 bg-blue-700 text-white rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayerAction('check')}
                      >
                        Check
                      </motion.button>
                    )}
                    
                    {currentBet > tablePlayers.find(p => p.isPlayer).bet && (
                      <motion.button 
                        className="px-4 py-2 bg-blue-700 text-white rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayerAction('call')}
                      >
                        Call {currentBet}
                      </motion.button>
                    )}
                    
                    <motion.button 
                      className="px-4 py-2 bg-green-700 text-white rounded-lg"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handlePlayerAction('raise')}
                      disabled={betAmount <= currentBet}
                    >
                      Raise to {betAmount}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Player action notification */}
      <AnimatePresence>
        {showActionModal && (
          <motion.div 
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-70 px-6 py-4 rounded-lg shadow-neon text-center z-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <h2 className="text-2xl text-white font-bold mb-1">
              {lastAction.type === 'fold' && 'You Folded'}
              {lastAction.type === 'check' && 'You Checked'}
              {lastAction.type === 'call' && `You Called ${lastAction.amount}`}
              {lastAction.type === 'raise' && `You Raised to ${lastAction.amount}`}
            </h2>
            <p className="text-gray-300">Waiting for other players...</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Chat panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div 
            className="fixed right-0 top-20 bottom-0 w-80 bg-black bg-opacity-80 z-20 flex flex-col"
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-white font-bold">TABLE CHAT</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowChat(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto scrollbar-hide">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-3">
                  <span className={`font-bold ${msg.player === 'System' ? 'text-yellow-400' : 'text-white'}`}>
                    {msg.player}:
                  </span>
                  <span className="text-gray-300 ml-2">{msg.message}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-700">
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 bg-gray-800 text-white p-2 rounded-l focus:outline-none"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <motion.button 
                  className="bg-purple-700 text-white px-4 rounded-r"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendChatMessage}
                >
                  Send
                </motion.button>
              </div>
              
              <div className="flex gap-2 mt-3">
                <button className="bg-gray-700 text-white px-3 py-1 rounded text-sm">Good Luck!</button>
                <button className="bg-gray-700 text-white px-3 py-1 rounded text-sm">Nice Hand!</button>
                <button className="bg-gray-700 text-white px-3 py-1 rounded text-sm">😊</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default PokerTable;