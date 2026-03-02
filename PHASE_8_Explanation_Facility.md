# PHASE 8: Explanation Facility

**Project:** Knowledge-Based Expert System for Intelligent Stock & Cryptocurrency Trading

---

## Overview

The Explanation Facility is a **mandatory component** of any intelligent system. It ensures the system can explain **WHY** a decision was made — showing the full reasoning chain, not just the final answer. Without this facility, the system is merely a calculator, not an intelligent expert system.

In this system, every recommendation includes:
1. **Which rule fired** and its name
2. **Which facts matched** each condition (with actual values)
3. **The reasoning chain** — step-by-step trace from data to decision
4. **Risk adjustments** applied based on user profile
5. **Trade setup logic** — how entry, stop-loss, and target were calculated

---

## Sample Explanation Output 1: BUY Recommendation

### Input
- **Asset:** Bitcoin (BTC)
- **Risk Level:** 5 (Moderate)
- **Market Data:** Current Price: $95,341 | 24h Change: +2.54% | 7d Change: +8.31% | Volatility: 3.25%

### System Output with Explanation

```
╔══════════════════════════════════════════════════════════════════╗
║                    TRADING RECOMMENDATION                        ║
║                                                                  ║
║  Signal: BUY                    Confidence: 85%                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ► EXPLANATION OF DECISION                                       ║
║                                                                  ║
║  The system recommended BUY because:                             ║
║                                                                  ║
║  Rule Fired: R1 — Strong Uptrend with Low Volatility             ║
║                                                                  ║
║  Facts Matched:                                                  ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │ Condition 1: 7-day change > 5%                            │  ║
║  │   Actual value: +8.31%  →  8.31 > 5.0  →  ✅ SATISFIED   │  ║
║  │                                                            │  ║
║  │ Condition 2: 24-hour change > 0%                          │  ║
║  │   Actual value: +2.54%  →  2.54 > 0.0  →  ✅ SATISFIED   │  ║
║  │                                                            │  ║
║  │ Condition 3: Volatility < 30%                             │  ║
║  │   Actual value: 3.25%   →  3.25 < 30   →  ✅ SATISFIED   │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                                                                  ║
║  Reasoning Chain:                                                ║
║  Step 1: Market data loaded into Working Memory                  ║
║  Step 2: Volatility calculated as (96200-93100)/95341 = 3.25%   ║
║  Step 3: Rule R1 evaluated — all 3 conditions satisfied          ║
║  Step 4: R1 fired → BUY signal generated with 85% confidence    ║
║  Step 5: Moderate risk profile applied → no confidence change    ║
║  Step 6: Trade setup calculated with 5% stop-loss, 2x target    ║
║                                                                  ║
║  Trade Setup (Moderate Risk):                                    ║
║  • Entry:      $95,341                                           ║
║  • Stop-Loss:  $90,574 (5.0% below entry)                       ║
║  • Target:     $104,875 (10.0% above entry)                     ║
║  • Risk/Reward Ratio: 1:2.0                                     ║
║                                                                  ║
║  Why NOT other signals?                                          ║
║  • SELL rules (R4–R6): Not applicable — market is in uptrend    ║
║  • HOLD rules (R7–R9): Not applicable — volatility is low and   ║
║    market has clear directional movement                         ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Sample Explanation Output 2: SELL Recommendation

### Input
- **Asset:** Ethereum (ETH)
- **Risk Level:** 2 (Conservative)
- **Market Data:** Current Price: $3,245 | 24h Change: -6.2% | 7d Change: -12.4% | Volatility: 10.48%

### System Output with Explanation

```
╔══════════════════════════════════════════════════════════════════╗
║                    TRADING RECOMMENDATION                        ║
║                                                                  ║
║  Signal: SELL                   Confidence: 75%                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ► EXPLANATION OF DECISION                                       ║
║                                                                  ║
║  The system recommended SELL because:                            ║
║                                                                  ║
║  Rule Fired: R4 — Strong Downtrend                               ║
║                                                                  ║
║  Facts Matched:                                                  ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │ Condition 1: 7-day change < -8%                           │  ║
║  │   Actual value: -12.4%  →  -12.4 < -8.0  →  ✅ SATISFIED │  ║
║  │                                                            │  ║
║  │ Condition 2: 24-hour change < -3%                         │  ║
║  │   Actual value: -6.2%   →  -6.2 < -3.0   →  ✅ SATISFIED │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                                                                  ║
║  Reasoning Chain:                                                ║
║  Step 1: Market data loaded — ETH showing significant decline    ║
║  Step 2: Volatility calculated as (3520-3180)/3245 = 10.48%    ║
║  Step 3: Rule R1 (BUY) evaluated — FAILED (7d change negative) ║
║  Step 4: Rule R4 (SELL) evaluated — both conditions matched     ║
║  Step 5: R4 fired → SELL signal at 85% base confidence          ║
║  Step 6: Conservative risk profile → confidence reduced by 10%  ║
║  Step 7: Final confidence = 85% - 10% = 75%                    ║
║  Step 8: Trade setup calculated with 3% stop-loss, 1.5x target ║
║                                                                  ║
║  Risk Adjustment Applied:                                        ║
║  • Profile: Conservative (Risk Level 2)                          ║
║  • Confidence reduced from 85% to 75% (-10% penalty)           ║
║  • Tighter stop-loss: 3% (vs. 5% for Moderate)                 ║
║  • Lower target multiplier: 1.5x (vs. 2.0x for Moderate)       ║
║                                                                  ║
║  Trade Setup (Conservative):                                     ║
║  • Entry:      $3,245                                            ║
║  • Stop-Loss:  $3,342 (3.0% above entry — for SELL position)   ║
║  • Target:     $3,099 (4.5% below entry)                        ║
║  • Risk/Reward Ratio: 1:1.5                                     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## Sample Explanation Output 3: HOLD Recommendation (Safety Override)

### Input
- **Asset:** Dogecoin (DOGE)
- **Risk Level:** 8 (Aggressive)
- **Market Data:** Current Price: $0.28 | 24h Change: +8.7% | 7d Change: +15.3% | Volatility: 100%

### System Output with Explanation

```
╔══════════════════════════════════════════════════════════════════╗
║                    TRADING RECOMMENDATION                        ║
║                                                                  ║
║  Signal: HOLD                   Confidence: 75%                  ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ► EXPLANATION OF DECISION                                       ║
║                                                                  ║
║  The system recommended HOLD despite strong bullish signals      ║
║  because:                                                        ║
║                                                                  ║
║  Rule Fired: R7 — High Volatility (Safety Override)              ║
║                                                                  ║
║  ⚠ SAFETY MECHANISM ACTIVATED                                    ║
║  Although the market shows strong upward momentum (+15.3% over   ║
║  7 days, +8.7% over 24 hours), the system detected EXTREME      ║
║  volatility (100%) which poses significant risk.                 ║
║                                                                  ║
║  Facts Matched:                                                  ║
║  ┌────────────────────────────────────────────────────────────┐  ║
║  │ Condition: Volatility > 60%                               │  ║
║  │   Actual value: 100%   →  100 > 60    →  ✅ SATISFIED     │  ║
║  │                                                            │  ║
║  │   Volatility Calculation:                                  │  ║
║  │   = (high_24h - low_24h) / current_price                  │  ║
║  │   = ($0.42 - $0.14) / $0.28                               │  ║
║  │   = $0.28 / $0.28 = 1.00 (100%)                          │  ║
║  └────────────────────────────────────────────────────────────┘  ║
║                                                                  ║
║  Reasoning Chain:                                                ║
║  Step 1: Market data loaded — DOGE showing massive price swings ║
║  Step 2: Volatility calculated = 100% (EXTREME)                 ║
║  Step 3: Rule R1 (BUY) evaluated:                               ║
║          - 7d > 5%: +15.3% > 5.0% → ✅                         ║
║          - 24h > 0%: +8.7% > 0.0% → ✅                         ║
║          - vol < 30%: 100% < 30%  → ❌ FAILED                  ║
║          → R1 NOT fired (volatility too high)                   ║
║  Step 4: Rule R4 (SELL) evaluated — FAILED (trend is positive)  ║
║  Step 5: Rule R7 (High Volatility) evaluated:                   ║
║          - vol > 60%: 100% > 60% → ✅                          ║
║          → R7 FIRED (safety override)                           ║
║  Step 6: Decision = HOLD at 75% confidence                      ║
║  Step 7: Aggressive risk profile — no confidence adjustment     ║
║                                                                  ║
║  Why HOLD and not BUY?                                           ║
║  • The 24-hour price range ($0.14 to $0.42) represents a 200%  ║
║    swing — this means the price could drop sharply at any time  ║
║  • Entering a position during extreme volatility could result   ║
║    in immediate losses exceeding any stop-loss                   ║
║  • The system recommends waiting until volatility stabilises    ║
║    before considering entry                                      ║
║                                                                  ║
║  Rules NOT Fired:                                                ║
║  • R1 (BUY): Would have fired but volatility condition failed   ║
║  • R2 (BUY): Would have fired but checked after R7              ║
║  • R3 (BUY): Would have fired but checked after R7              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## How the Explanation Module Works

### Architecture

```
Inference Engine Decision
         │
         ▼
┌─────────────────────────────────┐
│     EXPLANATION MODULE          │
│                                 │
│  Input:                         │
│  • Triggered rule (ID + name)   │
│  • All evaluated conditions     │
│  • Matched fact values          │
│  • Risk profile adjustments     │
│  • Trade calculations           │
│                                 │
│  Process:                       │
│  1. Format rule identification  │
│  2. Show each condition with    │
│     actual value vs threshold   │
│  3. Build reasoning chain       │
│     (sequential steps)          │
│  4. Document risk adjustments   │
│  5. Explain trade setup logic   │
│  6. Note rules NOT fired (why)  │
│                                 │
│  Output:                        │
│  • Structured explanation text  │
│  • Displayed in UI panel        │
└─────────────────────────────────┘
```

### Key Design Principle

> **"Systems that only give outputs without explanation will NOT be considered intelligent systems."**  
> — Faculty Project Requirements

Every explanation output satisfies this requirement by showing:
- ✅ **What** the decision is (BUY/SELL/HOLD)
- ✅ **Why** the decision was made (which rule, which facts)
- ✅ **How** the reasoning progressed (step-by-step chain)
- ✅ **What adjustments** were applied (risk profile effects)
- ✅ **What alternatives** were considered (rules not fired and why)
