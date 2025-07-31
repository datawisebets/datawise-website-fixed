---
title: Devigging Sportsbook Odds
date: May 30, 2024
readTime: 5 min read
image: /images/blog/feature_game_lines_spreads.webp
excerpt: Learn how to remove the vigorish (vig) from sportsbook odds to uncover true probabilities and identify positive expected value betting opportunities.
author:
  name: DataWiseBets
  avatar: /lovable-uploads/Logo_TransparentBackground.png
categories:
  - Strategy
  - Analytics
featured: true
---

# Devigging Sportsbook Odds

Devigging sports betting odds involves removing the vigorish (vig) or overround included by sportsbooks to derive the underlying fair or "true" probabilities of outcomes. This process is crucial for bettors seeking to identify positive expected value (+EV) wagers by comparing devigged odds to their own probability estimates. Before diving into devigging, it's essential to understand [how to read sports betting odds](./how-to-read-sports-betting-odds.md) effectively. Popular devigging methods include multiplicative, additive, and shin, each making different assumptions about how sportsbooks allocate the vig across outcomes. Comparing devigged odds to market-setting "sharp" books like Pinnacle can further inform +EV assessments.

## Inferring True Outcome Likelihoods

Implied probability is a crucial concept in sports betting that converts odds into a percentage chance of an outcome occurring. It factors in the sportsbook's margin, providing insight into how the market views the likelihood of each possible result.

Implied probability can be calculated from American, decimal, or fractional odds using simple formulas. For example, +500 American odds convert to a 16.67% implied probability using:

- For positive American odds: 100 / (odds + 100)
- For negative American odds: |odds| / (|odds| + 100)

Comparing implied probabilities to a bettor's own estimated "true" probability of an outcome can identify value bets where the odds underestimate the real chance of a particular result.

The sum of implied probabilities for all outcomes in a market will exceed 100% due to the built-in sportsbook vig. This vig must be accounted for when assessing potential value using techniques like devigging odds.

Implied probability doesn't necessarily match the true statistical likelihood of an outcome - it reflects the market's combined view, which can be influenced by factors like public sentiment and sharp money.

Monitoring changes in implied probability as odds shift can provide clues about where smart money is going and help time bet placement for the best number.

Understanding and leveraging implied probability is an essential skill for sports bettors looking to identify and capitalize on mispriced odds in the market.

## Evaluating Devigging Techniques

There are several methods for devigging sports betting odds, each with its own assumptions and strengths:

### Multiplicative Method

The multiplicative method spreads the vig proportionally across outcomes based on their implied probability, with higher probability outcomes allocated more vig. While mathematically simple, it can fail to account for the favorite-longshot bias where bettors tend to overvalue longshots.

### Additive Method

The additive method divides the vig equally among all outcomes. This helps correct for the favorite-longshot bias but can sometimes result in negative probabilities for large underdogs.

### Shin Method

The shin method uses an iterative algorithm to address the favorite-longshot bias. It generally offers improved predictive accuracy over the multiplicative method and is equivalent to the additive method for two-outcome markets. These devigging techniques can be applied to various bet types, including [moneyline betting](./moneyline-betting-101.md) where understanding the true probabilities is especially crucial.

### Power Method

The power method extends the multiplicative and additive techniques by raising the probabilities to a constant power. It maintains valid probability ranges but may overcompensate for longshot bias compared to the shin approach.

Ultimately, the optimal devig method may vary based on the specific sport, market, and betting patterns involved. By analyzing the predictive value of different techniques across large datasets, bettors can adapt their devigging approach to maximize accuracy in a given situation.
