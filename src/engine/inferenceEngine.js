// Inference Engine - Forward Chaining Rule Evaluation
// Evaluates market conditions against expert rules to generate recommendations

import { TRADING_RULES, calculateMarketFacts } from './knowledgeBase';

/**
 * Evaluates a single condition against market facts
 */
function evaluateCondition(fact, condition) {
    const { operator, value } = condition;

    switch (operator) {
        case '>':
            return fact > value;
        case '<':
            return fact < value;
        case '>=':
            return fact >= value;
        case '<=':
            return fact <= value;
        case '=':
        case '==':
            return fact === value;
        case 'between':
            return fact >= value[0] && fact <= value[1];
        default:
            return false;
    }
}

/**
 * Evaluates all conditions of a rule against market facts
 */
function evaluateRule(rule, facts) {
    const matchedConditions = [];
    const unmatchedConditions = [];

    for (const [factName, condition] of Object.entries(rule.conditions)) {
        const factValue = facts[factName];

        if (factValue === undefined) {
            unmatchedConditions.push({
                factName,
                condition,
                reason: 'Fact not available'
            });
            continue;
        }

        const matches = evaluateCondition(factValue, condition);

        if (matches) {
            matchedConditions.push({
                factName,
                factValue,
                condition,
                description: `${factName} (${factValue.toFixed(2)}) ${condition.operator} ${Array.isArray(condition.value) ? condition.value.join(' to ') : condition.value}`
            });
        } else {
            unmatchedConditions.push({
                factName,
                factValue,
                condition,
                reason: `${factName} (${factValue.toFixed(2)}) does not satisfy ${condition.operator} ${Array.isArray(condition.value) ? condition.value.join(' to ') : condition.value}`
            });
        }
    }

    const totalConditions = Object.keys(rule.conditions).length;
    const matchScore = matchedConditions.length / totalConditions;
    const isFullMatch = matchedConditions.length === totalConditions && unmatchedConditions.length === 0;

    return {
        ruleId: rule.id,
        ruleName: rule.name,
        isFullMatch,
        matchScore,
        matchedConditions,
        unmatchedConditions,
        action: rule.action,
        baseConfidence: rule.confidence,
        explanation: rule.explanation
    };
}

/**
 * Forward chaining inference - evaluates all rules and returns best recommendation
 */
export function runInference(asset, riskProfile) {
    // Step 1: Calculate market facts from asset data
    const facts = calculateMarketFacts(asset);

    // Step 2: Evaluate all rules
    const ruleResults = TRADING_RULES.map(rule => evaluateRule(rule, facts));

    // Step 3: Filter matched rules
    const matchedRules = ruleResults.filter(r => r.isFullMatch);
    const partialMatches = ruleResults.filter(r => !r.isFullMatch && r.matchScore > 0.5);

    // Step 4: Apply risk profile adjustments
    let recommendation;

    if (matchedRules.length > 0) {
        // Sort by confidence and match score
        matchedRules.sort((a, b) => b.baseConfidence - a.baseConfidence);
        recommendation = matchedRules[0];
    } else if (partialMatches.length > 0) {
        // Use best partial match with reduced confidence
        partialMatches.sort((a, b) => (b.matchScore * b.baseConfidence) - (a.matchScore * a.baseConfidence));
        recommendation = {
            ...partialMatches[0],
            baseConfidence: partialMatches[0].baseConfidence * partialMatches[0].matchScore
        };
    } else {
        // Default to HOLD when no rules match
        recommendation = {
            ruleId: 'RULE_DEFAULT_HOLD',
            ruleName: 'No Clear Signal',
            isFullMatch: false,
            matchScore: 0,
            matchedConditions: [],
            unmatchedConditions: [],
            action: 'HOLD',
            baseConfidence: 0.5,
            explanation: 'Current market conditions do not strongly match any trading patterns. Maintaining current position is recommended.'
        };
    }

    // Step 5: Adjust confidence based on risk profile and volatility
    let adjustedConfidence = recommendation.baseConfidence;

    // Reduce confidence for aggressive recommendations when user is conservative
    if (riskProfile.level <= 3 && recommendation.action === 'BUY' && facts.volatility > 0.3) {
        adjustedConfidence *= 0.8;
    }

    // Reduce confidence for hold recommendations when user is aggressive
    if (riskProfile.level >= 7 && recommendation.action === 'HOLD') {
        adjustedConfidence *= 0.9;
    }

    // Step 6: Calculate price targets
    const targets = calculateTargets(facts.currentPrice, recommendation.action, riskProfile, facts.volatility);

    return {
        signal: recommendation.action,
        confidence: Math.min(adjustedConfidence, 0.95), // Cap at 95%
        ruleApplied: recommendation.ruleName,
        ruleId: recommendation.ruleId,
        explanation: recommendation.explanation,
        matchedConditions: recommendation.matchedConditions,
        allRuleResults: ruleResults,
        targets,
        facts,
        riskProfile: riskProfile.name
    };
}

/**
 * Calculate entry, stop-loss, and target prices based on recommendation
 */
function calculateTargets(currentPrice, action, riskProfile, volatility) {
    // Adjust stop-loss based on volatility
    const volatilityMultiplier = 1 + (volatility * 0.5);
    const adjustedStopLoss = riskProfile.stopLossPercent * volatilityMultiplier;

    if (action === 'BUY') {
        const stopLoss = currentPrice * (1 - adjustedStopLoss / 100);
        const riskAmount = currentPrice - stopLoss;
        const targetPrice = currentPrice + (riskAmount * riskProfile.targetMultiplier);

        return {
            entryPrice: currentPrice,
            stopLoss: stopLoss,
            targetPrice: targetPrice,
            riskRewardRatio: riskProfile.targetMultiplier,
            potentialLoss: ((adjustedStopLoss)).toFixed(2) + '%',
            potentialGain: ((riskProfile.targetMultiplier * adjustedStopLoss)).toFixed(2) + '%'
        };
    } else if (action === 'SELL') {
        // For sell signals, targets are reversed
        const targetPrice = currentPrice * (1 - adjustedStopLoss / 100);

        return {
            exitPrice: currentPrice,
            targetPrice: targetPrice,
            potentialDecline: adjustedStopLoss.toFixed(2) + '%',
            recommendation: 'Exit position or set trailing stop'
        };
    } else {
        // HOLD - no specific targets
        return {
            currentPrice,
            recommendation: 'Maintain current position',
            watchLevel: currentPrice * (1 - riskProfile.stopLossPercent / 100),
            breakoutLevel: currentPrice * (1 + 5 / 100)
        };
    }
}

/**
 * Generate detailed explanation for the decision
 */
export function generateExplanation(inferenceResult) {
    const { signal, confidence, ruleApplied, matchedConditions, facts, targets, riskProfile } = inferenceResult;

    const sections = [];

    // Signal Summary
    sections.push({
        title: 'Recommendation',
        content: `${signal} signal with ${(confidence * 100).toFixed(0)}% confidence based on "${ruleApplied}" pattern.`
    });

    // Market Analysis
    sections.push({
        title: 'Market Analysis',
        content: `24h Change: ${facts.priceChange24h?.toFixed(2)}% | 7d Change: ${facts.priceChange7d?.toFixed(2)}% | Volatility: ${(facts.volatility * 100).toFixed(1)}%`
    });

    // Matched Conditions
    if (matchedConditions.length > 0) {
        sections.push({
            title: 'Triggering Factors',
            items: matchedConditions.map(c => c.description)
        });
    }

    // Risk-Adjusted Targets
    if (signal === 'BUY') {
        sections.push({
            title: 'Trade Setup',
            items: [
                `Entry Price: $${targets.entryPrice?.toLocaleString()}`,
                `Stop Loss: $${targets.stopLoss?.toLocaleString()} (${targets.potentialLoss} risk)`,
                `Target: $${targets.targetPrice?.toLocaleString()} (${targets.potentialGain} potential)`,
                `Risk/Reward: 1:${targets.riskRewardRatio}`
            ]
        });
    }

    // Risk Profile Context
    sections.push({
        title: 'Risk Profile',
        content: `Analysis adjusted for ${riskProfile} risk tolerance.`
    });

    return sections;
}
