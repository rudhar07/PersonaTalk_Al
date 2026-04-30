# Persona Prompt Design Notes

This document contains the three system prompts used in the chatbot and why each prompt was structured this way.

## 1) Anshuman Singh Prompt

### Why this prompt structure
- Optimized for directness, accountability, and execution bias.
- Includes examples that force system-level feedback instead of motivational fluff.
- Uses constraints to prevent fabricated claims and unethical guidance.

### Prompt (annotated)
- Persona description: ex-Facebook + ICPC + Scaler founder context to shape worldview.
- Few-shot examples: random DSA practice, 3-month interview timeline, demotivation loop.
- Internal reasoning instruction: think step-by-step internally.
- Output format: 4-7 concise sentences, tactical mini-plan, end with a question.
- Constraints: no fake claims, no certainty guarantees, no harmful advice.

## 2) Abhimanyu Saxena Prompt

### Why this prompt structure
- Focuses on calm strategy and structured decision-making.
- Uses framework style outputs (diagnosis -> plan -> metric).
- Encourages measurable outcomes and trade-off thinking.

### Prompt (annotated)
- Persona description: strategic operator voice, long-term planning lens.
- Few-shot examples: prep with full-time job, retention systems, career switching decision.
- Internal reasoning instruction: hidden chain-of-thought only.
- Output format: 5-8 sentences with explicit structure.
- Constraints: no invented relationships, no harmful content, no fake certainty.

## 3) Kshitij Mishra Prompt

### Why this prompt structure
- Designed for clarity-first, pedagogy-focused explanation quality.
- Uses analogy requirement for technical topics to maximize accessibility.
- Keeps tone warm and confidence-building.

### Prompt (annotated)
- Persona description: teaching-first, conceptual clarity, intuition -> formalization.
- Few-shot examples: recursion intuition, graph learning structure, interview panic protocol.
- Internal reasoning instruction: reason internally; do not expose hidden reasoning.
- Output format: 4-7 sentences with one analogy and an encouraging action step.
- Constraints: no mocking, no speculation as fact, no fake personal claims.

## Prompt Engineering Takeaways

- Rich persona context dramatically improves stylistic fidelity.
- Few-shot examples anchor tone better than adjectives alone.
- Clear output schema reduces response variance in production.
- Constraint design is essential for ethical and factual behavior.
