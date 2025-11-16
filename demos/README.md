# Vector Databases Demo Suite

Complete demo environment comparing SQL, NoSQL, and Vector Search approaches.

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt

# Start Redis Stack (includes vector search)
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest

# Configure environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

### 2. Verify Setup

```bash
cd 00_environment_setup
python verify_setup.py
```

### 3. Run Demos in Order

```bash
# Demo 1: SQL limitations (8 mins)
cd ../01_sql_search
python demo.py

# Demo 2: NoSQL limitations (8 mins)
cd ../02_nosql_search
python demo.py

# Demo 3: Vector search capabilities (10 mins)
cd ../03_vector_search
python demo.py

# Demo 4: Side-by-side comparison (8 mins)
cd ../04_comparison
python comparison.py
```

## Demo Structure

```
demos/
├── 00_environment_setup/   # Setup instructions and verification
│   ├── README.md
│   └── verify_setup.py
├── 01_sql_search/          # SQL exact matching demos
│   ├── README.md
│   └── demo.py
├── 02_nosql_search/        # Redis key-value demos
│   ├── README.md
│   └── demo.py
├── 03_vector_search/       # Vector similarity demos
│   ├── README.md
│   └── demo.py
├── 04_comparison/          # Side-by-side comparison
│   ├── README.md
│   └── comparison.py
├── requirements.txt        # Python dependencies
└── .env.example           # Environment template
```

## What Each Demo Shows

### Demo 01: SQL Search
**Duration:** 8 minutes

Shows traditional SQL database search:
- Exact matching with `WHERE` clauses
- Pattern matching with `LIKE`
- Semantic search limitations
- The synonym problem

**Key Learning:** SQL is great for structured queries but can't understand meaning

### Demo 02: NoSQL Search
**Duration:** 8 minutes

Shows Redis as a key-value store:
- O(1) key-based lookups
- Pattern matching with SCAN
- Search by value limitations
- Manual secondary indexes

**Key Learning:** NoSQL excels at fast lookups but has same semantic limitations

### Demo 03: Vector Search
**Duration:** 10 minutes

Shows Redis vector search capabilities:
- Semantic search that understands meaning
- Synonym and concept handling
- Cosine similarity explained
- "King - man + woman = queen" example

**Key Learning:** Vector search unlocks semantic understanding and similarity queries

### Demo 04: Comparison
**Duration:** 8 minutes

Side-by-side comparison of all three:
- Same query, three approaches
- Performance characteristics
- When to use each approach
- Real-world hybrid architectures

**Key Learning:** Each database type has its strengths - use the right tool for the job

## Total Demo Time

**34-40 minutes** including setup and transitions

Perfect for a 2-hour presentation with:
- Theory/slides: ~60 minutes
- Demos: ~35 minutes
- Q&A: ~25 minutes

## Prerequisites

- **Python 3.10+**
- **Docker** (for Redis Stack)
- **OpenAI API key** (for embeddings)

## Cost Estimate

Running all demos:
- ~20 embedding API calls
- ~1,500 total tokens
- **Cost: < $0.01** (negligible)

## Troubleshooting

### Redis won't start
```bash
# Check if port is in use
lsof -i :6379

# Stop existing Redis
docker stop redis-stack
docker rm redis-stack

# Restart
docker run -d -p 6379:6379 redis/redis-stack:latest
```

### OpenAI API errors
- Verify API key in `.env`
- Check account has credits
- Ensure key starts with `sk-`

### Import errors
```bash
# Reinstall dependencies
pip install --upgrade -r requirements.txt
```

## Dataset

All demos use the same **10 classic movies**:
- The Matrix
- Inception
- Interstellar
- The Shawshank Redemption
- The Godfather
- Pulp Fiction
- Forrest Gump
- Star Wars
- Avatar
- The Dark Knight

This small dataset keeps demos fast while clearly showing the differences between approaches.

## Presentation Integration

### During Presentation

1. **Run Demo 01** after explaining SQL basics
2. **Run Demo 02** after introducing NoSQL concepts
3. **Run Demo 03** after explaining vector embeddings
4. **Run Demo 04** before discussing real-world architectures

### Live Coding Tips

- Keep terminal font large (18pt+)
- Run demos from top-level directory
- Have Redis Stack pre-started
- Test all demos before presentation
- Have backup recorded videos

### Audience Participation

After Demo 03, ask audience:
- "What use cases come to mind?"
- "Where would vector search help in your projects?"
- "What concerns do you have about implementation?"

## Additional Resources

### RedisInsight UI
After starting Redis Stack, open http://localhost:8001 to:
- Visualize vector indexes
- Inspect stored embeddings
- Monitor query performance

### Jupyter Notebooks
For interactive exploration, notebooks are available in `/notebooks/` directory.

### Extended Demos
For workshops or longer sessions, additional demos available:
- RAG chatbot implementation
- Image similarity search
- Hybrid search (keyword + vector)

## Next Steps

After completing demos:
1. Review decision matrix in Demo 04
2. Explore Redis documentation: https://redis.io/docs/stack/search/reference/vectors/
3. Try implementing with your own data
4. Experiment with different embedding models

## Support

**Issues or Questions:**
- Check individual demo READMEs
- Review troubleshooting section
- Verify environment with `verify_setup.py`

---

**Last Updated:** 2025-10-17
**Status:** Ready for presentation
