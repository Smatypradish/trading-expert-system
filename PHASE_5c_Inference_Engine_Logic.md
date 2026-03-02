# PHASE 5c: Inference Engine Logic

**Project:** Knowledge-Based Expert System for Intelligent Stock & Cryptocurrency Trading

---

## 1. Rule Firing Mechanism

### How Does the Engine Select Which Rule to Apply?

The inference engine uses a **Priority-Ordered Sequential Evaluation** strategy. Rules are organized in a fixed priority order and evaluated one by one from highest to lowest priority. The first rule whose conditions are fully satisfied by the current facts in Working Memory is selected and fired.

### Rule Evaluation Process

```
ALGORITHM: Rule_Firing

INPUT:  Working Memory (all facts), Rule Base (R1–R9)

PROCEDURE:
  1. Sort rules by priority level (High → Medium)
  2. For each rule in priority order:
     a. Extract all conditions from the rule
     b. For each condition:
        - Retrieve the relevant fact from Working Memory
        - Evaluate the condition against the fact value
        - If condition is FALSE → skip to next rule
     c. If ALL conditions are TRUE:
        - FIRE this rule
        - Record rule ID, action, confidence, and explanation
        - STOP evaluation (first match wins)
  3. If NO rule matches after checking all rules:
     - Apply DEFAULT rule: HOLD with 50% confidence
     - Explanation: "No clear trading signal detected"
```

### Priority Levels

| Priority | Rules | Signal Type | Rationale |
|----------|-------|------------|-----------|
| **HIGH** (evaluated first) | R1, R4, R7 | Strong BUY, Strong SELL, High Volatility HOLD | These represent the strongest, most reliable market signals |
| **MEDIUM** (evaluated second) | R2, R3, R5, R6, R8, R9 | Moderate signals | These are secondary patterns that apply when no strong signal exists |

### Evaluation Order

```
Priority HIGH:
  R1 → Strong Uptrend with Low Volatility       (BUY,  85%)
  R4 → Strong Downtrend                         (SELL, 85%)
  R7 → High Volatility                          (HOLD, 75%)

Priority MEDIUM:
  R2 → Moderate Uptrend                         (BUY,  75%)
  R3 → Strong Bullish Momentum                  (BUY,  80%)
  R5 → Moderate Bearish Trend                   (SELL, 75%)
  R6 → Overbought Near ATH                      (SELL, 70%)
  R8 → Sideways Market                          (HOLD, 65%)
  R9 → Near All-Time Low                        (HOLD, 70%)

DEFAULT (if none match):
  → HOLD, 50% confidence
```

---

## 2. Conflict Resolution Strategy

### What Happens When Multiple Rules Match?

In this system, conflict resolution is handled through **Priority-First, Confidence-Second** ordering:

### Strategy: Ordered Rule Evaluation with Priority Hierarchy

```
Conflict Resolution Algorithm:

CASE 1: Only one rule matches
  → Fire that rule (no conflict)

CASE 2: Multiple rules could potentially match
  → The FIRST rule in priority order that matches is fired
  → Remaining rules are NEVER evaluated (evaluation stops at first match)
  → This eliminates conflicts by design

CASE 3: No rules match
  → Apply default rule: HOLD at 50% confidence

CASE 4: Tie within same priority level
  → The rule appearing earlier in the evaluation sequence wins
  → Within the same priority, rules are ordered by confidence (highest first)
```

### Why This Strategy Works for Trading

| Situation | What Happens | Example |
|-----------|-------------|---------|
| Strong clear signal | High-priority rule fires immediately | 7d: +10%, 24h: +3%, Vol: 5% → R1 (BUY 85%) fires; R2, R3 never evaluated |
| Moderate signal | High-priority rules fail; medium-priority rule fires | 7d: +4%, 24h: +3% → R1 fails, R4 fails, R7 fails; R2 (BUY 75%) fires |
| Conflicting signals | Higher priority rule takes precedence | 7d: +6%, Vol: 65% → R1 fails (vol too high), R7 (HOLD 75%) fires before R2 |
| Uncertain market | HOLD rule fires or default applies | 7d: +1%, 24h: -0.5% → Only R8 (Sideways HOLD) matches |

### Conflict Example — Worked Through

**Scenario:** Market data shows both bullish AND high volatility signals.

```
Facts:
  price_change_7d  = +6.2%
  price_change_24h = +1.5%
  volatility       = 0.65 (65%)

Rules that COULD match:
  R1: 7d > 5% ✅, 24h > 0% ✅, vol < 0.30 ❌  → FAILS (volatility too high)
  R7: vol > 0.60 ✅                             → MATCHES

Resolution:
  R1 fails because not ALL conditions met.
  R7 fires because volatility is dangerously high.
  Decision: HOLD (75% confidence)
  Reason: Even though the trend is bullish, high volatility makes
          entry risky. The system correctly prioritises safety.
```

---

## 3. Priority Handling

### How Are High-Priority Rules Given Preference?

The priority system is implemented through the **evaluation order** itself. High-priority rules are checked before medium-priority rules.

### Priority Assignment Rationale

```
HIGH PRIORITY Rules — Why?
──────────────────────────
R1 (Strong Uptrend + Low Vol)
  → Most reliable BUY signal: strong trend + stable market = highest
    probability of profitable entry

R4 (Strong Downtrend)
  → Most dangerous market condition: significant losses possible
    if not acted upon quickly

R7 (High Volatility)
  → Safety override: regardless of trend, extreme volatility makes
    any position risky. This acts as a circuit breaker.

MEDIUM PRIORITY Rules — Why?
────────────────────────────
R2, R3 (Moderate BUY signals)
  → Weaker patterns that are less reliable but still actionable

R5, R6 (Moderate SELL signals)
  → Secondary bearish signals; less urgent than strong downtrend

R8, R9 (HOLD signals)
  → Sideways or uncertain markets; lowest urgency since HOLD
    means "do nothing"
```

### Priority Override Mechanism

```
IF a HIGH-priority rule matches:
  → It ALWAYS takes precedence over medium-priority rules
  → The engine stops immediately; no further rules are checked

IF only MEDIUM-priority rules match:
  → Among medium rules, the first match in sequence wins
  → Sequence is ordered by confidence (highest confidence first)

SPECIAL CASE — Safety Override:
  Rule R7 (High Volatility HOLD) acts as a safety mechanism.
  Even if both R1 (BUY) and R4 (SELL) conditions are close to
  being met, R7 prevents action in dangerous market conditions.
```

---

## 4. Worked Example: Complete Rule Matching Step by Step

### Scenario: Ethereum Analysis with Conservative Risk

**Input Data:**
```
Asset:            Ethereum (ETH)
current_price     = $3,245
price_change_24h  = -6.2%
price_change_7d   = -12.4%
high_24h          = $3,520
low_24h           = $3,180
ath               = $4,891
atl               = $0.432
risk_level        = 2 (Conservative)
```

---

### Step 1: Calculate Derived Facts

```
volatility    = (3520 - 3180) / 3245 = 340 / 3245 = 0.1048 (10.48%)
ath_proximity = (3245 / 4891) × 100 = 66.34%
atl_proximity = (3245 / 0.432) × 100 = 751,157%

Working Memory:
  current_price = 3245, price_change_24h = -6.2, price_change_7d = -12.4
  volatility = 0.1048 (LOW), ath_proximity = 66.34%, atl_proximity = 751157%
  risk_level = 2 (Conservative)
```

---

### Step 2: Rule Matching — Priority HIGH Rules

```
┌─────────────────────────────────────────────────────────┐
│ RULE R1: Strong Uptrend with Low Volatility             │
│   price_change_7d > 5.0   → -12.4 > 5.0   → ❌ FALSE  │
│   Result: SKIP (first condition fails)                  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ RULE R4: Strong Downtrend                               │
│   price_change_7d < -8.0  → -12.4 < -8.0  → ✅ TRUE   │
│   price_change_24h < -3.0 → -6.2 < -3.0   → ✅ TRUE   │
│                                                         │
│   ★ ALL CONDITIONS MET → RULE R4 FIRES ★               │
│   Action: SELL, Confidence: 85%                         │
│   STOP — No further rules evaluated                     │
└─────────────────────────────────────────────────────────┘

Rules R7, R2, R3, R5, R6, R8, R9 → NOT EVALUATED (R4 already fired)
```

---

### Step 3: Apply Risk Adjustment (Conservative)

```
risk_level = 2 → CONSERVATIVE (1–3)

Adjustments Applied:
  confidence: 85% - 10% = 75%  (conservative penalty)
  stop_loss: 3%
  target_multiplier: 1.5x
```

---

### Step 4: Calculate Trade Setup

```
entry_price     = $3,245
stop_loss_price = $3,245 × (1 + 0.03)  = $3,342  (3% above for SELL)
target_price    = $3,245 - ($3,245 × 0.03 × 1.5) = $3,245 - $146 = $3,099
risk_reward     = ($3,245 - $3,099) / ($3,342 - $3,245) = $146 / $97 = 1.5
```

---

### Step 5: Final Output with Explanation

```
╔══════════════════════════════════════════════════════════════╗
║  RECOMMENDATION: SELL (75% Confidence)                      ║
╠══════════════════════════════════════════════════════════════╣
║  Triggered Rule: R4 — Strong Downtrend                      ║
║                                                              ║
║  Reasoning Chain:                                            ║
║  1. FACT: 7-day change = -12.4% (below -8% threshold)      ║
║  2. FACT: 24-hour change = -6.2% (below -3% threshold)     ║
║  3. RULE R4 conditions fully satisfied → FIRED              ║
║  4. RISK: Conservative profile → confidence reduced by 10%  ║
║                                                              ║
║  Rules NOT Fired (and why):                                  ║
║  • R1: Failed — 7d change is negative, not > 5%            ║
║  • R4 matched first — all remaining rules skipped           ║
║                                                              ║
║  Trade Setup (Conservative):                                 ║
║  • Entry: $3,245                                            ║
║  • Stop-Loss: $3,342 (3% risk)                              ║
║  • Target: $3,099 (4.5% potential)                          ║
║  • Risk/Reward: 1:1.5                                       ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 5. Summary Table

| Component | Implementation in This System |
|-----------|-------------------------------|
| **Rule Firing** | Priority-ordered sequential evaluation; first match fires |
| **Conflict Resolution** | Ordered evaluation eliminates conflicts by design; priority first, then confidence |
| **Priority Handling** | HIGH priority rules (R1, R4, R7) evaluated before MEDIUM (R2, R3, R5, R6, R8, R9) |
| **Default Behavior** | If no rule matches → HOLD at 50% confidence |
| **Safety Override** | R7 (High Volatility) acts as circuit breaker, preventing trades in dangerous markets |
