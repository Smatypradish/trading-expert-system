import { useState, useEffect, useRef } from 'react';
import { searchCoins, fetchCoinDetails } from '../services/marketApi';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { t } from '../utils/i18n';


function Header({ onAddCoin, onShowAuth, onViewCoin }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showLanguageMenu, setShowLanguageMenu] = useState(false);
    const [searchError, setSearchError] = useState('');

    const debounceTimer = useRef(null);
    const { currentUser, userProfile, logout } = useAuth();
    const { language, setLanguage } = useLanguage();

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSearchError('');

        if (query.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Set new timer - wait 500ms after user stops typing
        debounceTimer.current = setTimeout(async () => {
            try {
                setIsSearching(true);
                const results = await searchCoins(query);
                setSearchResults(results);
                setShowResults(true);
                setSearchError('');
            } catch (error) {
                console.error('Search error:', error);
                if (error.message.includes('429')) {
                    setSearchError('Too many requests. Please wait a moment and try again.');
                } else {
                    setSearchError('Search failed. Please try again.');
                }
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    const handleViewCoin = async (coinId) => {
        setSearchQuery('');
        setSearchResults([]);
        setShowResults(false);

        try {
            const coinDetails = await fetchCoinDetails(coinId);
            if (onViewCoin) {
                onViewCoin(coinDetails);
            }
        } catch (error) {
            console.error('Error fetching coin:', error);
            setSearchError('Failed to load coin details. Please try again.');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setShowUserMenu(false);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                {/* Logo */}
                <div className="logo">
                    <div className="logo-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    <span>TradingExpert<span style={{ color: '#3861FB' }}>AI</span></span>
                </div>

                {/* Live Status Indicator */}
                <div className="system-status">
                    <span className="status-dot"></span>
                    {t('systemStatus', language)}
                </div>

                {/* Search Container */}
                <div className="search-container" style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
                    <input
                        type="text"
                        placeholder={t('searchPlaceholder', language)}
                        value={searchQuery}
                        onChange={handleSearch}
                        onBlur={() => setTimeout(() => setShowResults(false), 200)}
                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                        style={{ width: '100%', paddingLeft: '2.5rem' }}
                    />
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--text-muted)"
                        strokeWidth="2"
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}>
                        <circle cx="11" cy="11" r="8" />
                        <path d="M21 21l-4.35-4.35" />
                    </svg>

                    {/* Search Error */}
                    {searchError && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '4px',
                            background: 'rgba(246, 70, 93, 0.15)',
                            border: '1px solid var(--color-sell)',
                            borderRadius: 'var(--border-medium)',
                            padding: 'var(--spacing-sm)',
                            color: 'var(--color-sell)',
                            fontSize: 'var(--font-size-xs)',
                            zIndex: 1000
                        }}>
                            {searchError}
                        </div>
                    )}

                    {/* Search Results */}
                    {showResults && searchResults.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '4px',
                            background: 'var(--bg-surface)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--border-medium)',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            zIndex: 1000
                        }}>
                            {searchResults.map(coin => (
                                <button
                                    key={coin.id}
                                    onClick={() => handleViewCoin(coin.id)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-sm)',
                                        padding: 'var(--spacing-sm) var(--spacing-md)',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '1px solid var(--border-color)',
                                        cursor: 'pointer',
                                        color: 'var(--text-primary)',
                                        textAlign: 'left',
                                        transition: 'background var(--transition-fast)'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                    <img src={coin.thumb} alt={coin.name} style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{coin.name}</div>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{coin.symbol}</div>
                                    </div>
                                    {coin.marketCapRank && (
                                        <div className="font-mono" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                            #{coin.marketCapRank}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>


                {/* User Menu */}
                <nav style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                    {/* Language Selector */}
                    <div className="language-selector" style={{ position: 'relative' }}>
                        <button
                            onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                            className="language-btn">
                            🌐 {language.toUpperCase()}
                        </button>
                        {showLanguageMenu && (
                            <div className="language-dropdown">
                                <button
                                    onClick={() => { setLanguage('en'); setShowLanguageMenu(false); }}
                                    className={`language-option ${language === 'en' ? 'active' : ''}`}>
                                    🇺🇸 English
                                </button>
                                <button
                                    onClick={() => { setLanguage('ta'); setShowLanguageMenu(false); }}
                                    className={`language-option ${language === 'ta' ? 'active' : ''}`}>
                                    🇮🇳 தமிழ்
                                </button>
                            </div>
                        )}
                    </div>
                    {currentUser ? (
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)',
                                    padding: '6px var(--spacing-sm)',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--border-sharp)',
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)',
                                    fontSize: 'var(--font-size-xs)',
                                    fontWeight: 600,
                                    transition: 'all var(--transition-fast)'
                                }}>
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: 'white'
                                }}>
                                    {(userProfile?.displayName || currentUser.email)?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <span style={{ fontSize: 'var(--font-size-sm)' }}>
                                    {userProfile?.displayName || currentUser.email?.split('@')[0]}
                                </span>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M6 9l6 6 6-6" />
                                </svg>
                            </button>

                            {showUserMenu && (
                                <div style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    marginTop: '4px',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-color)',
                                    borderRadius: 'var(--border-medium)',
                                    minWidth: '180px',
                                    zIndex: 1000
                                }}>
                                    <div style={{
                                        padding: 'var(--spacing-sm) var(--spacing-md)',
                                        borderBottom: '1px solid var(--border-color)',
                                        fontSize: 'var(--font-size-xs)',
                                        color: 'var(--text-muted)'
                                    }}>
                                        {t('signedInAs', language)}<br />
                                        <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-data)' }}>{currentUser.email}</strong>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: '100%',
                                            padding: 'var(--spacing-sm) var(--spacing-md)',
                                            background: 'transparent',
                                            border: 'none',
                                            color: 'var(--color-sell)',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                            fontSize: 'var(--font-size-sm)',
                                            fontWeight: 600,
                                            transition: 'background var(--transition-fast)'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                        {t('signOut', language)}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={onShowAuth}
                            className="btn btn-primary"
                            style={{ padding: '6px var(--spacing-md)' }}>
                            {t('signIn', language)}
                        </button>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Header;
