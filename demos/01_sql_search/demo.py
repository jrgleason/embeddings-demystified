#!/usr/bin/env python3
"""
Demo 01: SQL Search with SQLite
Demonstrates traditional exact-match searching and its limitations
"""

import sqlite3
from pathlib import Path

# Sample movie data
MOVIES = [
    (1, "The Matrix", "A computer hacker learns about the true nature of reality and his role in the war against its controllers.", 1999, "Sci-Fi"),
    (2, "Inception", "A thief who enters the dreams of others to steal secrets from their subconscious.", 2010, "Sci-Fi"),
    (3, "Interstellar", "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", 2014, "Sci-Fi"),
    (4, "The Shawshank Redemption", "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", 1994, "Drama"),
    (5, "The Godfather", "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", 1972, "Crime"),
    (6, "Pulp Fiction", "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", 1994, "Crime"),
    (7, "Forrest Gump", "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.", 1994, "Drama"),
    (8, "Star Wars", "Luke Skywalker joins forces with a Jedi Knight to rescue a princess and save the galaxy from the evil Empire.", 1977, "Sci-Fi"),
    (9, "Avatar", "A paraplegic Marine dispatched to the moon Pandora becomes torn between following his orders and protecting the world he feels is his home.", 2009, "Sci-Fi"),
    (10, "The Dark Knight", "Batman must accept one of the greatest psychological and physical tests to fight injustice.", 2008, "Action"),
]

def setup_database():
    """Create SQLite database and populate with movie data."""
    db_path = Path(__file__).parent / "movies.db"

    # Remove existing database
    if db_path.exists():
        db_path.unlink()

    # Create new database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create movies table
    cursor.execute('''
        CREATE TABLE movies (
            id INTEGER PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            year INTEGER,
            genre TEXT
        )
    ''')

    # Insert movie data
    cursor.executemany(
        'INSERT INTO movies VALUES (?, ?, ?, ?, ?)',
        MOVIES
    )

    conn.commit()
    return conn

def demo_exact_match(conn):
    """Demonstrate exact match searching."""
    print("\n" + "="*60)
    print("Demo 1: Exact Match Search")
    print("="*60)

    query = "The Matrix"
    cursor = conn.cursor()

    cursor.execute(
        'SELECT title, year FROM movies WHERE title = ?',
        (query,)
    )

    results = cursor.fetchall()

    print(f"\nQuery: Find movie with title = '{query}'")
    print(f"SQL: SELECT title, year FROM movies WHERE title = '{query}'")
    print(f"\nResults: {len(results)}")

    for title, year in results:
        print(f"  - {title} ({year})")

    # Now try a variation
    print("\n" + "-"*60)
    query = "Matrix"  # Without "The"
    cursor.execute(
        'SELECT title, year FROM movies WHERE title = ?',
        (query,)
    )

    results = cursor.fetchall()
    print(f"\nQuery: Find movie with title = '{query}'")
    print(f"Results: {len(results)} (No match! Must be exact)")

def demo_like_pattern(conn):
    """Demonstrate LIKE pattern matching."""
    print("\n" + "="*60)
    print("Demo 2: Pattern Matching with LIKE")
    print("="*60)

    query = "%Matrix%"
    cursor = conn.cursor()

    cursor.execute(
        'SELECT title, year FROM movies WHERE title LIKE ?',
        (query,)
    )

    results = cursor.fetchall()

    print(f"\nQuery: Find movies with 'Matrix' in title")
    print(f"SQL: SELECT title, year FROM movies WHERE title LIKE '%Matrix%'")
    print(f"\nResults: {len(results)}")

    for title, year in results:
        print(f"  - {title} ({year})")

    print("\nNote: LIKE helps with partial matches but still literal string matching")

def demo_semantic_limitation(conn):
    """Demonstrate limitations when searching by meaning."""
    print("\n" + "="*60)
    print("Demo 3: Semantic Search Limitation")
    print("="*60)

    # Try to find movies about "space exploration"
    query = "%space%"
    cursor = conn.cursor()

    cursor.execute(
        'SELECT title, description, year FROM movies WHERE description LIKE ?',
        (query,)
    )

    results = cursor.fetchall()

    print(f"\nGoal: Find movies about space exploration")
    print(f"SQL: SELECT * FROM movies WHERE description LIKE '%space%'")
    print(f"\nResults: {len(results)}")

    for title, desc, year in results:
        print(f"  - {title} ({year})")
        print(f"    {desc[:80]}...")

    print("\n" + "-"*60)
    print("Missing relevant movies:")
    print("  - Interstellar (uses 'wormhole', not 'space')")
    print("  - Star Wars (uses 'galaxy', not 'space exploration')")
    print("\nProblem: SQL can't understand that 'wormhole' and 'galaxy'")
    print("are semantically related to 'space exploration'!")

def demo_synonym_problem(conn):
    """Demonstrate the synonym problem."""
    print("\n" + "="*60)
    print("Demo 4: The Synonym Problem")
    print("="*60)

    cursor = conn.cursor()

    # Search for "dream"
    queries = ["dream", "subconscious", "sleep"]

    for query in queries:
        pattern = f"%{query}%"
        cursor.execute(
            'SELECT title FROM movies WHERE description LIKE ?',
            (pattern,)
        )

        results = cursor.fetchall()
        print(f"\nSearch for '{query}': {len(results)} results")
        for (title,) in results:
            print(f"  - {title}")

    print("\n" + "-"*60)
    print("Problem: All three searches are about the same concept (dreams)")
    print("but return different results because SQL only matches exact words!")
    print("\nInception's description: '...enters the dreams of others...'")
    print("  - Matches: 'dream' ✓")
    print("  - Matches: 'subconscious' ✓")
    print("  - Matches: 'sleep' ✗ (not mentioned, but semantically related)")

def show_summary():
    """Show summary of SQL search limitations."""
    print("\n" + "="*60)
    print("SQL Search: Summary")
    print("="*60)
    print("\n✓ Strengths:")
    print("  - Exact matches are fast and reliable")
    print("  - Good for structured data (IDs, dates, numbers)")
    print("  - Well-understood and standardized (ANSI SQL)")
    print("  - ACID guarantees for transactions")

    print("\n✗ Limitations:")
    print("  - Cannot understand meaning or semantics")
    print("  - Requires exact string matches (or patterns with LIKE)")
    print("  - Cannot find similar items without explicit relationships")
    print("  - No understanding of synonyms or related concepts")
    print("  - Full-text search extensions help but still keyword-based")

    print("\n💡 When to use SQL:")
    print("  - Structured data with known schema")
    print("  - Exact lookups (user IDs, order numbers)")
    print("  - Complex joins and aggregations")
    print("  - Transactional consistency required")

    print("\n⚠️  When SQL isn't enough:")
    print("  - 'Find similar products to this one'")
    print("  - 'Show me movies like Inception'")
    print("  - 'Search by meaning, not just keywords'")
    print("  - Recommendation systems")
    print("  - Semantic search")

def main():
    """Run all SQL search demos."""
    print("="*60)
    print("DEMO 01: SQL SEARCH WITH SQLITE")
    print("="*60)
    print("\nSetting up database with 10 movies...")

    conn = setup_database()

    demo_exact_match(conn)
    demo_like_pattern(conn)
    demo_semantic_limitation(conn)
    demo_synonym_problem(conn)
    show_summary()

    print("\n" + "="*60)
    print("Next: Run demos/02_nosql_search/demo.py")
    print("="*60 + "\n")

    conn.close()

if __name__ == '__main__':
    main()
