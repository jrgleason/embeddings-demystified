# Slide 9c: Choosing the Right Algorithm

**Status:** [DRAFT]
**Time:** 0:24 - 0:25
**Section:** Part 2 - Vector Databases & Architecture

## Content Overview
Provide a decision framework for choosing between HNSW, IVF, and PQ. Show real-world combinations and when to use each approach.

## What We'll Say

"Now you've seen three major approaches. How do you choose? Let's break it down.

## Algorithm Comparison

| Factor | HNSW | IVF | PQ | IVF + PQ |
|--------|------|-----|----|---------  |
| **Search Speed** | O(log n) | O(n/c) | O(n) lookups | O(n/c) lookups |
| **Memory Usage** | High | Medium | Very Low | Low |
| **Accuracy (Recall)** | 95-99% | 90-95% | 85-90% | 90-95% |
| **Build Time** | Slow | Medium | Fast | Medium |
| **Update Cost** | High | Medium | Low | Medium |
| **Best Scale** | <100M | 10M-500M | Any | 100M+ |

## Decision Framework

```
Start here: How many vectors?

< 1 million vectors
├─ Have RAM? → HNSW (best accuracy + speed)
└─ Tight memory? → IVF

1M - 100M vectors
├─ Read-heavy workload? → HNSW (if RAM available)
├─ Balanced workload? → IVF
└─ Write-heavy? → IVF or PQ

100M - 1B+ vectors
├─ Budget for RAM? → Sharded HNSW
├─ Cost-sensitive? → IVF + PQ
└─ Extreme scale? → IVF + PQ with distributed system
```

## Real-World Combinations

Production systems often combine multiple techniques:

**Faiss (Facebook AI):**
```python
# Options Faiss provides:
IndexFlatL2           # Brute force (baseline)
IndexHNSWFlat         # HNSW with full precision
IndexIVFFlat          # IVF without compression
IndexIVFPQ            # IVF + PQ (most popular for scale)
IndexIVFPQR           # IVF + PQ + Refinement (rerank top results)
```

**Pinecone (Managed Service):**
- Proprietary variant of IVF with optimizations
- Automatic scaling and sharding
- Handles billions of vectors

**Weaviate:**
- HNSW by default
- Supports PQ compression
- Hybrid search (vector + keyword)

**Milvus:**
- Supports HNSW, IVF, and PQ
- User chooses based on needs
- Good for experimentation

## Configuration Examples

**High Accuracy (E-commerce Product Search):**
```python
# HNSW with generous parameters
index = HNSWIndex(
    M=32,              # More connections
    ef_construction=400,
    ef_search=100      # High recall
)
# Memory: High, Recall: 99%+
```

**Balanced (Document Similarity):**
```python
# IVF with moderate settings
index = IVFIndex(
    n_clusters=4096,
    n_probes=32
)
# Memory: Medium, Recall: 93-95%
```

**Massive Scale (Recommendation System):**
```python
# IVF + PQ for billions of items
index = IVFPQ(
    n_clusters=65536,
    n_probes=64,
    n_subspaces=16,
    bits_per_code=8
)
# Memory: Low, Recall: 90-92%, Scale: Billions
```

## Key Takeaways

1. **No single "best" algorithm** - it depends on your constraints
2. **Start simple** - benchmark before optimizing
3. **Accuracy vs Speed vs Memory** - pick two
4. **Most production systems use IVF + PQ** for scale
5. **HNSW is the new default** for quality-first applications

## What's Next

Now that you understand indexing, let's look at actual vector database products:
- Managed services vs self-hosted
- Feature comparison
- Cost considerations
- Integration patterns"

## Visual Elements Needed
- [ ] Large comparison table (main focal point)
- [ ] Decision tree flowchart (color-coded paths)
- [ ] Visual spectrum:
  ```
  Accuracy ←————————→ Memory Efficiency
  HNSW              IVF              PQ
  ```
- [ ] Real-world logos: Faiss, Pinecone, Weaviate, Milvus
- [ ] Configuration code blocks
- [ ] "Pick Two" triangle:
  ```
       Speed
       /  \
      /    \
  Accuracy—Memory
  ```

## Examples/Analogies

**Car Analogy:**
"Choosing a vector index is like choosing a car:
- **HNSW:** Sports car - fast, luxurious, expensive to run
- **IVF:** Sedan - balanced, practical, good for most
- **PQ:** Economy car - cheap to run, does the job
- **IVF+PQ:** Hybrid - best of both worlds for long trips"

**Computing Trade-offs:**
"Like video games graphics settings:
- Ultra (HNSW): Beautiful but needs high-end GPU
- High (IVF): Great balance for most systems
- Low (PQ): Runs on anything
- Custom (IVF+PQ): Tuned for your hardware"

## Interactive Elements
- "What's your scale? Thousands? Millions? Billions?" (helps audience identify path)
- "This decision is reversible - you can change later"
- "Most start with HNSW, scale to IVF+PQ as needed"

## Notes/Considerations
- This is a summary/decision slide - keep it practical
- Focus on "how to choose" not "how it works"
- Provide clear guidance, not just facts
- Acknowledge there's no universal answer
- Set up next section on database products
- Mention benchmarking tools (ann-benchmarks.com)

### Resources to Mention:
- **ann-benchmarks.com** - Compare algorithms on standard datasets
- **Faiss documentation** - Excellent technical details
- **Vector DB docs** - Each has tuning guides

## Breakdown Needed?
- [ ] Yes
- [x] No - 1 minute for decision framework is appropriate
