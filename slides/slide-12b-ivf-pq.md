# Slide 9b: IVF & Product Quantization

**Status:** [DRAFT]
**Time:** 0:22 - 0:24
**Section:** Part 2 - Vector Databases & Architecture

## Content Overview
Explain IVF (Inverted File Index) clustering approach and Product Quantization compression. Show how these techniques reduce search space and memory footprint.

## What We'll Say

"HNSW is great, but it uses a lot of memory. When you have billions of vectors or tight budgets, you need different approaches. Let's look at two complementary techniques:

## 1. IVF - Inverted File Index

**Core Idea:** Don't search everything - cluster vectors and search only relevant clusters.

**Library Analogy:**
Imagine a library with 1 million books. Instead of checking each book:
1. Organize into sections: Fiction, Science, History, etc. (clustering)
2. When searching for 'Python programming,' go straight to Computer Science
3. Only search that section

```python
class IVF:
    def __init__(self, vectors, n_clusters=1000):
        # One-time: cluster all vectors using k-means
        self.centroids = kmeans(vectors, n_clusters)

        # Build inverted lists: centroid → vectors in that cluster
        self.clusters = {i: [] for i in range(n_clusters)}
        for vector_id, vector in enumerate(vectors):
            closest_centroid = self.find_closest_centroid(vector)
            self.clusters[closest_centroid].append(vector_id)

    def search(self, query, n_probes=10, k=10):
        # Step 1: Find n_probes closest centroids
        closest_centroids = self.rank_centroids(query, n_probes)

        # Step 2: Only search vectors in those clusters
        candidates = []
        for centroid_id in closest_centroids:
            candidates.extend(self.clusters[centroid_id])

        # Step 3: Rank candidates and return top-k
        return self.rank_candidates(query, candidates, k)
```

**Performance:**
- **Search Time:** O(k + n/c) where k = clusters searched, c = total clusters
  - 1 billion vectors, 10,000 clusters = search ~100,000 vectors (99.99% reduction!)
- **Accuracy:** 90-95% recall with proper n_probes
- **Memory:** Lower than HNSW (just centroids + lists)

**Trade-off:** More n_probes = better accuracy but slower search

## 2. Product Quantization (PQ)

**Core Idea:** Compress vectors dramatically by chunking and quantizing.

**Image Compression Analogy:**
JPEG doesn't store every pixel's exact color. It uses compression. PQ does the same for vectors.

```python
# Original vector: 1,536 floats × 4 bytes = 6,144 bytes
vector = [0.234, -0.891, 0.445, ..., 0.123]  # 1,536 numbers

# Product Quantization with 8 subspaces:
# 1. Split into 8 chunks of 192 dimensions each
chunks = [
    vector[0:192],      # Chunk 1
    vector[192:384],    # Chunk 2
    ...
    vector[1344:1536]   # Chunk 8
]

# 2. For each chunk, find nearest codebook entry
codebook_size = 256  # Can represent with 1 byte (0-255)
compressed = [
    codebook_1.find_nearest(chunks[0]),  # Returns index: 142
    codebook_2.find_nearest(chunks[1]),  # Returns index: 78
    ...
    codebook_8.find_nearest(chunks[7])   # Returns index: 201
]

# Compressed: 8 bytes instead of 6,144 bytes
# = 768× compression!
```

**How Search Works:**
```python
def pq_search(query, compressed_vectors, k=10):
    # Precompute distances from query to all codebook entries
    distance_tables = precompute_distances(query)

    # For each compressed vector, compute approximate distance
    scores = []
    for pq_codes in compressed_vectors:
        # Sum distances using lookup tables (very fast!)
        distance = sum(distance_tables[i][code]
                      for i, code in enumerate(pq_codes))
        scores.append(distance)

    return top_k(scores, k)
```

**Performance:**
- **Memory:** 10-100× reduction
- **Search Speed:** Fast (table lookups)
- **Accuracy:** 85-95% recall (depends on # subspaces)

## Combining IVF + PQ

The killer combination used in production:

```python
# IVF: Reduce search space
# PQ: Reduce memory per vector

class IVF_PQ:
    def __init__(self, vectors, n_clusters=10000, n_subspaces=8):
        # First: cluster vectors (IVF)
        self.ivf = IVF(vectors, n_clusters)

        # Second: compress each vector (PQ)
        self.pq = ProductQuantizer(n_subspaces)

    def search(self, query, n_probes=20, k=10):
        # Step 1: Find relevant clusters (IVF)
        cluster_ids = self.ivf.find_clusters(query, n_probes)

        # Step 2: Search compressed vectors in those clusters (PQ)
        candidates = []
        for cluster_id in cluster_ids:
            compressed_vectors = self.get_cluster_vectors(cluster_id)
            scores = self.pq.compute_distances(query, compressed_vectors)
            candidates.extend(scores)

        # Step 3: Return top-k
        return sorted(candidates)[:k]
```

**Result:** Billions of vectors, millisecond queries, reasonable memory

**Used by:**
- Faiss (Facebook AI Similarity Search)
- Milvus
- Pinecone (proprietary variant)

## When to Use IVF vs PQ vs Combined

| Technique | Memory | Speed | Accuracy | Use Case |
|-----------|--------|-------|----------|----------|
| IVF alone | Medium | Fast | 90-95% | Balanced, millions of vectors |
| PQ alone | Very low | Very fast | 85-90% | Massive scale, memory-constrained |
| IVF + PQ | Low | Fast | 90-95% | Billions of vectors, production |

**Rule of thumb:**
- **< 1 million vectors:** HNSW
- **1M - 100M vectors:** IVF
- **100M+ vectors:** IVF + PQ"

## Visual Elements Needed
- [ ] IVF diagram: Voronoi cells with vectors clustered
- [ ] Animation: Query finds nearby centroids, searches those clusters
- [ ] PQ diagram: Vector split into chunks → codebook lookup
- [ ] Compression visualization: Full vector vs compressed codes
- [ ] Memory comparison bar chart:
  ```
  Full precision: ████████████████████ 6,144 bytes
  IVF:            ██████████████████   ~5,000 bytes
  PQ:             █                     8 bytes
  ```
- [ ] IVF + PQ combined diagram
- [ ] Decision table

## Examples/Analogies

**IVF - Phone Book Sections:**
"Phone book splits names by letter. You don't search A-Z for 'Smith' - you jump to the S section. IVF does this with vectors."

**PQ - Pantone Color Codes:**
"Instead of storing RGB (255, 128, 64), designers use Pantone codes (PMS 1585). Lossy but efficient. PQ creates 'codebooks' of vector chunks."

**IVF + PQ - Efficient Warehouse:**
"Warehouse has sections (IVF). Items are stored with barcodes instead of full descriptions (PQ). Fast to navigate, compact storage."

## Interactive Elements
- "Who's familiar with k-means clustering?" (foundation of IVF)
- Show the compression ratio: "6KB → 8 bytes"
- "This is how Faiss handles billions of vectors on commodity hardware"

## Notes/Considerations
- Don't overexplain k-means - just mention clustering
- Emphasize practical benefits: memory + speed
- These are the workhorses of billion-scale systems
- Faiss (by Facebook AI) popularized these techniques
- Most production systems use some variant of IVF+PQ

### Technical Details to Have Ready:
- **IVF parameters:** nlist (clusters), nprobe (search)
- **PQ parameters:** M (subspaces), nbits (codebook size)
- **Training requirement:** Both need training on sample data
- **Asymmetric distance:** PQ uses special distance computation

## Breakdown Needed?
- [ ] Yes
- [x] No - 2 minutes covers both techniques at right depth
