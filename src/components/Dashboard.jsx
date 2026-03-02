import { useState, useEffect, useMemo } from 'react';
import AssetCard from './AssetCard';
import RiskProfile from './RiskProfile';
import TrendingCoins from './TrendingCoins';
import MarketStats from './MarketStats';
import { RISK_PROFILES } from '../engine/knowledgeBase';
import { runInference } from '../engine/inferenceEngine';

function Dashboard({ assets, loading, error, riskProfile, onRiskProfileChange, onSelectAsset, onRemoveAsset }) {
    const [activeTab, setActiveTab] = useState('all');
    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'compact'

    // Filter assets based on active tab
    const filteredAssets = useMemo(() => {
        if (activeTab === 'all') return assets;

        return assets.filter(asset => {
            const analysis = runInference(asset, riskProfile);
            return analysis.signal.toLowerCase() === activeTab.toLowerCase();
        });
    }, [assets, activeTab, riskProfile]);

    if (error) {
        return (
            <div className="empty-state glass-card">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4M12 16h.01" />
                </svg>
                <h3>Connection Error</h3>
                <p>{error}</p>
                <button className="btn btn-primary" onClick={() => window.location.reload()}>
                    Retry
                </button>
            </div>
        );
    }

    // Calculate market summary
    const marketSummary = {
        totalAssets: assets.length,
        buySignals: 0,
        sellSignals: 0,
        holdSignals: 0,
        avgChange24h: 0
    };

    return (
        <div className="dashboard-grid">
            <div className="main-panel">
                {/* Market Stats Bar */}
                <MarketStats assets={assets} />

                <div className="section-header">
                    <div>
                        <h2 className="section-title">Market Analysis</h2>
                        <p className="section-subtitle">Real-time cryptocurrency analysis with expert system recommendations</p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                        {/* View Mode Toggle */}
                        <div className="tabs" style={{ marginRight: 'var(--spacing-sm)' }}>
                            <button
                                className={`tab ${viewMode === 'cards' ? 'active' : ''}`}
                                onClick={() => setViewMode('cards')}
                                title="Card View"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7" rx="1" />
                                    <rect x="14" y="3" width="7" height="7" rx="1" />
                                    <rect x="3" y="14" width="7" height="7" rx="1" />
                                    <rect x="14" y="14" width="7" height="7" rx="1" />
                                </svg>
                            </button>
                            <button
                                className={`tab ${viewMode === 'compact' ? 'active' : ''}`}
                                onClick={() => setViewMode('compact')}
                                title="Compact View"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
                                </svg>
                            </button>
                        </div>

                        {/* Tab Filter */}
                        <div className="tabs">
                            <button
                                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                                onClick={() => setActiveTab('all')}
                            >
                                All Assets ({assets.length})
                            </button>
                            <button
                                className={`tab ${activeTab === 'buy' ? 'active' : ''}`}
                                onClick={() => setActiveTab('buy')}
                            >
                                📈 Buy
                            </button>
                            <button
                                className={`tab ${activeTab === 'sell' ? 'active' : ''}`}
                                onClick={() => setActiveTab('sell')}
                            >
                                📉 Sell
                            </button>
                            <button
                                className={`tab ${activeTab === 'hold' ? 'active' : ''}`}
                                onClick={() => setActiveTab('hold')}
                            >
                                ⏸️ Hold
                            </button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="asset-list">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="card" style={{ padding: 'var(--spacing-md)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                                    <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                                    <div style={{ flex: 1 }}>
                                        <div className="skeleton skeleton-text large" style={{ width: '120px', marginBottom: '4px' }} />
                                        <div className="skeleton skeleton-text" style={{ width: '60px' }} />
                                    </div>
                                    <div className="skeleton" style={{ width: '70px', height: '24px' }} />
                                </div>
                                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                                    <div className="skeleton skeleton-text" style={{ width: '80px' }} />
                                    <div className="skeleton skeleton-text" style={{ width: '80px' }} />
                                    <div className="skeleton skeleton-text" style={{ width: '80px' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={viewMode === 'compact' ? 'asset-grid' : 'asset-list'} style={
                        viewMode === 'compact' ? {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: 'var(--spacing-md)'
                        } : {}
                    }>
                        {filteredAssets.map((asset, index) => (
                            <AssetCard
                                key={asset.id}
                                asset={asset}
                                riskProfile={riskProfile}
                                onClick={() => onSelectAsset(asset)}
                                onRemove={() => onRemoveAsset(asset.id)}
                                compact={viewMode === 'compact'}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredAssets.length === 0 && assets.length > 0 && (
                    <div className="empty-state glass-card">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 3h18v18H3z" />
                        </svg>
                        <h3>No {activeTab.toUpperCase()} Signals</h3>
                        <p>No assets match the selected filter</p>
                    </div>
                )}

                {!loading && assets.length === 0 && (
                    <div className="empty-state glass-card">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3>No Assets Found</h3>
                        <p>Search for cryptocurrencies to add to your watchlist</p>
                    </div>
                )}
            </div>

            <aside className="sidebar">
                <RiskProfile
                    profile={riskProfile}
                    onChange={onRiskProfileChange}
                    profiles={RISK_PROFILES}
                />

                {/* Trending Coins */}
                <TrendingCoins />

                <div className="glass-card" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                        🧠 System Info
                    </h3>
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                        <p style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <strong>Knowledge Base:</strong> Rule-based expert system
                        </p>
                        <p style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <strong>Reasoning:</strong> Forward chaining inference
                        </p>
                        <p style={{ marginBottom: 'var(--spacing-sm)' }}>
                            <strong>Data Source:</strong> CoinGecko API
                        </p>
                        <p>
                            <strong>Last Update:</strong> {new Date().toLocaleTimeString()}
                        </p>
                    </div>
                </div>

                <div className="glass-card" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                        ⚠️ Disclaimer
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                        This is an educational expert system demonstrating Knowledge Engineering principles.
                        Not financial advice. Past performance does not guarantee future results.
                    </p>
                </div>
            </aside>
        </div>
    );
}

export default Dashboard;
