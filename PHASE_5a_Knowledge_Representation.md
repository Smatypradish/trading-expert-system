# PHASE 5: Formal Knowledge Representation

**Project:** Knowledge-Based Expert System for Intelligent Stock & Cryptocurrency Trading  
**Representation Method:** Rule-Based Representation

---

## 1. Rule-Based Representation

### 1.1 Facts Declaration

```prolog
% Market Data Facts
fact(current_price, float).
fact(price_change_24h, float).
fact(price_change_7d, float).
fact(high_24h, float).
fact(low_24h, float).
fact(ath, float).
fact(atl, float).
fact(market_cap_rank, integer).

% Derived Facts (Calculated)
fact(volatility, float).
fact(ath_proximity, float).
fact(atl_proximity, float).
fact(trend_strength, float).

% User Input Facts
fact(risk_level, integer).  % Range: 1-10
```

### 1.2 BUY Rules - Formal Representation

**RULE R1: Strong Uptrend with Low Volatility**

```
IF:
  price_change_7d > 5.0 AND
  price_change_24h > 0.0 AND
  volatility < 0.30
THEN:
  recommendation := BUY
  confidence := 0.85
  explanation := "Strong upward trend over 7 days with low market volatility indicates favorable entry point"
  triggered_rule := "R1: Strong Uptrend with Low Volatility"
```

**Formal Notation:**
```
R1: (price_change_7d > 5.0) ∧ (price_change_24h > 0.0) ∧ (volatility < 0.30) 
    → (recommendation = BUY) ∧ (confidence = 0.85)
```

---

**RULE R2: Moderate Uptrend**

```
IF:
  price_change_7d > 3.0 AND
  price_change_24h > 2.0
THEN:
  recommendation := BUY
  confidence := 0.75
  explanation := "Positive momentum across both 24-hour and 7-day timeframes"
  triggered_rule := "R2: Moderate Uptrend"
```

**Formal Notation:**
```
R2: (price_change_7d > 3.0) ∧ (price_change_24h > 2.0) 
    → (recommendation = BUY) ∧ (confidence = 0.75)
```

---

**RULE R3: Strong Bullish Momentum**

```
IF:
  price_change_24h > 5.0 AND
  volatility < 0.40
THEN:
  recommendation := BUY
  confidence := 0.80
  explanation := "Strong 24-hour momentum with manageable volatility"
  triggered_rule := "R3: Strong Bullish Momentum"
```

**Formal Notation:**
```
R3: (price_change_24h > 5.0) ∧ (volatility < 0.40) 
    → (recommendation = BUY) ∧ (confidence = 0.80)
```

---

### 1.3 SELL Rules - Formal Representation

**RULE R4: Strong Downtrend**

```
IF:
  price_change_7d < -8.0 AND
  price_change_24h < -3.0
THEN:
  recommendation := SELL
  confidence := 0.85
  explanation := "Significant downward trend across multiple timeframes"
  triggered_rule := "R4: Strong Downtrend"
```

**Formal Notation:**
```
R4: (price_change_7d < -8.0) ∧ (price_change_24h < -3.0) 
    → (recommendation = SELL) ∧ (confidence = 0.85)
```

---

**RULE R5: Moderate Bearish Trend**

```
IF:
  price_change_7d < -5.0 AND
  price_change_24h < -2.0
THEN:
  recommendation := SELL
  confidence := 0.75
  explanation := "Bearish trend across timeframes suggests further downside potential"
  triggered_rule := "R5: Moderate Bearish Trend"
```

**Formal Notation:**
```
R5: (price_change_7d < -5.0) ∧ (price_change_24h < -2.0) 
    → (recommendation = SELL) ∧ (confidence = 0.75)
```

---

**RULE R6: Overbought Near All-Time High**

```
IF:
  current_price > (ath * 0.95) AND
  price_change_24h < 0.0
THEN:
  recommendation := SELL
  confidence := 0.70
  explanation := "Price approaching all-time high with negative 24-hour momentum suggests exhaustion"
  triggered_rule := "R6: Overbought Near ATH"
```

**Formal Notation:**
```
R6: (current_price > 0.95 × ath) ∧ (price_change_24h < 0.0) 
    → (recommendation = SELL) ∧ (confidence = 0.70)
```

---

### 1.4 HOLD Rules - Formal Representation

**RULE R7: High Volatility**

```
IF:
  volatility > 0.60
THEN:
  recommendation := HOLD
  confidence := 0.75
  explanation := "Excessive market volatility creates uncertain entry/exit conditions"
  triggered_rule := "R7: High Volatility"
```

**Formal Notation:**
```
R7: (volatility > 0.60) 
    → (recommendation = HOLD) ∧ (confidence = 0.75)
```

---

**RULE R8: Sideways Market**

```
IF:
  price_change_7d >= -3.0 AND
  price_change_7d <= 3.0 AND
  price_change_24h >= -2.0 AND
  price_change_24h <= 2.0
THEN:
  recommendation := HOLD
  confidence := 0.65
  explanation := "Sideways price action without clear directional trend"
  triggered_rule := "R8: Sideways Market"
```

**Formal Notation:**
```
R8: (-3.0 ≤ price_change_7d ≤ 3.0) ∧ (-2.0 ≤ price_change_24h ≤ 2.0) 
    → (recommendation = HOLD) ∧ (confidence = 0.65)
```

---

**RULE R9: Near All-Time Low**

```
IF:
  current_price < (atl * 1.10)
THEN:
  recommendation := HOLD
  confidence := 0.70
  explanation := "Price near historical low requires trend confirmation before action"
  triggered_rule := "R9: Near All-Time Low"
```

**Formal Notation:**
```
R9: (current_price < 1.10 × atl) 
    → (recommendation = HOLD) ∧ (confidence = 0.70)
```

---

## 2. Derived Fact Calculation Rules

### 2.1 Volatility Calculation

```
RULE: Calculate_Volatility
IF:
  high_24h EXISTS AND
  low_24h EXISTS AND
  current_price EXISTS AND
  current_price > 0
THEN:
  price_range := high_24h - low_24h
  volatility := price_range / current_price
```

**Formal Notation:**
```
∃(high_24h, low_24h, current_price) ∧ (current_price > 0) 
→ volatility = (high_24h - low_24h) / current_price
```

---

### 2.2 ATH Proximity Calculation

```
RULE: Calculate_ATH_Proximity
IF:
  current_price EXISTS AND
  ath EXISTS AND
  ath > 0
THEN:
  ath_proximity := (current_price / ath) * 100
```

**Formal Notation:**
```
∃(current_price, ath) ∧ (ath > 0) 
→ ath_proximity = (current_price / ath) × 100
```

---

### 2.3 ATL Proximity Calculation

```
RULE: Calculate_ATL_Proximity
IF:
  current_price EXISTS AND
  atl EXISTS AND
  atl > 0
THEN:
  atl_proximity := (current_price / atl) * 100
```

**Formal Notation:**
```
∃(current_price, atl) ∧ (atl > 0) 
→ atl_proximity = (current_price / atl) × 100
```

---

## 3. Risk Profile Adjustment Rules

### 3.1 Conservative Risk Profile

```
RULE: Adjust_For_Conservative_Risk
IF:
  risk_level >= 1 AND
  risk_level <= 3 AND
  recommendation EXISTS
THEN:
  confidence := confidence - 0.10
  stop_loss_percentage := 0.03
  target_multiplier := 1.5
  
WHERE:
  stop_loss_price := current_price * (1 - stop_loss_percentage)
  target_price := current_price + (current_price * stop_loss_percentage * target_multiplier)
```

**Formal Notation:**
```
(1 ≤ risk_level ≤ 3) ∧ ∃(recommendation) 
→ (confidence' = confidence - 0.10) ∧ 
  (stop_loss = 0.03) ∧ 
  (target_multiplier = 1.5)
```

---

### 3.2 Moderate Risk Profile

```
RULE: Adjust_For_Moderate_Risk
IF:
  risk_level >= 4 AND
  risk_level <= 6 AND
  recommendation EXISTS
THEN:
  stop_loss_percentage := 0.05
  target_multiplier := 2.0
  
WHERE:
  stop_loss_price := current_price * (1 - stop_loss_percentage)
  target_price := current_price + (current_price * stop_loss_percentage * target_multiplier)
```

**Formal Notation:**
```
(4 ≤ risk_level ≤ 6) ∧ ∃(recommendation) 
→ (stop_loss = 0.05) ∧ (target_multiplier = 2.0)
```

---

### 3.3 Aggressive Risk Profile

```
RULE: Adjust_For_Aggressive_Risk
IF:
  risk_level >= 7 AND
  risk_level <= 10 AND
  recommendation EXISTS
THEN:
  stop_loss_percentage := 0.10
  target_multiplier := 3.0
  
WHERE:
  stop_loss_price := current_price * (1 - stop_loss_percentage)
  target_price := current_price + (current_price * stop_loss_percentage * target_multiplier)
```

**Formal Notation:**
```
(7 ≤ risk_level ≤ 10) ∧ ∃(recommendation) 
→ (stop_loss = 0.10) ∧ (target_multiplier = 3.0)
```

---

## 4. Forward Chaining Inference Algorithm

### 4.1 Pseudocode Representation

```
ALGORITHM: Forward_Chaining_Inference

INPUT: 
  market_facts = {current_price, price_change_24h, price_change_7d, 
                  high_24h, low_24h, ath, atl}
  user_input = {risk_level}

INITIALIZATION:
  working_memory = {}
  triggered_rules = []
  final_recommendation = NULL

STEP 1: Load Facts into Working Memory
  FOR each fact IN market_facts:
    ADD fact TO working_memory
  ADD user_input TO working_memory

STEP 2: Calculate Derived Facts
  EXECUTE Calculate_Volatility
  EXECUTE Calculate_ATH_Proximity
  EXECUTE Calculate_ATL_Proximity
  ADD derived_facts TO working_memory

STEP 3: Rule Matching (Priority Ordered)
  rule_list = [R1, R2, R3, R4, R5, R6, R7, R8, R9]
  
  FOR each rule IN rule_list:
    IF evaluate_conditions(rule, working_memory) == TRUE:
      ADD rule TO triggered_rules
      IF final_recommendation == NULL:
        final_recommendation = rule.action
        base_confidence = rule.confidence
        BREAK  // First matching rule wins

STEP 4: Apply Risk Adjustment
  IF risk_level IN [1,2,3]:
    EXECUTE Adjust_For_Conservative_Risk
  ELSE IF risk_level IN [4,5,6]:
    EXECUTE Adjust_For_Moderate_Risk
  ELSE:
    EXECUTE Adjust_For_Aggressive_Risk

STEP 5: Calculate Trade Targets
  entry_price = current_price
  stop_loss_price = entry_price * (1 - stop_loss_percentage)
  target_price = entry_price + (entry_price * stop_loss_percentage * target_multiplier)

OUTPUT:
  {
    recommendation: final_recommendation,
    confidence: adjusted_confidence,
    explanation: rule.explanation,
    triggered_rules: triggered_rules,
    entry_price: entry_price,
    stop_loss: stop_loss_price,
    target: target_price,
    risk_reward_ratio: (target_price - entry_price) / (entry_price - stop_loss_price)
  }

END ALGORITHM
```

---

## 5. Constraint Representation

### 5.1 Confidence Cap Constraint

```
CONSTRAINT: Maximum_Confidence
APPLIES_TO: All Rules

∀ rule ∈ Rules: 
  rule.confidence ≤ 0.95

ENFORCEMENT:
  IF calculated_confidence > 0.95 THEN
    final_confidence := 0.95
```

---

### 5.2 Data Freshness Constraint

```
CONSTRAINT: Data_Freshness
APPLIES_TO: Market Data Facts

∀ fact ∈ MarketFacts:
  current_time - fact.timestamp ≤ 60 seconds

ENFORCEMENT:
  IF data_age > 60 seconds THEN
    REJECT analysis
    MESSAGE "Data too old, refresh required"
```

---

### 5.3 Stop-Loss Validity Constraint

```
CONSTRAINT: Stop_Loss_Range
APPLIES_TO: Risk Adjustment Rules

∀ recommendation:
  0.02 ≤ stop_loss_percentage ≤ 0.15

ENFORCEMENT:
  Conservative: stop_loss = max(0.03, min(stop_loss, 0.15))
  Moderate: stop_loss = max(0.05, min(stop_loss, 0.15))
  Aggressive: stop_loss = max(0.10, min(stop_loss, 0.15))
```

---

### 5.4 Target Price Validity Constraint

```
CONSTRAINT: Minimum_Risk_Reward_Ratio
APPLIES_TO: Trade Setup Calculation

∀ trade:
  (target_price - entry_price) / (entry_price - stop_loss_price) ≥ 1.5

ENFORCEMENT:
  target_distance = entry_price * stop_loss_percentage * target_multiplier
  IF target_distance < (1.5 * stop_loss_distance) THEN
    target_multiplier := 1.5
```

---

## 6. Complete Rule Base Summary

### 6.1 Rule Priority Hierarchy

```
Priority 1 (Highest): R1, R4, R7
Priority 2 (Medium):  R2, R3, R5, R6, R8, R9

Rule Resolution:
  IF multiple rules trigger THEN
    SELECT rule with highest priority
    IF tie THEN
      SELECT rule with highest confidence
```

### 6.2 Rule Coverage Analysis

```
Total Decision Space Coverage:
- BUY scenarios: 3 rules (R1, R2, R3)
- SELL scenarios: 3 rules (R4, R5, R6)
- HOLD scenarios: 3 rules (R7, R8, R9)

Edge Case Handling:
- No rule matches → Default to HOLD with 50% confidence
- Multiple rule matches → First high-priority rule wins
- Missing data → Reject analysis with error message
```

---

## 7. Explanation Generation Rules

```
RULE: Generate_Explanation
IF:
  final_recommendation EXISTS AND
  triggered_rule EXISTS
THEN:
  explanation_text := triggered_rule.explanation
  
  ADD market_context:
    "Market Analysis:\n"
    "- 24h Change: " + format_percentage(price_change_24h) + "\n"
    "- 7d Change: " + format_percentage(price_change_7d) + "\n"
    "- Volatility: " + format_percentage(volatility) + 
        " (" + classify_volatility(volatility) + ")\n"
  
  ADD trade_setup:
    "Trade Setup (" + risk_profile_name + "):\n"
    "- Entry: $" + format_price(entry_price) + "\n"
    "- Stop-Loss: $" + format_price(stop_loss_price) + 
        " (" + format_percentage(stop_loss_percentage) + " risk)\n"
    "- Target: $" + format_price(target_price) + 
        " (" + format_percentage(potential_gain) + " potential)\n"
    "- Risk/Reward: 1:" + format_ratio(risk_reward_ratio)
```

---

**Total Formal Rules Represented:** 15
- Trading Decision Rules: 9 (R1-R9)
- Derived Fact Rules: 3
- Risk Adjustment Rules: 3
- Constraints: 4
- Explanation Rule: 1
