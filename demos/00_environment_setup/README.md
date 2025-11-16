# Demo Environment Setup

This guide will help you set up a demo environment to explore the differences between:
- **SQL** (exact matching with SQLite)
- **NoSQL** (key-value store with Redis)
- **Vector Search** (semantic similarity with Redis Stack)

## Prerequisites

- Python 3.10+
- Docker Desktop (recommended) or local Redis Stack installation
- OpenAI API key (for generating embeddings)

---

## Installation Steps

### 1. Install Python Dependencies

Create a virtual environment and install required packages:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Set Up Redis Stack

Redis Stack includes RediSearch with vector similarity search capabilities.

#### Option A: Docker (Recommended)

```bash
# Pull and run Redis Stack
docker run -d \
  --name redis-stack \
  -p 6379:6379 \
  -p 8001:8001 \
  redis/redis-stack:latest
```

This will:
- Run Redis on port 6379 (standard Redis port)
- Provide RedisInsight UI on http://localhost:8001

#### Option B: Local Installation

**macOS (using Homebrew):**
```bash
brew tap redis-stack/redis-stack
brew install redis-stack
redis-stack-server
```

**Linux/Windows:**
See installation instructions at: https://redis.io/docs/stack/get-started/install/

### 3. Configure Environment Variables

Create a `.env` file in the `demos/` directory:

```bash
# demos/.env
OPENAI_API_KEY=your_openai_api_key_here
REDIS_HOST=localhost
REDIS_PORT=6379
```

### 4. Verify Installation

Run the verification script:

```bash
cd demos/00_environment_setup
python verify_setup.py
```

You should see:
```
✓ Redis connection successful
✓ Redis Stack modules loaded (search, vector)
✓ SQLite working
✓ OpenAI API key configured
✓ All dependencies installed

Environment ready for demos!
```

---

## What Each Database Type Demonstrates

### SQL (SQLite)
**Use Case:** Exact matching, structured queries

**Example Query:**
```sql
SELECT * FROM movies WHERE title = 'The Matrix';
```

**Limitations:**
- Cannot find "similar" movies
- Cannot understand synonyms or semantic meaning
- Requires exact matches or pattern matching (LIKE)

### NoSQL (Redis - Key/Value)
**Use Case:** Fast lookups by ID, caching, session storage

**Example Query:**
```python
redis.get("movie:123")  # Get movie by ID
redis.hgetall("movie:123")  # Get movie details as hash
```

**Limitations:**
- Optimized for key-based access
- Limited querying capabilities
- Cannot search by similarity or meaning

### Vector Search (Redis Stack)
**Use Case:** Semantic similarity, "find similar" queries

**Example Query:**
```python
# Find movies semantically similar to "space exploration adventure"
results = index.search(
    Query("*=>[KNN 5 @embedding $vec AS score]")
        .return_fields("title", "score")
        .sort_by("score")
        .dialect(2),
    query_params={"vec": query_embedding}
)
```

**Advantages:**
- Understands semantic meaning
- Finds similar items without exact matches
- Works across different phrasings
- Powers modern AI applications (RAG, recommendations, etc.)

---

## Demo Dataset

All demos use a **movie dataset** with 100 classic films including:
- Title
- Description/plot summary
- Genre
- Year

This allows for clear comparisons:
- **SQL:** Find exact title matches
- **NoSQL:** Fast retrieval by movie ID
- **Vector:** Find movies with similar plots/themes

---

## Demo Flow (30-40 minutes total)

1. **Demo 01: SQL Search** (8 mins)
   - Show exact matching
   - Demonstrate LIKE patterns
   - Show limitations with synonyms

2. **Demo 02: NoSQL Search** (8 mins)
   - Show fast key-value retrieval
   - Demonstrate hash operations
   - Compare performance with SQL

3. **Demo 03: Vector Search** (10 mins)
   - Generate embeddings for movie plots
   - Create vector index
   - Search by semantic similarity
   - Show "king - man + woman = queen" example

4. **Demo 04: Comparison** (8 mins)
   - Side-by-side comparison of all three
   - Show when to use each approach
   - Discuss trade-offs (performance, cost, complexity)

---

## Troubleshooting

### Redis Stack not starting
```bash
# Check if port 6379 is in use
lsof -i :6379

# Stop existing Redis instance
docker stop redis-stack

# Restart
docker start redis-stack
```

### OpenAI API errors
- Verify API key is valid
- Check account has credits
- Ensure `.env` file is in correct location

### Module import errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

---

## Cost Considerations

**OpenAI API Usage:**
- Embedding model: `text-embedding-3-small`
- Cost: ~$0.00002 per 1K tokens
- 100 movie descriptions (~50K tokens): **~$0.001** (negligible)

**Redis Stack:**
- Free for local development
- RedisInsight UI included for visualization

---

## Next Steps

Once your environment is set up:
1. Run `demos/01_sql_search/demo.py`
2. Run `demos/02_nosql_search/demo.py`
3. Run `demos/03_vector_search/demo.py`
4. Compare results in `demos/04_comparison/comparison.py`

Each demo includes detailed comments explaining the concepts and code.
