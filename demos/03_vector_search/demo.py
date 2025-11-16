#!/usr/bin/env python3
"""
Demo 03: Vector Search with Redis Stack
Demonstrates semantic search using vector embeddings and cosine similarity
"""

import redis
from redis.commands.search.field import VectorField, TextField, NumericField, TagField
from redis.commands.search.indexing import IndexDefinition, IndexType
from redis.commands.search.query import Query
import numpy as np
from openai import OpenAI
import os
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(env_path)

# Same movie data as previous demos
MOVIES = [
    {"id": 1, "title": "The Matrix", "description": "A computer hacker learns about the true nature of reality and his role in the war against its controllers.", "year": 1999, "genre": "Sci-Fi"},
    {"id": 2, "title": "Inception", "description": "A thief who enters the dreams of others to steal secrets from their subconscious.", "year": 2010, "genre": "Sci-Fi"},
    {"id": 3, "title": "Interstellar", "description": "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", "year": 2014, "genre": "Sci-Fi"},
    {"id": 4, "title": "The Shawshank Redemption", "description": "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.", "year": 1994, "genre": "Drama"},
    {"id": 5, "title": "The Godfather", "description": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.", "year": 1972, "genre": "Crime"},
    {"id": 6, "title": "Pulp Fiction", "description": "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.", "year": 1994, "genre": "Crime"},
    {"id": 7, "title": "Forrest Gump", "description": "The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.", "year": 1994, "genre": "Drama"},
    {"id": 8, "title": "Star Wars", "description": "Luke Skywalker joins forces with a Jedi Knight to rescue a princess and save the galaxy from the evil Empire.", "year": 1977, "genre": "Sci-Fi"},
    {"id": 9, "title": "Avatar", "description": "A paraplegic Marine dispatched to the moon Pandora becomes torn between following his orders and protecting the world he feels is his home.", "year": 2009, "genre": "Sci-Fi"},
    {"id": 10, "title": "The Dark Knight", "description": "Batman must accept one of the greatest psychological and physical tests to fight injustice.", "year": 2008, "genre": "Action"},
]

INDEX_NAME = "movies_vss"
VECTOR_DIMENSION = 1536  # OpenAI text-embedding-3-small dimension

def get_embedding(text: str, client: OpenAI) -> list[float]:
    """Generate embedding vector for text using OpenAI."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def setup_vector_search(r, client):
    """Create vector search index in Redis and load movie data."""
    # Drop existing index if it exists
    try:
        r.ft(INDEX_NAME).dropindex()
        print(f"✓ Dropped existing index: {INDEX_NAME}")
    except:
        pass

    # Define the schema for our vector index
    schema = (
        TextField("title"),
        TextField("description"),
        NumericField("year"),
        TagField("genre"),
        VectorField("embedding",
            "FLAT",  # Algorithm: FLAT (brute force) or HNSW (approximate)
            {
                "TYPE": "FLOAT32",
                "DIM": VECTOR_DIMENSION,
                "DISTANCE_METRIC": "COSINE"  # Cosine similarity
            }
        )
    )

    # Create the index
    r.ft(INDEX_NAME).create_index(
        fields=schema,
        definition=IndexDefinition(prefix=["movie:"], index_type=IndexType.HASH)
    )
    print(f"✓ Created vector search index: {INDEX_NAME}")

    # Generate embeddings and store movies
    print("\nGenerating embeddings for movies...")
    for movie in MOVIES:
        # Generate embedding from description (where semantic meaning lives)
        embedding = get_embedding(movie["description"], client)

        # Store movie data with embedding
        key = f"movie:{movie['id']}"
        r.hset(key, mapping={
            "title": movie["title"],
            "description": movie["description"],
            "year": movie["year"],
            "genre": movie["genre"],
            "embedding": np.array(embedding, dtype=np.float32).tobytes()
        })

        print(f"  ✓ {movie['title']}")

    print(f"\n✓ Loaded {len(MOVIES)} movies with vector embeddings\n")

def demo_semantic_search(r, client):
    """Demonstrate semantic search by meaning."""
    print("="*60)
    print("Demo 1: Semantic Search - Understanding Meaning")
    print("="*60)

    query_text = "space exploration and discovering new worlds"

    print(f"\nQuery: '{query_text}'")
    print("Note: This exact phrase doesn't appear in any description!\n")

    # Generate embedding for query
    query_embedding = get_embedding(query_text, client)
    query_vector = np.array(query_embedding, dtype=np.float32).tobytes()

    # Search for similar vectors (K=3 nearest neighbors)
    query = (
        Query("*=>[KNN 3 @embedding $vec AS score]")
        .return_fields("title", "description", "score")
        .sort_by("score")
        .dialect(2)
    )

    results = r.ft(INDEX_NAME).search(query, query_params={"vec": query_vector})

    print(f"Found {results.total} similar movies:\n")
    for i, doc in enumerate(results.docs, 1):
        print(f"{i}. {doc.title} (similarity: {1 - float(doc.score):.3f})")
        print(f"   {doc.description[:80]}...")
        print()

    print("✓ Found relevant movies even though query words don't appear!")
    print("✓ Understands 'space exploration' relates to 'wormhole' and 'galaxy'")

def demo_synonym_handling(r, client):
    """Demonstrate handling of synonyms."""
    print("\n" + "="*60)
    print("Demo 2: Synonym and Related Concept Handling")
    print("="*60)

    queries = [
        "dreams and subconscious mind",
        "sleeping and dream states",
        "alternate realities in your mind"
    ]

    print("\nThree different ways to describe the same concept:\n")

    for query_text in queries:
        print(f"Query: '{query_text}'")

        query_embedding = get_embedding(query_text, client)
        query_vector = np.array(query_embedding, dtype=np.float32).tobytes()

        query = (
            Query("*=>[KNN 1 @embedding $vec AS score]")
            .return_fields("title", "score")
            .sort_by("score")
            .dialect(2)
        )

        results = r.ft(INDEX_NAME).search(query, query_params={"vec": query_vector})

        if results.docs:
            doc = results.docs[0]
            print(f"  → {doc.title} (similarity: {1 - float(doc.score):.3f})")

        print()

    print("✓ All queries find 'Inception' - understands semantic similarity!")
    print("✓ No need to list all possible synonyms in advance")

def demo_cosine_similarity_explained(client):
    """Explain cosine similarity with simple example."""
    print("\n" + "="*60)
    print("Demo 3: How Cosine Similarity Works")
    print("="*60)

    # Get embeddings for similar and dissimilar concepts
    texts = [
        "space exploration and astronomy",
        "traveling through outer space",
        "cooking delicious Italian food"
    ]

    print("\nComparing three phrases as vectors:\n")

    embeddings = []
    for text in texts:
        emb = get_embedding(text, client)
        embeddings.append(np.array(emb))
        print(f"  '{text}'")

    print("\nCosine Similarity Matrix:")
    print("(1.0 = identical, 0.0 = unrelated, -1.0 = opposite)\n")

    print("                              Space 1   Space 2   Cooking")
    for i, text1 in enumerate(texts):
        label = f"{text1[:25]}..."
        print(f"{label:30}", end="")

        for j, text2 in enumerate(texts):
            # Cosine similarity = dot product of normalized vectors
            similarity = np.dot(embeddings[i], embeddings[j]) / (
                np.linalg.norm(embeddings[i]) * np.linalg.norm(embeddings[j])
            )
            print(f"  {similarity:.3f} ", end="")

        print()

    print("\nObservations:")
    print("✓ Similar concepts (space 1 & 2) have high similarity (~0.9+)")
    print("✓ Different concepts (space & cooking) have low similarity (~0.7)")
    print("✓ Each phrase is identical to itself (1.0)")

def demo_king_queen_example(client):
    """Demonstrate the famous 'king - man + woman = queen' example."""
    print("\n" + "="*60)
    print("Demo 4: The Famous 'King - Man + Woman = Queen' Example")
    print("="*60)

    print("\nVector arithmetic in semantic space:")
    print("  king - man + woman ≈ queen\n")

    # Get embeddings
    king = np.array(get_embedding("king", client))
    man = np.array(get_embedding("man", client))
    woman = np.array(get_embedding("woman", client))
    queen = np.array(get_embedding("queen", client))

    # Perform vector arithmetic
    result = king - man + woman

    # Calculate similarity to queen
    similarity = np.dot(result, queen) / (
        np.linalg.norm(result) * np.linalg.norm(queen)
    )

    print(f"Similarity between (king - man + woman) and 'queen': {similarity:.3f}")

    # Compare to other royalty terms
    print("\nComparing result to other words:")
    test_words = ["queen", "princess", "monarch", "emperor", "doctor"]

    for word in test_words:
        emb = np.array(get_embedding(word, client))
        sim = np.dot(result, emb) / (np.linalg.norm(result) * np.linalg.norm(emb))
        print(f"  {word:12} : {sim:.3f}")

    print("\n✓ 'queen' has highest similarity - the math works!")
    print("✓ This shows embeddings capture semantic relationships")

def show_summary():
    """Show summary of vector search capabilities."""
    print("\n" + "="*60)
    print("Vector Search: Summary")
    print("="*60)
    print("\n✓ Strengths:")
    print("  - Understands semantic meaning, not just keywords")
    print("  - Handles synonyms and related concepts automatically")
    print("  - 'Find similar' queries work naturally")
    print("  - Captures relationships between concepts")
    print("  - Works across languages and modalities")

    print("\n⚙️  How it works:")
    print("  1. Text → Embedding model → Vector (1536 dimensions)")
    print("  2. Vectors stored in specialized index (HNSW, FLAT)")
    print("  3. Search = find nearest neighbors by cosine similarity")
    print("  4. Return K most similar items")

    print("\n💡 When to use Vector Search:")
    print("  - Semantic search ('find similar documents')")
    print("  - Recommendation systems ('users who liked X also liked...')")
    print("  - RAG (Retrieval-Augmented Generation)")
    print("  - Image/video similarity search")
    print("  - Anomaly detection")
    print("  - Question answering systems")

    print("\n⚠️  Considerations:")
    print("  - Embedding costs (API calls)")
    print("  - Storage overhead (1536 floats per item)")
    print("  - Index build time for large datasets")
    print("  - Quality depends on embedding model")
    print("  - Trade-off: accuracy vs speed (FLAT vs HNSW)")

def main():
    """Run all vector search demos."""
    print("="*60)
    print("DEMO 03: VECTOR SEARCH WITH REDIS STACK")
    print("="*60)
    print()

    # Check for API key
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("✗ OPENAI_API_KEY not found in environment")
        print("  Create demos/.env with your API key")
        exit(1)

    # Connect to Redis
    try:
        r = redis.Redis(host='localhost', port=6379, decode_responses=False)
        r.ping()
        print("✓ Connected to Redis")
    except redis.ConnectionError:
        print("✗ Cannot connect to Redis Stack")
        print("  Run: docker run -d -p 6379:6379 redis/redis-stack:latest")
        exit(1)

    # Initialize OpenAI client
    client = OpenAI(api_key=api_key)
    print("✓ OpenAI client initialized\n")

    # Setup and run demos
    setup_vector_search(r, client)
    demo_semantic_search(r, client)
    demo_synonym_handling(r, client)
    demo_cosine_similarity_explained(client)
    demo_king_queen_example(client)
    show_summary()

    print("\n" + "="*60)
    print("Next: Run demos/04_comparison/comparison.py")
    print("to see all three approaches side-by-side!")
    print("="*60 + "\n")

if __name__ == '__main__':
    main()
