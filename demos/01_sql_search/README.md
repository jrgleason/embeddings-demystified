# Demo 01: SQL Search with SQLite

## Overview

This demo demonstrates traditional SQL-based searching and its limitations when dealing with semantic queries.

## What You'll Learn

- How SQL handles exact matching
- Pattern matching with `LIKE`
- Why SQL struggles with semantic search
- The synonym problem in keyword-based search

## Running the Demo

```bash
cd demos/01_sql_search
python demo.py
```

## Demo Flow (8 minutes)

### 1. Exact Match (2 mins)
Shows how SQL requires exact string matches

### 2. Pattern Matching (2 mins)
Demonstrates LIKE patterns for partial matches

### 3. Semantic Limitation (2 mins)
Shows why searching for "space exploration" misses relevant movies

### 4. Synonym Problem (2 mins)
Demonstrates how different words for the same concept return different results

## Key Takeaways

**SQL is great for:**
- Structured data with known fields
- Exact lookups (IDs, dates, numbers)
- Complex joins and aggregations

**SQL struggles with:**
- "Find similar" queries
- Understanding meaning/context
- Synonyms and related concepts
- Recommendation systems
