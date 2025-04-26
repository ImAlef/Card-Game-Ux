import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import EnhancedImageService from '../services/EnhancedImageService';

// Tournament data
const tournaments = [
  {
    id: 'weekend-classic',
    name: 'Weekend Classic',
    gameMode: 'hokm',
    status: 'active',
    entryFee: { type: 'free' },
    participants: 128,
    maxParticipants: 256,
    startTime: 'Live Now',
    endTime: '2d 6h',
    prizes: [
      { position: '1st', reward: { type: 'currency', amount: 5000 } },
      { position: '2nd', reward: { type: 'currency', amount: 2500 } },
      { position: '3rd', reward: { type: 'currency', amount: 1000 } },
      { position: '4th-10th', reward: { type: 'currency', amount: 500 } }
    ],
    description: 'The classic weekend tournament. Play Hokm against other players and climb the leaderboard.',
    registered: true,
    progress: { 
      stage: 'Round 2', 
      position: 12, 
      wins: 3, 
      losses: 1, 
      nextMatch: '30 min'
    }
  },
  {
    id: 'ranked-showdown',
    name: 'Ranked Showdown',
    gameMode: 'hokm',
    status: 'active',
    entryFee: { type: 'ticket', amount: 1 },
    participants: 76,
    maxParticipants: 128,
    startTime: 'Live Now',
    endTime: '1d 12h',
    prizes: [
      { position: '1st', reward: { type: 'character', name: 'Exclusive Character' } },
      { position: '2nd', reward: { type: 'card', name: 'Legendary Card Pack' } },
      { position: '3rd', reward: { type: 'currency', amount: 2000 } },
    ],
    description: 'High stakes competitive tournament for ranked players. Entry requires tournament ticket.',
    registered: false,
    minimumRank: 'Silver'
  },
  {
    id: 'poker-masters',
    name: 'Poker Masters',
    gameMode: 'poker',
    status: 'upcoming',
    entryFee: { type: 'currency', amount: 1000 },
    participants: 42,
    maxParticipants: 100,
    startTime: '1d 8h',
    endTime: '4d',
    prizes: [
      { position: '1st', reward: { type: 'pet', name: 'Golden Dragon Pet' } },
      { position: '2nd', reward: { type: 'background', name: 'Luxury Casino Background' } },
      { position: '3rd', reward: { type: 'currency', amount: 3000 } },
    ],
    description: 'Test your poker skills in this high-stakes tournament with premium rewards.',
    registered: true
  },
  {
    id: 'blackjack-blitz',
    name: 'Blackjack Blitz',
    gameMode: 'blackjack',
    status: 'upcoming',
    entryFee: { type: 'free' },
    participants: 215,
    maxParticipants: 500,
    startTime: '3d',
    endTime: '4d',
    prizes: [
      { position: '1st', reward: { type: 'currency', amount: 2000 } },
      { position: '2nd', reward: { type: 'currency', amount: 1000 } },
      { position: '3rd', reward: { type: 'currency', amount: 500 } },
    ],
    description: 'Fast-paced Blackjack tournament. Hit or stand your way to the top!',
    registered: false
  },
  {
    id: 'season-championship',
    name: 'Season 2 Championship',
    gameMode: 'hokm',
    status: 'upcoming',
    entryFee: { type: 'qualification' },
    participants: 18,
    maxParticipants: 32,
    startTime: '5d',
    endTime: '7d',
    prizes: [
      { position: '1st', reward: { type: 'special', name: 'Season 2 Champion Title & Trophy' } },
      { position: '2nd', reward: { type: 'currency', amount: 10000 } },
      { position: '3rd', reward: { type: 'currency', amount: 5000 } },
    ],
    description: 'The ultimate seasonal championship. Qualification required by reaching Gold rank or higher.',
    registered: false,
    qualification: 'Gold Rank or higher'
  },
  {
    id: 'mystic-challenge',
    name: 'Mystic Realms Challenge',
    gameMode: 'any',
    status: 'completed',
    entryFee: { type: 'free' },
    participants: 364,
    maxParticipants: 500,
    startTime: 'Completed',
    endTime: 'Completed',
    prizes: [
      { position: '1st', reward: { type: 'special', name: 'Mystic Avatar & Frame' } },
      { position: '2nd', reward: { type: 'card', name: 'Mythic Card Pack' } },
      { position: '3rd', reward: { type: 'currency', amount: 2000 } },
    ],
    description: 'Celebration tournament for Season 2 launch. Play any game mode to earn points.',
    registered: true,
    result: { position: 24, reward: { type: 'currency', amount: 200 } }
  }
];

// Leaderboard data
const leaderboardData = {
  seasonRank: 142,
  totalPlayers: 10542,
  topPercentage: 1.3,
  playerStats: {
    wins: 73,
    losses: 54,
    winRate: 57.5,
    bestRank: 98,
    currentStreak: 3,
    bestStreak: 8
  },
  topPlayers: [
    { rank: 1, name: 'CardKing99', character: 'viper', level: 87, wins: 412, losses: 145 },
    { rank: 2, name: 'ArcaneWizard', character: 'jinx', level: 75, wins: 389, losses: 201 },
    { rank: 3, name: 'PokerFace', character: 'ekko', level: 68, wins: 356, losses: 183 },
    { rank: 4, name: 'HokmMaster', character: 'caitlyn', level: 82, wins: 342, losses: 176 },
    { rank: 5, name: 'BlackjackPro', character: 'jayce', level: 61, wins: 318, losses: 197 }
  ]
};

// Player data
const playerData = {
  name: "CardMaster42",
  level: 15,
  character: "viper",
  rank: "Silver II",
  currency: 1730,
  tickets: 2
};

function Compete() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tournaments');
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournamentFilter, setTournamentFilter] = useState('all');
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Filter tournaments based on selected filter
  const filteredTournaments = () => {
    switch(tournamentFilter) {
      case 'active':
        return tournaments.filter(t => t.status === 'active');
      case 'upcoming':
        return tournaments.filter(t => t.status === 'upcoming');
      case 'registered':
        return tournaments.filter(t => t.registered);
      case 'completed':
        return tournaments.filter(t => t.status === 'completed');
      default:
        return tournaments;
    }
  };

  // Get game mode icon
  const getGameModeIcon = (mode) => {
    switch(mode) {
      case 'hokm': return '🃏';
      case 'poker': return '♠️';
      case 'blackjack': return '🎮';
      default: return '🎯';
    }
  };

  // Get reward image
  const getRewardImage = (reward) => {
    switch(reward.type) {
      case 'currency': return EnhancedImageService.getImage('shopItem', 'coins');
      case 'card': return EnhancedImageService.getImage('shopItem', 'neon_pack');
      case 'character': return EnhancedImageService.getImage('character', 'jinx');
      case 'pet': return EnhancedImageService.getImage('pet', 'dragon');
      case 'background': return EnhancedImageService.getImage('background', 'arcane');
      case 'special': return EnhancedImageService.getImage('shopItem', 'premium_pass');
      default: return EnhancedImageService.getCustomPlaceholder(60, 60, 'Reward');
    }
  };

  return (
    <div className="min-h-screen bg-arcane text-white">
      {/* Header */}
      <header className="bg-black bg-opacity-50 p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="mr-4 bg-gray-800 p-2 rounded-full"
            onClick={() => navigate(-1)}
          >
            <span className="text-xl">←</span>
          </button>
          <h1 className="text-2xl font-bold">COMPETE</h1>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-black bg-opacity-60 rounded-full px-3 py-1 flex items-center">
            <span className="text-yellow-400 mr-1">🪙</span>
            <span className="font-bold">{playerData.currency}</span>
          </div>
          <div className="bg-black bg-opacity-60 rounded-full px-3 py-1 flex items-center">
            <span className="text-purple-400 mr-1">🎟️</span>
            <span className="font-bold">{playerData.tickets}</span>
          </div>
        </div>
      </header>
      
      {/* Player rank banner */}
      <div 
        className="relative mb-6 shadow-neon-subtle"
        style={{
          background: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url(${EnhancedImageService.getImage('background', 'arcane')})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-6xl mx-auto p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-yellow-500">
              <img 
                src={EnhancedImageService.getImage('character', playerData.character)}
                alt={playerData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{playerData.name}</h2>
              <div className="flex items-center">
                <div className="bg-blue-900 px-2 py-0.5 rounded text-sm mr-2">
                  {playerData.rank}
                </div>
                <span className="text-gray-300 text-sm">Level {playerData.level}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-gray-300">Season Rank</div>
            <div className="text-3xl font-bold text-yellow-400">#{leaderboardData.seasonRank}</div>
            <div className="text-xs text-gray-400">Top {leaderboardData.topPercentage}%</div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Tabs navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <TabButton 
            label="TOURNAMENTS" 
            active={activeTab === 'tournaments'} 
            onClick={() => setActiveTab('tournaments')}
            notification={tournaments.filter(t => t.status === 'active' && t.registered).length > 0}
          />
          <TabButton 
            label="LEADERBOARD" 
            active={activeTab === 'leaderboard'} 
            onClick={() => setActiveTab('leaderboard')}
          />
          <TabButton 
            label="RANKING SYSTEM" 
            active={activeTab === 'ranking'} 
            onClick={() => setActiveTab('ranking')}
          />
          <TabButton 
            label="HISTORY" 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')}
          />
        </div>
        
        {/* Content based on active tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tournaments tab content */}
            {activeTab === 'tournaments' && (
              <div>
                {/* Filter and search */}
                <div className="flex justify-between items-center mb-6">
                  <div className="relative">
                    <button 
                      className="bg-gray-800 px-4 py-2 rounded-lg flex items-center"
                      onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                    >
                      <span className="mr-2">FILTER: {tournamentFilter.toUpperCase()}</span>
                      <span className={`transform transition-transform ${filterDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    
                    {filterDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 bg-gray-800 rounded-lg shadow-xl z-10">
                        <div className="py-1">
                          {['all', 'active', 'upcoming', 'registered', 'completed'].map(filter => (
                            <button
                              key={filter}
                              className={`block px-4 py-2 text-left w-full hover:bg-gray-700 ${
                                tournamentFilter === filter ? 'bg-purple-900' : ''
                              }`}
                              onClick={() => {
                                setTournamentFilter(filter);
                                setFilterDropdownOpen(false);
                              }}
                            >
                              {filter.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="text"
                    placeholder="Search tournaments..."
                    className="bg-gray-800 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                  />
                </div>
                
                {/* Tournament list */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {filteredTournaments().map(tournament => (
                    <div 
                      key={tournament.id}
                      className={`bg-gray-800 rounded-xl overflow-hidden shadow-neon-subtle cursor-pointer transform transition-transform hover:scale-[1.02] ${
                        tournament.registered ? 'border-l-4 border-green-500' : ''
                      }`}
                      onClick={() => setSelectedTournament(tournament)}
                    >
                      <div className={`p-3 flex justify-between items-center ${
                        tournament.status === 'active' ? 'bg-green-900' : 
                        tournament.status === 'upcoming' ? 'bg-blue-900' : 
                        'bg-gray-700'
                      }`}>
                        <div className="flex items-center">
                          <span className="mr-2 text-xl">{getGameModeIcon(tournament.gameMode)}</span>
                          <span className="font-bold">{tournament.name}</span>
                        </div>
                        <div className="flex items-center">
                          <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                            tournament.status === 'active' ? 'bg-green-700' : 
                            tournament.status === 'upcoming' ? 'bg-blue-700' : 
                            'bg-gray-600'
                          }`}>
                            {tournament.status.toUpperCase()}
                          </div>
                          {tournament.registered && (
                            <div className="ml-2 bg-green-700 px-2 py-0.5 rounded text-xs">
                              REGISTERED
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="flex justify-between mb-3">
                          <div>
                            <div className="text-sm text-gray-400">Game Mode</div>
                            <div className="font-bold">{tournament.gameMode.toUpperCase()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Participants</div>
                            <div className="font-bold">{tournament.participants}/{tournament.maxParticipants}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Entry Fee</div>
                            <div className="font-bold">
                              {tournament.entryFee.type === 'free' && 'FREE'}
                              {tournament.entryFee.type === 'currency' && `${tournament.entryFee.amount} 🪙`}
                              {tournament.entryFee.type === 'ticket' && `${tournament.entryFee.amount} 🎟️`}
                              {tournament.entryFee.type === 'qualification' && 'QUALIFY'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="text-sm text-gray-400 mb-1">Time</div>
                          <div className="flex justify-between">
                            <span className="text-sm">{tournament.startTime}</span>
                            <span className="text-sm text-green-400">{tournament.endTime}</span>
                          </div>
                        </div>
                        
                        {tournament.status === 'active' && tournament.registered && tournament.progress && (
                          <div className="bg-gray-900 p-2 rounded mb-3">
                            <div className="flex justify-between text-sm">
                              <div>{tournament.progress.stage}</div>
                              <div>Position: #{tournament.progress.position}</div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <div className="text-green-400">Wins: {tournament.progress.wins}</div>
                              <div className="text-red-400">Losses: {tournament.progress.losses}</div>
                              <div>Next: {tournament.progress.nextMatch}</div>
                            </div>
                          </div>
                        )}
                        
                        {tournament.status === 'completed' && tournament.registered && tournament.result && (
                          <div className="bg-gray-900 p-2 rounded mb-3">
                            <div className="flex justify-between text-sm">
                              <div>Final Position:</div>
                              <div className="font-bold">#{tournament.result.position}</div>
                            </div>
                            {tournament.result.reward && (
                              <div className="flex justify-between text-sm">
                                <div>Reward:</div>
                                <div className="text-yellow-400">
                                  {tournament.result.reward.type === 'currency' && `${tournament.result.reward.amount} Coins`}
                                  {tournament.result.reward.type !== 'currency' && tournament.result.reward.name}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-end">
                          <div className="text-sm text-gray-300 italic truncate max-w-xs">
                            {tournament.description.substring(0, 50)}...
                          </div>
                          <button 
                            className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              tournament.registered ? 'bg-blue-700 hover:bg-blue-600' :
                              tournament.status === 'active' || tournament.status === 'upcoming' ?
                                'bg-purple-700 hover:bg-purple-600' : 'bg-gray-700 cursor-not-allowed'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!tournament.registered && (tournament.status === 'active' || tournament.status === 'upcoming')) {
                                setShowRegistrationModal(tournament);
                              }
                            }}
                            disabled={tournament.status === 'completed'}
                          >
                            {tournament.registered ? 'VIEW DETAILS' : 
                              tournament.status === 'active' || tournament.status === 'upcoming' ?
                              'REGISTER' : 'COMPLETED'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Tournament schedule */}
                <div className="bg-gray-900 bg-opacity-80 rounded-xl p-6 shadow-neon-subtle mb-8">
                  <h3 className="text-xl font-bold mb-4">TOURNAMENT SCHEDULE</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400">
                          <th className="pb-2">NAME</th>
                          <th className="pb-2">MODE</th>
                          <th className="pb-2">STARTS</th>
                          <th className="pb-2">ENTRY</th>
                          <th className="pb-2">STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tournaments
                          .filter(t => t.status !== 'completed')
                          .map(tournament => (
                          <tr key={tournament.id} className="border-t border-gray-800">
                            <td className="py-3">{tournament.name}</td>
                            <td className="py-3">{tournament.gameMode.toUpperCase()}</td>
                            <td className="py-3">{tournament.startTime}</td>
                            <td className="py-3">
                              {tournament.entryFee.type === 'free' && 'FREE'}
                              {tournament.entryFee.type === 'currency' && `${tournament.entryFee.amount} 🪙`}
                              {tournament.entryFee.type === 'ticket' && `${tournament.entryFee.amount} 🎟️`}
                              {tournament.entryFee.type === 'qualification' && 'QUALIFY'}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                tournament.status === 'active' ? 'bg-green-700' : 'bg-blue-700'
                              }`}>
                                {tournament.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Leaderboard tab content */}
            {activeTab === 'leaderboard' && (
              <div>
                {/* Player stats card */}
                <div className="bg-gray-800 rounded-xl p-4 shadow-neon-subtle mb-6">
                  <h3 className="text-xl font-bold mb-3">YOUR STATS</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    <div className="bg-gray-900 rounded p-3 text-center">
                      <div className="text-sm text-gray-400">Wins</div>
                      <div className="text-xl font-bold text-green-400">{leaderboardData.playerStats.wins}</div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 text-center">
                      <div className="text-sm text-gray-400">Losses</div>
                      <div className="text-xl font-bold text-red-400">{leaderboardData.playerStats.losses}</div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 text-center">
                      <div className="text-sm text-gray-400">Win Rate</div>
                      <div className="text-xl font-bold">{leaderboardData.playerStats.winRate}%</div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 text-center">
                      <div className="text-sm text-gray-400">Best Rank</div>
                      <div className="text-xl font-bold text-yellow-400">#{leaderboardData.playerStats.bestRank}</div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 text-center">
                      <div className="text-sm text-gray-400">Current Streak</div>
                      <div className="text-xl font-bold text-blue-400">{leaderboardData.playerStats.currentStreak}</div>
                    </div>
                    <div className="bg-gray-900 rounded p-3 text-center">
                      <div className="text-sm text-gray-400">Best Streak</div>
                      <div className="text-xl font-bold text-purple-400">{leaderboardData.playerStats.bestStreak}</div>
                    </div>
                  </div>
                </div>
                
                {/* Top players leaderboard */}
                <div className="bg-gray-900 bg-opacity-80 rounded-xl p-6 shadow-neon-subtle mb-6">
                  <h3 className="text-xl font-bold mb-4">TOP PLAYERS</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-400">
                          <th className="pb-2">RANK</th>
                          <th className="pb-2">PLAYER</th>
                          <th className="pb-2">LEVEL</th>
                          <th className="pb-2">WINS</th>
                          <th className="pb-2">LOSSES</th>
                          <th className="pb-2">WIN RATE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {leaderboardData.topPlayers.map(player => (
                          <tr key={player.rank} className="border-t border-gray-800">
                            <td className="py-3">
                              <div className={`${
                                player.rank === 1 ? 'text-yellow-400' : 
                                player.rank === 2 ? 'text-gray-300' : 
                                player.rank === 3 ? 'text-yellow-700' : 'text-white'
                              } font-bold`}>
                                #{player.rank}
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                                  <img 
                                    src={EnhancedImageService.getImage('character', player.character)}
                                    alt={player.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span>{player.name}</span>
                              </div>
                            </td>
                            <td className="py-3">{player.level}</td>
                            <td className="py-3 text-green-400">{player.wins}</td>
                            <td className="py-3 text-red-400">{player.losses}</td>
                            <td className="py-3">{((player.wins / (player.wins + player.losses)) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                        
                        {/* Player's rank - separated by a gap */}
                        <tr className="border-t border-gray-800">
                          <td colSpan="6" className="py-1 text-center text-gray-600">• • •</td>
                        </tr>
                        <tr className="border-t border-gray-800 bg-gray-800">
                          <td className="py-3">
                            <div className="font-bold">#{leaderboardData.seasonRank}</div>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-yellow-500">
                                <img 
                                  src={EnhancedImageService.getImage('character', playerData.character)}
                                  alt={playerData.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <span>{playerData.name}</span>
                            </div>
                          </td>
                          <td className="py-3">{playerData.level}</td>
                          <td className="py-3 text-green-400">{leaderboardData.playerStats.wins}</td>
                          <td className="py-3 text-red-400">{leaderboardData.playerStats.losses}</td>
                          <td className="py-3">{leaderboardData.playerStats.winRate}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Regional filters */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <button className="bg-purple-700 hover:bg-purple-600 py-2 rounded-lg font-bold">
                    GLOBAL
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg">
                    REGIONAL
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg">
                    FRIENDS
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 py-2 rounded-lg">
                    CLAN
                  </button>
                </div>
              </div>
            )}
            
            {/* Ranking system tab content */}
            {activeTab === 'ranking' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-neon-subtle">
                  <div className="bg-purple-900 p-3">
                    <h3 className="font-bold">RANKING TIERS</h3>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 mr-3 flex items-center justify-center">
                          <span className="text-black font-bold">L</span>
                        </div>
                        <div>
                          <div className="font-bold text-yellow-400">LEGENDARY</div>
                          <div className="text-xs text-gray-400">Top 100 players</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-fuchsia-400 to-fuchsia-600 mr-3 flex items-center justify-center">
                          <span className="text-black font-bold">M</span>
                        </div>
                        <div>
                          <div className="font-bold text-fuchsia-400">MASTER</div>
                          <div className="text-xs text-gray-400">Top 500 players</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-400 to-red-600 mr-3 flex items-center justify-center">
                          <span className="text-black font-bold">D</span>
                        </div>
                        <div>
                          <div className="font-bold text-red-400">DIAMOND</div>
                          <div className="text-xs text-gray-400">Top 5%</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 mr-3 flex items-center justify-center">
                          <span className="text-black font-bold">P</span>
                        </div>
                        <div>
                          <div className="font-bold text-purple-400">PLATINUM</div>
                          <div className="text-xs text-gray-400">Top 15%</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-800 mr-3 flex items-center justify-center">
                          <span className="text-black font-bold">G</span>
                        </div>
                        <div>
                          <div className="font-bold text-yellow-600">GOLD</div>
                          <div className="text-xs text-gray-400">Top 25%</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 mr-3 flex items-center justify-center">
                          <span className="text-black font-bold">S</span>
                        </div>
                        <div>
                          <div className="font-bold text-gray-400">SILVER</div>
                          <div className="text-xs text-gray-400">Top 50%</div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-700 to-yellow-900 mr-3 flex items-center justify-center">
                          <span className="text-black font-bold">B</span>
                        </div>
                        <div>
                          <div className="font-bold text-yellow-700">BRONZE</div>
                          <div className="text-xs text-gray-400">Remaining players</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-gray-800 rounded-xl overflow-hidden shadow-neon-subtle">
                    <div className="bg-blue-900 p-3">
                      <h3 className="font-bold">YOUR CURRENT RANK</h3>
                    </div>
                    <div className="p-4 text-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-r from-gray-400 to-gray-600 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-black font-bold text-3xl">S</span>
                      </div>
                      <div className="font-bold text-2xl text-gray-400 mb-1">{playerData.rank}</div>
                      <div className="text-sm text-gray-300 mb-4">Rank points: 1254 / 1500</div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full bg-gray-400"
                          style={{ width: '83.6%' }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-400">246 points to Gold I</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-xl overflow-hidden shadow-neon-subtle">
                    <div className="bg-green-900 p-3">
                      <h3 className="font-bold">RANK BENEFITS</h3>
                    </div>
                    <div className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-black font-bold text-sm">1</span>
                          </div>
                          <div>
                            <div className="font-bold">Season Rewards</div>
                            <div className="text-sm text-gray-300">Earn exclusive rewards based on your highest rank each season</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-black font-bold text-sm">2</span>
                          </div>
                          <div>
                            <div className="font-bold">Tournament Access</div>
                            <div className="text-sm text-gray-300">Higher ranks unlock access to exclusive tournaments</div>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-yellow-600 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-black font-bold text-sm">3</span>
                          </div>
                          <div>
                            <div className="font-bold">Rank Badges</div>
                            <div className="text-sm text-gray-300">Display your rank on your profile and during matches</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* History tab content */}
            {activeTab === 'history' && (
              <div className="bg-gray-800 rounded-xl shadow-neon-subtle p-4">
                <h3 className="text-xl font-bold mb-4">COMPETITION HISTORY</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-400">
                        <th className="pb-2">EVENT</th>
                        <th className="pb-2">DATE</th>
                        <th className="pb-2">PLACEMENT</th>
                        <th className="pb-2">REWARD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-700">
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="mr-2">🃏</span>
                            <span>Mystic Realms Challenge</span>
                          </div>
                        </td>
                        <td className="py-3">April 20, 2025</td>
                        <td className="py-3">#24</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">🪙</span>
                            <span>200 Coins</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="mr-2">♠️</span>
                            <span>Poker Championship</span>
                          </div>
                        </td>
                        <td className="py-3">April 14, 2025</td>
                        <td className="py-3">#8</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">🪙</span>
                            <span>500 Coins</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="mr-2">🃏</span>
                            <span>Weekend Classic</span>
                          </div>
                        </td>
                        <td className="py-3">April 7, 2025</td>
                        <td className="py-3">#42</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">🪙</span>
                            <span>100 Coins</span>
                          </div>
                        </td>
                      </tr>
                      <tr className="border-t border-gray-700">
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="mr-2">🎮</span>
                            <span>Blackjack Blitz</span>
                          </div>
                        </td>
                        <td className="py-3">March 30, 2025</td>
                        <td className="py-3">#15</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <span className="text-yellow-400 mr-1">🪙</span>
                            <span>300 Coins</span>
                          </div>
                        </td>
                      </tr>
                      {tournaments.filter(t => t.status === 'completed' && t.registered).map(tournament => (
                        <tr key={tournament.id} className="border-t border-gray-700">
                          <td className="py-3">
                            <div className="flex items-center">
                              <span className="mr-2">{getGameModeIcon(tournament.gameMode)}</span>
                              <span>{tournament.name}</span>
                            </div>
                          </td>
                          <td className="py-3">March 15, 2025</td>
                          <td className="py-3">#{tournament.result?.position || '-'}</td>
                          <td className="py-3">
                            {tournament.result?.reward && (
                              <div className="flex items-center">
                                <span className={tournament.result.reward.type === 'currency' ? 'text-yellow-400 mr-1' : 'text-purple-400 mr-1'}>
                                  {tournament.result.reward.type === 'currency' ? '🪙' : '🏆'}
                                </span>
                                <span>
                                  {tournament.result.reward.type === 'currency' 
                                    ? `${tournament.result.reward.amount} Coins` 
                                    : tournament.result.reward.name}
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        
        {/* Tournament details modal */}
        <AnimatePresence>
          {selectedTournament && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gray-900 rounded-xl overflow-hidden max-w-2xl w-full shadow-neon-strong"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <div className={`p-4 flex justify-between items-center ${
                  selectedTournament.status === 'active' ? 'bg-green-900' : 
                  selectedTournament.status === 'upcoming' ? 'bg-blue-900' : 'bg-gray-700'
                }`}>
                  <div className="flex items-center">
                    <span className="mr-2 text-xl">{getGameModeIcon(selectedTournament.gameMode)}</span>
                    <h2 className="text-xl font-bold">{selectedTournament.name}</h2>
                  </div>
                  <button onClick={() => setSelectedTournament(null)}>
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <div className="bg-gray-800 rounded-lg p-4 mb-4">
                        <h3 className="font-bold mb-2">TOURNAMENT DETAILS</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Status:</span>
                            <span className={`${
                              selectedTournament.status === 'active' ? 'text-green-400' : 
                              selectedTournament.status === 'upcoming' ? 'text-blue-400' : 'text-gray-400'
                            }`}>
                              {selectedTournament.status.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Game Mode:</span>
                            <span>{selectedTournament.gameMode.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Entry Fee:</span>
                            <span>
                              {selectedTournament.entryFee.type === 'free' && 'FREE'}
                              {selectedTournament.entryFee.type === 'currency' && `${selectedTournament.entryFee.amount} 🪙`}
                              {selectedTournament.entryFee.type === 'ticket' && `${selectedTournament.entryFee.amount} 🎟️`}
                              {selectedTournament.entryFee.type === 'qualification' && 'QUALIFICATION REQUIRED'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Participants:</span>
                            <span>{selectedTournament.participants}/{selectedTournament.maxParticipants}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Start Time:</span>
                            <span>{selectedTournament.startTime}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">End Time:</span>
                            <span className="text-green-400">{selectedTournament.endTime}</span>
                          </div>
                          {selectedTournament.qualification && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">Requirement:</span>
                              <span className="text-yellow-400">{selectedTournament.qualification}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {selectedTournament.registered && selectedTournament.progress && (
                        <div className="bg-gray-800 rounded-lg p-4">
                          <h3 className="font-bold mb-2">YOUR PROGRESS</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Current Stage:</span>
                              <span>{selectedTournament.progress.stage}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Position:</span>
                              <span>#{selectedTournament.progress.position}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Wins:</span>
                              <span className="text-green-400">{selectedTournament.progress.wins}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Losses:</span>
                              <span className="text-red-400">{selectedTournament.progress.losses}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Next Match:</span>
                              <span className="text-yellow-400">{selectedTournament.progress.nextMatch}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h3 className="font-bold mb-2">PRIZES</h3>
                        <div className="space-y-3">
                          {selectedTournament.prizes.map((prize, index) => (
                            <div key={index} className="flex items-center">
                              <div className="w-12 text-center">
                                <span className={`${
                                  prize.position === '1st' ? 'text-yellow-400' : 
                                  prize.position === '2nd' ? 'text-gray-300' : 
                                  prize.position === '3rd' ? 'text-yellow-700' : 'text-white'
                                } font-bold`}>
                                  {prize.position}
                                </span>
                              </div>
                              <div className="w-16 h-16 rounded-lg overflow-hidden mx-4">
                                <img 
                                  src={getRewardImage(prize.reward)}
                                  alt="Prize"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                {prize.reward.type === 'currency' && (
                                  <div className="text-yellow-400 font-bold">{prize.reward.amount} Coins</div>
                                )}
                                {prize.reward.type !== 'currency' && (
                                  <div className="font-bold">{prize.reward.name}</div>
                                )}
                                <div className="text-sm text-gray-400">
                                  {prize.reward.type === 'currency' ? 'Currency' : 
                                   prize.reward.type === 'character' ? 'Character' :
                                   prize.reward.type === 'card' ? 'Card Pack' :
                                   prize.reward.type === 'pet' ? 'Pet' :
                                   prize.reward.type === 'background' ? 'Background' :
                                   'Special Reward'}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="font-bold mb-2">DESCRIPTION</h3>
                    <p className="text-gray-300">{selectedTournament.description}</p>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                      onClick={() => setSelectedTournament(null)}
                    >
                      CLOSE
                    </button>
                    
                    {!selectedTournament.registered && 
                     (selectedTournament.status === 'active' || selectedTournament.status === 'upcoming') && (
                      <button 
                        className="bg-purple-700 hover:bg-purple-600 px-4 py-2 rounded-lg font-bold"
                        onClick={() => {
                          setSelectedTournament(null);
                          setShowRegistrationModal(selectedTournament);
                        }}
                      >
                        REGISTER
                      </button>
                    )}
                    
                    {selectedTournament.registered && selectedTournament.status === 'active' && (
                      <button 
                        className="bg-green-700 hover:bg-green-600 px-4 py-2 rounded-lg font-bold"
                      >
                        PLAY NOW
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Registration modal */}
        <AnimatePresence>
          {showRegistrationModal && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div 
                className="bg-gray-900 rounded-xl overflow-hidden max-w-md w-full shadow-neon-strong"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <div className={`p-4 flex justify-between items-center ${
                  showRegistrationModal.status === 'active' ? 'bg-green-900' : 'bg-blue-900'
                }`}>
                  <h2 className="text-xl font-bold">TOURNAMENT REGISTRATION</h2>
                  <button onClick={() => setShowRegistrationModal(null)}>
                    <span className="text-2xl">×</span>
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-xl mb-2">{showRegistrationModal.name}</div>
                    <div className="flex items-center justify-center text-sm text-gray-300">
                      <span className="mr-1">{getGameModeIcon(showRegistrationModal.gameMode)}</span>
                      <span>{showRegistrationModal.gameMode.toUpperCase()}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="font-bold mb-2">ENTRY REQUIREMENTS</h3>
                    
                    {showRegistrationModal.entryFee.type === 'free' && (
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center mr-3">
                          <span className="text-xl">✓</span>
                        </div>
                        <div>
                          <div className="font-bold">Free Entry</div>
                          <div className="text-sm text-gray-300">No cost to participate</div>
                        </div>
                      </div>
                    )}
                    
                    {showRegistrationModal.entryFee.type === 'currency' && (
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-yellow-900 flex items-center justify-center mr-3">
                          <span className="text-yellow-400 text-xl">🪙</span>
                        </div>
                        <div>
                          <div className="font-bold">{showRegistrationModal.entryFee.amount} Coins Required</div>
                          <div className="text-sm text-gray-300">
                            Current balance: <span className="text-yellow-400">{playerData.currency} Coins</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {showRegistrationModal.entryFee.type === 'ticket' && (
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-purple-900 flex items-center justify-center mr-3">
                          <span className="text-purple-400 text-xl">🎟️</span>
                        </div>
                        <div>
                          <div className="font-bold">{showRegistrationModal.entryFee.amount} Tournament Ticket Required</div>
                          <div className="text-sm text-gray-300">
                            Current tickets: <span className="text-purple-400">{playerData.tickets} Tickets</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {showRegistrationModal.entryFee.type === 'qualification' && (
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center mr-3">
                          <span className="text-blue-400 text-xl">🏆</span>
                        </div>
                        <div>
                          <div className="font-bold">Qualification Required</div>
                          <div className="text-sm text-gray-300">
                            Requirement: <span className="text-blue-400">{showRegistrationModal.qualification}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {showRegistrationModal.minimumRank && (
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-3">
                          <span className="text-gray-400 text-xl">🥇</span>
                        </div>
                        <div>
                          <div className="font-bold">Rank Requirement</div>
                          <div className="text-sm text-gray-300">
                            Minimum rank: <span className="text-gray-400">{showRegistrationModal.minimumRank}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h3 className="font-bold mb-2">TOURNAMENT RULES</h3>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Players advance through a bracket system</li>
                      <li>• Each match is best of 3</li>
                      <li>• Standard game rules apply</li>
                      <li>• No refunds for disqualification or withdrawal</li>
                      <li>• Prizes will be awarded at tournament completion</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-between">
                    <button 
                      className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
                      onClick={() => setShowRegistrationModal(null)}
                    >
                      CANCEL
                    </button>
                    
                    <button 
                      className={`px-4 py-2 rounded-lg font-bold ${
                        (showRegistrationModal.entryFee.type === 'currency' && playerData.currency < showRegistrationModal.entryFee.amount) ||
                        (showRegistrationModal.entryFee.type === 'ticket' && playerData.tickets < showRegistrationModal.entryFee.amount)
                          ? 'bg-gray-600 cursor-not-allowed'
                          : 'bg-purple-700 hover:bg-purple-600'
                      }`}
                      disabled={
                        (showRegistrationModal.entryFee.type === 'currency' && playerData.currency < showRegistrationModal.entryFee.amount) ||
                        (showRegistrationModal.entryFee.type === 'ticket' && playerData.tickets < showRegistrationModal.entryFee.amount)
                      }
                      onClick={() => {
                        // Would handle registration logic here
                        setShowRegistrationModal(null);
                      }}
                    >
                      CONFIRM REGISTRATION
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({ label, active, onClick, notification = false }) {
  return (
    <button 
      className={`py-3 px-6 font-bold relative ${
        active ? 'text-white border-b-2 border-purple-500' : 'text-gray-400 hover:text-gray-300'
      }`}
      onClick={onClick}
    >
      {label}
      {notification && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      )}
    </button>
  );
}

export default Compete;