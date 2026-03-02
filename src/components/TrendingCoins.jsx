import { useState, useEffect } from 'react';
import { fetchTrendingCoins } from '../services/marketApi';

function TrendingCoins() {
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTrending = async () => {
            try {
                const data = await fetchTrendingCoins();
                setTrending(data.slice(0, 5));
            } catch (error) {
                console.error('Error loading trending:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTrending();
    }, []);

    if (loading) {
        return (
            <div className="glass-card" style={{ marginTop: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                    🔥 Trending
                </h3>
                <div className="pulse" style={{ height: '150px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }} />
            </div>
        );
    }

    return (
        <div className="glass-card" style={{ marginTop: 'var(--spacing-lg)' }}>
            <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: 'var(--font-size-lg)' }}>
                🔥 Trending Now
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                {trending.map((coin, index) => (
                    <div
                        key={coin.id}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            padding: 'var(--spacing-sm)',
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            transition: 'all 0.15s'
                        }}
                    >
                        <span style={{
                            color: 'var(--text-muted)',
                            fontSize: 'var(--font-size-xs)',
                            width: '16px'
                        }}>
                            {index + 1}
                        </span>
                        <img
                            src={coin.thumb}
                            alt={coin.name}
                            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                                fontWeight: 500,
                                fontSize: 'var(--font-size-sm)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {coin.name}
                            </div>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                                {coin.symbol}
                            </div>
                        </div>
                        {coin.marketCapRank && (
                            <span style={{
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--text-muted)',
                                background: 'var(--bg-card)',
                                padding: '2px 6px',
                                borderRadius: 'var(--radius-sm)'
                            }}>
                                #{coin.marketCapRank}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrendingCoins;
