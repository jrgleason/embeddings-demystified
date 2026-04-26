# Project Context

## Purpose

This project is a comprehensive 2-hour technical presentation for CodeMash 2025 titled **"Vector Databases and Embeddings Demystified"**. The goal is to teach developers how to build AI-powered search and recommendation systems using vector databases, covering everything from fundamental concepts to production implementation.

**Target Audience:** Developers with basic Python knowledge but no ML background required

**Key Objectives:**
1. Demystify vector embeddings and similarity search mathematics
2. Provide practical, production-ready Python implementations
3. Bridge theory with real-world applications (Netflix recommendations, Google Photos search, RAG chatbots)
4. Enable attendees to implement semantic search within a week

## Tech Stack

### Interactive Demo (embeddings-demo)
- **Frontend:** React 18+ with Vite
- **UI Framework:** Material-UI (MUI) with Emotion
- **Routing:** React Router DOM
- **Backend:** Express.js with vite-express
- **AI/ML:** 
  - LangChain.js (@langchain/core, @langchain/community, @langchain/ollama)
  - Ollama (qwen3-embedding:0.6b for local embeddings)
- **Visualization:** @thi.ng/tsne for dimensionality reduction
- **Styling:** Tailwind CSS
- **Dev Tools:** ESLint, Vite SWC plugin

### Python Examples (for presentation demos)
- **Python:** 3.10+ (using modern type hints)
- **AI/ML:** LangChain, OpenAI SDK, Sentence Transformers
- **Vector Databases:** Pinecone, ChromaDB, MongoDB Atlas, Redis, Neo4j
- **Scientific Computing:** NumPy, FAISS, tiktoken
- **Notebooks:** Jupyter for interactive demos
- **Environment:** python-dotenv for API key management

### Presentation Materials
- **Slides:** Individual markdown files per slide in `/slides`
- **Documentation:** Comprehensive requirements and design docs in `/docs`

## Project Conventions

### Code Style

**JavaScript/React:**
- ES6+ modern JavaScript with modules
- Functional React components (hooks, no class components)
- Latest package versions ("latest" in package.json)
- ESLint for code quality

**Python:**
- PEP 8 style guide
- Type hints for all function signatures
- Docstrings for all public functions
- Meaningful variable names (no single letters except loop counters)
- Comments explain WHY, not WHAT (avoid obvious syntax comments)
- Example:
  ```python
  def embed_text(text: str) -> list[float]:
      """Convert text to vector embedding using OpenAI API."""
      response = openai.Embedding.create(
          input=text,
          model="text-embedding-3-small"
      )
      return response.data[0].embedding
  ```

**Markdown:**
- Clear section headers with proper hierarchy
- Code blocks with language specification
- Consistent formatting across documentation
- Template-based approach for slides (see `/slides/TEMPLATE.md`)

### File Organization

**Slide Development:**
- One markdown file per slide: `slide-[number]-[title].md`
- Split slides use letters: `slide-05a-`, `slide-05b-`, etc.
- Each slide file follows template structure with status tracking
- Status markers: [DRAFT], [REVIEW], [FINAL], [NEEDS BREAKDOWN]

**Demo Code:**
- Self-contained, reproducible examples
- Maximum 10 lines per slide code snippet
- Larger examples in Jupyter notebooks
- All demos must complete in under 5 minutes runtime

### Architecture Patterns

**Demo Architecture:**
```
[Data Sources] 
    → [Embedding Pipeline: Chunker → Embedder → Uploader]
    → [Vector Database: Index + Metadata + Storage]
    → [Query Pipeline: Query Embed → Retrieve → Rerank]
    → [LLM Generation: Context + Query → Response]
```

**RAG Pattern:**
1. **Ingestion:** Chunk documents, generate embeddings, store in vector DB
2. **Retrieval:** Query embedding, similarity search, metadata filtering
3. **Augmentation:** Combine retrieved context with user query
4. **Generation:** LLM generates grounded response with citations

**GraphRAG Pattern (Advanced):**
- Combines knowledge graphs with vector search for multi-hop reasoning
- Use Neo4j for graph database with vector index
- Entity/relationship extraction for graph construction
- Graph traversal limits context scope to relevant relationships

### Testing Strategy

**Demo Reliability (99% success rate):**
- Test demos 3+ times before presentation
- Pre-recorded backup videos for each demo
- Cached API responses for offline fallback
- Multiple test accounts/API keys
- Error handling for: missing API keys, network failures, rate limiting, invalid input

**Reproducibility:**
- Clear setup instructions in README
- Seed values for random operations
- Deterministic outputs where possible
- Docker/venv with pinned dependency versions

**Content Validation:**
- Technical accuracy review by ML experts
- User testing with 3-5 non-ML developers
- Timing verification (2 hours ±5 minutes)
- Verify all facts within 2 weeks of presentation

### Git Workflow

**Branching Strategy:**
- Main branch for stable, tested content
- Feature branches for new slides or major changes
- Review before merging to main

**Commit Conventions:**
- Descriptive commit messages focusing on "why"
- Examples:
  - "Add detailed speaker script for similarity metrics slide"
  - "Split dense embedding model slide into three focused slides"
  - "Update demo to use latest LangChain API"

**Version Control:**
- Never commit `.env` files or API keys
- Use `.env.example` for template
- Document all environment variables needed

## Domain Context

### Vector Embeddings
- Numerical representations (arrays of floats) that capture semantic meaning
- Generated by AI models: OpenAI, Sentence Transformers, Qwen
- Typical dimensions: 384 (small), 768 (BERT), 1024, 1536 (OpenAI)
- Similar concepts have similar vectors (measured by cosine similarity, etc.)

### Similarity Metrics
| Metric | Range | Best For | Use Case |
|--------|-------|----------|----------|
| Cosine Similarity | -1 to 1 | Text embeddings | Default choice for most applications |
| Euclidean Distance | 0 to ∞ | When magnitude matters | Image similarity, clustering |
| Dot Product | -∞ to ∞ | Speed-critical | Normalized vectors, recommendations |

### ANN (Approximate Nearest Neighbor) Algorithms
| Algorithm | Speed | Memory | Accuracy | Best Scale |
|-----------|-------|--------|----------|------------|
| HNSW | O(log n) | High | 95-99% | <100M vectors |
| IVF | O(n/c) | Medium | 90-95% | 10M-500M |
| Product Quantization | Fast | Low | 85-90% | Any scale |
| IVF + PQ | Fast | Low | 90-95% | 100M+ |

### Vector Database Options
- **Pinecone/Milvus:** Vector-native (fast ANN, serverless options)
- **MongoDB Atlas:** Unified operational + vector DB (no data sync needed)
- **Redis:** In-memory vector search (sub-millisecond latency)
- **ChromaDB:** Local/open-source (development, privacy)
- **Neo4j:** Graph + vector for GraphRAG (multi-hop reasoning)

### RAG (Retrieval-Augmented Generation)
- Solves LLM limitations: knowledge cutoff, hallucinations, no private data
- Four components: Ingestion, Retrieval, Augmentation, Generation
- Chunking strategies: 500 tokens with 50 overlap (typical)
- Hybrid search: semantic (vector) + lexical (keyword) for best results

### Real-World Applications
1. Netflix-style recommendations
2. Google Photos image/face search
3. RAG-powered chatbots (customer support)
4. Fraud detection (similar transaction patterns)
5. E-commerce product recommendations
6. Multi-hop reasoning (research assistants with GraphRAG)

## Important Constraints

### Time Constraints
- **Presentation:** Exactly 2 hours including demos and Q&A
- **Demos:** Each must complete in under 5 minutes runtime
- **Structure:** 30min + 30min + [10min break] + 40min + 20min + 10min Q&A

### Budget Constraints
- **API Costs:** Target <$5 total for all demos
- Use local Ollama for free embeddings when possible
- Cache responses during development
- Minimize OpenAI API calls

### Technical Constraints
- **Python Primary:** All demos must be in Python (presentation requirement)
- **Audience Level:** Assume basic Python, no ML background
- **Reliability:** Demos must work offline (no internet dependency)
- **Dependencies:** Python 3.10+ required for modern type hints

### Content Constraints
- **Scope:** Focus on text embeddings (no images/video/audio)
- **Depth:** Accessible to non-ML developers (avoid deep learning internals)
- **Practicality:** Working code over theory (80/20 rule)

### Accessibility Requirements
- Minimum 24pt font for body text, 40pt+ for titles
- High contrast color schemes (4.5:1 ratio)
- No color-only differentiation
- Code minimum 18pt font during live demos

## External Dependencies

### API Services (with fallbacks)
- **OpenAI API:** Embeddings (text-embedding-3-small), GPT-4 for RAG demos
  - Fallback: Cached responses, local Sentence Transformers
- **Pinecone:** Vector database for production demos
  - Fallback: ChromaDB (local), FAISS (offline)

### Local Services
- **Ollama:** Local LLM and embedding model (qwen3-embedding:0.6b)
  - Must be running: `ollama serve`
  - Required for embeddings-demo app

### Development Tools
- **Node.js:** 18+ for React demo app
- **Python:** 3.10+ for Jupyter notebooks
- **Jupyter:** For interactive demo notebooks
- **Git:** Version control

### Key Libraries
**JavaScript:**
- @langchain/* packages for AI orchestration
- @mui/material for UI components
- @thi.ng/tsne for visualization
- express for backend server

**Python:**
- langchain (>=0.3.0) for RAG implementation
- openai (>=1.0.0) for embeddings/LLMs
- pinecone-client or chromadb for vector storage
- sentence-transformers for local embeddings
- numpy, pandas for data manipulation
- faiss for offline similarity search

### Environment Variables
Required in `.env` (never commit):
```bash
# For local Ollama demos
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen3:0.6b
OLLAMA_EMBEDDING_MODEL=qwen3-embedding:0.6b

# For cloud demos (optional)
OPENAI_API_KEY=your_key_here
PINECONE_API_KEY=your_key_here
```

### Infrastructure Assumptions
- Stable internet connection (with offline fallbacks)
- Projector/screen at venue
- Microphone and power for laptop
- Audience has computers with Python installed (for post-presentation experiments)
