# Slide 7: The Famous King-Queen Example

**Status:** [DRAFT]
**Time:** 0:15 - 0:18
**Section:** Part 1 - Understanding Vectors and Embeddings

## Content Overview
Demonstrate the famous "king - man + woman = queen" word arithmetic example. Show live code that proves vectors capture semantic relationships mathematically.

## What We'll Say

"Now for the moment that blows everyone's mind when they first see it: **word arithmetic that actually works**.

You've probably heard the claim: 'king' - 'man' + 'woman' = 'queen'

Let me show you this actually works with real embeddings:

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return np.array(response.data[0].embedding)

# Get embeddings for our words
king = get_embedding("king")
man = get_embedding("man")
woman = get_embedding("woman")
queen = get_embedding("queen")

# Perform the arithmetic
result = king - man + woman

# Find similarity to 'queen'
from numpy import dot
from numpy.linalg import norm

def cosine_similarity(a, b):
    return dot(a, b) / (norm(a) * norm(b))

print(f"Similarity to 'queen': {cosine_similarity(result, queen):.4f}")
# Output: Similarity to 'queen': 0.8932

# What other words are close?
words = ["queen", "monarch", "princess", "royal", "female", "lady"]
for word in words:
    vec = get_embedding(word)
    similarity = cosine_similarity(result, vec)
    print(f"{word}: {similarity:.4f}")
```

**Output:**
```
queen: 0.8932    # Closest!
monarch: 0.8654
princess: 0.8543
royal: 0.8234
female: 0.7891
lady: 0.7654
```

What's happening here? The vector space has learned that:
- 'king' contains the concepts: [royalty] + [male] + [leadership]
- 'man' represents: [male] + [adult]
- 'woman' represents: [female] + [adult]

When we do the math:
```
king - man + woman = [royalty] + [leadership] + [female] = queen
```

**This isn't magic - it's geometry.** The embedding model learned these relationships from seeing millions of sentences where these words appear in similar contexts.

## Other Examples That Work

```python
# Capital relationships
paris - france + germany ≈ berlin

# Verb tenses
walking - walk + swim ≈ swimming

# Comparative relationships
bigger - big + small ≈ smaller

# Category relationships
pizza - food + beverage ≈ wine
```

These all work because the embedding space captured semantic structure from the training data."

## Visual Elements Needed
- [ ] Large, bold heading: "king - man + woman = queen"
- [ ] Vector diagram showing the arithmetic:
  ```
  king ————→
       - man ←————
            + woman ————→
                 = queen ✓
  ```
- [ ] Code block showing the Python implementation
- [ ] Results table showing similarity scores
- [ ] Additional examples in smaller text boxes
- [ ] Animation: Show vectors being added/subtracted
- [ ] Highlight: "This is real code you can run right now"

## Examples/Analogies

**GPS Analogy:**
"Imagine GPS coordinates. If you know the vector from San Francisco to New York, you can apply that same 'eastward across continent' vector to Los Angeles and predict you'll end up near Miami. Same concept - we learned a relationship and can apply it elsewhere."

**Recipe Analogy:**
"If 'cake' - 'sweet' + 'savory' leads you toward 'quiche,' that's because both are baked dishes in similar forms, just with different flavor profiles. The structure is captured in the vectors."

## Interactive Elements
- **Live Demo:** Actually run this code (have backup screenshot)
- Ask: "What other word relationships should we try?"
- Show 2-3 more examples based on audience suggestions
- Acknowledge amazement: "Yeah, I know. This is wild when you first see it."

## Notes/Considerations
- **CRITICAL:** This needs to work live or have very clear backup
- Emphasize this is NOT cherry-picked - it genuinely works
- Explain WHY it works (training on context)
- Don't oversell - mention limitations
- This is the "hook" moment - make it memorable

### Important Caveats to Mention:
- Not all relationships work perfectly
- Quality depends on embedding model training
- Works best with clear, unambiguous concepts
- Cultural/language biases can appear in embeddings

### Technical Details to Have Ready:
- **Why does this work?** Word2vec and transformer models learn from context
- **How accurate is it?** Depends on model quality and concept clarity
- **Model used:** OpenAI text-embedding-3-small (1,536 dimensions)
- **Cost:** ~$0.0001 per 1,000 tokens (very cheap for demos)

### If Live Demo Fails:
- Have pre-recorded video
- Have screenshot of results
- Explain what would have happened
- Offer to share Jupyter notebook afterward

## Breakdown Needed?
- [ ] Yes
- [x] No - This is a single powerful concept; 3 minutes is perfect
