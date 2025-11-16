# Demo 03: Vector Search with Redis Stack

## Overview

This demo demonstrates semantic search using vector embeddings and shows how vector databases solve the limitations of SQL and NoSQL for similarity-based queries.

## What You'll Learn

- How vector embeddings capture semantic meaning
- Cosine similarity for measuring vector distance
- Semantic search that understands context
- The famous "king - man + woman = queen" example
- When and why to use vector search

## Running the Demo

**Prerequisites:**
- Redis Stack running (includes vector search)
- OpenAI API key in `demos/.env`

```bash
# Start Redis Stack
docker run -d -p 6379:6379 redis/redis-stack:latest

# Create .env file
cp demos/.env.example demos/.env
# Edit and add your OPENAI_API_KEY

# Run demo
cd demos/03_vector_search
python demo.py
```

## Demo Flow (10 minutes)

### 1. Semantic Search (3 mins)
- Query: "space exploration and discovering new worlds"
- Shows results even though exact words don't appear
- Demonstrates understanding of meaning vs keywords

### 2. Synonym Handling (2 mins)
- Three different phrasings of "dreams"
- All return "Inception" as top result
- Shows automatic synonym understanding

### 3. Cosine Similarity Explained (2 mins)
- Visual similarity matrix
- Compare similar vs dissimilar concepts
- Understand the math behind "similarity"

### 4. King-Queen Example (3 mins)
- The famous: king - man + woman ≈ queen
- Shows vector arithmetic captures relationships
- Demonstrates semantic algebra

## Key Concepts

### Embeddings
Text → Vector of 1536 floats that captures semantic meaning

### Cosine Similarity
Measures angle between vectors (1.0 = identical, 0.0 = unrelated)

### Vector Index
Specialized data structure (FLAT, HNSW) for fast nearest neighbor search

## Cost Estimate

**For this demo:**
- 10 movies × ~50 tokens = 500 tokens
- 4 queries × ~20 tokens = 80 tokens
- Total: ~580 tokens for embeddings
- Cost: ~$0.00001 (negligible)

## Transition to Next Demo

This sets up the side-by-side comparison showing when to use each approach!
