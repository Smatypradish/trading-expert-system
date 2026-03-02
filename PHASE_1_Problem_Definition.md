# PHASE 1: Problem Definition & Decision Scope

**Domain:** Finance  
**Project Title:** Knowledge-Based Expert System for Intelligent Stock & Cryptocurrency Trading

---

## 1. What Decision Will the System Make?

The system will make **BUY, SELL, or HOLD recommendations** for cryptocurrencies based on:
- Real-time market data analysis
- Price trend identification (24-hour and 7-day patterns)
- Market volatility assessment
- User-defined risk tolerance levels

The system acts as a virtual trading advisor, providing actionable recommendations with confidence levels and detailed justifications.

---

## 2. Who is the Target User?

**Primary Users:**
- **Individual retail investors** seeking data-driven trading guidance
- **Beginner traders** who lack technical analysis expertise
- **Risk-conscious investors** wanting transparent, explainable recommendations

**User Profile:**
- Limited knowledge of technical indicators
- Desire for automated market analysis
- Need for risk-adjusted recommendations
- Requirement for decision transparency

---

## 3. What Inputs are Required?

| Input Type | Description | Source |
|------------|-------------|--------|
| **Asset Selection** | Cryptocurrency to analyze (e.g., Bitcoin, Ethereum) | User selection |
| **Current Price** | Real-time market price in USD | CoinGecko API |
| **24-Hour Change** | Percentage price change in last 24 hours | CoinGecko API |
| **7-Day Change** | Percentage price change over 7 days | CoinGecko API |
| **Price Range** | 24-hour high and low prices | CoinGecko API |
| **Risk Tolerance** | User's risk profile (Conservative/Moderate/Aggressive) | User input |
| **Historical Data** | All-time high (ATH) and all-time low (ATL) | CoinGecko API |

---

## 4. What is the Expected Output?

**Primary Output:**
| Component | Description |
|-----------|-------------|
| **Trading Signal** | BUY / SELL / HOLD recommendation |
| **Confidence Level** | Percentage (0-95%) indicating recommendation strength |
| **Trade Setup** | - Entry price<br>- Stop-loss level<br>- Target price |
| **Explanation** | Human-readable justification for the decision |
| **Triggered Rules** | List of knowledge base rules that fired |

**Example Output:**
```
Recommendation: BUY (85% confidence)
Reason: Strong upward trend over 7 days with low market volatility

Market Analysis:
- 24h Change: +2.54%
- 7d Change: +8.31%
- Volatility: 12.4% (Low)

Trade Setup:
- Entry: $95,341
- Stop-Loss: $90,574 (5% risk)
- Target: $104,875 (10% potential)

Triggered Rules:
✓ Strong Uptrend with Low Volatility
✓ Positive 24-hour Momentum
```

---

## Decision-Making Workflow

```
User Input (Asset + Risk Profile)
    ↓
Data Collection (API Fetch)
    ↓
Fact Calculation (Volatility, Trends)
    ↓
Rule Evaluation (Forward Chaining)
    ↓
Decision Generation (BUY/SELL/HOLD)
    ↓
Explanation Generation
    ↓
Output to User
```
