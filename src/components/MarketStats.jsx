import { useMemo } from 'react';
import { formatNumber } from '../services/marketApi';

function MarketStats({ assets }) {
    const stats = useMemo(() => {
        if (!assets.length) return null;

        const totalMarketCap = assets.reduce((sum, a) => sum + (a.market_cap || 0), 0);
        const totalVolume = assets.reduce((sum, a) => sum + (a.total_volume || 0), 0);
        const avgChange24h = assets.reduce((sum, a) => sum + (a.price_change_percentage_24h || 0), 0) / assets.length;

        const gainers = assets.filter(a => (a.price_change_percentage_24h || 0) > 0).length;
        const losers = assets.length - gainers;

        return {
            totalMarketCap,
            totalVolume,
            avgChange24h,
            gainers,
            losers
        };
    }, [assets]);

    if (!stats) return null;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-xl)'
        }}>
            <div className="glass-card" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))'
            }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Market Cap
                </div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                    ${formatNumber(stats.totalMarketCap)}
                </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    24h Volume
                </div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700 }}>
                    ${formatNumber(stats.totalVolume)}
                </div>
            </div>

            <div className="glass-card" style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Avg 24h Change
                </div>
                <div style={{
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 700,
                    color: stats.avgChange24h >= 0 ? 'var(--color-buy)' : 'var(--color-sell)'
                }}>
                    {stats.avgChange24h >= 0 ? '+' : ''}{stats.avgChange24h.toFixed(2)}%
                </div>
            </div>

            <div className="glass-card" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.1)'
            }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Gainers
                </div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-buy)' }}>
                    📈 {stats.gainers}
                </div>
            </div>

            <div className="glass-card" style={{
                padding: 'var(--spacing-md)',
                textAlign: 'center',
                background: 'rgba(239, 68, 68, 0.1)'
            }}>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Losers
                </div>
                <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-sell)' }}>
                    📉 {stats.losers}
                </div>
            </div>
        </div>
    );
}

export default MarketStats;
