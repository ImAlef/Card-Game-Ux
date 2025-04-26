import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ImageService from '../services/ImageService';

// Cards data - using card codes: suit (H=Hearts, S=Spades, D=Diamonds, C=Clubs) + value (A, K, Q, J, 10, 9, 2)
const cardData = {
  "HA": { name: "Ace of Hearts", suit: "hearts", value: "A", power: 14 },
  "HK": { name: "King of Hearts", suit: "hearts", value: "K", power: 13 },
  "HQ": { name: "Queen of Hearts", suit: "hearts", value: "Q", power: 12 },
  "HJ": { name: "Jack of Hearts", suit: "hearts", value: "J", power: 11 },
  "H10": { name: "10 of Hearts", suit: "hearts", value: "10", power: 10 },
  "H9": { name: "9 of Hearts", suit: "hearts", value: "9", power: 9 },
  "H8": { name: "8 of Hearts", suit: "hearts", value: "8", power: 8 },
  "H7": { name: "7 of Hearts", suit: "hearts", value: "7", power: 7 },
  
  "SA": { name: "Ace of Spades", suit: "spades", value: "A", power: 14 },
  "SK": { name: "King of Spades", suit: "spades", value: "K", power: 13 },
  "SQ": { name: "Queen of Spades", suit: "spades", value: "Q", power: 12 },
  "SJ": { name: "Jack of Spades", suit: "spades", value: "J", power: 11 },
  "S10": { name: "10 of Spades", suit: "spades", value: "10", power: 10 },
  "S9": { name: "9 of Spades", suit: "spades", value: "9", power: 9 },
  "S8": { name: "8 of Spades", suit: "spades", value: "8", power: 8 },
  "S7": { name: "7 of Spades", suit: "spades", value: "7", power: 7 },
  
  "DA": { name: "Ace of Diamonds", suit: "diamonds", value: "A", power: 14 },
  "DK": { name: "King of Diamonds", suit: "diamonds", value: "K", power: 13 },
  "DQ": { name: "Queen of Diamonds", suit: "diamonds", value: "Q", power: 12 },
  "DJ": { name: "Jack of Diamonds", suit: "diamonds", value: "J", power: 11 },
  "D10": { name: "10 of Diamonds", suit: "diamonds", value: "10", power: 10 },
  "D9": { name: "9 of Diamonds", suit: "diamonds", value: "9", power: 9 },
  "D8": { name: "8 of Diamonds", suit: "diamonds", value: "8", power: 8 },
  "D7": { name: "7 of Diamonds", suit: "diamonds", value: "7", power: 7 },
  
  "CA": { name: "Ace of Clubs", suit: "clubs", value: "A", power: 14 },
  "CK": { name: "King of Clubs", suit: "clubs", value: "K", power: 13 },
  "CQ": { name: "Queen of Clubs", suit: "clubs", value: "Q", power: 12 },
  "CJ": { name: "Jack of Clubs", suit: "clubs", value: "J", power: 11 },
  "C10": { name: "10 of Clubs", suit: "clubs", value: "10", power: 10 },
  "C9": { name: "9 of Clubs", suit: "clubs", value: "9", power: 9 },
  "C8": { name: "8 of Clubs", suit: "clubs", value: "8", power: 8 },
  "C7": { name: "7 of Clubs", suit: "clubs", value: "7", power: 7 },
};

// Character data
const characterData = {
  'Viper': {
    name: 'Viper',
    team: 'A',
    primaryColor: '#4ade80',
    secondaryColor: '#166534',
    avatar: 'viper'
  },
  'Jinx': {
    name: 'Jinx',
    team: 'A',
    primaryColor: '#ec4899',
    secondaryColor: '#9d174d',
    avatar: 'jinx'
  },
  'Ekko': {
    name: 'Ekko',
    team: 'B',
    primaryColor: '#a78bfa',
    secondaryColor: '#5b21b6', 
    avatar: 'ekko'
  },
  'Caitlyn': {
    name: 'Caitlyn',
    team: 'B',
    primaryColor: '#38bdf8',
    secondaryColor: '#0369a1',
    avatar: 'caitlyn'
  }
};

// Helper function for better organization
const getSuitSymbol = (suit) => {
  switch(suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
    default: return '';
  }
};

const getSuitColor = (suit) => {
  return (suit === 'hearts' || suit === 'diamonds') ? 'text-red-500' : 'text-white';
};

function HokmGame() {
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Game players
  const [players, setPlayers] = useState([
    { 
      id: 1, 
      name: 'You', 
      character: 'Viper', 
      team: 'A',
      position: 'bottom',
      isUser: true,
      cardBack: 'neon',
    },
    { 
      id: 2, 
      name: 'Jinx', 
      character: 'Jinx', 
      team: 'A',
      position: 'top',
      isUser: false,
      cardBack: 'arcane',
    },
    { 
      id: 3, 
      name: 'Ekko', 
      character: 'Ekko', 
      team: 'B',
      position: 'right',
      isUser: false,
      cardBack: 'golden',
    },
    { 
      id: 4, 
      name: 'Caitlyn', 
      character: 'Caitlyn', 
      team: 'B',
      position: 'left',
      isUser: false,
      cardBack: 'standard',
    },
  ]);
  
  // Add character data to players
  useEffect(() => {
    const enhancedPlayers = players.map(player => ({
      ...player,
      ...characterData[player.character],
    }));
    setPlayers(enhancedPlayers);
  }, []);
  
  // Game state
  const [gameState, setGameState] = useState({
    stage: 'trumpSelection', // trumpSelection, playing, roundEnd, gameEnd
    currentTurn: 1, // Player ID whose turn it is
    trumpSuit: null, // hearts, diamonds, clubs, spades
    trumpCaller: 1, // Player ID who called trump
    currentTrick: [], // Cards played in current trick
    trickWinner: null,
    trickLeader: 1, // Player who leads the current trick
    leadSuit: null, // Suit that was led in the current trick
    activePlayer: 1, // Player ID who is active (playing animation)
    score: { A: 0, B: 0 },
    roundNumber: 1,
    tricks: { A: 0, B: 0 },
    cardsPlayed: [], // All cards played in the current round
    roundHistory: [],
    timePerTurn: 15, // Seconds per turn
    timeRemaining: 15,
    playedCards: new Set(), // Set of all cards played to avoid duplicates
    handScore: { A: 0, B: 0 }, // Needed to calculate score after all tricks are played
  });
  
  // Timer for player turns
  const [turnTimer, setTurnTimer] = useState(null);
  
  // Player hands
  const [playerHand, setPlayerHand] = useState([
    "HA", "HK", "H9", "SK", "SQ", "S10", "DA", "DK", "DJ", "D9", "CA", "CK", "C8"
  ]);
  
  // For the other players' hands (for simulation purposes)
  const [aiHands, setAiHands] = useState({
    2: [],
    3: [],
    4: []
  });
  
  // Trump selection options - for the trump selector screen
  const trumpOptions = [
    { suit: 'hearts', name: 'Hearts', symbol: '♥', color: 'text-red-500' },
    { suit: 'diamonds', name: 'Diamonds', symbol: '♦', color: 'text-red-500' },
    { suit: 'clubs', name: 'Clubs', symbol: '♣', color: 'text-white' },
    { suit: 'spades', name: 'Spades', symbol: '♠', color: 'text-white' },
  ];
  
  // Game log messages
  const [gameLog, setGameLog] = useState([
    { message: "Game started! Round 1", type: "system" },
    { message: "You are the Trump Caller - select a suit", type: "system" },
  ]);
  
  // Animation states
  const [showTrickWinner, setShowTrickWinner] = useState(false);
  const [isShowingLog, setIsShowingLog] = useState(false);
  const [showTrumpAnimation, setShowTrumpAnimation] = useState(false);
  const [lastPlayedCard, setLastPlayedCard] = useState(null);
  
  // Sound effects
  const [sounds, setSounds] = useState({
    cardPlay: new Audio('/sounds/card-play.mp3'),
    trickWin: new Audio('/sounds/trick-win.mp3'),
    roundEnd: new Audio('/sounds/round-end.mp3'),
    trumpSelect: new Audio('/sounds/trump-select.mp3'),
    turnAlert: new Audio('/sounds/turn-alert.mp3'),
  });
  
  // Options for the game
  const [options, setOptions] = useState({
    soundEnabled: true,
    showHints: true,
    confirmMoves: false,
    aiSpeed: 'normal', // slow, normal, fast
    cardSize: 'normal', // small, normal, large
  });
  
  // Initialize the game
  useEffect(() => {
    // Deal cards to all players
    dealCards();
    
    // Start turn timer if it's the user's turn
    if (gameState.currentTurn === 1 && gameState.stage === 'playing') {
      startTurnTimer();
    }
    
    // For demo purposes, add some randomness to AI decisions
    const randomReadyInterval = setInterval(() => {
      if (gameState.stage === 'playing' && gameState.currentTurn !== 1) {
        // Simulate AI thinking
        playAITurn();
      }
    }, getAIDelay());
    
    return () => clearInterval(randomReadyInterval);
  }, [gameState.currentTurn, gameState.stage]);
  
  // Deal initial cards
  const dealCards = () => {
    // In a real game, this would receive cards from the server
    // For now, we'll just simulate it
    
    // Create a deck of cards (excluding the ones already in player's hand)
    const suits = ["H", "S", "D", "C"];
    const values = ["A", "K", "Q", "J", "10", "9", "8", "7"];
    let deck = [];
    
    for (const suit of suits) {
      for (const value of values) {
        const card = suit + value;
        if (!playerHand.includes(card)) {
          deck.push(card);
        }
      }
    }
    
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    // Deal to AI players
    const newAiHands = {...aiHands};
    for (let playerId = 2; playerId <= 4; playerId++) {
      const cardsNeeded = 13 - (newAiHands[playerId]?.length || 0);
      newAiHands[playerId] = deck.splice(0, cardsNeeded);
    }
    
    setAiHands(newAiHands);
  };
  
  // Start turn timer
  const startTurnTimer = () => {
    // Clear any existing timer
    if (turnTimer) {
      clearInterval(turnTimer);
    }
    
    // Reset time remaining
    setGameState(prev => ({
      ...prev,
      timeRemaining: prev.timePerTurn
    }));
    
    // Start new timer
    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          clearInterval(timer);
          
          // If it's the user's turn and they haven't played, play a random card
          if (prev.currentTurn === 1 && prev.stage === 'playing') {
            const playableCards = getPlayableCards();
            if (playableCards.length > 0) {
              const randomCard = playableCards[Math.floor(Math.random() * playableCards.length)];
              playCard(randomCard);
            }
          }
          
          return {
            ...prev,
            timeRemaining: 0
          };
        }
        
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);
    
    setTurnTimer(timer);
    
    // Play alert sound if it's the user's turn
    if (gameState.currentTurn === 1 && options.soundEnabled) {
      sounds.turnAlert.play();
    }
    
    return () => {
      clearInterval(timer);
    };
  };
  
  // Get delay for AI moves based on the selected speed
  const getAIDelay = () => {
    switch (options.aiSpeed) {
      case 'slow': return 2000;
      case 'fast': return 500;
      case 'normal':
      default: return 1000;
    }
  };
  
  // Handle trump selection
  const selectTrump = (suit) => {
    if (options.soundEnabled) {
      sounds.trumpSelect.play();
    }
    
    setGameState(prev => ({
      ...prev,
      trumpSuit: suit,
      stage: 'playing',
      currentTurn: 1,
    }));
    
    addToGameLog(`Trump suit selected: ${suit}`, "highlight");
    setShowTrumpAnimation(true);
    
    // Hide trump animation after 3 seconds
    setTimeout(() => {
      setShowTrumpAnimation(false);
    }, 3000);
    
    // Start the turn timer
    startTurnTimer();
  };
  
  // Get playable cards based on the current game state
  const getPlayableCards = () => {
    // If this is the first play in a trick, any card is valid
    if (gameState.currentTrick.length === 0) {
      return [...playerHand];
    }
    
    const leadSuit = cardData[gameState.currentTrick[0].cardCode].suit;
    
    // Check if player has any cards of the lead suit
    const hasSuit = playerHand.some(cardCode => cardData[cardCode].suit === leadSuit);
    
    if (hasSuit) {
      // Must play cards of the lead suit
      return playerHand.filter(cardCode => cardData[cardCode].suit === leadSuit);
    } else {
      // Can play any card if you don't have the lead suit
      return [...playerHand];
    }
  };
  
  // Check if a card is playable
  const isCardPlayable = (cardCode) => {
    return getPlayableCards().includes(cardCode);
  };
  
  // Handle AI turn
  const playAITurn = () => {
    const playerId = gameState.currentTurn;
    if (playerId === 1 || gameState.stage !== 'playing') return;
    
    // Get the AI's hand
    const hand = aiHands[playerId] || [];
    
    // Get a valid card to play
    let cardToPlay;
    
    // If this is the first play in a trick, AI can play any card
    if (gameState.currentTrick.length === 0) {
      // Simple AI logic: Play a random card from hand
      cardToPlay = hand[Math.floor(Math.random() * hand.length)];
    } else {
      // Get the suit led
      const leadSuit = cardData[gameState.currentTrick[0].cardCode].suit;
      
      // Check if AI has any cards of the lead suit
      const suitCards = hand.filter(cardCode => cardData[cardCode].suit === leadSuit);
      
      if (suitCards.length > 0) {
        // Must play cards of the lead suit
        cardToPlay = suitCards[Math.floor(Math.random() * suitCards.length)];
      } else {
        // Can play any card if you don't have the lead suit
        cardToPlay = hand[Math.floor(Math.random() * hand.length)];
      }
    }
    
    // Update AI's hand
    setAiHands(prev => ({
      ...prev,
      [playerId]: prev[playerId].filter(c => c !== cardToPlay)
    }));
    
    // Play the card
    simulateCardPlay(playerId, cardToPlay);
  };
  
  // Simulate a card being played by AI
  const simulateCardPlay = (playerId, cardCode) => {
    if (options.soundEnabled) {
      sounds.cardPlay.play();
    }
    
    // Add card to current trick
    const updatedTrick = [...gameState.currentTrick, { playerId, cardCode }];
    
    // If this is the first card in the trick, set the lead suit
    const leadSuit = updatedTrick.length === 1 ? cardData[cardCode].suit : gameState.leadSuit;
    
    // Add to game log
    const playerName = players.find(p => p.id === playerId)?.name || `Player ${playerId}`;
    addToGameLog(`${playerName} played ${cardData[cardCode].name}`, "opponent");
    
    // Save the last played card for animation
    setLastPlayedCard({ playerId, cardCode });
    
    // Update game state with the new trick
    setGameState(prev => ({
      ...prev,
      currentTrick: updatedTrick,
      leadSuit: leadSuit,
      playedCards: new Set([...prev.playedCards, cardCode])
    }));
    
    // If all players have played, determine trick winner after a delay
    if (updatedTrick.length === 4) {
      setTimeout(() => {
        evaluateTrick(updatedTrick);
      }, 1500);
    } else {
      // Move to next player after a delay
      setTimeout(() => {
        const nextPlayerId = getNextPlayer(playerId);
        
        setGameState(prev => ({
          ...prev,
          currentTurn: nextPlayerId,
          activePlayer: nextPlayerId
        }));
        
        // Restart the timer for the next player
        startTurnTimer();
      }, 500);
    }
  };
  
  // Handle card play by the user
  const playCard = (cardCode) => {
    // Only allow playing if it's the player's turn and we're in playing stage
    if (gameState.currentTurn !== 1 || gameState.stage !== 'playing') return;
    
    // Check if the card is playable according to the rules
    if (!isCardPlayable(cardCode)) {
      addToGameLog("You must follow suit if possible.", "system");
      return;
    }
    
    // If confirm moves is enabled, ask for confirmation
    if (options.confirmMoves) {
      if (!window.confirm(`Play ${cardData[cardCode].name}?`)) {
        return;
      }
    }
    
    // Play sound
    if (options.soundEnabled) {
      sounds.cardPlay.play();
    }
    
    // Remove card from hand
    setPlayerHand(prev => prev.filter(c => c !== cardCode));
    
    // Add card to current trick
    const updatedTrick = [...gameState.currentTrick, { playerId: 1, cardCode }];
    
    // If this is the first card in the trick, set the lead suit
    const leadSuit = updatedTrick.length === 1 ? cardData[cardCode].suit : gameState.leadSuit;
    
    // Add to game log
    addToGameLog(`You played ${cardData[cardCode].name}`, "player");
    
    // Save the last played card for animation
    setLastPlayedCard({ playerId: 1, cardCode });
    
    // Update game state
    setGameState(prev => ({
      ...prev,
      currentTrick: updatedTrick,
      leadSuit: leadSuit,
      playedCards: new Set([...prev.playedCards, cardCode])
    }));
    
    // If all players have played, determine trick winner after a delay
    if (updatedTrick.length === 4) {
      setTimeout(() => {
        evaluateTrick(updatedTrick);
      }, 1500);
    } else {
      // Move to next player
      setTimeout(() => {
        const nextPlayerId = getNextPlayer(1);
        
        setGameState(prev => ({
          ...prev,
          currentTurn: nextPlayerId,
          activePlayer: nextPlayerId
        }));
        
        // Restart the timer for the next player
        startTurnTimer();
        
        // Simulate AI playing after a delay
        setTimeout(() => {
          if (gameState.stage === 'playing') {
            playAITurn();
          }
        }, getAIDelay());
      }, 500);
    }
  };
  
  // Get the next player in turn order
  const getNextPlayer = (currentPlayerId) => {
    return currentPlayerId % 4 + 1;
  };
  
  // Evaluate the trick to determine the winner
  const evaluateTrick = (trick) => {
    if (trick.length !== 4) return;
    
    // Get the lead suit (first card played)
    const leadSuit = cardData[trick[0].cardCode].suit;
    
    // Find the highest card
    let highestCardPlay = trick[0];
    let highestPower = calculateCardPower(trick[0].cardCode, leadSuit);
    
    for (let i = 1; i < trick.length; i++) {
      const power = calculateCardPower(trick[i].cardCode, leadSuit);
      if (power > highestPower) {
        highestCardPlay = trick[i];
        highestPower = power;
      }
    }
    
    const winningPlayerId = highestCardPlay.playerId;
    const winningTeam = players.find(p => p.id === winningPlayerId)?.team || 'A';
    
    // Play sound
    if (options.soundEnabled) {
      sounds.trickWin.play();
    }
    
    // Update trick counts
    const updatedTricks = {
      ...gameState.tricks,
      [winningTeam]: gameState.tricks[winningTeam] + 1
    };
    
    // Check if round is over (13 tricks)
    const totalTricks = updatedTricks.A + updatedTricks.B;
    
    if (totalTricks >= 13) {
      // Round is over
      handleRoundEnd(updatedTricks, winningPlayerId);
    } else {
      // Continue with next trick
      const winnerName = players.find(p => p.id === winningPlayerId)?.name || `Player ${winningPlayerId}`;
      addToGameLog(`${winnerName} wins the trick!`, "system");
      
      setGameState(prev => ({
        ...prev,
        currentTrick: [],
        trickWinner: winningPlayerId,
        tricks: updatedTricks,
        currentTurn: winningPlayerId,
        activePlayer: winningPlayerId,
        leadSuit: null,
        trickLeader: winningPlayerId
      }));
      
      // Show trick winner animation
      setShowTrickWinner(true);
      setTimeout(() => setShowTrickWinner(false), 2000);
      
      // Start the next trick after a delay
      setTimeout(() => {
        startTurnTimer();
      }, 2000);
    }
  };
  
  // Calculate the power of a card based on the lead suit and trump
  const calculateCardPower = (cardCode, leadSuit) => {
    const card = cardData[cardCode];
    
    // Base power from the card's value
    let power = card.power;
    
    // If it's a trump card, add 100 to make it higher than any non-trump
    if (card.suit === gameState.trumpSuit) {
      power += 100;
    }
    // If it's not a trump but follows the lead suit, it's valid for winning
    else if (card.suit === leadSuit) {
      power += 0; // No adjustment needed
    }
    // If it's neither trump nor lead suit, it's worthless for winning
    else {
      power = -1;
    }
    
    return power;
  };
  
  // Handle the end of a round
  const handleRoundEnd = (tricks, lastTrickWinner) => {
    // Play sound
    if (options.soundEnabled) {
      sounds.roundEnd.play();
    }
    
    // Determine round winner
    const roundWinner = tricks.A > tricks.B ? 'A' : 'B';
    let roundPoints = 1; // Default points
    
    // Custom scoring logic (can be expanded)
    // For example, if a team wins all tricks, they get 2 points
    if (tricks[roundWinner] === 13) {
      roundPoints = 2;
      addToGameLog(`Team ${roundWinner} won all tricks! Double points!`, "highlight");
    }
    
    // Update score
    const updatedScore = {
      ...gameState.score,
      [roundWinner]: gameState.score[roundWinner] + roundPoints
    };
    
    // Add to game log
    addToGameLog(`Team ${roundWinner} wins the round with ${tricks[roundWinner]} tricks!`, "highlight");
    
    // Save round history
    const roundHistory = [...gameState.roundHistory, {
      round: gameState.roundNumber,
      trumpSuit: gameState.trumpSuit,
      tricks: {...tricks},
      winner: roundWinner,
      points: roundPoints
    }];
    
    // Check if game is over
    if (updatedScore.A >= 7 || updatedScore.B >= 7) {
      // Game is over
      const gameWinner = updatedScore.A >= 7 ? 'A' : 'B';
      addToGameLog(`Team ${gameWinner} wins the game!`, "highlight");
      
      setGameState(prev => ({
        ...prev,
        currentTrick: [],
        trickWinner: lastTrickWinner,
        tricks: tricks,
        score: updatedScore,
        stage: 'gameEnd',
        winner: gameWinner,
        roundHistory: roundHistory
      }));
    } else {
      // Start new round
      startNewRound(updatedScore, lastTrickWinner, roundHistory);
    }
  };
  
  // Start a new round
  const startNewRound = (score, lastTrickWinner, roundHistory) => {
    // Give trump selection to the winner of the last round
    const trumpCaller = lastTrickWinner;
    
    // Reset game state for new round
    setGameState({
      ...gameState,
      currentTrick: [],
      trickWinner: null,
      tricks: { A: 0, B: 0 },
      score: score,
      stage: 'trumpSelection',
      roundNumber: gameState.roundNumber + 1,
      trumpSuit: null,
      currentTurn: trumpCaller,
      activePlayer: trumpCaller,
      trumpCaller: trumpCaller,
      leadSuit: null,
      trickLeader: trumpCaller,
      playedCards: new Set(),
      roundHistory: roundHistory
    });
    
    // Deal new cards
    dealNewCards();
    
    addToGameLog(`Starting Round ${gameState.roundNumber + 1}`, "system");
    
    // If AI is the trump caller, select trump after a delay
    if (trumpCaller !== 1) {
      setTimeout(() => {
        // AI selects trump
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const selectedTrump = suits[Math.floor(Math.random() * suits.length)];
        
        const callerName = players.find(p => p.id === trumpCaller)?.name || `Player ${trumpCaller}`;
        addToGameLog(`${callerName} selected ${selectedTrump} as the trump suit.`, "highlight");
        
        setGameState(prev => ({
          ...prev,
          trumpSuit: selectedTrump,
          stage: 'playing',
          currentTurn: trumpCaller,
        }));
        
        setShowTrumpAnimation(true);
        setTimeout(() => {
          setShowTrumpAnimation(false);
          
          // Start the first trick
          startTurnTimer();
          
          // AI plays the first card
          setTimeout(() => {
            playAITurn();
          }, getAIDelay());
        }, 3000);
      }, 2000);
    } else {
      addToGameLog(`You are the Trump Caller - select a suit`, "system");
    }
  };
  
// Deal new cards for a new round
const dealNewCards = () => {
  // In a real game, this would come from the server
  // For now we'll just generate a new random hand
  
  // Create a new deck
  const suits = ["H", "S", "D", "C"];
  const values = ["A", "K", "Q", "J", "10", "9", "8", "7"];
  let allCards = [];
  
  for (const suit of suits) {
    for (const value of values) {
      allCards.push(suit + value);
    }
  }
  
  // Shuffle the deck
  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }
  
  // Deal cards to player
  const newPlayerHand = allCards.slice(0, 13);
  setPlayerHand(newPlayerHand);
  
  // Deal to AI players
  const newAiHands = {};
  for (let playerId = 2; playerId <= 4; playerId++) {
    const startIndex = (playerId - 1) * 13;
    newAiHands[playerId] = allCards.slice(startIndex, startIndex + 13);
  }
  setAiHands(newAiHands);
};

// Add message to game log
const addToGameLog = (message, type = "system") => {
  setGameLog(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
};

// Get card position transformation for played cards
const getCardPosition = (playerId) => {
  const position = players.find(p => p.id === playerId)?.position;
  
  // Get viewport dimensions for responsive positioning
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const isSmallScreen = viewportWidth < 768;
  const isVerySmallScreen = viewportWidth < 576;
  const isLowHeight = viewportHeight < 500;
  
  // Adjust positioning values based on screen size
  let xOffset, yOffset;
  
  if (isLowHeight && position === 'bottom') {
    // Bring cards closer to the center in landscape mobile
    yOffset = -30;
  } else if (isLowHeight && position === 'top') {
    yOffset = 30;
  } else if (isSmallScreen) {
    // Smaller offsets for small screens
    xOffset = position === 'left' ? 25 : position === 'right' ? -25 : 0;
    yOffset = position === 'bottom' ? -40 : position === 'top' ? 40 : 0;
  } else {
    // Standard offsets for larger screens
    xOffset = position === 'left' ? 50 : position === 'right' ? -50 : 0;
    yOffset = position === 'bottom' ? -70 : position === 'top' ? 70 : 0;
  }
  
  return { x: xOffset || 0, y: yOffset || 0 };
};

// Get playable card class
const getCardClass = (cardCode) => {
  let className = "rounded-lg shadow-md cursor-pointer transition-all duration-200";
  
  if (gameState.stage !== 'playing' || gameState.currentTurn !== 1) {
    className += " opacity-80";
  } else if (isCardPlayable(cardCode)) {
    className += " hover:border-2 hover:border-yellow-400 hover:-translate-y-5";
  } else {
    className += " opacity-50 cursor-not-allowed";
  }
  
  return className;
};

// Get player avatar
const getPlayerAvatar = (player) => {
  return ImageService.getImage('character', player.avatar);
};

// Get card back image
const getCardBack = (style) => {
  return ImageService.getImage('card', style);
};

// Get card image
const getCardImage = (cardCode) => {
  // Return the image for a specific card
  const card = cardData[cardCode];
  if (!card) return "";
  
  const suit = card.suit.charAt(0).toUpperCase() + card.suit.slice(1);
  const value = card.value;
  
  return ImageService.getImage('playingCard', `${suit}${value}`);
};

// Handle leaving the game
const handleLeaveGame = () => {
  if (window.confirm("Are you sure you want to leave this game?")) {
    navigate('/hokm-lobby');
  }
};

// Handle playing again
const handlePlayAgain = () => {
  // Reset the entire game state
  setGameState({
    stage: 'trumpSelection',
    currentTurn: 1,
    trumpSuit: null,
    trumpCaller: 1,
    currentTrick: [],
    trickWinner: null,
    trickLeader: 1,
    leadSuit: null,
    activePlayer: 1,
    score: { A: 0, B: 0 },
    roundNumber: 1,
    tricks: { A: 0, B: 0 },
    cardsPlayed: [],
    roundHistory: [],
    timePerTurn: 15,
    timeRemaining: 15,
    playedCards: new Set(),
    handScore: { A: 0, B: 0 },
  });
  
  // Reset the game log
  setGameLog([
    { message: "Game started! Round 1", type: "system" },
    { message: "You are the Trump Caller - select a suit", type: "system" },
  ]);
  
  // Deal new cards
  dealNewCards();
};

// Render game hints
const renderGameHints = () => {
  if (!options.showHints) return null;
  
  let hint = "";
  
  if (gameState.stage === 'trumpSelection' && gameState.currentTurn === 1) {
    hint = "Select a trump suit to continue";
  } else if (gameState.stage === 'playing' && gameState.currentTurn === 1) {
    const playable = getPlayableCards();
    if (playable.length < playerHand.length) {
      hint = `You must follow the lead suit (${gameState.leadSuit}) if possible`;
    } else {
      hint = "Your turn - play any card";
    }
  } else if (gameState.stage === 'playing') {
    hint = `Waiting for ${players.find(p => p.id === gameState.currentTurn)?.name || 'opponent'} to play...`;
  }
  
  return (
    <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 px-4 py-2 rounded-lg text-white text-sm">
      {hint}
    </div>
  );
};

return (
  <motion.div 
    className="min-h-screen bg-gradient-to-b from-green-900 to-gray-900 flex flex-col relative overflow-hidden"
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ duration: 0.6 }}
  >
    {/* Ambient particles for visual effect */}
    <div className="absolute inset-0 pointer-events-none z-0">
      <div className="particle"></div>
      <div className="particle"></div>
      <div className="particle"></div>
    </div>
    
    {/* Game header with scores and controls */}
    <header className="p-4 flex justify-between items-center z-10 bg-black bg-opacity-50">
      <div className="flex items-center gap-2 md:gap-4">
        <motion.button 
          className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon hover-glow"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLeaveGame}
        >
          <span className="text-white text-sm">←</span>
        </motion.button>
        <h1 className="text-lg md:text-2xl text-yellow-400 font-bold">HOKM</h1>
        
        {/* Round counter */}
        <div className="bg-gray-800 bg-opacity-70 px-2 py-1 rounded text-sm text-white hidden md:block">
          Round {gameState.roundNumber}
        </div>
        
        {/* Trump indicator */}
        {gameState.trumpSuit && (
          <div className="bg-gray-800 bg-opacity-80 px-2 md:px-3 py-1 rounded-lg flex items-center">
            <span className="text-gray-400 mr-1 text-xs md:text-sm">Trump:</span>
            <span className={`text-base md:text-xl ${
              gameState.trumpSuit === 'hearts' || gameState.trumpSuit === 'diamonds' 
                ? 'text-red-500' 
                : 'text-white'
            }`}>
              {getSuitSymbol(gameState.trumpSuit)}
            </span>
          </div>
        )}
      </div>
      
      {/* Score display */}
      <div className="flex items-center gap-2 md:gap-4">
        <div className="bg-blue-900 bg-opacity-70 px-2 md:px-4 py-1 md:py-2 rounded-lg flex items-center">
          <span className="text-white font-bold mr-2 text-xs md:text-sm">Team A</span>
          <div className="bg-blue-800 px-2 py-1 rounded text-white text-xs md:text-sm">
            {gameState.score.A}
          </div>
          <span className="text-gray-400 mx-1 hidden md:inline">•</span>
          <div className="text-xs text-gray-300 hidden md:block">Tricks: {gameState.tricks.A}</div>
        </div>
        
        <div className="bg-red-900 bg-opacity-70 px-2 md:px-4 py-1 md:py-2 rounded-lg flex items-center">
          <span className="text-white font-bold mr-2 text-xs md:text-sm">Team B</span>
          <div className="bg-red-800 px-2 py-1 rounded text-white text-xs md:text-sm">
            {gameState.score.B}
          </div>
          <span className="text-gray-400 mx-1 hidden md:inline">•</span>
          <div className="text-xs text-gray-300 hidden md:block">Tricks: {gameState.tricks.B}</div>
        </div>
        
        <motion.button 
          className="w-8 h-8 md:w-10 md:h-10 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsShowingLog(!isShowingLog)}
        >
          <span className="text-white text-xs md:text-sm">📜</span>
        </motion.button>
      </div>
    </header>
    
    {/* Main game area */}
    <div className="flex-1 relative flex flex-col items-center justify-center z-10">
      {/* Trump Selection Screen */}
      <AnimatePresence>
        {gameState.stage === 'trumpSelection' && gameState.currentTurn === 1 && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 className="text-2xl md:text-4xl text-yellow-400 font-bold mb-4 md:mb-8">SELECT TRUMP SUIT</h2>
            
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {trumpOptions.map(option => (
                <motion.button 
                  key={option.suit}
                  className="bg-gray-800 p-4 md:p-8 rounded-lg flex flex-col items-center shadow-neon"
                  whileHover={{ scale: 1.05, backgroundColor: '#1f2937' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectTrump(option.suit)}
                >
                  <span className={`text-4xl md:text-7xl ${option.color}`}>{option.symbol}</span>
                  <span className="text-white text-lg md:text-2xl mt-2 md:mt-4">{option.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game End Screen */}
      <AnimatePresence>
        {gameState.stage === 'gameEnd' && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="bg-gray-900 p-6 md:p-10 rounded-lg shadow-neon max-w-lg w-11/12"
            >
              <h2 className="text-3xl md:text-4xl text-yellow-400 font-bold mb-4 md:mb-6 text-center">GAME OVER</h2>
              <h3 className="text-2xl md:text-3xl text-white text-center mb-6 md:mb-8">
                Team {gameState.winner} Wins!
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6 md:mb-8">
                <div className={`p-4 rounded-lg ${gameState.winner === 'A' ? 'bg-blue-700' : 'bg-gray-800'}`}>
                  <h4 className="text-lg md:text-xl text-white font-bold text-center mb-2">Team A</h4>
                  <p className="text-2xl md:text-3xl text-center">{gameState.score.A}</p>
                </div>
                <div className={`p-4 rounded-lg ${gameState.winner === 'B' ? 'bg-red-700' : 'bg-gray-800'}`}>
                  <h4 className="text-lg md:text-xl text-white font-bold text-center mb-2">Team B</h4>
                  <p className="text-2xl md:text-3xl text-center">{gameState.score.B}</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <motion.button 
                  className="px-4 md:px-6 py-2 md:py-3 bg-purple-700 text-white rounded-lg shadow-neon hover-glow text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLeaveGame}
                >
                  Back to Lobby
                </motion.button>
                <motion.button 
                  className="px-4 md:px-6 py-2 md:py-3 bg-green-700 text-white rounded-lg shadow-neon hover-glow text-sm md:text-base"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayAgain}
                >
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trump Animation */}
      <AnimatePresence>
        {showTrumpAnimation && gameState.trumpSuit && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", duration: 1 }}
              className="bg-gradient-to-r from-purple-800 to-blue-800 p-8 md:p-12 rounded-full shadow-neon"
            >
              <span className={`text-6xl md:text-8xl ${getSuitColor(gameState.trumpSuit)}`}>
                {getSuitSymbol(gameState.trumpSuit)}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trick Winner Animation */}
      <AnimatePresence>
        {showTrickWinner && (
          <motion.div 
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-gray-900 bg-opacity-80 px-6 py-3 rounded-lg shadow-neon"
            >
              <h3 className="text-xl md:text-2xl text-yellow-400 font-bold">
                {players.find(p => p.id === gameState.trickWinner)?.name || 'Player'} wins the trick!
              </h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Log Sidebar */}
      <AnimatePresence>
        {isShowingLog && (
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-64 md:w-80 bg-black bg-opacity-70 z-20 shadow-neon overflow-hidden"
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h3 className="text-white font-bold">GAME LOG</h3>
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setIsShowingLog(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 h-full overflow-y-auto scrollbar-hide pb-24">
              {gameLog.map((log, index) => (
                <div key={index} className="mb-2">
                  <p className={`text-sm ${
                    log.type === 'system' 
                      ? 'text-gray-400' 
                      : log.type === 'highlight'
                        ? 'text-yellow-400 font-bold'
                        : log.type === 'player'
                          ? 'text-green-400'
                          : 'text-blue-400'
                  }`}>
                    {log.message}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Round history in log */}
            {gameState.roundHistory.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4">
                <h4 className="text-white font-bold mb-2">Round History</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {gameState.roundHistory.map((round, index) => (
                    <div key={index} className="text-xs bg-gray-800 p-2 rounded">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Round {round.round}:</span>
                        <span className="text-white">Team {round.winner} won</span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400">Trump:</span>
                        <span className={getSuitColor(round.trumpSuit)}>
                          {getSuitSymbol(round.trumpSuit)}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-gray-400">Tricks:</span>
                        <span className="text-white">A: {round.tricks.A} | B: {round.tricks.B}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Turn timer */}
      {gameState.stage === 'playing' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-black bg-opacity-70 rounded-full px-4 py-1 flex items-center">
            <div className="text-white text-sm font-bold mr-2">
              {players.find(p => p.id === gameState.currentTurn)?.name || 'Player'}'s Turn
            </div>
            <div className={`text-sm font-mono ${
              gameState.timeRemaining <= 5 ? 'text-red-500' : 'text-white'
            }`}>
              {gameState.timeRemaining}s
            </div>
          </div>
        </div>
      )}
      
      {/* Game hints */}
      {renderGameHints()}
      
      {/* Game table with players and cards */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Game table background - responsive sizing */}
        <div className={`absolute rounded-full bg-green-800 shadow-neon
          ${isLowHeight ? 'w-[250px] h-[250px]' : 'w-[300px] h-[300px] md:w-[600px] md:h-[600px]'}`}>
        </div>
        
        {/* Center - played cards - adjusted for mobile */}
        <div className="absolute w-[120px] h-[120px] md:w-[200px] md:h-[200px] flex items-center justify-center">
          {gameState.currentTrick.map((play, index) => (
            <motion.div
              key={index}
              className="absolute"
              initial={{ 
                x: getCardPosition(play.playerId).x * 2, 
                y: getCardPosition(play.playerId).y * 2,
                opacity: 0,
                rotateZ: 0
              }}
              animate={{ 
                x: getCardPosition(play.playerId).x, 
                y: getCardPosition(play.playerId).y,
                opacity: 1,
                rotateZ: Math.random() * 16 - 8 // Random slight rotation
              }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <img 
                src={getCardImage(play.cardCode)} 
                alt={cardData[play.cardCode].name}
                className="w-[60px] h-[84px] md:w-[100px] md:h-[140px] rounded-lg shadow-md"
              />
            </motion.div>
          ))}
        </div>
        
          {/* Top player (partner) */}
          <div className={`absolute top-1 md:top-6 transform -translate-x-1/2 left-1/2 flex flex-col items-center
          ${isLowHeight ? 'mobile-landscape-compact' : ''}`}>
          <div className={`mb-1 p-1 rounded-full ${
            gameState.currentTurn === players.find(p => p.position === 'top')?.id 
              ? 'bg-yellow-600 animate-pulse' 
              : 'bg-gray-800'
          }`}>
            <img 
              src={getPlayerAvatar(players.find(p => p.position === 'top'))} 
              alt={players.find(p => p.position === 'top')?.name} 
              className="player-avatar rounded-full"
            />
          </div>
          <p className={`text-white bg-gray-900 bg-opacity-80 px-2 py-1 rounded text-xs
            ${isLowHeight ? 'mobile-landscape-hide' : ''}`}>
            {players.find(p => p.position === 'top')?.name}
          </p>
          
          {/* Cards in hand (face down) - responsive sizing */}
          <div className="flex -space-x-1 md:-space-x-4 mt-1">
            {aiHands[players.find(p => p.position === 'top')?.id]?.map((_, i) => (
              <img 
                key={i}
                src={getCardBack(players.find(p => p.position === 'top')?.cardBack)} 
                alt="Card back"
                className="player-card-sm rounded object-cover"
              />
            )).slice(0, isLowHeight ? 3 : 5)}
            {aiHands[players.find(p => p.position === 'top')?.id]?.length > 5 && (
              <div className="bg-gray-900 text-white text-xs px-1 py-0.5 rounded-full">
                +{aiHands[players.find(p => p.position === 'top')?.id]?.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
        
        {/* Left player */}
        <div className="absolute left-3 md:left-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
          <div className={`mb-1 md:mb-2 p-1 md:p-2 rounded-full ${
            gameState.currentTurn === players.find(p => p.position === 'left')?.id ? 'bg-yellow-600 animate-pulse' : 'bg-gray-800'
          }`}>
            <img 
              src={getPlayerAvatar(players.find(p => p.position === 'left'))} 
              alt={players.find(p => p.position === 'left')?.name} 
              className="w-8 h-8 md:w-12 md:h-12 rounded-full"
            />
          </div>
          <p className="text-white bg-gray-900 bg-opacity-80 px-2 py-1 rounded text-xs md:text-sm">
            {players.find(p => p.position === 'left')?.name}
          </p>
          
          {/* Cards in hand (face down) */}
          <div className="flex flex-col -space-y-3 md:-space-y-6 mt-1 md:mt-2">
            {aiHands[players.find(p => p.position === 'left')?.id]?.map((_, i) => (
              <img 
                key={i}
                src={getCardBack(players.find(p => p.position === 'left')?.cardBack)} 
                alt="Card back"
                className="w-7 h-5 md:w-12 md:h-8 rounded object-cover rotate-90"
              />
            )).slice(0, 5)}
            {aiHands[players.find(p => p.position === 'left')?.id]?.length > 5 && (
              <div className="bg-gray-900 text-white text-xs px-1 py-0.5 rounded-full">
                +{aiHands[players.find(p => p.position === 'left')?.id]?.length - 5}
              </div>
            )}
          </div>
        </div>
        
        {/* Right player */}
        <div className="absolute right-3 md:right-6 top-1/2 transform -translate-y-1/2 flex flex-col items-center">
          <div className={`mb-1 md:mb-2 p-1 md:p-2 rounded-full ${
            gameState.currentTurn === players.find(p => p.position === 'right')?.id ? 'bg-yellow-600 animate-pulse' : 'bg-gray-800'
          }`}>
            <img 
              src={getPlayerAvatar(players.find(p => p.position === 'right'))} 
              alt={players.find(p => p.position === 'right')?.name} 
              className="w-8 h-8 md:w-12 md:h-12 rounded-full"
            />
          </div>
          <p className="text-white bg-gray-900 bg-opacity-80 px-2 py-1 rounded text-xs md:text-sm">
            {players.find(p => p.position === 'right')?.name}
          </p>
          
          {/* Cards in hand (face down) */}
          <div className="flex flex-col -space-y-3 md:-space-y-6 mt-1 md:mt-2">
            {aiHands[players.find(p => p.position === 'right')?.id]?.map((_, i) => (
              <img 
                key={i}
                src={getCardBack(players.find(p => p.position === 'right')?.cardBack)} 
                alt="Card back"
                className="w-7 h-5 md:w-12 md:h-8 rounded object-cover -rotate-90"
              />
            )).slice(0, 5)}
            {aiHands[players.find(p => p.position === 'right')?.id]?.length > 5 && (
              <div className="bg-gray-900 text-white text-xs px-1 py-0.5 rounded-full">
                +{aiHands[players.find(p => p.position === 'right')?.id]?.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Player's hand */}
      <div className={`mb-2 md:mb-10 relative z-10 ${isLowHeight ? 'mobile-landscape-adjust' : ''}`}>
      <div className={`p-1 md:p-2 rounded-full mx-auto mb-1 md:mb-2 ${
        gameState.currentTurn === players.find(p => p.position === 'bottom')?.id 
          ? 'bg-yellow-600 animate-pulse' 
          : 'bg-gray-800'
        }`}>
        <img 
          src={getPlayerAvatar(players.find(p => p.position === 'bottom'))} 
          alt={players.find(p => p.position === 'bottom')?.name} 
          className="w-8 h-8 md:w-16 md:h-16 rounded-full"
        />
      </div>
      
      <div className={`flex justify-center -space-x-4 md:-space-x-10 max-w-full overflow-x-auto pb-2
        ${isLowHeight ? 'pb-0 mobile-landscape-smaller' : ''}`}>
        {playerHand.map((cardCode, index) => {
          const isPlayable = gameState.stage === 'playing' && 
                            gameState.currentTurn === 1 && 
                            isCardPlayable(cardCode);
          
          return (
            <motion.div
              key={cardCode}
              className="relative"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.05, type: "spring" }}
              whileHover={{ 
                y: isPlayable ? (isLowHeight ? -10 : -20) : 0, 
                zIndex: isPlayable ? 10 : 'auto' 
              }}
              onClick={() => isPlayable && playCard(cardCode)}
            >
              <img 
                src={getCardImage(cardCode)} 
                alt={cardData[cardCode].name}
                className={`player-card ${getCardClass(cardCode)}`}
              />
              
              {/* Trump card indicator */}
              {gameState.trumpSuit && cardData[cardCode].suit === gameState.trumpSuit && (
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-6 md:h-6 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                  {getSuitSymbol(gameState.trumpSuit)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
      
      {/* Game settings button - opens settings modal */}
      <div className="absolute bottom-4 right-4 z-20">
        <motion.button
          className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSettings(true)}
        >
          <span className="text-white text-lg">⚙️</span>
        </motion.button>
      </div>
      
      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 md:p-6"
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
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl md:text-2xl text-yellow-400 font-bold">GAME SETTINGS</h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white"
                    onClick={() => setShowSettings(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-4 space-y-4">
                  {/* Sound toggle */}
                  <div className="flex justify-between items-center">
                    <span className="text-white">Sound Effects</span>
                    <div 
                      className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${
                        options.soundEnabled ? 'bg-green-600 justify-end' : 'bg-gray-700 justify-start'
                      }`}
                      onClick={() => setOptions(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Show hints toggle */}
                  <div className="flex justify-between items-center">
                    <span className="text-white">Show Hints</span>
                    <div 
                      className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${
                        options.showHints ? 'bg-green-600 justify-end' : 'bg-gray-700 justify-start'
                      }`}
                      onClick={() => setOptions(prev => ({ ...prev, showHints: !prev.showHints }))}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Confirm moves toggle */}
                  <div className="flex justify-between items-center">
                    <span className="text-white">Confirm Card Plays</span>
                    <div 
                      className={`w-12 h-6 rounded-full flex items-center p-1 cursor-pointer ${
                        options.confirmMoves ? 'bg-green-600 justify-end' : 'bg-gray-700 justify-start'
                      }`}
                      onClick={() => setOptions(prev => ({ ...prev, confirmMoves: !prev.confirmMoves }))}
                    >
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* AI Speed */}
                  <div>
                    <span className="text-white block mb-2">AI Speed</span>
                    <div className="flex gap-2">
                      {['slow', 'normal', 'fast'].map(speed => (
                        <button 
                          key={speed}
                          className={`px-3 py-1 rounded ${
                            options.aiSpeed === speed ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300'
                          }`}
                          onClick={() => setOptions(prev => ({ ...prev, aiSpeed: speed }))}
                        >
                          {speed.charAt(0).toUpperCase() + speed.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Card Size */}
                  <div>
                    <span className="text-white block mb-2">Card Size</span>
                    <div className="flex gap-2">
                      {['small', 'normal', 'large'].map(size => (
                        <button 
                          key={size}
                          className={`px-3 py-1 rounded ${
                            options.cardSize === size ? 'bg-purple-700 text-white' : 'bg-gray-800 text-gray-300'
                          }`}
                          onClick={() => setOptions(prev => ({ ...prev, cardSize: size }))}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <motion.button 
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow-neon"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSettings(false)}
                  >
                    Save Settings
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game actions menu (options, help, etc.) */}
      <div className="absolute bottom-4 left-4 z-20">
        <motion.button
          className="w-10 h-10 md:w-12 md:h-12 bg-gray-800 bg-opacity-70 rounded-full flex items-center justify-center shadow-neon"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHelp(true)}
        >
          <span className="text-white text-lg">❓</span>
        </motion.button>
      </div>
      
      {/* Help modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 md:p-6"
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
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl md:text-2xl text-yellow-400 font-bold">HOW TO PLAY HOKM</h2>
                  <button 
                    className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-white"
                    onClick={() => setShowHelp(false)}
                  >
                    ✕
                  </button>
                </div>
                
                <div className="border-t border-gray-700 pt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  <div>
                    <h3 className="text-white font-bold mb-2">Basic Rules</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• Hokm is a trick-taking card game played with 4 players in two teams (A & B)</li>
                      <li>• Each player receives 13 cards (a standard 52-card deck)</li>
                      <li>• The goal is to win tricks for your team</li>
                      <li>• First team to 7 points wins the game</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold mb-2">Trump Suit</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• At the start of each round, one player selects a trump suit</li>
                      <li>• Trump cards beat all cards of other suits</li>
                      <li>• Among trump cards, higher ranks win</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold mb-2">Playing a Trick</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• First player leads with any card</li>
                      <li>• Other players must follow suit if possible</li>
                      <li>• If you can't follow suit, you can play any card</li>
                      <li>• Highest card of the lead suit wins, unless a trump is played</li>
                      <li>• Winner of the trick leads the next one</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold mb-2">Scoring</h3>
                    <ul className="text-gray-300 space-y-2 text-sm">
                      <li>• After all 13 tricks, the team with more tricks wins the round</li>
                      <li>• Winning team gets 1 point</li>
                      <li>• If a team wins all 13 tricks, they get 2 points</li>
                      <li>• First team to reach 7 points wins the game</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-white font-bold mb-2">Card Rankings (Highest to Lowest)</h3>
                    <p className="text-gray-300 text-sm">Ace, King, Queen, Jack, 10, 9, 8, 7</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <motion.button 
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg shadow-neon"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowHelp(false)}
                  >
                    Got It
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

export default HokmGame;