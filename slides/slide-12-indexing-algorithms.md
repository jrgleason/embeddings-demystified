# Slide 9: Indexing Algorithms

**Status:** [DRAFT]
**Time:** 0:20 - 0:25
**Section:** Part 2 - Vector Databases & Architecture

## Content Overview
Explain the three major indexing algorithms: HNSW (Hierarchical Navigable Small Worlds), IVF (Inverted File Index), and Product Quantization. Show how each trades accuracy for speed.

## What We'll Say

"Vector databases use specialized indexing algorithms to make search fast. Let's look at the three most important ones:

## 1. HNSW - Hierarchical Navigable Small Worlds

**Concept:** Build a multi-layer graph where each layer has different granularity

Think of it like a highway system:
- **Top layer:** Interstate highways (sparse, connects major cities)
- **Middle layers:** State highways (more connections)
- **Bottom layer:** Local roads (connects everything)

When searching:
1. Start at the top layer (fast, long jumps)
2. Move toward your target
3. Descend to lower layers for precision
4. Find the closest neighbors at the bottom

```python
# Simplified concept (actual implementation is complex)
class HNSW:
    def search(self, query, top_k=10):
        # Start at top layer
        current = self.entry_point

        for layer in range(self.max_layer, -1, -1):
            # Greedy search at this layer
            current = self.navigate_layer(query, current, layer)

        # Collect top-k neighbors at bottom layer
        return self.get_neighbors(current, top_k)
```

**Performance:**
- Search: O(log n) - logarithmic time!
- Memory: Higher (stores graph connections)
- Accuracy: Excellent (95-99% recall)

**Used by:** Chroma, Weaviate, Qdrant

## 2. IVF - Inverted File Index

**Concept:** Cluster vectors into groups (Voronoi cells), then search only relevant clusters

Like organizing a library:
1. Create sections (clusters): Fiction, History, Science, etc.
2. When searching, identify relevant sections first
3. Only search within those sections

```python
# Simplified concept
class IVF:
    def __init__(self, vectors, n_clusters=1000):
        # Cluster all vectors using k-means
        self.cluster_centers = kmeans(vectors, n_clusters)
        self.inverted_lists = self.build_inverted_lists(vectors)

    def search(self, query, n_probes=10):
        # Find closest cluster centers
        closest_clusters = self.find_clusters(query, n_probes)

        # Search only vectors in those clusters
        candidates = []
        for cluster_id in closest_clusters:
            candidates.extend(self.inverted_lists[cluster_id])

        return self.rank_by_similarity(query, candidates)
```

**Performance:**
- Search: O(n/c + c) where c = clusters
- Memory: Lower than HNSW
- Accuracy: Good (90-95% recall with enough probes)

**Used by:** Pinecone, Faiss (Facebook AI)

## 3. Product Quantization (PQ)

**Concept:** Compress vectors by dividing into sub-vectors and quantizing each

Like image compression:
1. Split vector into chunks: [v1, v2, v3, ..., v8]
2. Replace each chunk with nearest codebook entry
3. Store indices instead of full floats

```python
# Example: Compress 1536D vector with 8 sub-vectors
# Original: 1536 floats × 4 bytes = 6,144 bytes
# Compressed: 8 indices × 1 byte = 8 bytes
# = 768× compression!

class ProductQuantizer:
    def __init__(self, dimensions, n_subspaces=8):
        self.subspace_dim = dimensions // n_subspaces
        # Train codebooks for each subspace
        self.codebooks = [self.train_codebook(subspace)
                          for subspace in range(n_subspaces)]

    def encode(self, vector):
        # Split and quantize
        codes = []
        for i, codebook in enumerate(self.codebooks):
            subvector = vector[i*self.subspace_dim:(i+1)*self.subspace_dim]
            code = codebook.find_nearest(subvector)
            codes.append(code)
        return codes  # Just 8 bytes instead of 6KB!
```

**Performance:**
- Search: Fast (asymmetric distance computation)
- Memory: Excellent (10-100× compression)
- Accuracy: Lower (85-95% recall depending on setup)

**Used by:** Faiss, Milvus (often combined with IVF)

## Combining Techniques

Many production systems combine these:
- **IVF + PQ:** Cluster first, then compress (used by Faiss)
- **HNSW + PQ:** Graph navigation with compressed vectors
- **Hybrid:** Different algorithms for different query types

## Which Should You Choose?

| Algorithm | Speed | Memory | Accuracy | Best For |
|-----------|-------|--------|----------|----------|
| HNSW      | Fast  | High   | Highest  | Premium quality, have RAM |
| IVF       | Fast  | Medium | Good     | Balanced use cases |
| PQ        | Fastest| Lowest | Lower    | Massive scale, cost-sensitive |

**Default recommendation:** Start with HNSW if you have memory. Use IVF+PQ for billion-scale."

## Visual Elements Needed
- [ ] HNSW diagram: Multi-layer graph with connections
- [ ] IVF diagram: Voronoi cells/clusters with vectors inside
- [ ] PQ diagram: Vector split into chunks + codebook
- [ ] Performance comparison table
- [ ] Complexity notation: O(log n) vs O(n/c) vs O(n)
- [ ] Memory usage comparison bar chart
- [ ] Decision tree: "Which algorithm should I use?"

## Examples/Analogies

**HNSW - Highway System:**
"You don't drive through every town between NYC and LA. You take I-80 (top layer) most of the way, then state highways, then local roads to your destination."

**IVF - Library Sections:**
"Looking for a Python book? Go to Computer Science section. Don't search Fiction or History."

**PQ - Image Compression:**
"JPEG doesn't store every pixel perfectly. It uses clever compression. Same idea - lose a little quality for massive savings."

## Interactive Elements
- Show complexity notation: O(n) vs O(log n) vs O(1)
- "Who's familiar with k-means clustering?" (for IVF)
- "This is where computer science theory meets practice"

## Notes/Considerations
- **CRITICAL:** This is dense material - may need 5-7 minutes, not 5
- Focus on intuition, not implementation details
- Emphasize trade-offs: speed vs accuracy vs memory
- Real systems combine multiple techniques
- This sets up the database comparison in next slides

### Technical Details to Have Ready:
- **HNSW parameters:** M (connections), efConstruction (build), efSearch (query)
- **IVF parameters:** nlist (clusters), nprobe (clusters to search)
- **PQ parameters:** M (subspaces), nbits (codebook size)
- **Recall@K:** How many of the true top-K results are found

## Breakdown Needed?
- [x] Yes - Too much for 5 minutes
- [ ] No

### Proposed Breakdown:

**Slide 9a: HNSW (2 min)**
- Highway analogy
- Multi-layer graph concept
- Performance characteristics
- When to use

**Slide 9b: IVF & Product Quantization (2 min)**
- Clustering (IVF)
- Compression (PQ)
- Trade-offs
- When to use

**Slide 9c: Choosing the Right Algorithm (1 min)**
- Comparison table
- Decision guide
- Real-world combinations
- Bridge to database products

**Total: 5 minutes with proper breakdown**
