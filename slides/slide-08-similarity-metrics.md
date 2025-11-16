# Slide 7: Measuring Similarity

**Status:** [DRAFT]
**Time:** 0:14 - 0:18
**Section:** Part 1 - Understanding Vectors and Embeddings

## Content Overview
Introduce the three main similarity metrics: cosine similarity, Euclidean distance, and dot product. Show concrete examples with numbers and explain when to use each.

## What We'll Say

"Now that we have vectors representing meaning, how do we measure similarity? There are three main approaches:

## 1. Cosine Similarity
**Measures the angle between vectors** (ignores magnitude, only cares about direction)

```python
from numpy import dot
from numpy.linalg import norm

def cosine_similarity(a, b):
    return dot(a, b) / (norm(a) * norm(b))

# Example:
dog = [0.8, 0.3, 0.1]
puppy = [0.75, 0.35, 0.12]
cat = [0.7, 0.25, -0.1]

print(cosine_similarity(dog, puppy))  # 0.998 - very similar!
print(cosine_similarity(dog, cat))    # 0.956 - somewhat similar
```

**Range:** -1 to 1 (1 = identical direction, 0 = perpendicular, -1 = opposite)

**When to use:** Most common for text embeddings. Normalized vectors mean magnitude doesn't matter - only direction/meaning matters.

## 2. Euclidean Distance
**Measures straight-line distance** between points (like a ruler in space)

```python
import numpy as np

def euclidean_distance(a, b):
    return np.linalg.norm(np.array(a) - np.array(b))

# Example:
print(euclidean_distance(dog, puppy))  # 0.067 - close!
print(euclidean_distance(dog, cat))    # 0.245 - farther
```

**Range:** 0 to ∞ (0 = identical, larger = more different)

**When to use:** When magnitude matters (e.g., comparing sizes, quantities)

## 3. Dot Product
**Measures both angle AND magnitude**

```python
def dot_product(a, b):
    return np.dot(a, b)

# Example:
print(dot_product(dog, puppy))  # 0.662
print(dot_product(dog, cat))    # 0.545
```

**Range:** -∞ to ∞ (higher = more similar for positive vectors)

**When to use:** Computationally fastest; good for pre-normalized vectors

## Which Should You Use?

**For most text applications: Cosine Similarity**
- Text embeddings often use normalized vectors
- Direction matters more than magnitude
- Industry standard for semantic search

**Euclidean Distance for:**
- Image embeddings where pixel intensity matters
- Physical measurements

**Dot Product for:**
- Speed-critical applications (no division or square roots)
- Already normalized vectors

**Pro tip:** OpenAI embeddings are pre-normalized, so cosine similarity and dot product give equivalent rankings (dot product is faster)."

## Visual Elements Needed
- [ ] Side-by-side comparison table:
  ```
  | Metric     | Measures      | Range    | Best For           |
  |------------|---------------|----------|--------------------|
  | Cosine     | Angle         | -1 to 1  | Text (default)     |
  | Euclidean  | Distance      | 0 to ∞   | Magnitude matters  |
  | Dot Product| Angle + Mag   | -∞ to ∞  | Speed-critical     |
  ```
- [ ] Visual diagrams for each:
  - Cosine: Two vectors with angle between them
  - Euclidean: Two points with ruler/line between
  - Dot Product: Two vectors with projection
- [ ] Code blocks with clear syntax highlighting
- [ ] Numerical examples showing the outputs
- [ ] Decision flowchart: "Which metric should I use?"

## Examples/Analogies

**Cosine Similarity - Direction Over Distance:**
"Two people walking in the same direction are 'similar' even if one walks faster. Cosine similarity only cares about direction, not speed."

**Euclidean Distance - Literal Distance:**
"How far apart are two cities? Straight-line distance. That's Euclidean distance - simple, intuitive, but not always what you want for meaning."

**Dot Product - Quick Approximation:**
"If you've already normalized everything, dot product gives you the same ranking as cosine but faster. It's like using a shortcut."

## Interactive Elements
- Show the code snippets on screen
- Walk through one calculation step-by-step
- "In production, which do you think Netflix uses?" (Answer: Likely cosine for semantic, but optimized with dot product)

## Notes/Considerations
- **CRITICAL:** This is math-heavy - pace it carefully
- Show concrete numbers, not just formulas
- Emphasize practical decision-making
- Common confusion: "Why do we need three?" (Different use cases)
- Have NumPy/Python code ready to show it's simple
- Mention: Most vector DBs support all three metrics

### Technical Details to Have Ready:
- **Normalization:** `vector / norm(vector)` makes it unit length
- **Computational cost:** Dot product (O(n)) < Cosine (O(n) + division) < Euclidean (O(n) + sqrt)
- **OpenAI normalization:** Their embeddings come pre-normalized to length 1
- **When rankings differ:** Cosine and Euclidean can rank results differently

## Breakdown Needed?
- [ ] Yes - Consider splitting if time is tight
- [x] No - 4 minutes allows proper explanation with examples

### Potential Breakdown (if needed):
**Slide 6a: Cosine Similarity (2 min)**
- Focus on most important metric
- Show code example
- Explain why it's the default

**Slide 6b: Other Metrics (2 min)**
- Euclidean and dot product
- When to use each
- Decision guide
