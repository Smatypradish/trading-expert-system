import { useMemo } from 'react';
import { runInference } from '../engine/inferenceEngine';
import { formatPrice } from '../services/marketApi';

function AssetCard({ asset, riskProfile, onClick, onRemove, style }) {
    // Run inference engine to get trading signal
    const analysis = useMemo(() => {
        return runInference(asset, riskProfile);
    }, [asset, riskProfile]);

    const { signal, confidence } = analysis;

    const signalColors = {
        BUY: { bg: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-buy)', border: 'rgba(16, 185, 129, 0.3)' },
        SELL: { bg: 'rgba(239, 68, 68, 0.15)', color: 'var(--color-sell)', border: 'rgba(239, 68, 68, 0.3)' },
        HOLD: { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-hold)', border: 'rgba(245, 158, 11, 0.3)' }
    };

    const priceChange = asset.price_change_percentage_24h || 0;
    const isPositive = priceChange >= 0;

    return (
        <div
            className="card fade-in"
            onClick={onClick}
            style={{
                cursor: 'pointer',
                ...style
            }}
        >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                {/* Asset Icon */}
                <img
                    src={asset.image}
                    alt={asset.name}
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'var(--bg-secondary)'
                    }}
                />

                {/* Asset Info */}
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-xs)' }}>
                        <h3 style={{ fontSize: 'var(--font-size-lg)', margin: 0 }}>{asset.name}</h3>
                        <span style={{
                            color: 'var(--text-muted)',
                            fontSize: 'var(--font-size-sm)',
                            background: 'var(--bg-secondary)',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-sm)'
                        }}>
                            {asset.symbol}
                        </span>
                        <span style={{
                            color: 'var(--text-muted)',
                            fontSize: 'var(--font-size-xs)',
                            marginLeft: 'auto'
                        }}>
                            #{asset.market_cap_rank}
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
                        {/* Price */}
                        <div>
                            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600 }}>
                                {formatPrice(asset.current_price)}
                            </div>
                            <div style={{
                                fontSize: 'var(--font-size-sm)',
                                color: isPositive ? 'var(--color-buy)' : 'var(--color-sell)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}>
                                {isPositive ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                                <span style={{ color: 'var(--text-muted)' }}>24h</span>
                            </div>
                        </div>

                        {/* 7d Change */}
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>7d Change</div>
                            <div style={{
                                fontSize: 'var(--font-size-sm)',
                                fontWeight: 500,
                                color: (asset.price_change_percentage_7d_in_currency || 0) >= 0 ? 'var(--color-buy)' : 'var(--color-sell)'
                            }}>
                                {(asset.price_change_percentage_7d_in_currency || 0) >= 0 ? '+' : ''}
                                {(asset.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                            </div>
                        </div>

                        {/* Signal Badge with Explanation */}
                        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginBottom: '4px' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)',
                                    padding: 'var(--spacing-xs) var(--spacing-md)',
                                    borderRadius: 'var(--border-sharp)',
                                    fontWeight: 700,
                                    fontSize: 'var(--font-size-xs)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    background: signalColors[signal].bg,
                                    color: signalColors[signal].color,
                                    border: `1px solid ${signalColors[signal].border}`
                                }}>
                                    {signal === 'BUY' && '📈'}
                                    {signal === 'SELL' && '📉'}
                                    {signal === 'HOLD' && '⏸️'}
                                    {signal}
                                </div>
                                {/* Explanation Icon */}
                                <div className="info-icon">
                                    ℹ️
                                    <div className="info-tooltip">
                                        {signal === 'BUY' && 'Strong upward momentum + Low volatility indicates favorable entry conditions'}
                                        {signal === 'SELL' && 'Downward trend + Negative momentum suggests exit opportunity'}
                                        {signal === 'HOLD' && 'High volatility or sideways movement - waiting for clearer signals'}
                                    </div>
                                </div>
                            </div>
                            <div className="font-mono" style={{
                                fontSize: 'var(--font-size-xs)',
                                color: 'var(--text-muted)',
                                marginTop: '4px'
                            }}>
                                {(confidence * 100).toFixed(0)}% confidence
                            </div>
                        </div>
                    </div>
                </div>

                {/* Remove Button */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all 0.15s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--color-sell)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                    title="Remove from watchlist"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Quick Analysis */}
            <div style={{
                marginTop: 'var(--spacing-md)',
                paddingTop: 'var(--spacing-md)',
                borderTop: '1px solid var(--border-color)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--text-secondary)'
            }}>
                <strong style={{ color: 'var(--text-primary)' }}>Quick Analysis:</strong>{' '}
                {analysis.explanation?.substring(0, 100)}...
                <span style={{ color: 'var(--accent-primary)', marginLeft: '4px' }}>View details →</span>
            </div>
        </div>
    );
}

export default AssetCard;
