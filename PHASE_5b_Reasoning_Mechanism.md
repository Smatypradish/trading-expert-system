# PHASE 5b: Reasoning Mechanism Design

**Project:** Knowledge-Based Expert System for Intelligent Stock & Cryptocurrency Trading

---

## 1. Chosen Reasoning Mechanism: Forward Chaining

### What is Forward Chaining?

Forward chaining is a **data-driven** reasoning strategy. The system starts with **known facts** (market data) and applies rules iteratively until a conclusion (BUY/SELL/HOLD) is reached. It moves from data → rules → conclusion.

```
Known Facts (Market Data)  →  Rule Matching  →  Decision (BUY / SELL / HOLD)
```

This is in contrast to **backward chaining**, which starts with a hypothesis and works backwards to find supporting facts.

---

## 2. How Forward Chaining Works in This System

### Step-by-Step Process

```
STEP 1: FACT LOADING
  → Load raw market data from CoinGecko API into Working Memory
  → Load user's risk tolerance level into Working Memory

STEP 2: DERIVED FACT CALCULATION
  → Calculate volatility from 24h high/low prices
  → Calculate ATH proximity (how close price is to all-time high)
  → Calculate ATL proximity (how close price is to all-time low)
  → Add all derived facts to Working Memory

STEP 3: RULE MATCHING (Forward Pass)
  → Iterate through all 9 rules in priority order (R1 → R9)
  → For each rule, check if ALL conditions are satisfied by Working Memory facts
  → If a rule matches → FIRE the rule (record it as triggered)
  → The FIRST matching rule determines the decision (highest priority wins)

STEP 4: RISK ADJUSTMENT
  → Apply risk profile rules based on user's risk level
  → Adjust confidence and calculate stop-loss/target prices

STEP 5: EXPLANATION GENERATION
  → Record which rules fired and why
  → Generate human-readable explanation of the reasoning chain
  → Output final recommendation with full justification
```

### Visual Flow

```
  ┌──────────────┐
  │  Market Data  │  (Facts from API)
  │  + User Input │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Calculate    │  Volatility, ATH/ATL proximity
  │  Derived Facts│
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐     ┌───────────────┐
  │  Match Rules  │────▶│ Rule R1 match?│──No──▶ Try R2
  │  (R1 → R9)   │     │  Yes ──▶ FIRE │       Try R3...
  └──────┬───────┘     └───────────────┘
         │ (First match found)
         ▼
  ┌──────────────┐
  │  Apply Risk   │  Adjust confidence, stop-loss, target
  │  Adjustment   │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  Generate     │  Rules fired, facts matched, reasoning chain
  │  Explanation  │
  └──────┬───────┘
         │
         ▼
  ┌──────────────┐
  │  OUTPUT:      │  BUY/SELL/HOLD + confidence + explanation
  │  Decision     │
  └──────────────┘
```

---

## 3. Step-by-Step Trace: Sample Query

### Scenario: Analyzing Bitcoin with Moderate Risk Profile

**User Input:**
- Asset: Bitcoin (BTC)
- Risk Level: 5 (Moderate)

**API Data Received:**
```
current_price     = $95,341
price_change_24h  = +2.54%
price_change_7d   = +8.31%
high_24h          = $96,200
low_24h           = $93,100
ath               = $108,786
atl               = $67.81
```

---

### TRACE — Step 1: Load Facts into Working Memory

```
Working Memory:
  current_price     = 95341
  price_change_24h  = 2.54
  price_change_7d   = 8.31
  high_24h          = 96200
  low_24h           = 93100
  ath               = 108786
  atl               = 67.81
  risk_level        = 5
```

---

### TRACE — Step 2: Calculate Derived Facts

```
  volatility    = (96200 - 93100) / 95341 = 3100 / 95341 = 0.0325  (3.25%)
  ath_proximity = (95341 / 108786) × 100 = 87.64%
  atl_proximity = (95341 / 67.81) × 100 = 140,601%

Working Memory Updated:
  + volatility      = 0.0325   → Category: LOW (< 0.30)
  + ath_proximity    = 87.64%  → NOT near ATH (< 95%)
  + atl_proximity    = 140601% → NOT near ATL (> 110%)
```

---

### TRACE — Step 3: Rule Matching (Forward Pass)

```
Evaluating Rule R1: Strong Uptrend with Low Volatility
  Condition 1: price_change_7d > 5.0   → 8.31 > 5.0   → ✅ TRUE
  Condition 2: price_change_24h > 0.0  → 2.54 > 0.0   → ✅ TRUE
  Condition 3: volatility < 0.30       → 0.0325 < 0.30 → ✅ TRUE
  
  Result: ALL CONDITIONS MET → RULE R1 FIRES ✅
  Action: recommendation = BUY, confidence = 0.85
  
  *** First match found — stop rule evaluation ***
  (Rules R2–R9 are NOT evaluated because R1 already matched)
```

**Triggered Rules List:** `[R1: Strong Uptrend with Low Volatility]`

---

### TRACE — Step 4: Apply Risk Adjustment

```
  risk_level = 5 → Category: MODERATE (4–6)
  
  Applying Moderate Risk Profile:
    confidence adjustment = 0%  (no change)
    stop_loss_percentage  = 5%
    target_multiplier     = 2.0x
  
  Final confidence = 0.85 (85%)
```

---

### TRACE — Step 5: Calculate Trade Setup

```
  entry_price     = $95,341
  stop_loss_price = $95,341 × (1 - 0.05) = $95,341 × 0.95 = $90,574
  target_price    = $95,341 + ($95,341 × 0.05 × 2.0) = $95,341 + $9,534 = $104,875
  risk_reward     = ($104,875 - $95,341) / ($95,341 - $90,574) = $9,534 / $4,767 = 2.0
```

---

### TRACE — Final Output

```
╔══════════════════════════════════════════════════════════════╗
║  RECOMMENDATION: BUY (85% Confidence)                       ║
╠══════════════════════════════════════════════════════════════╣
║  Triggered Rule: R1 — Strong Uptrend with Low Volatility    ║
║                                                              ║
║  Reasoning Chain:                                            ║
║  1. 7-day price change (+8.31%) exceeds threshold (>5%)     ║
║  2. 24-hour change (+2.54%) is positive (>0%)               ║
║  3. Volatility (3.25%) is low (<30%)                        ║
║  4. All three conditions satisfied Rule R1                   ║
║  5. Risk profile (Moderate) applied — no confidence change  ║
║                                                              ║
║  Trade Setup (Moderate Risk):                                ║
║  • Entry:     $95,341                                        ║
║  • Stop-Loss: $90,574 (5% risk)                             ║
║  • Target:    $104,875 (10% potential)                       ║
║  • Risk/Reward: 1:2.0                                       ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 4. Justification: Why Forward Chaining?

| Criterion | Forward Chaining | Backward Chaining | Why Forward Wins |
|-----------|-----------------|-------------------|------------------|
| **Data Availability** | Starts with known data | Requires hypothesis first | Market data is always available upfront via API |
| **Decision Type** | Exploratory — finds what the data suggests | Confirmatory — tests a guess | Trading decisions should be data-driven, not hypothesis-driven |
| **Real-Time Suitability** | Processes new data immediately | Must re-hypothesize for each query | Market data changes constantly; forward chaining handles updates naturally |
| **Transparency** | Clear trace: "data → rule → decision" | Complex backtracking trace | Users need to understand WHY a recommendation was made |
| **Efficiency** | One pass through rules in priority order | May explore many dead ends | Real-time trading requires fast response; forward chaining with priority ordering ensures quick resolution |

### Key Reasons:

1. **Data-Driven Domain:** Trading decisions are fundamentally based on incoming market data (prices, changes, volatility). Forward chaining naturally fits because we start with data and derive a conclusion.

2. **Real-Time Processing:** The system receives live API data and must produce recommendations quickly. Forward chaining processes facts in a single pass, making it efficient for real-time use.

3. **Explainability:** Forward chaining produces a clear, linear reasoning trace (fact → rule → decision) that can be directly shown to users. This satisfies the faculty's mandatory Explanation Facility requirement.

4. **No Pre-Hypothesis Needed:** Unlike backward chaining, we don't need to guess "should I buy?" and then validate. Instead, the system objectively evaluates all data and lets the rules determine the outcome.
