import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AssetDetailModal from './components/AssetDetailModal';
import AuthModal from './components/AuthModal';
import { fetchCryptoMarketData, DEFAULT_CRYPTOS } from './services/marketApi';
import { RISK_PROFILES } from './engine/knowledgeBase';
import './index.css';

// Extended crypto list for more options
const EXTENDED_CRYPTOS = [
  'bitcoin', 'ethereum', 'binancecoin', 'solana', 'cardano',
  'ripple', 'polkadot', 'dogecoin', 'avalanche-2', 'chainlink',
  'polygon', 'uniswap', 'litecoin', 'cosmos', 'stellar',
  'monero', 'tron', 'near', 'algorand', 'fantom'
];

function AppContent() {
  const { currentUser, userProfile, updateWatchlist, updateRiskLevel } = useAuth();

  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Use user's saved watchlist if logged in, otherwise use defaults
  const [watchlist, setWatchlist] = useState(() => {
    if (userProfile?.watchlist) return userProfile.watchlist;
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : EXTENDED_CRYPTOS.slice(0, 8);
  });

  // Use user's saved risk profile if logged in
  const [riskProfile, setRiskProfile] = useState(() => {
    if (userProfile?.riskLevel) {
      const level = userProfile.riskLevel;
      if (level <= 3) return RISK_PROFILES.CONSERVATIVE;
      if (level <= 6) return RISK_PROFILES.MODERATE;
      return RISK_PROFILES.AGGRESSIVE;
    }
    return RISK_PROFILES.MODERATE;
  });

  // Update watchlist when user profile loads
  useEffect(() => {
    if (userProfile?.watchlist) {
      setWatchlist(userProfile.watchlist);
    }
    if (userProfile?.riskLevel) {
      const level = userProfile.riskLevel;
      if (level <= 3) setRiskProfile(RISK_PROFILES.CONSERVATIVE);
      else if (level <= 6) setRiskProfile(RISK_PROFILES.MODERATE);
      else setRiskProfile(RISK_PROFILES.AGGRESSIVE);
    }
  }, [userProfile]);

  // Fetch market data with retry logic
  useEffect(() => {
    const loadMarketData = async (retryCount = 0) => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchCryptoMarketData(watchlist);
        setAssets(data);
      } catch (err) {
        console.error('Market data error:', err);

        // Check if it's a rate limit error
        if (err.message.includes('429') && retryCount < 2) {
          const retryDelay = (retryCount + 1) * 3000; // 3s, 6s delays
          setError(`Rate limit hit. Retrying in ${retryDelay / 1000}s...`);

          setTimeout(() => {
            loadMarketData(retryCount + 1);
          }, retryDelay);
          return;
        }

        setError('Failed to load market data. Please try later or refresh.');
      } finally {
        setLoading(false);
      }
    };

    loadMarketData();

    // Refresh data every 60 seconds
    const interval = setInterval(() => loadMarketData(), 60000);
    return () => clearInterval(interval);
  }, [watchlist]);

  // Save watchlist
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, currentUser]);

  const handleSelectAsset = (asset) => {
    setSelectedAsset(asset);
  };

  const handleCloseModal = () => {
    setSelectedAsset(null);
  };

  const handleAddToWatchlist = async (coinId) => {
    if (!watchlist.includes(coinId)) {
      const newWatchlist = [...watchlist, coinId];
      setWatchlist(newWatchlist);
      if (currentUser) {
        await updateWatchlist(newWatchlist);
      }
    }
  };

  const handleRemoveFromWatchlist = async (coinId) => {
    const newWatchlist = watchlist.filter(id => id !== coinId);
    setWatchlist(newWatchlist);
    if (currentUser) {
      await updateWatchlist(newWatchlist);
    }
  };

  const handleRiskProfileChange = async (profile) => {
    setRiskProfile(profile);
    if (currentUser) {
      await updateRiskLevel(profile.level);
    }
  };

  return (
    <div className="app">
      <div className="bg-pattern"></div>

      <Header
        onAddCoin={handleAddToWatchlist}
        onShowAuth={() => setShowAuthModal(true)}
        onViewCoin={handleSelectAsset}
      />

      <main className="main-content">
        <div className="container">
          <Dashboard
            assets={assets}
            loading={loading}
            error={error}
            riskProfile={riskProfile}
            onRiskProfileChange={handleRiskProfileChange}
            onSelectAsset={handleSelectAsset}
            onRemoveAsset={handleRemoveFromWatchlist}
          />
        </div>
      </main>

      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          riskProfile={riskProfile}
          onClose={handleCloseModal}
        />
      )}

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Risk Disclaimer Footer */}
      <div className="risk-disclaimer">
        <strong>⚠️ RISK WARNING:</strong> Trading involves risk. This system is for informational and educational purposes only. Not financial advice.
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
