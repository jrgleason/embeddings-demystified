# Slide 6: Choosing an Embedding Model

**Status:** [DRAFT]
**Time:** 0:11 - 0:15
**Section:** Part 1 - Understanding Vectors and Embeddings

## Content Overview
Compare different embedding models (OpenAI, open source, domain-specific) to help developers choose the right model for their use case. Show that not all embeddings are created equal.

## What We'll Say

"Now you understand what embeddings are. But which embedding model should you use?

The answer depends on your needs: general-purpose vs specialized, cloud vs on-premise, cost vs performance.

## Commercial (API-Based) Models

### OpenAI
**Models:**
- `text-embedding-3-small` (1,536 dims) - $0.02 per 1M tokens
- `text-embedding-3-large` (3,072 dims) - $0.13 per 1M tokens

```python
from openai import OpenAI

client = OpenAI()
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="Your text here"
)
embedding = response.data[0].embedding  # 1,536 numbers
```

**Strengths:**
- Excellent general-purpose quality
- Easy API integration
- New models support dimension reduction (3,072 → 1,536 with minimal quality loss)

**Use when:** You want high quality with minimal setup

### Voyage AI
**Models:**
- `voyage-3` - General purpose, outperforms OpenAI v3 large by 7.55% on average
- `voyage-law-2` - Specialized for legal documents
- `voyage-code-2` - Optimized for code search
- `voyage-3-lite` - Budget option at $0.02 per 1M tokens

**Strengths:**
- Better accuracy than OpenAI at lower cost
- Domain-specific models for specialized use cases
- voyage-3 costs 2.2x less than OpenAI v3 large

**Use when:** You need specialized performance or better cost efficiency

### Cohere
**Models:**
- `embed-english-v3.0` (1,024 dims)
- `embed-multilingual-v3.0` (1,024 dims)

**Strengths:**
- Strong multilingual support
- Compression-aware embeddings (work well with quantization)

**Use when:** Multilingual applications are critical

### Google Gemini
**Models:**
- `text-embedding-004` (768 dims) - **FREE** with generous limits

**Strengths:**
- Completely free for small to medium usage
- 1,500 requests per minute rate limit
- Solid performance for the price (none!)

**Use when:** You're on a tight budget or building prototypes

---

## Open Source (Self-Hosted) Models

### Sentence Transformers (Hugging Face)
**Popular Models:**
- `all-MiniLM-L6-v2` (384 dims) - Fast, lightweight
- `all-mpnet-base-v2` (768 dims) - Better quality
- `bge-large-en-v1.5` (1,024 dims) - Top MTEB leaderboard

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer('all-MiniLM-L6-v2')
embedding = model.encode("Your text here")  # 384 numbers
```

**Strengths:**
- Run locally, no API costs
- Privacy - data never leaves your infrastructure
- 15,000+ pre-trained models on Hugging Face
- Fast CPU inference possible

**Challenges:**
- Need to host/manage models yourself
- Quality slightly lower than latest commercial models
- Requires ML infrastructure

**Use when:** Privacy concerns, high volume (saves money), or air-gapped environments

### BGE (BAAI General Embedding)
**Models:**
- `bge-small-en-v1.5` (384 dims)
- `bge-large-en-v1.5` (1,024 dims)
- `bge-m3` - Multilingual support

**Strengths:**
- Top performance on MTEB benchmark
- Free and open source
- Competitive with commercial models

**Use when:** You need top open-source quality

---

## Domain-Specific Models

### Medical/Healthcare
**voyage-health-2** (Voyage AI)
- Trained on medical literature
- Understands clinical terminology
- Better than general models for patient records, research papers

**ClinicalBERT** (Open source)
- Trained on MIMIC-III ICU notes
- Specialized in clinical language

**Use when:** Building healthcare applications, medical search

### Legal
**voyage-law-2** (Voyage AI)
- #1 on MTEB legal retrieval benchmark
- Outperforms OpenAI v3 large by 6% on legal tasks
- Understands legal terminology and case citations

**Use when:** Legal document search, contract analysis

### Code
**voyage-code-2** (Voyage AI)
- Optimized for code similarity search
- Better at understanding function intent

**CodeBERT** (Open source)
- Microsoft's code understanding model
- Good for code documentation search

**Use when:** Code search, documentation retrieval, finding similar functions

---

## Comparison Table

| Model | Dims | Cost | Specialty | Best For |
|-------|------|------|-----------|----------|
| **OpenAI 3-small** | 1,536 | $0.02/1M | General | Easy start, high quality |
| **OpenAI 3-large** | 3,072 | $0.13/1M | General | Maximum quality |
| **Voyage 3** | 1,024 | $0.06/1M | General | Best price/performance |
| **Voyage law-2** | 1,024 | $0.10/1M | Legal | Legal documents |
| **Gemini 004** | 768 | Free | General | Prototypes, budgets |
| **all-MiniLM-L6** | 384 | Free* | General | Self-hosted, fast |
| **bge-large** | 1,024 | Free* | General | Best open source |

*Free but requires infrastructure to host

---

## Decision Framework

```
Start here: What's your primary concern?

Privacy/Air-gapped
└─→ Open source (Sentence Transformers, BGE)

Budget
├─ FREE tier ok? → Google Gemini
└─ High volume? → Self-host open source (saves $$$ at scale)

Domain-specific
├─ Legal? → Voyage law-2
├─ Medical? → Voyage health-2 or ClinicalBERT
├─ Code? → Voyage code-2 or CodeBERT
└─ General? → See below

General purpose (most common)
├─ Want best performance? → Voyage 3 or OpenAI 3-large
├─ Need multilingual? → Cohere multilingual
├─ Starting simple? → OpenAI 3-small
└─ Building prototype? → Google Gemini (free)
```

## Key Performance Insight

**2024 Benchmark (500K Amazon reviews):**
- Mistral-embed: 77.8% accuracy
- Google Gemini: 71.5% accuracy (but most expensive until free)
- Voyage-3.5-lite: 66.1% accuracy at lowest cost
- OpenAI 3-large: Good but not the leader in accuracy

**Takeaway:** More expensive doesn't always mean better. Benchmark for your use case!

---

## The Fine-Tuning Option

Some providers let you **fine-tune** embeddings on your data:

```python
# OpenAI fine-tuning (requires training data)
openai.FineTuningJob.create(
    model="text-embedding-3-small",
    training_file="your_training_data.jsonl"
)
```

**Use when:**
- You have >1,000 labeled examples
- Your domain is very specialized (e.g., proprietary product catalog)
- General models aren't performing well enough

**Most teams:** Start with pre-trained general models, fine-tune only if needed

---

## Real-World Example

**E-commerce Product Search:**

**Option 1 (Start):** OpenAI 3-small
- Fast to implement
- Good out-of-the-box quality
- Cost: ~$20/month for 1M products

**Option 2 (Scale):** Voyage 3
- Better quality for same use case
- Cost: ~$60 for 1M products (one-time embedding)
- Better long-term ROI

**Option 3 (Optimize):** Fine-tuned BGE
- Best quality for YOUR products
- No ongoing API costs
- Requires ML team & infrastructure

Most teams: Start with #1, move to #2 or #3 as they scale.

---

## Key Takeaways

1. **Commercial models** (OpenAI, Voyage, Cohere) are easiest to start with
2. **Open source models** save money at scale but need infrastructure
3. **Domain-specific models** significantly outperform general models in specialized fields
4. **Google Gemini** is compelling for free tier and prototypes
5. **Benchmark before committing** - what works for others may not work for you

**Resources:**
- MTEB Leaderboard: huggingface.co/spaces/mteb/leaderboard
- Sentence Transformers: sbert.net
- Always test with YOUR data before production"

## Visual Elements Needed
- [ ] Comparison table (main visual)
- [ ] Decision tree flowchart
- [ ] Cost comparison bar chart:
  ```
  Cost per 1M tokens:
  Gemini:     FREE
  OpenAI 3-s: $0.02
  Voyage-lite: $0.02
  BGE:        FREE* (but infra costs)
  OpenAI 3-l: $0.13
  ```
- [ ] Code examples for OpenAI and Sentence Transformers
- [ ] Domain-specific callout boxes (medical, legal, code)
- [ ] Performance benchmark visualization
- [ ] Icons: API (cloud), Self-hosted (server), Domain (specialty)

## Examples/Analogies

**Restaurant Menu Analogy:**
"Choosing an embedding model is like choosing from a menu:
- **Fast food (OpenAI):** Quick, consistent, costs more per meal
- **Home cooking (open source):** Cheaper in bulk, but you do the work
- **Specialty restaurant (domain-specific):** Perfect for special occasions, tailored to your taste"

**Tool Selection:**
"Like choosing between:
- **DeWalt (commercial):** Warranty, support, works great out of the box
- **Harbor Freight (open source):** Cheap, good enough for most, DIY friendly
- **Specialized tool (domain-specific):** The BEST for one specific job"

## Interactive Elements
- Quick poll: "How many are using OpenAI embeddings? Open source? Other?"
- "Anyone working in legal, medical, or code-heavy domains?" (highlight specialists)
- "For most general apps, you can't go wrong with OpenAI or Voyage to start"

## Notes/Considerations
- Emphasize: **Start simple, optimize later**
- Most teams overthink this - general models work for 80% of use cases
- Domain-specific models are worth it when you have specialized content
- Cost becomes important at scale (millions of embeddings)
- Privacy/compliance might force open source decision
- Benchmarking is crucial - what works for one domain may not work for another

### Technical Notes to Have Ready:
- **Dimension reduction:** OpenAI 3-large can reduce to 1,536 with <5% quality loss
- **Multilingual:** Cohere and Voyage offer strong multilingual options
- **MTEB benchmark:** Industry standard for comparing embedding quality
- **Fine-tuning cost:** $3-8 per 1M tokens (OpenAI), worth it for specialized domains
- **Hosting costs:** AWS/GCP ~$50-200/month for self-hosted depending on traffic

## Connection to Previous/Next Slides
- **Previous (Slide 5):** We learned what embeddings are
- **This Slide:** Now choose which model to use
- **Next (Slide 7):** Why do we need so many dimensions?

## Breakdown Needed?
- [ ] Yes - Could split commercial vs open source
- [x] No - 4 minutes covers decision framework comprehensively
