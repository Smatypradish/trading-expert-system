# PHASE 6: System Architecture Design

**Project:** Knowledge-Based Expert System for Intelligent Stock & Cryptocurrency Trading

---

## 1. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        EXPERT TRADING SYSTEM                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      USER INTERFACE (UI)                          │  │
│  │                                                                   │  │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │  │
│  │   │  Asset       │  │  Risk Level  │  │  Results Dashboard   │   │  │
│  │   │  Selection   │  │  Selector    │  │  • Signal Display    │   │  │
│  │   │  (Dropdown)  │  │  (Slider)    │  │  • Confidence Meter  │   │  │
│  │   └──────┬───────┘  └──────┬───────┘  │  • Trade Setup       │   │  │
│  │          │                  │          │  • Explanation Panel  │   │  │
│  │          │                  │          └──────────┬───────────┘   │  │
│  └──────────┼──────────────────┼────────────────────┼───────────────┘  │
│             │                  │                     ▲                   │
│             ▼                  ▼                     │                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    INFERENCE ENGINE                                │  │
│  │                                                                   │  │
│  │   ┌──────────────────────────────────────────────────────────┐    │  │
│  │   │  1. Fact Loader                                          │    │  │
│  │   │     • Fetches market data from CoinGecko API            │    │  │
│  │   │     • Loads user inputs into Working Memory              │    │  │
│  │   └──────────────────────┬───────────────────────────────────┘    │  │
│  │                          ▼                                        │  │
│  │   ┌──────────────────────────────────────────────────────────┐    │  │
│  │   │  2. Derived Fact Calculator                              │    │  │
│  │   │     • Computes volatility, ATH/ATL proximity             │    │  │
│  │   └──────────────────────┬───────────────────────────────────┘    │  │
│  │                          ▼                                        │  │
│  │   ┌──────────────────────────────────────────────────────────┐    │  │
│  │   │  3. Rule Matcher (Forward Chaining)                      │    │  │
│  │   │     • Evaluates rules R1–R9 in priority order            │    │  │
│  │   │     • Fires first matching rule                          │    │  │
│  │   │     • Applies conflict resolution if needed              │    │  │
│  │   └──────────────────────┬───────────────────────────────────┘    │  │
│  │                          ▼                                        │  │
│  │   ┌──────────────────────────────────────────────────────────┐    │  │
│  │   │  4. Risk Adjuster                                        │    │  │
│  │   │     • Adjusts confidence based on risk profile           │    │  │
│  │   │     • Calculates stop-loss and target prices             │    │  │
│  │   └──────────────────────┬───────────────────────────────────┘    │  │
│  │                          │                                        │  │
│  └──────────────────────────┼────────────────────────────────────────┘  │
│             │               │               │                           │
│             ▼               ▼               ▼                           │
│  ┌─────────────────┐ ┌──────────────┐ ┌─────────────────────────────┐  │
│  │  KNOWLEDGE BASE │ │  WORKING     │ │  EXPLANATION MODULE         │  │
│  │                 │ │  MEMORY      │ │                             │  │
│  │  • 9 Trading    │ │              │ │  • Records triggered rules  │  │
│  │    Rules (R1-R9)│ │  • Raw facts │ │  • Shows reasoning chain    │  │
│  │  • 3 Risk Rules │ │  • Derived   │ │  • Displays matched facts   │  │
│  │  • 4 Constraints│ │    facts     │ │  • Generates human-readable │  │
│  │  • 3 Derived    │ │  • Triggered │ │    justification text       │  │
│  │    Fact Rules   │ │    rules log │ │  • Shows trade setup logic  │  │
│  │                 │ │  • Decision  │ │                             │  │
│  └─────────────────┘ └──────────────┘ └─────────────────────────────┘  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    EXTERNAL DATA SOURCE                           │  │
│  │              CoinGecko API (Real-Time Market Data)               │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Component Descriptions

### 2.1 User Interface (UI)

| Aspect | Description |
|--------|-------------|
| **Role** | The front-end web interface through which users interact with the system |
| **Technology** | HTML, CSS, JavaScript (Vite + Vanilla JS) |
| **Input Elements** | Asset selection dropdown (Bitcoin, Ethereum, etc.), Risk level slider (1–10) |
| **Output Elements** | Trading signal display (BUY/SELL/HOLD), confidence meter, trade setup panel (entry, stop-loss, target), explanation panel showing reasoning |
| **Deployment** | Firebase Hosting (accessible via web browser) |

**Key Responsibilities:**
- Accept user inputs (asset selection, risk level)
- Display real-time market data
- Present trading recommendations with visual indicators
- Show the explanation panel with reasoning chain
- Provide responsive, professional trading terminal interface

---

### 2.2 Knowledge Base

| Aspect | Description |
|--------|-------------|
| **Role** | Stores all domain knowledge — the rules, facts, constraints, and relationships that the system uses to make decisions |
| **Storage** | Encoded directly in JavaScript as structured objects and arrays |
| **Contents** | 9 trading rules (R1–R9), 3 risk adjustment rules, 4 constraints, 3 derived fact calculation formulas |

**Structure:**
```
Knowledge Base
├── Trading Rules (R1–R9)
│   ├── BUY Rules:  R1 (85%), R2 (75%), R3 (80%)
│   ├── SELL Rules: R4 (85%), R5 (75%), R6 (70%)
│   └── HOLD Rules: R7 (75%), R8 (65%), R9 (70%)
│
├── Risk Adjustment Rules
│   ├── Conservative (1–3): -10% confidence, 3% stop-loss
│   ├── Moderate (4–6): no adjustment, 5% stop-loss
│   └── Aggressive (7–10): no adjustment, 10% stop-loss
│
├── Constraints
│   ├── C1: Confidence cap at 95%
│   ├── C2: Minimum 24h data required
│   ├── C3: Stop-loss between 2–15%
│   └── C4: Target ≥ 1.5x stop-loss
│
└── Derived Fact Formulas
    ├── Volatility = (High - Low) / Price
    ├── ATH Proximity = (Price / ATH) × 100
    └── ATL Proximity = (Price / ATL) × 100
```

---

### 2.3 Inference Engine

| Aspect | Description |
|--------|-------------|
| **Role** | The "brain" of the system — processes facts against rules to produce decisions |
| **Strategy** | Forward Chaining (data-driven reasoning) |
| **Process** | Loads facts → calculates derived facts → matches rules in priority order → applies risk adjustments → generates output |

**Sub-Components:**

1. **Fact Loader:** Retrieves raw market data from CoinGecko API and loads it along with user inputs into Working Memory.

2. **Derived Fact Calculator:** Computes secondary facts (volatility, ATH/ATL proximity) from raw data.

3. **Rule Matcher:** Iterates through rules R1–R9 in priority order. Uses forward chaining — the first rule whose conditions fully match the facts fires.

4. **Risk Adjuster:** Modifies the confidence level and calculates stop-loss/target prices based on the user's risk profile.

**Working Memory** is a temporary data store that holds:
- All raw facts from the API
- All derived/calculated facts
- The log of triggered rules
- The final decision and explanation

---

### 2.4 Explanation Module

| Aspect | Description |
|--------|-------------|
| **Role** | Makes the system "intelligent" by explaining WHY a decision was made — not just WHAT the decision is |
| **Output** | Human-readable text showing the full reasoning chain |
| **Importance** | **Mandatory** — systems without explanation are NOT considered intelligent (per faculty requirements) |

**What the Explanation Module Produces:**

1. **Triggered Rule:** Which rule fired (e.g., "R1: Strong Uptrend with Low Volatility")
2. **Fact Matching:** Which facts satisfied the rule's conditions, with actual values
3. **Reasoning Chain:** Step-by-step trace showing condition → evaluation → result
4. **Risk Adjustment:** How the user's risk profile affected the output
5. **Trade Logic:** How entry, stop-loss, and target prices were calculated

---

## 3. Data Flow: From User Input to Final Decision

```
STAGE 1: USER INPUT
──────────────────
User selects: Asset (e.g., Bitcoin) + Risk Level (e.g., 5 – Moderate)
    │
    ▼
STAGE 2: DATA FETCH
──────────────────
UI sends request → CoinGecko API
API returns: current_price, 24h_change, 7d_change, high, low, ATH, ATL
    │
    ▼
STAGE 3: FACT LOADING
──────────────────
Inference Engine loads API data + user risk level into Working Memory
Working Memory now contains 8 raw facts + 1 user input
    │
    ▼
STAGE 4: DERIVED FACTS
──────────────────
Inference Engine calculates:
  • Volatility = (high_24h - low_24h) / current_price
  • ATH proximity = current_price / ATH × 100
  • ATL proximity = current_price / ATL × 100
Working Memory updated with 3 additional derived facts
    │
    ▼
STAGE 5: RULE EVALUATION (Forward Chaining)
──────────────────
Inference Engine reads rules from Knowledge Base
Evaluates each rule (R1→R9) against Working Memory facts
First matching rule FIRES → decision is set (BUY/SELL/HOLD)
    │
    ▼
STAGE 6: RISK ADJUSTMENT
──────────────────
Risk profile rules from Knowledge Base are applied:
  Conservative → reduce confidence by 10%, set 3% stop-loss
  Moderate → no change, set 5% stop-loss
  Aggressive → no change, set 10% stop-loss
    │
    ▼
STAGE 7: EXPLANATION GENERATION
──────────────────
Explanation Module generates:
  • Which rule fired and why
  • Facts that matched each condition
  • Step-by-step reasoning chain
  • Trade setup calculations
    │
    ▼
STAGE 8: DISPLAY OUTPUT
──────────────────
UI receives final result and displays:
  • Trading signal (BUY/SELL/HOLD) with confidence
  • Trade setup (entry, stop-loss, target)
  • Full explanation panel with reasoning chain
```

---

## 4. Component Communication

| From | To | Data Passed | Method |
|------|----|-------------|--------|
| **UI** | **Inference Engine** | Asset name, risk level | Function call |
| **Inference Engine** | **CoinGecko API** | API request (asset ID) | HTTP GET (fetch) |
| **CoinGecko API** | **Inference Engine** | JSON market data | HTTP response |
| **Inference Engine** | **Knowledge Base** | Request for rules/constraints | Direct object access |
| **Knowledge Base** | **Inference Engine** | Rule definitions, constraints | Return rule objects |
| **Inference Engine** | **Explanation Module** | Triggered rules, matched facts, decision | Function call with data |
| **Explanation Module** | **Inference Engine** | Formatted explanation text | Return string |
| **Inference Engine** | **UI** | Complete result object (signal, confidence, explanation, trade setup) | Return object / callback |
