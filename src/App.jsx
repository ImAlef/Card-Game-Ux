import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainMenu from './components/MainMenu';
import HokmLobby from './components/EnhancedHokmLobby';
import HokmGame from './components/HokmGame';
import PokerTable from './components/PokerTable';
import DailyReward from './components/DailyReward';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';
import Settings from './components/Settings';
import Friends from './components/Friends';
import Shop from './components/Shop';
import Customize from './components/Customize';
import AppPreloader from './components/AppPreloader';
import HokmLobbies from './components/HokmLobbies';
import EnhancedHokmLobby from './components/EnhancedHokmLobby';
import OrientationHandler from './components/OrientationHandler';
import BattlePass from './components/BattlePass';
import Quests from './components/Quests';
import Compete from './components/Compete';
import './App.css';
import './responsiveUtils.css'; // Import responsive utilities

function App() {
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  return (
    <AppPreloader onComplete={() => setAssetsLoaded(true)}>
      <OrientationHandler>
        <Router>
          <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/hokm-lobbies" element={<HokmLobbies />} />
            <Route path="/hokm-lobby/:lobbyId" element={<EnhancedHokmLobby />} />
            <Route path="/hokm-lobby" element={<HokmLobby />} />
            <Route path="/hokm-game" element={<HokmGame />} />
            <Route path="/poker-table" element={<PokerTable />} />
            <Route path="/daily-reward" element={<DailyReward />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/customize" element={<Customize />} />
             {/* اضافه کردن مسیرهای جدید */}
            <Route path="/battlepass" element={<BattlePass />} />
            <Route path="/quests" element={<Quests />} />
            <Route path="/compete" element={<Compete />} />
            <Route path="/tournaments" element={<Compete />} />
  

            <Route path="*" element={<div className="min-h-screen bg-arcane flex flex-col items-center justify-center p-10">
              <h1 className="text-4xl text-yellow-400 font-bold mb-6">Page Not Found</h1>
              <p className="text-white mb-6">The page you're looking for doesn't exist.</p>
              <a href="/" className="px-6 py-3 bg-purple-800 text-white rounded-lg shadow-neon hover-glow">Back to Home</a>
            </div>} />
          </Routes>
        </Router>
      </OrientationHandler>
    </AppPreloader>
  );
}

export default App;