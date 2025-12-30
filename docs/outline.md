# Presentation Outline
## Vector Databases and Embeddings Demystified

**Presenter:** Jackie Gleason
**Duration:** 2 hours
**Event:** CodeMash 2025
**Total Slides:** 55

---

## Presentation Structure

| Section | Slides | Topic |
|---------|--------|-------|
| Introduction | 1-5 | Hook and Overview |
| Part 1: Foundations | 6-30 | What are Vectors & Embeddings |
| Part 2: Using Embeddings | 31-53 | How to Use & Vector Databases |
| Closing | 54-55 | Thank You & References |

---

## INTRODUCTION (Slides 1-5)

### Slide 1: Title Slide
**Vector Databases and Embeddings Demystified**
- Presenter: Jackie Gleason

### Slide 2: Who am I
- Lead AI Developer @ NetJets
- 20+ years experience
- IoT and robotics hacker
- 3D Printing enthusiast
- Short North Resident
- Traveler
- 2nd CodeMash as a Speaker

### Slide 3: What we will learn
1. What are Vectors and Embeddings
2. How do we use Embeddings
3. What Problems do Embeddings Solve
4. What comes next?
5. Summary

### Slide 4: The Mystery
**Hook Questions:**
- How does Netflix know you'll love that obscure documentary?
- How does Google Photos find every picture of your dog?
- How does ChatGPT answer questions about your documents?

### Slide 5: The Secret Sauce
**Vector Embeddings + Semantic similarity**
1. Transform data into numerical representations
2. Measure distance between vectors
3. Shift from 'exact match' to 'semantic understanding'

---

## PART 1: FOUNDATIONS (Slides 6-30)

### Slide 6: Neural Network - What is it?
**Transformer explanation:**
- Text is broken into chunks (tokens) and passed through layers of transformer blocks
- Each layer adjusts how strongly tokens "pay attention" to others, guided by learned weights
- As the text moves through layers, it gathers context—words influence each other based on meaning and position
- By the final layer, the model has built a rich understanding of the input to predict the next word or generate a response
- The network is trained by adjusting the weights to improve accuracy over time

**Terms section included**

### Slide 7: What is a Vector?
- A vector is just an ordered list of numbers that represents something measurable
- **Physical world examples:**
  - GPS coordinates → [latitude, longitude]
  - RGB color values → [red, green, blue]
- **In AI:**
  - We can represent concepts like words or images as numeric lists — e.g., 'dog' → [0.8, 0.3, 0.1]
- **Key idea:**
  - Turning things into numbers lets us use math to compare and find relationships — similar items have similar vectors

### Slide 8: What is an Embedding?
- A vector is just a list of numbers
- An embedding is a vector trained to capture meaning or relationships between things
- **Examples:**
  - A random number on a book is just a number (vector)
  - A Dewey Decimal number encodes what the book is about - this is a type of embedding
  - A random coordinate is just a point on a map (vector)
  - A coordinate that maps to a real location with meaning (e.g., a city) is an embedding
- **Key insight:** Embeddings give numbers meaning — they map things into a space where distance reflects similarity

### Slide 9: Example - Limitations?
- Visual example image
- Reference: https://ai.stanford.edu/~syyeung/

### Slide 10: How Embeddings Work
- Diagram visual
- Reference: https://www.pinecone.io/learn/vector-embeddings/

### Slide 11: Back to the Network
- The text is sent to the LLM
- It is split into tokens, and an embedding is created for each one
- These embeddings pass through the neural network, where weights help the model learn relationships and context
- The model uses that understanding to predict the next word or generate a response

### Slide 12: Dimensions vs Parameters
- **Dimension:** The length of a vector, or the shape of a tensor
  - This is the amount of numbers in the embedding
- **Parameters:** All the trainable values inside the model
  - Weights
  - Biases
  - Layer normalization scales
  - Attention matrices
- **Example:**
  - Input dimension = 1024
  - Output dimension = 4096
  - Weight matrix dimensions = 1024×4096
  - Number of parameters = 1024×4096 weights + 4096 biases

### Slide 13: Topology V. Ontology (Deep Dive)
**When you train embeddings:**
- The network weights create a topology — a "shape" in high-dimensional space where meaning is organized
- The ontology is the human-level interpretation of that structure — what those clusters mean (e.g., "these are all animals," "these are all financial terms")

**Think of it like this:**
- Topology = how embeddings are positioned
- Ontology = what those positions represent

They're related — but topology is what the model learns, while ontology is what we, humans, infer from it.

### Slide 14: Encoding
- **Definition:** Converting raw input (text, audio, image, etc.) into a structured numerical representation (vector/tensor)
- **Purpose:** Make the input understandable to neural networks
- **Common encoding types:**
  - Tokenization + embedding (text)
  - Spectrograms or MFCCs (audio)
  - Pixel or patch embeddings (images)

### Slide 15: Tokenization
- Tokenization slide content

### Slide 16: DEMO
- Live demonstration

### Slide 17: Where things get mathy
- Transition slide with three topic areas

### Slide 18: Semantic Similarity (Deep Dive)
- Semantic similarity measures how much two pieces of text (words, phrases, sentences) share meaning rather than just having the same words
- **Metrics:** To quantify "closeness", we use measures like:
  - Euclidean distance: Distance
  - Dot product: Scaled alignment
  - Cosine similarity: Angle
- **LLM context:** The model's weights adjust how embeddings are formed and transformed. Using similarity between embeddings, the system can choose which tokens, concepts or contexts are most relevant (i.e., "similar") and thereby influence prediction or retrieval

### Slide 19: Measuring Similarity (Deep Dive)
**Three Main Similarity Metrics:**

1. **Cosine Similarity** - Measures angle between vectors
   - Range: -1 to 1 (1 = identical)
   - Best for: Text embeddings (default choice)

2. **Euclidean Distance** - Straight-line distance
   - Range: 0 to ∞ (0 = identical)
   - Best for: When magnitude matters

3. **Dot Product** - Angle + magnitude
   - Range: -∞ to ∞ (higher = more similar)
   - Best for: Speed-critical, normalized vectors

**Pro tip:** OpenAI embeddings are pre-normalized

### Slide 20: High-Dimensional Space
- **1D:** One concept (e.g., sentiment: sad ←→ happy)
- **2D:** Two concepts (e.g., animal type + sentiment)
- **3D:** Three concepts (what we can visualize)
- **1,536D:** Capturing rich nuance of language

**Example:** 'bank' - financial? river edge? verb? formal? historical?

### Slide 21: Example: King - Man + Woman = Queen
- How do we treat language like vector math?
- Example: King - Man + Woman = Queen
- Link to more info

### Slide 22: Cosine Similarity - Meaning = Direction, Not Distance
- To compare meanings, we measure the angle between two vectors, not their length
- Cosine similarity = how aligned the directions are
- **Why angle matters:**
  - If two vectors point in the same direction → meanings are similar
  - Magnitude (length of the vector) doesn't matter
  - Direction = the semantic pattern across dimensions
- **Real example:**
  - "King" and "Queen" vectors point in similar directions
  - "King – Man + Woman" produces a vector pointing toward "Queen"
  - This works because cosine similarity captures relational direction, not raw distance

### Slide 23: Visualization - Demo (t-SNE)
- Embeddings live in hundreds or thousands of dimensions, far beyond human perception
- To visualize them, we reduce dimensionality down to 2D or 3D
- **t-SNE (t-Distributed Stochastic Neighbor Embedding):**
  - Captures local structure (nearby points stay nearby)
  - Preserves clusters of meaning
  - Repositions points so humans see the relationships clearly
- **Process overview:**
  1. Reduce dimensions to 2
  2. Plot each vector as a point on an XY graph
  3. t-SNE (or UMAP) maintains relative proximity, so similar words cluster
- **Angle still matters after projection:**
  - In high dimensions, similarity = small angle
  - Dimensionality reduction preserves those local angles
  - Clusters in 2D correspond to highly aligned vectors in the original space

### Slide 24: DEMO
- t-SNE visualization demo

### Slide 25: MultiModal Embeddings (Best Practice)
- Most common embeddings are using text to predict text
- Non-text based embeddings are starting to take off
- **Examples:**
  - **Ultravox:** Speech directly to LLM without transcription
  - **Wav2Vec (Meta):** Turns soundwaves into embeddings
  - **ImageBind (Meta):** Works on images, videos, thermal, etc
  - **BrainLM:** BrainWaves to embeddings

### Slide 26: (Image/Transition Slide)

### Slide 27: DEMO
- Multimodal demo

### Slide 28: From Concepts to Models
- Embeddings are learned — not hand-coded
- Different models specialize in creating embeddings for specific goals
- Some focus on words, others on sentences, documents, or even images
- The choice of model affects accuracy, speed, and context understanding

### Slide 29: Popular Embedding Models - What do we do?!
- Most people just default to using the OpenAI Ada 002 Embedding model
- Embedding models are typically rated using MTEB or Massive Text Embedding Benchmark
- Available on HuggingFace
- Qwen3 (Ali Baba) has been making waves (more in my IoT presentation)

### Slide 30: Review - Section 1
**Summary of Part 1:**
- What is an embedding
  - Dimensions
  - Shape
  - Similarity
- How do we use embedding
  - Tokenize
  - Semantic Similarity
  - Embedding models
- MultiModal
  - Embeddings to/from non-text data
  - Layering

---

## PART 2: USING EMBEDDINGS (Slides 31-53)

### Slide 31: How do we use embeddings?
- Transition/overview slide for Part 2

### Slide 32: BERT - Cir. 2018
- **B**idirectional **E**ncoder **R**epresentations from **T**ransformers
- Developed by Google for NLP
- BERT embeddings encode contextual meaning, and fine-tuned BERT models can learn domain-specific knowledge
  - Can be fine-tuned to learn domain-specific language patterns
- Uses bidirectional self-attention, allowing each token to consider both left and right context when forming its embedding

### Slide 33: VS GPT
- Comparison slide (Part 1)

### Slide 34: VS GPT
- Comparison slide (Part 2)

### Slide 35: RAG - Cir. 2020
**Retrieval-Augmented Generation**
- Stores the original material along-side the generated embedding
- The embedding can then be used for similarity search
- The similarity search can then be used to retrieve the original material to be included in the request being sent to the LLM
- **Compliments the LLM:**
  - Domain specific knowledge
  - Up-to-date knowledge
  - Provide facts

### Slide 36: Vector Stores - Part 2: Using Embeddings
- Stores and searches embeddings
- Can increase performance with minimal accuracy hit using Approximate Nearest Neighbor (ANN)
- **Example:**
  - 1 billion vectors × 1536 dimensions
  - Naive approach: 25 minutes per query

### Slide 37: Types of ANN
```
ANN (Problem Category)
├── Graph-based algorithms
│   ├── HNSW
│   ├── NSW (Navigable Small World)
│   └── ONNG
├── Tree-based algorithms
│   ├── KD-Tree
│   └── Ball Tree
├── Hash-based algorithms
│   ├── LSH (Locality Sensitive Hashing)
│   └── Product Quantization
└── Clustering-based algorithms
    └── IVF (Inverted File Index)
```

### Slide 38: HNSW (Hierarchical Navigable Small Worlds)
- Graph-based algorithm for fast similarity search in high-dimensional vector spaces
- Builds multiple layers of "small-world" graphs — sparse on top, dense at the bottom
- High-recall, low-latency, in-memory vector search
- Supports real-time updates

### Slide 39: Graph-Based RAG (Neo4j)
- Stores embeddings as node properties
- Maintains rich relationships between nodes
- Supports complex queries combining relationships + similarity
- **Retrieval example:** "Find documents similar to this chunk AND related to a given topic or user"
- Good for knowledge graphs, provenance, recommendations

### Slide 40: ANN vs Graph
| Feature | HNSW / ANN | Graph DB (Neo4j) |
|---------|------------|------------------|
| Purpose | Fast vector similarity search | Relationship-rich queries |
| Structure | Multi-layer small-world graph | Nodes & edges |
| Latency | Low (<ms) for high-dimensional vectors | Medium, depends on traversal |
| Updates | Real-time inserts supported | Real-time inserts supported but slower at scale |
| Use case | Semantic search, embeddings, RAG retrieval | Knowledge graphs, recommendations, relational reasoning |

### Slide 41: Vs SQL, Etc
- **SQL:** Use complex logic to get exactly what you want
- **NoSQL:** Retrieve a record by ID
- **Graph:** Retrieve information related to a record
- **Vector:** Retrieve records similar to a query embedding

### Slide 42: Vector Storage Options
- **Vector-native databases:** Pinecone, Milvus (fast ANN indexing)
- **In-memory stores:** LangChainJS, Redis (low-latency, ephemeral)
- **Document DBs:** MongoDB Atlas Vector Search (partitioned, structured)
- **Graph DBs:** Neo4j (embedding stored on nodes for relational queries)

### Slide 43: Vector Storage Best Practices
- **Indexing pipeline:** preprocess → embeddings → normalize → upsert to vector DB
- **Metric:** Cosine vs dot vs L2 — normalize embeddings for cosine similarity
- **Hybrid search:** Combine keyword + vector for high precision/recall
- **Metadata & filtering:** Store extra fields (timestamp, tenant, access control)
- **Incremental updates:** Add or refresh embeddings when corpus changes

### Slide 44: Fine Tuning
- Fine tuning concepts slide

### Slide 45: Fine Tuning vs RAG
- Comparison of approaches

### Slide 46: MTEB - Analytics
- https://huggingface.co/spaces/mteb/leaderboard
- MTEB Leaderboard reference

### Slide 47: FAISS
**What Is FAISS?**
- FAISS = Facebook AI Similarity Search, an open-source library from Meta/Meta AI
- Written in C++ with Python wrappers; supports CPU and GPU (CUDA) implementations
- Designed for efficient similarity search (nearest neighbor) and clustering of high-dimensional dense vectors

**Why FAISS Is Powerful:**
- **Scalable:** Handles datasets ranging from millions to billions of vectors
- **High Performance:** GPU acceleration can massively speed up search
- **Flexible:** Choose tradeoffs — exact vs approximate, memory vs speed
- **Widely used:** Often used inside vector databases; serves as benchmark in ANN research

**When (and Why) to Use FAISS:**
- When you have very large embedding datasets (e.g., millions+ vectors) and need fast, accurate similarity search
- When GPU resources are available, and you want to leverage them for faster search
- When you need to optimize memory by compressing vectors (e.g., via PQ)
- For batch processing of queries — FAISS is optimized for handling many queries at once
- When you want local control over indexing and search

**Note:** FAISS is a library, not a full database

### Slide 48: TODO: Clustering Scale
- Placeholder for future content

### Slide 49: Vector Databases & Architecture
- **The Challenge:** 1 billion vectors × 1536 dimensions
- **Naive approach:** 25 minutes per query (unacceptable!)
- Vector databases solve this with specialized algorithms
- **Goal:** Millisecond queries on billions of vectors
- **Trade-off:** 99% accuracy for 1000× speed

### Slide 50: DEMO
- Vector database demo

### Slide 51: HNSW - Highway System for Vectors
**Multi-layer graph structure:**
- **Layer 3 (Top):** Highways - long jumps, fast navigation
- **Layer 2:** State roads - medium distance
- **Layer 1:** Local streets - fine-grained
- **Layer 0 (Bottom):** All vectors - precise results

**Performance:**
- Search Time: O(log n) - only ~30-40 nodes visited
- Memory: High (2-5× vector size)
- Accuracy: 95-99% recall
- Used by: Chroma, Weaviate, Qdrant, Elasticsearch

✅ Best for: High accuracy, read-heavy, sufficient RAM
❌ Avoid: Tight memory, frequent updates

### Slide 52: IVF & Product Quantization
**Two Complementary Techniques:**

**IVF (Inverted File Index) - Clustering**
- Cluster vectors into groups (like library sections)
- Search only relevant clusters
- 1B vectors, 10K clusters = search ~100K (99.99% reduction)
- Accuracy: 90-95% recall

**Product Quantization (PQ) - Compression**
- Split vector into chunks, quantize each
- 1536 floats × 4 bytes = 6,144 bytes
- PQ: 8 bytes (768× compression!)
- Accuracy: 85-95% recall

**IVF + PQ Combined = Production Standard**
- Used by: Faiss, Milvus, Pinecone
- Billions of vectors, millisecond queries, reasonable memory

### Slide 53: Choosing the Right Algorithm
**Algorithm Comparison:**

| Algorithm | Speed | Memory | Accuracy | Best Scale |
|-----------|-------|--------|----------|------------|
| HNSW | O(log n) | High | 95-99% | <100M |
| IVF | O(n/c) | Medium | 90-95% | 10M-500M |
| PQ | Fast | Low | 85-90% | Any |
| IVF + PQ | Fast | Low | 90-95% | 100M+ |

**Decision Framework:**
- < 1M vectors → HNSW (best accuracy)
- 1M-100M vectors → IVF or HNSW
- 100M+ vectors → IVF + PQ
- Tight memory → PQ or IVF + PQ

**Key Takeaway:** No single "best" - depends on constraints

---

## CLOSING (Slides 54-55)

### Slide 54: THANK YOU
- Jackie Gleason

### Slide 55: References
- **PineconeDB Vectors:**
  - https://www.pinecone.io/learn/vector-embeddings/
  - https://www.pinecone.io/learn/series/faiss/hnsw/
- **OpenAI:**
  - https://platform.openai.com/docs/guides/embeddings
- **Wikipedia:**
  - https://en.wikipedia.org/wiki/Semantic_similarity
- **Other:**
  - https://alexop.dev/posts/how-to-implement-a-cosine-similarity-function-in-typescript-for-vector-comparison/

---

## Demo Integration Points

| Slide | Demo | Description |
|-------|------|-------------|
| 16 | Tokenization Demo | Show how text is tokenized |
| 24 | t-SNE Visualization | Interactive word clustering visualization |
| 27 | Multimodal Demo | Non-text embedding examples |
| 50 | Vector Database Demo | Live vector store operations |

---

## Key Takeaways for Audience

1. **Vector embeddings** = numerical representations that capture semantic meaning
2. **Similarity metrics** = cosine similarity is the default for text; measures angle, not distance
3. **High dimensions** = more dimensions capture more nuance (1,536D is common)
4. **ANN algorithms** = trade small accuracy loss for massive speed gains
5. **HNSW** = best for accuracy; **IVF+PQ** = best for scale
6. **RAG** = use embeddings to ground LLM responses in real documents
7. **Choice depends on constraints** = no single "best" algorithm or database

---

**Last Updated:** 2025-12-29
**Status:** Content complete through slide 55
