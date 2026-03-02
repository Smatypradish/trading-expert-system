import { useMemo, useState, useEffect } from 'react';
import { runInference, generateExplanation } from '../engine/inferenceEngine';
import { fetchPriceHistory, formatPrice, formatNumber } from '../services/marketApi';
import { getSentiment, getVolatilityLevel } from '../engine/knowledgeBase';
import PriceChart from './PriceChart';

function AssetDetailModal({ asset, riskProfile, onClose }) {
    const [priceHistory, setPriceHistory] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [activeTab, setActiveTab] = useState('analysis');

    // Run inference
    const analysis = useMemo(() => {
        return runInference(asset, riskProfile);
    }, [asset, riskProfile]);

    // Generate explanation
    const explanation = useMemo(() => {
        return generateExplanation(analysis);
    }, [analysis]);

    // Get sentiment and volatility
    const sentiment = getSentiment(analysis.facts.priceChange7d);
    const volatility = getVolatilityLevel(analysis.facts.volatility);

    // Fetch price history
    useEffect(() => {
        const loadHistory = async () => {
            try {
                setLoadingHistory(true);
                const history = await fetchPriceHistory(asset.id, 7);
                setPriceHistory(history);
            } catch (error) {
                console.error('Error loading price history:', error);
            } finally {
                setLoadingHistory(false);
            }
        };
        loadHistory();
    }, [asset.id]);

    const { signal, confidence, targets } = analysis;

    const signalStyles = {
        BUY: { bg: 'linear-gradient(135deg, #10b981, #059669)', shadow: '0 0 40px rgba(16, 185, 129, 0.4)' },
        SELL: { bg: 'linear-gradient(135deg, #ef4444, #dc2626)', shadow: '0 0 40px rgba(239, 68, 68, 0.4)' },
        HOLD: { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', shadow: '0 0 40px rgba(245, 158, 11, 0.4)' }
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: 'var(--spacing-lg)'
            }}
        >
            <div
                className="modal-content fade-in"
                onClick={e => e.stopPropagation()}
                style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xl)',
                    width: '100%',
                    maxWidth: '900px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    padding: 'var(--spacing-lg)',
                    borderBottom: '1px solid var(--border-color)',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--bg-card)',
                    zIndex: 10
                }}>
                    <img
                        src={asset.image}
                        alt={asset.name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%' }}
                    />
                    <div style={{ flex: 1 }}>
                        <h2 style={{ margin: 0, fontSize: 'var(--font-size-2xl)' }}>
                            {asset.name}
                            <span style={{
                                color: 'var(--text-muted)',
                                fontSize: 'var(--font-size-lg)',
                                marginLeft: 'var(--spacing-sm)'
                            }}>
                                {asset.symbol}
                            </span>
                        </h2>
                        <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                            Rank #{asset.market_cap_rank} • Market Cap: ${formatNumber(asset.market_cap)}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--spacing-sm)',
                            cursor: 'pointer',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Main Signal Display */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--spacing-lg)',
                    padding: 'var(--spacing-lg)'
                }}>
                    {/* Signal Card */}
                    <div style={{
                        background: signalStyles[signal].bg,
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-xl)',
                        textAlign: 'center',
                        boxShadow: signalStyles[signal].shadow
                    }}>
                        <div style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 700, color: 'white' }}>
                            {signal}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-lg)', color: 'rgba(255,255,255,0.9)', marginTop: 'var(--spacing-sm)' }}>
                            {(confidence * 100).toFixed(0)}% Confidence
                        </div>
                        <div style={{
                            marginTop: 'var(--spacing-md)',
                            fontSize: 'var(--font-size-sm)',
                            color: 'rgba(255,255,255,0.8)'
                        }}>
                            Based on: {analysis.ruleApplied}
                        </div>
                    </div>

                    {/* Price Info */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-lg)'
                    }}>
                        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                            {formatPrice(asset.current_price)}
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-lg)',
                            marginTop: 'var(--spacing-md)'
                        }}>
                            <div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>24h Change</div>
                                <div style={{
                                    fontWeight: 600,
                                    color: (asset.price_change_percentage_24h || 0) >= 0 ? 'var(--color-buy)' : 'var(--color-sell)'
                                }}>
                                    {(asset.price_change_percentage_24h || 0) >= 0 ? '+' : ''}
                                    {(asset.price_change_percentage_24h || 0).toFixed(2)}%
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>7d Change</div>
                                <div style={{
                                    fontWeight: 600,
                                    color: (asset.price_change_percentage_7d_in_currency || 0) >= 0 ? 'var(--color-buy)' : 'var(--color-sell)'
                                }}>
                                    {(asset.price_change_percentage_7d_in_currency || 0) >= 0 ? '+' : ''}
                                    {(asset.price_change_percentage_7d_in_currency || 0).toFixed(2)}%
                                </div>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-md)',
                            marginTop: 'var(--spacing-md)'
                        }}>
                            <div style={{
                                flex: 1,
                                padding: 'var(--spacing-sm)',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-sm)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Sentiment</div>
                                <div style={{ fontWeight: 600, color: sentiment.color }}>{sentiment.label}</div>
                            </div>
                            <div style={{
                                flex: 1,
                                padding: 'var(--spacing-sm)',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-sm)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Volatility</div>
                                <div style={{ fontWeight: 600, color: volatility.color }}>{volatility.label}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ padding: '0 var(--spacing-lg)' }}>
                    <div className="tabs" style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <button
                            className={`tab ${activeTab === 'analysis' ? 'active' : ''}`}
                            onClick={() => setActiveTab('analysis')}
                        >
                            📊 Analysis
                        </button>
                        <button
                            className={`tab ${activeTab === 'explanation' ? 'active' : ''}`}
                            onClick={() => setActiveTab('explanation')}
                        >
                            💡 Explanation
                        </button>
                        <button
                            className={`tab ${activeTab === 'targets' ? 'active' : ''}`}
                            onClick={() => setActiveTab('targets')}
                        >
                            🎯 Targets
                        </button>
                        <button
                            className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
                            onClick={() => setActiveTab('rules')}
                        >
                            📜 Rules Applied
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div style={{ padding: '0 var(--spacing-lg) var(--spacing-lg)' }}>
                    {/* Analysis Tab */}
                    {activeTab === 'analysis' && (
                        <div>
                            {/* Chart */}
                            {loadingHistory ? (
                                <div style={{
                                    height: '300px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--bg-secondary)',
                                    borderRadius: 'var(--radius-lg)'
                                }}>
                                    <div className="loading-spinner"></div>
                                </div>
                            ) : priceHistory ? (
                                <PriceChart data={priceHistory} signal={signal} />
                            ) : null}

                            {/* Market Facts */}
                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: 'var(--spacing-md)'
                            }}>
                                {[
                                    { label: '24h High', value: formatPrice(asset.high_24h) },
                                    { label: '24h Low', value: formatPrice(asset.low_24h) },
                                    { label: 'All-Time High', value: formatPrice(asset.ath) },
                                    { label: 'All-Time Low', value: formatPrice(asset.atl) }
                                ].map((item, i) => (
                                    <div key={i} style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{item.label}</div>
                                        <div style={{ fontWeight: 600 }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Explanation Tab */}
                    {activeTab === 'explanation' && (
                        <div style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-lg)'
                        }}>
                            <h3 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--accent-primary)' }}>
                                🧠 Decision Explanation
                            </h3>

                            {explanation.map((section, i) => (
                                <div key={i} style={{ marginBottom: 'var(--spacing-lg)' }}>
                                    <h4 style={{
                                        fontSize: 'var(--font-size-sm)',
                                        color: 'var(--text-muted)',
                                        marginBottom: 'var(--spacing-sm)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>
                                        {section.title}
                                    </h4>
                                    {section.content && (
                                        <p style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{section.content}</p>
                                    )}
                                    {section.items && (
                                        <ul style={{
                                            listStyle: 'none',
                                            padding: 0,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 'var(--spacing-xs)'
                                        }}>
                                            {section.items.map((item, j) => (
                                                <li key={j} style={{
                                                    padding: 'var(--spacing-sm)',
                                                    background: 'var(--bg-card)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    borderLeft: '3px solid var(--accent-primary)'
                                                }}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}

                            <div style={{
                                marginTop: 'var(--spacing-lg)',
                                padding: 'var(--spacing-md)',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: '3px solid var(--color-hold)'
                            }}>
                                <strong>Note:</strong> This explanation demonstrates the Knowledge Engineering principle of
                                <em> explainability</em>, which is crucial for building trust in expert systems.
                            </div>
                        </div>
                    )}

                    {/* Targets Tab */}
                    {activeTab === 'targets' && (
                        <div style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-lg)'
                        }}>
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                                🎯 Risk-Adjusted Price Targets
                            </h3>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 'var(--spacing-md)',
                                marginBottom: 'var(--spacing-lg)'
                            }}>
                                {signal === 'BUY' && (
                                    <>
                                        <div style={{
                                            padding: 'var(--spacing-lg)',
                                            background: 'var(--bg-card)',
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center',
                                            border: '1px solid var(--accent-primary)'
                                        }}>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Entry Price</div>
                                            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--accent-primary)' }}>
                                                {formatPrice(targets.entryPrice)}
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: 'var(--spacing-lg)',
                                            background: 'var(--bg-card)',
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center',
                                            border: '1px solid var(--color-sell)'
                                        }}>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Stop Loss</div>
                                            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-sell)' }}>
                                                {formatPrice(targets.stopLoss)}
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-sell)' }}>
                                                {targets.potentialLoss} risk
                                            </div>
                                        </div>
                                        <div style={{
                                            padding: 'var(--spacing-lg)',
                                            background: 'var(--bg-card)',
                                            borderRadius: 'var(--radius-md)',
                                            textAlign: 'center',
                                            border: '1px solid var(--color-buy)'
                                        }}>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Target Price</div>
                                            <div style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-buy)' }}>
                                                {formatPrice(targets.targetPrice)}
                                            </div>
                                            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-buy)' }}>
                                                {targets.potentialGain} potential
                                            </div>
                                        </div>
                                    </>
                                )}

                                {signal === 'SELL' && (
                                    <div style={{
                                        gridColumn: 'span 3',
                                        padding: 'var(--spacing-lg)',
                                        background: 'var(--bg-card)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center',
                                        border: '1px solid var(--color-sell)'
                                    }}>
                                        <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-sell)' }}>
                                            Recommended: Exit Position
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
                                            {targets.recommendation}
                                        </div>
                                    </div>
                                )}

                                {signal === 'HOLD' && (
                                    <div style={{
                                        gridColumn: 'span 3',
                                        padding: 'var(--spacing-lg)',
                                        background: 'var(--bg-card)',
                                        borderRadius: 'var(--radius-md)',
                                        textAlign: 'center',
                                        border: '1px solid var(--color-hold)'
                                    }}>
                                        <div style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-hold)' }}>
                                            Recommended: Maintain Position
                                        </div>
                                        <div style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)' }}>
                                            {targets.recommendation}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: 'var(--spacing-lg)',
                                            justifyContent: 'center',
                                            marginTop: 'var(--spacing-md)'
                                        }}>
                                            <div>
                                                <span style={{ color: 'var(--text-muted)' }}>Watch Level: </span>
                                                <span style={{ fontWeight: 600 }}>{formatPrice(targets.watchLevel)}</span>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-muted)' }}>Breakout Level: </span>
                                                <span style={{ fontWeight: 600 }}>{formatPrice(targets.breakoutLevel)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{
                                padding: 'var(--spacing-md)',
                                background: 'var(--bg-card)',
                                borderRadius: 'var(--radius-md)',
                                fontSize: 'var(--font-size-sm)',
                                color: 'var(--text-secondary)'
                            }}>
                                <strong>Risk Profile:</strong> {analysis.riskProfile} |
                                <strong> Risk/Reward:</strong> 1:{targets.riskRewardRatio || riskProfile.targetMultiplier}
                            </div>
                        </div>
                    )}

                    {/* Rules Tab */}
                    {activeTab === 'rules' && (
                        <div style={{
                            background: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-lg)'
                        }}>
                            <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>
                                📜 Knowledge Base Rules Evaluated
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                                {analysis.allRuleResults.map((rule, i) => (
                                    <div key={i} style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--bg-card)',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: `3px solid ${rule.isFullMatch ? 'var(--color-buy)' : rule.matchScore > 0.5 ? 'var(--color-hold)' : 'var(--border-color)'}`
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            marginBottom: 'var(--spacing-sm)'
                                        }}>
                                            <span style={{ fontWeight: 600 }}>{rule.ruleName}</span>
                                            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                                                <span className={`signal-badge signal-${rule.action.toLowerCase()}`} style={{ fontSize: 'var(--font-size-xs)' }}>
                                                    {rule.action}
                                                </span>
                                                <span style={{
                                                    fontSize: 'var(--font-size-xs)',
                                                    color: rule.isFullMatch ? 'var(--color-buy)' : 'var(--text-muted)'
                                                }}>
                                                    {rule.isFullMatch ? '✓ MATCHED' : `${(rule.matchScore * 100).toFixed(0)}% match`}
                                                </span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                                            {rule.explanation}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AssetDetailModal;
