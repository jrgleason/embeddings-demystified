# Demo 02: NoSQL Search with Redis

## Overview

This demo shows Redis as a key-value store and demonstrates both its strengths (fast lookups) and limitations (searching by value, semantic understanding).

## What You'll Learn

- O(1) key-based lookups in Redis
- Pattern matching with SCAN
- Why searching by value is expensive
- Manual secondary index pattern
- When NoSQL isn't enough for search

## Running the Demo

**Prerequisites:** Redis must be running
```bash
docker run -d -p 6379:6379 redis/redis-stack:latest
```

**Run demo:**
```bash
cd demos/02_nosql_search
python demo.py
```

## Demo Flow (8 minutes)

### 1. Key-Based Lookup (2 mins)
Shows why Redis is incredibly fast for known keys

### 2. Pattern Matching (1 min)
Demonstrates SCAN for finding keys by pattern

### 3. Search Limitation (2 mins)
Shows O(N) scanning problem when searching by value

### 4. Search by Value (2 mins)
Demonstrates the difficulty of full-text search in Redis

### 5. Manual Secondary Index (1 min)
Shows workaround but highlights maintenance burden

## Key Takeaways

**Redis (key-value) is great for:**
- Sub-millisecond lookups
- Caching and sessions
- Real-time counters
- Known key access patterns

**Redis (key-value) struggles with:**
- Complex queries
- Searching by field values
- Semantic understanding
- Finding similar items

**Transition to Vector Search:**
This sets up the need for Redis Vector Search in the next demo!
