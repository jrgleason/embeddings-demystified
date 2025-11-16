# Slide 9a: HNSW - Hierarchical Navigable Small Worlds

**Status:** [DRAFT]
**Time:** 0:20 - 0:22
**Section:** Part 2 - Vector Databases & Architecture

## Content Overview
Explain HNSW (Hierarchical Navigable Small Worlds) indexing algorithm using the highway system analogy. Show how multi-layer graphs enable logarithmic search time.

## What We'll Say

"The first major indexing algorithm is **HNSW - Hierarchical Navigable Small Worlds**. Despite the intimidating name, the concept is intuitive.

## The Highway System Analogy

Imagine driving from San Francisco to New York. You don't go through every single town along the way. Instead:

1. **Start on local roads** to get to the highway
2. **Jump on I-80** (interstate) for the long haul
3. **Take exit to state highway** near your destination
4. **Use local roads** to reach the exact address

HNSW works the same way with vectors:

```
Layer 3 (Top):     A ←———————————————————————→ Z
                   ↓                             ↓
Layer 2:           A ←——→ M ←——→ P ←——→ Z
                   ↓      ↓      ↓      ↓
Layer 1:           A → D → G → M → P → S → W → Z
                   ↓   ↓   ↓   ↓   ↓   ↓   ↓   ↓
Layer 0 (Bottom):  A→B→C→D→E→F→G→H→...→W→X→Y→Z
```

## How Search Works

```python
def hnsw_search(query_vector, entry_point, max_layer, k=10):
    current_nearest = entry_point

    # Navigate from top layer down
    for layer in range(max_layer, -1, -1):
        # Greedy search: always move to closer neighbors
        while True:
            neighbors = get_neighbors(current_nearest, layer)
            closer = find_closer_neighbor(query_vector, neighbors)

            if closer is None:
                break  # Can't get closer at this layer
            current_nearest = closer

        # Descend to next layer for more precision

    # At bottom layer, collect k nearest neighbors
    return get_k_nearest(current_nearest, k)
```

**Key Insight:** Each layer trades precision for speed:
- **Top layers:** Fast navigation, big jumps (like highways)
- **Bottom layer:** Precise results, small steps (like local roads)

## Performance Characteristics

**Search Time:** O(log n)
- With 1 billion vectors, you might only visit ~30-40 nodes
- Compare to naive O(n) = visiting all 1 billion!

**Memory Usage:** Higher than other methods
- Stores graph connections (edges between nodes)
- Typical: 2-5× the size of the raw vectors

**Accuracy:** Excellent
- 95-99% recall (finds 95-99% of true nearest neighbors)
- Configurable: trade speed for accuracy

**Build Time:** Slower
- Must construct the multi-layer graph
- Usually one-time cost

## Configuration Parameters

```python
# Creating HNSW index
index = HNSWIndex(
    M=16,              # Connections per node (highway lanes)
    ef_construction=200,  # Quality of graph build
    ef_search=50       # Quality of search (higher = slower but better)
)
```

- **M:** Higher = more connections = faster search but more memory
- **ef_construction:** Higher = better index quality but slower build
- **ef_search:** Higher = better recall but slower queries

## When to Use HNSW

✅ **Great for:**
- High-quality results needed (99%+ recall)
- Read-heavy workloads (many queries, few updates)
- You have sufficient RAM
- Speed is critical

❌ **Not ideal for:**
- Extremely tight memory budgets
- Frequent updates/deletes (graph maintenance overhead)
- Billion-scale on single machine (consider sharding)

## Real-World Usage

**Used by:**
- Chroma
- Weaviate
- Qdrant
- Elasticsearch (recent versions)

**Industry adoption:** HNSW has become the default for many new vector databases because of its excellent accuracy-speed trade-off."

## Visual Elements Needed
- [ ] Multi-layer graph diagram showing HNSW structure
- [ ] Highway system analogy visual with actual roads/highways
- [ ] Animation: Search traversing from top layer to bottom
- [ ] Performance comparison:
  ```
  Naive search:  O(n) = 1,000,000,000 operations
  HNSW search:   O(log n) = ~30 operations
  = 33,000,000× fewer operations!
  ```
- [ ] Configuration parameter sliders showing trade-offs
- [ ] Memory vs accuracy vs speed triangle
- [ ] Code block showing index creation

## Examples/Analogies

**GPS Navigation:**
"GPS doesn't calculate routes by checking every possible road. It uses hierarchical roads: highways for long distances, local roads for precision. HNSW does the same with vectors."

**Corporate Hierarchy:**
"To reach a specific employee, you don't ask everyone in the company. You go to the right department first (top layer), then team (middle), then person (bottom)."

**Zoom Levels:**
"Like Google Maps: start zoomed out (top layer), zoom in as you get closer (descend layers), street view for exact location (bottom layer)."

## Interactive Elements
- "Who's used A* pathfinding or graph algorithms?" (HNSW builds on similar ideas)
- Show the logarithmic growth: "10 nodes → 3 steps, 1000 nodes → 5 steps, 1 billion → 30 steps"
- Emphasize: "This is why vector search can be so fast"

## Notes/Considerations
- Keep graph theory minimal - focus on intuition
- Emphasize the practical benefits (speed + accuracy)
- This is the most important algorithm to understand
- Most modern vector DBs use HNSW or variants
- Don't get bogged down in implementation details

### Technical Notes to Have Ready:
- **Algorithm origin:** Paper by Malkov & Yashunin (2018)
- **Graph type:** Proximity graph with long-range connections
- **Small world phenomenon:** Like "six degrees of separation"
- **Navigable:** Can always find a path to target
- **Hierarchical:** Multiple resolution layers

## Breakdown Needed?
- [ ] Yes
- [x] No - 2 minutes is perfect for one algorithm with depth
