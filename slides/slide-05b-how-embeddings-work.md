# How Embeddings Work

## The Process

```
Object 1 ──→
             ┌─────────────────────┐
Object 2 ──→ │  Embedding Model    │ ──→ [0.6│0.3│0.1│─ ─ ─ ─]
             └─────────────────────┘
Object 3 ──→                           [0.8│0.5│0.3│─ ─ ─ ─]

Set of Objects                         [0.4│0.2│0.9│─ ─ ─ ─]

                                       Objects as Vectors
```

## Key Steps
1. Input objects (text, images, audio, etc.)
2. Pass through trained embedding model
3. Output: Fixed-size numerical vectors
4. Vectors capture semantic meaning

**Source:** https://www.pinecone.io/learn/vector-embeddings/

---

**Notes:**
- Visual diagram showing embedding generation process
- Multiple objects → Single model → Multiple vectors
- All output vectors are same dimensionality
- Model is pre-trained to capture semantic relationships
