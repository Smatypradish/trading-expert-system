// Knowledge Base - Expert Trading Rules
// Defines facts, rules, and relationships for trading decisions

export const RISK_PROFILES = {
  CONSERVATIVE: {
    id: 'conservative',
    name: 'Conservative',
    level: 3,
    stopLossPercent: 3,
    targetMultiplier: 1.5,
    maxVolatilityTolerance: 0.3,
    description: 'Low risk, smaller gains, tighter stop-losses'
  },
  MODERATE: {
    id: 'moderate',
    name: 'Moderate',
    level: 5,
    stopLossPercent: 5,
    targetMultiplier: 2,
    maxVolatilityTolerance: 0.5,
    description: 'Balanced risk/reward approach'
  },
  AGGRESSIVE: {
    id: 'aggressive',
    name: 'Aggressive',
    level: 8,
    stopLossPercent: 10,
    targetMultiplier: 3,
    maxVolatilityTolerance: 0.8,
    description: 'Higher risk for potentially larger gains'
  }
};

// Trading Rules Knowledge Base
export const TRADING_RULES = [
  // STRONG BUY RULES
  {
    id: 'RULE_STRONG_BUY_1',
    name: 'Strong Uptrend with Low Volatility',
    conditions: {
      priceChange7d: { operator: '>', value: 5 },
      priceChange24h: { operator: '>', value: 0 },
      volatility: { operator: '<', value: 0.3 }
    },
    action: 'BUY',
    confidence: 0.85,
    explanation: 'Strong upward trend over 7 days with continued positive momentum and low market volatility indicates a favorable entry point.'
  },
  {
    id: 'RULE_STRONG_BUY_2',
    name: 'Bounce from Support with Volume',
    conditions: {
      priceChange24h: { operator: '>', value: 3 },
      priceFromATL: { operator: '<', value: 30 },
      volatility: { operator: '<', value: 0.5 }
    },
    action: 'BUY',
    confidence: 0.75,
    explanation: 'Price showing strong recovery from near all-time low levels suggests potential reversal and buying opportunity.'
  },
  {
    id: 'RULE_MODERATE_BUY',
    name: 'Steady Growth Pattern',
    conditions: {
      priceChange7d: { operator: '>', value: 2 },
      priceChange24h: { operator: '>', value: -2 },
      volatility: { operator: '<', value: 0.4 }
    },
    action: 'BUY',
    confidence: 0.65,
    explanation: 'Consistent positive trend with acceptable volatility suggests moderate buying opportunity.'
  },

  // SELL RULES
  {
    id: 'RULE_STRONG_SELL_1',
    name: 'Strong Downtrend',
    conditions: {
      priceChange7d: { operator: '<', value: -8 },
      priceChange24h: { operator: '<', value: -3 }
    },
    action: 'SELL',
    confidence: 0.85,
    explanation: 'Significant downward trend over 7 days with continued negative momentum suggests exiting position to minimize losses.'
  },
  {
    id: 'RULE_STRONG_SELL_2',
    name: 'Near All-Time High with Reversal',
    conditions: {
      priceFromATH: { operator: '<', value: 10 },
      priceChange24h: { operator: '<', value: -5 }
    },
    action: 'SELL',
    confidence: 0.80,
    explanation: 'Price near all-time high showing reversal signals - taking profits recommended.'
  },
  {
    id: 'RULE_MODERATE_SELL',
    name: 'Declining Momentum',
    conditions: {
      priceChange7d: { operator: '<', value: -5 },
      priceChange24h: { operator: '<', value: 0 }
    },
    action: 'SELL',
    confidence: 0.70,
    explanation: 'Continued negative momentum indicates weakening market - consider reducing exposure.'
  },

  // HOLD RULES
  {
    id: 'RULE_HOLD_VOLATILE',
    name: 'High Volatility Warning',
    conditions: {
      volatility: { operator: '>', value: 0.6 }
    },
    action: 'HOLD',
    confidence: 0.75,
    explanation: 'Market volatility is too high for confident entry or exit. Wait for market stabilization.'
  },
  {
    id: 'RULE_HOLD_SIDEWAYS',
    name: 'Sideways Movement',
    conditions: {
      priceChange7d: { operator: 'between', value: [-3, 3] },
      priceChange24h: { operator: 'between', value: [-2, 2] }
    },
    action: 'HOLD',
    confidence: 0.65,
    explanation: 'Price trading sideways with no clear direction. Wait for breakout confirmation.'
  },
  {
    id: 'RULE_HOLD_MIXED',
    name: 'Mixed Signals',
    conditions: {
      priceChange7d: { operator: '>', value: 0 },
      priceChange24h: { operator: '<', value: -3 }
    },
    action: 'HOLD',
    confidence: 0.55,
    explanation: 'Conflicting short-term and medium-term signals. Maintain current position until trend clarifies.'
  }
];

// Market Sentiment Thresholds
export const SENTIMENT_THRESHOLDS = {
  EXTREMELY_BULLISH: { min: 10, label: 'Extremely Bullish', color: '#10b981' },
  BULLISH: { min: 5, label: 'Bullish', color: '#34d399' },
  SLIGHTLY_BULLISH: { min: 2, label: 'Slightly Bullish', color: '#6ee7b7' },
  NEUTRAL: { min: -2, label: 'Neutral', color: '#f59e0b' },
  SLIGHTLY_BEARISH: { min: -5, label: 'Slightly Bearish', color: '#fca5a5' },
  BEARISH: { min: -10, label: 'Bearish', color: '#f87171' },
  EXTREMELY_BEARISH: { min: -Infinity, label: 'Extremely Bearish', color: '#ef4444' }
};

// Volatility Classification
export const VOLATILITY_LEVELS = {
  LOW: { max: 0.3, label: 'Low', color: '#10b981', riskLevel: 'Safe for entry' },
  MODERATE: { max: 0.5, label: 'Moderate', color: '#f59e0b', riskLevel: 'Proceed with caution' },
  HIGH: { max: 0.7, label: 'High', color: '#f97316', riskLevel: 'High risk environment' },
  EXTREME: { max: Infinity, label: 'Extreme', color: '#ef4444', riskLevel: 'Avoid trading' }
};

// Calculate market facts from price data
export function calculateMarketFacts(asset) {
  const {
    current_price,
    price_change_percentage_24h,
    price_change_percentage_7d_in_currency,
    ath,
    atl,
    high_24h,
    low_24h
  } = asset;

  // Calculate volatility (24h range / current price)
  const volatility = high_24h && low_24h 
    ? (high_24h - low_24h) / current_price 
    : 0;

  // Calculate distance from ATH/ATL as percentage
  const priceFromATH = ath ? ((ath - current_price) / ath) * 100 : 0;
  const priceFromATL = atl ? ((current_price - atl) / atl) * 100 : 0;

  return {
    currentPrice: current_price,
    priceChange24h: price_change_percentage_24h || 0,
    priceChange7d: price_change_percentage_7d_in_currency || 0,
    volatility,
    priceFromATH,
    priceFromATL,
    high24h: high_24h,
    low24h: low_24h,
    ath,
    atl
  };
}

// Get sentiment based on price change
export function getSentiment(priceChange7d) {
  for (const [key, threshold] of Object.entries(SENTIMENT_THRESHOLDS)) {
    if (priceChange7d >= threshold.min) {
      return { key, ...threshold };
    }
  }
  return SENTIMENT_THRESHOLDS.NEUTRAL;
}

// Get volatility level
export function getVolatilityLevel(volatility) {
  for (const [key, level] of Object.entries(VOLATILITY_LEVELS)) {
    if (volatility <= level.max) {
      return { key, ...level };
    }
  }
  return VOLATILITY_LEVELS.EXTREME;
}
