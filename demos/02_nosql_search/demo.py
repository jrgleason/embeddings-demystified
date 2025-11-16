#!/usr/bin/env python3
"""
Demo 02: NoSQL Key-Value Search with Redis
Demonstrates fast key-based lookups and the limitations of NoSQL for search
"""

import redis
import json
import time

# Same movie data as SQL demo
MOVIES = {
    "movie:1": {"id": 1, "title": "The Matrix", "description": "A computer hacker learns about the true nature of reality and his role in the war against its controllers.", "year": 1999, "genre": "Sci-Fi"},
    "movie:2": {"id": 2, "title": "Inception", "description": "A thief who enters the dreams of others to steal secrets from their subconscious.", "year": 2010, "genre": "Sci-Fi"},
    "movie:3": {"id": 3, "title": "Interstellar", "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", "year": 2014, "genre": "Sci-Fi"},
    "movie:4": {"id": 4, "title": "The Shawshank Redemption", "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", "year": 1994, "genre": "Drama"},
    "movie:5": {"id": 5, "title": "The Godfather", "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", "year": 1972, "genre": "Crime"},
    "movie:6": {"id": 6, "title": "Pulp Fiction", "description": "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", "year": 1994, "genre": "Crime"},
    "movie:7": {"id": 7, "title": "Forrest Gump", "description": "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.", "year": 1994, "genre": "Drama"},
    "movie:8": {"id": 8, "title": "Star Wars", "description": "Luke Skywalker joins forces with a Jedi Knight to rescue a princess and save the galaxy from the evil Empire.", "year": 1977, "genre": "Sci-Fi"},
    "movie:9": {"id": 9, "title": "Avatar", "description": "A paraplegic Marine dispatched to the moon Pandora becomes torn between following his orders and protecting the world he feels is his home.", "year": 2009, "genre": "Sci-Fi"},
    "movie:10": {"id": 10, "title": "The Dark Knight", "description": "Batman must accept one of the greatest psychological and physical tests to fight injustice.", "year": 2008, "genre": "Action"},
}

def setup_redis():
    """Connect to Redis and populate with movie data."""
    try:
        r = redis.Redis(host='localhost', port=6379, decode_responses=True)
        r.ping()
        print("✓ Connected to Redis")
    except redis.ConnectionError:
        print("✗ Cannot connect to Redis")
        print("  Make sure Redis is running: docker run -d -p 6379:6379 redis/redis-stack:latest")
        exit(1)

    # Clear any existing movie data
    for key in r.scan_iter("movie:*"):
        r.delete(key)

    # Store movies as hashes (Redis hash = key-value map)
    for key, movie in MOVIES.items():
        r.hset(key, mapping=movie)

    print(f"✓ Loaded {len(MOVIES)} movies into Redis\n")
    return r

def demo_key_lookup(r):
    """Demonstrate fast key-based lookup."""
    print("="*60)
    print("Demo 1: Key-Based Lookup (O(1) performance)")
    print("="*60)

    key = "movie:1"

    # Time the lookup
    start = time.perf_counter()
    movie = r.hgetall(key)
    elapsed = time.perf_counter() - start

    print(f"\nQuery: Get movie by key '{key}'")
    print(f"Redis command: HGETALL {key}")
    print(f"Time: {elapsed*1000:.3f}ms")
    print(f"\nResult:")
    print(f"  Title: {movie['title']}")
    print(f"  Year: {movie['year']}")
    print(f"  Genre: {movie['genre']}")

    print("\n✓ Strength: Extremely fast lookups when you know the key")
    print("✓ Use case: User sessions, caching, real-time data")

def demo_pattern_matching(r):
    """Demonstrate SCAN with pattern matching."""
    print("\n" + "="*60)
    print("Demo 2: Pattern Matching with SCAN")
    print("="*60)

    pattern = "movie:*"

    print(f"\nQuery: Find all keys matching '{pattern}'")
    print(f"Redis command: SCAN 0 MATCH {pattern}")

    # Get all movie keys
    keys = list(r.scan_iter(pattern))
    print(f"\nFound {len(keys)} keys:")

    for key in sorted(keys)[:3]:
        title = r.hget(key, 'title')
        print(f"  - {key}: {title}")

    print(f"  ... and {len(keys)-3} more")

    print("\n✓ Can find keys by pattern")
    print("✗ But still need to know the key structure")

def demo_search_limitation(r):
    """Demonstrate the search limitation."""
    print("\n" + "="*60)
    print("Demo 3: The Search Problem")
    print("="*60)

    print("\nGoal: Find all Sci-Fi movies")
    print("\nOption 1: Scan all keys and filter (inefficient)")

    scifi_movies = []
    for key in r.scan_iter("movie:*"):
        genre = r.hget(key, 'genre')
        if genre == "Sci-Fi":
            title = r.hget(key, 'title')
            scifi_movies.append((key, title))

    print(f"\nResult: {len(scifi_movies)} Sci-Fi movies found")
    for key, title in scifi_movies[:3]:
        print(f"  - {title}")

    print("\n✗ Problem: Had to scan ALL keys and check each one")
    print("✗ Performance: O(N) where N = total number of keys")
    print("✗ Not scalable with millions of records")

def demo_search_by_value(r):
    """Demonstrate searching by value (not key)."""
    print("\n" + "="*60)
    print("Demo 4: Searching by Value (The Hard Way)")
    print("="*60)

    search_term = "dream"

    print(f"\nGoal: Find movies with '{search_term}' in description")
    print("Problem: Redis doesn't index hash values by default\n")

    matching_movies = []

    # Must scan every key and check the description
    print("Scanning all movies...")
    for key in r.scan_iter("movie:*"):
        description = r.hget(key, 'description')
        if search_term.lower() in description.lower():
            title = r.hget(key, 'title')
            matching_movies.append(title)

    print(f"\nFound {len(matching_movies)} movies:")
    for title in matching_movies:
        print(f"  - {title}")

    print("\n✗ Required scanning every single movie")
    print("✗ No built-in indexing of field values")
    print("✗ Same limitations as SQL for semantic search")

def demo_secondary_index_pattern(r):
    """Demonstrate manual secondary index pattern."""
    print("\n" + "="*60)
    print("Demo 5: Manual Secondary Index (Workaround)")
    print("="*60)

    print("\nPattern: Create manual indexes using Sets")
    print("Example: Maintain a set of movie IDs per genre\n")

    # Create secondary indexes by genre
    for key, movie in MOVIES.items():
        genre = movie['genre']
        r.sadd(f"genre:{genre}", key)

    # Now we can quickly find movies by genre
    print("Query: Find all Sci-Fi movies (using index)")
    print("Redis command: SMEMBERS genre:Sci-Fi\n")

    scifi_keys = r.smembers("genre:Sci-Fi")

    print(f"Found {len(scifi_keys)} Sci-Fi movies:")
    for key in sorted(scifi_keys)[:3]:
        title = r.hget(key, 'title')
        print(f"  - {title}")

    print("\n✓ Much faster with manual index")
    print("✗ But you must maintain indexes yourself")
    print("✗ No help with semantic search")
    print("✗ Can't find 'similar' movies")

def show_summary():
    """Show summary of NoSQL search characteristics."""
    print("\n" + "="*60)
    print("NoSQL (Redis) Search: Summary")
    print("="*60)
    print("\n✓ Strengths:")
    print("  - Extremely fast key-based lookups (O(1))")
    print("  - Great for caching and session storage")
    print("  - Simple data model (key-value, hash, set, list)")
    print("  - High performance at scale")
    print("  - Low latency (sub-millisecond)")

    print("\n✗ Limitations:")
    print("  - No built-in secondary indexes (must build manually)")
    print("  - Searching by value requires scanning all keys")
    print("  - Same semantic search limitations as SQL")
    print("  - Cannot find 'similar' items without explicit relationships")
    print("  - No understanding of meaning or context")

    print("\n💡 When to use Redis (as key-value store):")
    print("  - Caching frequently accessed data")
    print("  - Session storage")
    print("  - Real-time leaderboards/counters")
    print("  - Pub/sub messaging")
    print("  - Rate limiting")

    print("\n⚠️  When Redis key-value isn't enough:")
    print("  - Complex queries across multiple fields")
    print("  - 'Find similar' queries")
    print("  - Semantic search")
    print("  - Recommendation systems")
    print("\n  → This is where Redis VECTOR SEARCH comes in!")

def main():
    """Run all NoSQL search demos."""
    print("="*60)
    print("DEMO 02: NOSQL SEARCH WITH REDIS")
    print("="*60)
    print()

    r = setup_redis()

    demo_key_lookup(r)
    demo_pattern_matching(r)
    demo_search_limitation(r)
    demo_search_by_value(r)
    demo_secondary_index_pattern(r)
    show_summary()

    print("\n" + "="*60)
    print("Next: Run demos/03_vector_search/demo.py")
    print("to see how vector search solves these problems!")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
