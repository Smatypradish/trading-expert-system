# PHASE 2: Knowledge Identification

**Project:** Knowledge-Based Expert System for Intelligent Stock & Cryptocurrency Trading

---

## Facts (Data Points)

Facts represent measurable, observable data about cryptocurrency markets:

| Fact ID | Fact Name | Description | Data Type |
|---------|-----------|-------------|-----------|
| F1 | Current Price | Present market value in USD | Numeric (Float) |
| F2 | 24-Hour Change % | Percentage price change in last 24 hours | Numeric (Float) |
| F3 | 7-Day Change % | Percentage price change over 7 days | Numeric (Float) |
| F4 | 24-Hour High | Highest price in last 24 hours | Numeric (Float) |
| F5 | 24-Hour Low | Lowest price in last 24 hours | Numeric (Float) |
| F6 | Market Volatility | Calculated as (High - Low) / Current Price | Numeric (Float, 0-1) |
| F7 | All-Time High (ATH) | Historical maximum price | Numeric (Float) |
| F8 | All-Time Low (ATL) | Historical minimum price | Numeric (Float) |
| F9 | Market Cap Rank | Position among all cryptocurrencies | Integer |
| F10 | User Risk Level | Conservative (1-3), Moderate (4-6), Aggressive (7-10) | Integer (1-10) |

---

## Rules (Decision Logic)

Rules define the conditions that lead to trading recommendations:

### BUY Rules

| Rule ID | Rule Name | Conditions | Action | Confidence |
|---------|-----------|------------|--------|------------|
| R1 | Strong Uptrend with Low Volatility | 7d change > 5% AND<br>24h change > 0% AND<br>Volatility < 30% | BUY | 85% |
| R2 | Moderate Uptrend | 7d change > 3% AND<br>24h change > 2% | BUY | 75% |
| R3 | Strong Bullish Momentum | 24h change > 5% AND<br>Volatility < 40% | BUY | 80% |

### SELL Rules

| Rule ID | Rule Name | Conditions | Action | Confidence |
|---------|-----------|------------|--------|------------|
| R4 | Strong Downtrend | 7d change < -8% AND<br>24h change < -3% | SELL | 85% |
| R5 | Moderate Bearish Trend | 7d change < -5% AND<br>24h change < -2% | SELL | 75% |
| R6 | Near All-Time High with Negative Momentum | Current price > 95% of ATH AND<br>24h change < 0% | SELL | 70% |

### HOLD Rules

| Rule ID | Rule Name | Conditions | Action | Confidence |
|---------|-----------|------------|--------|------------|
| R7 | High Volatility | Volatility > 60% | HOLD | 75% |
| R8 | Sideways Market | 7d change between -3% and 3% AND<br>24h change between -2% and 2% | HOLD | 65% |
| R9 | Near All-Time Low | Current price < 110% of ATL | HOLD | 70% |

---

## Constraints

Constraints are limitations and boundaries that govern system behavior:

| Constraint ID | Type | Description |
|---------------|------|-------------|
| C1 | Confidence Cap | Maximum confidence for any recommendation is 95% |
| C2 | Minimum Data | At least 24-hour historical data required for analysis |
| C3 | Stop-Loss Range | Stop-loss must be between 2% and 15% based on risk profile |
| C4 | Target Range | Target price must be at least 1.5x stop-loss distance |
| C5 | Priority Rule | If multiple rules trigger, highest confidence rule takes precedence |
| C6 | Risk Adjustment | Conservative users: reduce confidence by 10%<br>Aggressive users: increase stop-loss by 50% |
| C7 | Data Freshness | Market data must be updated within last 60 seconds |

---

## Relationships

Relationships define how different knowledge elements interact:

### 1. Risk Profile → Stop-Loss Relationship

```
IF Risk Level = Conservative (1-3)
  THEN Stop-Loss = 3%
       Target Multiplier = 1.5x

IF Risk Level = Moderate (4-6)
  THEN Stop-Loss = 5%
       Target Multiplier = 2x

IF Risk Level = Aggressive (7-10)
  THEN Stop-Loss = 10%
       Target Multiplier = 3x
```

### 2. Volatility → Risk Assessment

```
Volatility < 30%  → Low Risk (favors BUY)
30% ≤ Volatility < 60% → Medium Risk (neutral)
Volatility ≥ 60%  → High Risk (favors HOLD)
```

### 3. Trend Direction → Signal Relationship

```
7d Change + 24h Change → Trend Strength
   Both Positive → Bullish (BUY signals)
   Both Negative → Bearish (SELL signals)
   Mixed → Uncertain (HOLD signals)
```

### 4. Price Position → Market Cycle

```
Price near ATH → Late Bull Market (caution on BUY)
Price near ATL → Early Bull Market (opportunity for BUY)
Price in middle → Normal market (rule-based decision)
```

---

## Knowledge Domain Map

```
Market Data (Facts)
    ↓
Volatility Calculation
    ↓
Trend Identification ←→ Risk Profile
    ↓
Rule Evaluation (Forward Chaining)
    ↓
Confidence Adjustment
    ↓
Target Price Calculation
    ↓
Trading Decision (BUY/SELL/HOLD)
```

---

**Total Knowledge Elements:**
- Facts: 10
- Rules: 9 (3 BUY, 3 SELL, 3 HOLD)
- Constraints: 7
- Relationships: 4 categories
