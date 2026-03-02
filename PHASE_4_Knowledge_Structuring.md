# PHASE 4: Structured Knowledge Model

**Project:** Knowledge-Based Expert System for Intelligent Stock & Cryptocurrency Trading

---

## 1. Decision Tables

### Decision Table 1: BUY/SELL/HOLD Signal Generation

| 7-Day Trend | 24-Hour Trend | Volatility Level | Near ATH/ATL | → Decision | Confidence |
|-------------|---------------|------------------|--------------|------------|------------|
| Up (>5%) | Up (>0%) | Low (<30%) | No | **BUY** | 85% |
| Up (>3%) | Up (>2%) | Medium (30-60%) | No | **BUY** | 75% |
| Up | Up (>5%) | Medium (<40%) | No | **BUY** | 80% |
| Down (<-8%) | Down (<-3%) | Any | Any | **SELL** | 85% |
| Down (<-5%) | Down (<-2%) | Any | Any | **SELL** | 75% |
| Any | Down | Low | Near ATH (>95%) | **SELL** | 70% |
| Any | Any | High (>60%) | Any | **HOLD** | 75% |
| Sideways (-3% to 3%) | Neutral (-2% to 2%) | Low | No | **HOLD** | 65% |
| Any | Any | Any | Near ATL (<110%) | **HOLD** | 70% |

**Legend:**
- **Up:** Positive percentage change
- **Down:** Negative percentage change  
- **Sideways:** Change within ±3%
- **Near ATH:** Price > 95% of all-time high
- **Near ATL:** Price < 110% of all-time low

---

### Decision Table 2: Risk Profile Settings

| Risk Level | Category | Stop-Loss % | Target Multiplier | Confidence Adjustment |
|------------|----------|-------------|-------------------|----------------------|
| 1-3 | Conservative | 3% | 1.5x | -10% |
| 4-6 | Moderate | 5% | 2.0x | 0% |
| 7-10 | Aggressive | 10% | 3.0x | 0% |

**Example Calculation:**
```
Base Signal: BUY (85% confidence)
Risk Level: Conservative (Level 2)

Final Output:
- Stop-Loss: 3% below entry
- Target: Entry + (Entry * 0.03 * 1.5) = 4.5% above entry
- Confidence: 85% - 10% = 75%
```

---

## 2. Rule Lists

### BUY Rules (Priority Order)

```
RULE R1: Strong Uptrend with Low Volatility
  Priority: High
  IF:
    AND priceChange7d > 5
    AND priceChange24h > 0
    AND volatility < 0.30
  THEN:
    signal = BUY
    confidence = 0.85
    explanation = "Strong upward trend with low volatility indicates favorable entry"

RULE R2: Moderate Uptrend
  Priority: Medium
  IF:
    AND priceChange7d > 3
    AND priceChange24h > 2
  THEN:
    signal = BUY
    confidence = 0.75
    explanation = "Positive momentum across both timeframes"

RULE R3: Strong Bullish Momentum
  Priority: Medium
  IF:
    AND priceChange24h > 5
    AND volatility < 0.40
  THEN:
    signal = BUY
    confidence = 0.80
    explanation = "Strong 24-hour momentum with manageable volatility"
```

### SELL Rules (Priority Order)

```
RULE R4: Strong Downtrend
  Priority: High
  IF:
    AND priceChange7d < -8
    AND priceChange24h < -3
  THEN:
    signal = SELL
    confidence = 0.85
    explanation = "Significant downtrend across multiple timeframes"

RULE R5: Moderate Bearish Trend
  Priority: Medium
  IF:
    AND priceChange7d < -5
    AND priceChange24h < -2
  THEN:
    signal = SELL
    confidence = 0.75
    explanation = "Bearish trend suggests further downside"

RULE R6: Overbought Near ATH
  Priority: Medium
  IF:
    AND currentPrice > (ath * 0.95)
    AND priceChange24h < 0
  THEN:
    signal = SELL
    confidence = 0.70
    explanation = "Price near all-time high with negative momentum"
```

### HOLD Rules (Priority Order)

```
RULE R7: High Volatility
  Priority: High
  IF:
    volatility > 0.60
  THEN:
    signal = HOLD
    confidence = 0.75
    explanation = "Excessive volatility creates uncertain conditions"

RULE R8: Sideways Market
  Priority: Medium
  IF:
    AND priceChange7d BETWEEN -3 AND 3
    AND priceChange24h BETWEEN -2 AND 2
  THEN:
    signal = HOLD
    confidence = 0.65
    explanation = "Sideways price action without clear direction"

RULE R9: Near All-Time Low
  Priority: Medium
  IF:
    currentPrice < (atl * 1.10)
  THEN:
    signal = HOLD
    confidence = 0.70
    explanation = "Price near historical low - wait for trend confirmation"
```

---

## 3. Concept-Relationship Diagrams

### Diagram 1: Knowledge Domain Hierarchy

```
                    TRADING DECISION
                          |
         +----------------+----------------+
         |                |                |
       BUY             SELL              HOLD
         |                |                |
    +---------+      +---------+      +---------+
    | Uptrend |      |Downtrend|      |Uncertain|
    |Low Vol  |      |High Vol |      |High Vol |
    |Momentum |      |ATH Near |      |Sideways |
    +---------+      +---------+      +---------+
         |                |                |
         +----------------+----------------+
                          |
                   MARKET FACTS
              (Price, Change%, Volatility)
```

### Diagram 2: Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   INPUT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ User Selects │  │  CoinGecko   │  │  Risk Level  │  │
│  │    Asset     │  │     API      │  │   (1-10)     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                 PROCESSING LAYER                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Calculate Market Facts                    │   │
│  │  • Volatility = (High - Low) / Price             │   │
│  │  • Trend Strength = 7d% + 24h%                   │   │
│  │  • ATH/ATL Proximity                             │   │
│  └─────────────────┬────────────────────────────────┘   │
│                    ▼                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │   Rule Evaluation (Forward Chaining)             │   │
│  │   FOR each rule IN knowledge_base:               │   │
│  │     IF all conditions match facts                │   │
│  │       THEN trigger rule                          │   │
│  │       BREAK (highest priority wins)              │   │
│  └─────────────────┬────────────────────────────────┘   │
│                    ▼                                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Confidence & Target Calculation              │   │
│  │  • Adjust for risk profile                       │   │
│  │  • Calculate stop-loss                           │   │
│  │  • Calculate target price                        │   │
│  └─────────────────┬────────────────────────────────┘   │
└────────────────────┼────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  OUTPUT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Trading    │  │ Explanation  │  │Trade Setup   │  │
│  │    Signal    │  │ (Why/How)    │  │ (Entry/Stop/ │  │
│  │ (BUY/SELL/   │  │              │  │  Target)     │  │
│  │   HOLD)      │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Diagram 3: Rule Interaction Network

```
        ┌──────────────────┐
        │  Market Facts    │
        │ • Price changes  │
        │ • Volatility     │
        │ • ATH/ATL        │
        └────────┬─────────┘
                 │
      ┌──────────┼──────────┐
      │          │          │
      ▼          ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ BUY     │ │ SELL    │ │ HOLD    │
│ Rules   │ │ Rules   │ │ Rules   │
│ R1-R3   │ │ R4-R6   │ │ R7-R9   │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     │      ┌────┴────┐      │
     └──────┤Priority │──────┘
            │Selection│
            └────┬────┘
                 │
            ┌────▼────┐
            │ Highest │
            │Confidence│
            │  Rule   │
            └────┬────┘
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
  ┌─────────┐         ┌─────────┐
  │Risk Adj │         │Explanation│
  │(Profile)│         │Generator │
  └─────────┘         └─────────┘
       │                   │
       └─────────┬─────────┘
                 ▼
        ┌──────────────────┐
        │  Final Decision  │
        │   with Targets   │
        └──────────────────┘
```

---

## 4. Structured Volatility Calculation

```
Algorithm: Calculate Market Volatility

INPUT: 
  - high_24h (float): 24-hour high price
  - low_24h (float): 24-hour low price
  - current_price (float): current market price

PROCESS:
  1. price_range = high_24h - low_24h
  2. volatility = price_range / current_price
  3. IF current_price == 0 THEN
       volatility = 0  // Error handling

OUTPUT:
  - volatility (float, range 0-1)

CLASSIFICATION:
  IF volatility < 0.30 THEN
    category = "Low" (favorable for BUY)
  ELSE IF volatility < 0.60 THEN
    category = "Medium" (neutral)
  ELSE
    category = "High" (favors HOLD)
```

---

## 5. Inference Mechanism Structure

```
Forward Chaining Algorithm:

INITIALIZE:
  facts = {all market data from API}
  triggered_rules = []
  final_decision = None

STEP 1: Fact Calculation
  Calculate derived facts:
    - volatility
    - trend_strength
    - ath_proximity
    - atl_proximity

STEP 2: Rule Matching (Priority Order)
  FOR each rule IN [R1, R2, R3, R4, R5, R6, R7, R8, R9]:
    IF evaluate_conditions(rule, facts) == TRUE:
      ADD rule TO triggered_rules
      IF final_decision == None:
        final_decision = rule.action
        confidence = rule.confidence
        BREAK  // First match wins (highest priority)

STEP 3: Risk Adjustment
  IF user_risk_level == CONSERVATIVE:
    confidence = confidence - 0.10
    stop_loss = 0.03
  ELIF user_risk_level == MODERATE:
    stop_loss = 0.05
  ELSE:  // AGGRESSIVE
    stop_loss = 0.10

STEP 4: Target Calculation
  entry_price = current_price
  stop_loss_price = entry_price * (1 - stop_loss)
  target_price = entry_price + (entry_price * stop_loss * target_multiplier)

OUTPUT:
  {
    signal: final_decision,
    confidence: confidence,
    triggered_rules: triggered_rules,
    entry: entry_price,
    stop_loss: stop_loss_price,
    target: target_price
  }
```
