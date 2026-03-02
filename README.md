# Trading Expert System

A professional trading analysis platform built with React.js, featuring a rule-based expert system for cryptocurrency market analysis.

## Features

- **Real-time Market Data** - Live cryptocurrency prices from CoinGecko API
- **Trading Signals** - BUY/SELL/HOLD recommendations based on technical analysis
- **Risk Profiles** - Conservative, Moderate, and Aggressive strategies
- **User Authentication** - Firebase Auth with Google Sign-in
- **Watchlist** - Save and track your favorite cryptocurrencies
- **Responsive Design** - Works on desktop and mobile devices

## Technology Stack

- **Frontend**: React.js with Vite
- **Styling**: Custom CSS with CSS Variables
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Hosting**: Firebase Hosting
- **API**: CoinGecko API for market data

## Technical Indicators Used

- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Volume Analysis
- Price Momentum
- Volatility Metrics

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/     # React UI components
├── context/        # React Context providers
├── engine/         # Expert system logic
│   ├── knowledgeBase.js    # Trading rules
│   └── inferenceEngine.js  # Rule processing
├── services/       # API and Firebase services
└── utils/          # Helper functions
```

## Expert System Architecture

The trading expert system uses **forward chaining** inference with 15+ rules covering:
- Price momentum analysis
- Volume confirmation
- Trend identification
- Volatility assessment
- Risk-adjusted recommendations

## Live Demo

https://trading-expert-system-eb8b1.web.app

