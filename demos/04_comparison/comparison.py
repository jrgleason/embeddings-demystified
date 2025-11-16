#!/usr/bin/env python3
"""
Demo 04: Side-by-Side Comparison
Shows SQL, NoSQL, and Vector Search solving the same problem
"""

import sqlite3
import redis
from redis.commands.search.field import VectorField, TextField
from redis.commands.search.indexing import IndexDefinition, IndexType
from redis.commands.search.query import Query
import numpy as np
from openai import OpenAI
import os
from dotenv import load_dotenv
from pathlib import Path
import time

# Load environment
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

# Test query that demonstrates the differences
TEST_QUERY = "find movies about exploring outer space"

def setup_all_databases():
    """Set up SQL, NoSQL, and Vector databases with same data."""
    movies = [
        {"id": 1, "title": "Interstellar", "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival."},
        {"id": 2, "title": "Star Wars", "description": "Luke Skywalker joins forces with a Jedi Knight to rescue a princess and save the galaxy from the evil Empire."},
        {"id": 3, "title": "The Matrix", "description": "A computer hacker learns about the true nature of reality and his role in the war against its controllers."},
        {"id": 4, "title": "Inception", "description": "A thief who enters the dreams of others to steal secrets from their subconscious."},
        {"id": 5, "title": "The Godfather", "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."},
    ]

    # Setup SQLite
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE movies (
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT
        )
    ''')
    for movie in movies:
        cursor.execute('INSERT INTO movies VALUES (?, ?, ?)',
                      (movie['id'], movie['title'], movie['description']))
    conn.commit()

    # Setup Redis (key-value)
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    for movie in movies:
        r.hset(f"compare:movie:{movie['id']}", mapping=movie)

    # Setup Vector Search
    client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

    # Create vector index
    try:
        r.ft("compare_idx").dropindex()
    except:
        pass

    r_binary = redis.Redis(host='localhost', port=6379, decode_responses=False)

    schema = (
        TextField("title"),
        TextField("description"),
        VectorField("embedding", "FLAT", {
            "TYPE": "FLOAT32",
            "DIM": 1536,
            "DISTANCE_METRIC": "COSINE"
        })
    )

    r_binary.ft("compare_idx").create_index(
        fields=schema,
        definition=IndexDefinition(prefix=["vec:movie:"], index_type=IndexType.HASH)
    )

    # Add movies with embeddings
    for movie in movies:
        embedding = client.embeddings.create(
            model="text-embedding-3-small",
            input=movie["description"]
        ).data[0].embedding

        r_binary.hset(f"vec:movie:{movie['id']}", mapping={
            "title": movie["title"],
            "description": movie["description"],
            "embedding": np.array(embedding, dtype=np.float32).tobytes()
        })

    return conn, r, r_binary, client, movies

def demo_sql_approach(conn):
    """Show SQL approach to the query."""
    print("="*70)
    print("APPROACH 1: SQL (Keyword Matching)")
    print("="*70)

    print(f"\nQuery: '{TEST_QUERY}'")
    print("SQL Strategy: Search for keyword 'space' in description\n")

    cursor = conn.cursor()
    start = time.perf_counter()

    cursor.execute(
        "SELECT title, description FROM movies WHERE description LIKE ?",
        ('%space%',)
    )
    results = cursor.fetchall()

    elapsed = time.perf_counter() - start

    print(f"SQL: SELECT * FROM movies WHERE description LIKE '%space%'")
    print(f"Time: {elapsed*1000:.2f}ms")
    print(f"Results: {len(results)}\n")

    if results:
        for title, desc in results:
            print(f"✓ {title}")
            print(f"  {desc[:60]}...\n")
    else:
        print("(No results - 'space' doesn't appear in descriptions)")

    print("Issues:")
    print("✗ Misses 'Star Wars' (says 'galaxy', not 'space')")
    print("✗ Only finds exact keyword matches")
    print("✗ Can't understand 'exploring' relates to 'travel' or 'rescue'\n")

def demo_nosql_approach(r):
    """Show NoSQL approach to the query."""
    print("="*70)
    print("APPROACH 2: NoSQL/Redis (Key-Value Store)")
    print("="*70)

    print(f"\nQuery: '{TEST_QUERY}'")
    print("Redis Strategy: Must scan all keys and filter manually\n")

    start = time.perf_counter()

    matching = []
    for key in r.scan_iter("compare:movie:*"):
        desc = r.hget(key, 'description')
        if desc and 'space' in desc.lower():
            title = r.hget(key, 'title')
            matching.append((title, desc))

    elapsed = time.perf_counter() - start

    print(f"Redis: Scan all keys + manual filtering")
    print(f"Time: {elapsed*1000:.2f}ms")
    print(f"Results: {len(matching)}\n")

    if matching:
        for title, desc in matching:
            print(f"✓ {title}")
            print(f"  {desc[:60]}...\n")
    else:
        print("(No results - 'space' not found)")

    print("Issues:")
    print("✗ Same keyword matching limitations as SQL")
    print("✗ Must scan all records (O(N) complexity)")
    print("✗ No built-in search capabilities")
    print("✗ Better for known-key lookups, not search\n")

def demo_vector_approach(r_binary, client):
    """Show vector search approach."""
    print("="*70)
    print("APPROACH 3: Vector Search (Semantic Understanding)")
    print("="*70)

    print(f"\nQuery: '{TEST_QUERY}'")
    print("Vector Strategy: Understand meaning, find semantically similar\n")

    start = time.perf_counter()

    # Generate query embedding
    query_embedding = client.embeddings.create(
        model="text-embedding-3-small",
        input=TEST_QUERY
    ).data[0].embedding

    query_vector = np.array(query_embedding, dtype=np.float32).tobytes()

    # Search
    query = (
        Query("*=>[KNN 3 @embedding $vec AS score]")
        .return_fields("title", "description", "score")
        .sort_by("score")
        .dialect(2)
    )

    results = r_binary.ft("compare_idx").search(
        query,
        query_params={"vec": query_vector}
    )

    elapsed = time.perf_counter() - start

    print(f"Redis VSS: Vector similarity search (K=3 nearest neighbors)")
    print(f"Time: {elapsed*1000:.2f}ms")
    print(f"Results: {len(results.docs)}\n")

    for doc in results.docs:
        similarity = 1 - float(doc.score)
        title = doc.title.decode() if isinstance(doc.title, bytes) else doc.title
        desc = doc.description.decode() if isinstance(doc.description, bytes) else doc.description

        print(f"✓ {title} (similarity: {similarity:.3f})")
        print(f"  {desc[:60]}...\n")

    print("Advantages:")
    print("✓ Finds 'Star Wars' - understands 'galaxy' relates to 'space'")
    print("✓ Finds 'Interstellar' - knows 'wormhole' is space-related")
    print("✓ Ranks by semantic similarity, not just keyword presence")
    print("✓ Works even when exact words don't match\n")

def show_decision_matrix():
    """Show when to use each approach."""
    print("="*70)
    print("DECISION MATRIX: Which Approach to Use?")
    print("="*70)
    print()

    print("Use SQL when:")
    print("  ✓ Structured data with known schema")
    print("  ✓ Exact matches (user ID, order number, date ranges)")
    print("  ✓ Complex joins and aggregations")
    print("  ✓ ACID transactions required")
    print("  ✓ Example: 'Find all orders from user 123 in 2024'")
    print()

    print("Use NoSQL (Redis) when:")
    print("  ✓ Simple key-value lookups")
    print("  ✓ Caching frequently accessed data")
    print("  ✓ Session storage")
    print("  ✓ Real-time counters/leaderboards")
    print("  ✓ Example: 'Get user session data for session_abc123'")
    print()

    print("Use Vector Search when:")
    print("  ✓ 'Find similar' queries")
    print("  ✓ Semantic search (meaning, not keywords)")
    print("  ✓ Recommendation systems")
    print("  ✓ RAG (Retrieval-Augmented Generation)")
    print("  ✓ Image/audio/video similarity")
    print("  ✓ Example: 'Find products similar to this one'")
    print()

    print("Hybrid Approach (Common in production):")
    print("  → SQL for structured data and transactions")
    print("  → Redis for caching and fast lookups")
    print("  → Vector DB for semantic search and recommendations")
    print()

def show_performance_comparison():
    """Show performance characteristics."""
    print("="*70)
    print("PERFORMANCE COMPARISON")
    print("="*70)
    print()

    print("Lookup by ID (Best → Worst):")
    print("  1. Redis (NoSQL):     ~0.1ms   - O(1)")
    print("  2. SQL (indexed):     ~1ms     - O(log n)")
    print("  3. Vector Search:     ~10ms    - Not optimized for this")
    print()

    print("Exact Text Match (Best → Worst):")
    print("  1. SQL (indexed):     ~1-5ms   - Optimized for this")
    print("  2. Redis (scan):      ~10ms    - Must scan all keys")
    print("  3. Vector Search:     ~10ms    - Overkill for exact match")
    print()

    print("Semantic Similarity (Best → Worst):")
    print("  1. Vector Search:     ~10-50ms - Purpose-built")
    print("  2. SQL (full-text):   ~100ms+  - Limited understanding")
    print("  3. Redis (scan):      ~100ms+  - Manual implementation")
    print()

    print("Scalability to 1M+ records:")
    print("  SQL:           ✓ Excellent with proper indexing")
    print("  Redis:         ✓ Excellent for key-value")
    print("  Vector Search: ✓ Good with approximate algorithms (HNSW)")
    print()

def main():
    """Run comparison demo."""
    print("\n" + "="*70)
    print("DEMO 04: SQL vs NoSQL vs Vector Search")
    print("="*70)
    print("\nSetting up all three databases with identical data...")

    try:
        conn, r, r_binary, client, movies = setup_all_databases()
        print(f"✓ Loaded {len(movies)} movies into all databases\n")
    except Exception as e:
        print(f"✗ Setup failed: {e}")
        print("  Ensure Redis Stack is running and OPENAI_API_KEY is set")
        exit(1)

    # Run comparisons
    demo_sql_approach(conn)
    demo_nosql_approach(r)
    demo_vector_approach(r_binary, client)

    # Show decision guides
    show_decision_matrix()
    show_performance_comparison()

    print("="*70)
    print("KEY TAKEAWAY")
    print("="*70)
    print()
    print("Each approach has its strengths:")
    print()
    print("• SQL:          Fast exact matches, complex queries, transactions")
    print("• NoSQL:        Fast key-value lookups, caching, simple data")
    print("• Vector Search: Semantic understanding, 'find similar', AI apps")
    print()
    print("Modern applications often use ALL THREE in combination!")
    print()
    print("="*70 + "\n")

    # Cleanup
    conn.close()

if __name__ == '__main__':
    main()
