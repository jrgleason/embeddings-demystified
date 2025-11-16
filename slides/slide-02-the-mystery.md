# Slide 2: The Mystery

**Status:** [DRAFT]
**Time:** 0:01 - 0:03
**Section:** Introduction

## Content Overview
Hook the audience with three compelling questions about familiar technologies that use vector databases. Include defendable claims with citations.

## What We'll Say

"Let me ask you three questions:

**How does Netflix know you'll love that obscure documentary?** Netflix uses foundation models with embedding layers that convert your viewing history and every title into vectors in high-dimensional space. These embeddings combine both your interaction patterns and content metadata (like genres, cast, and tone). When your user embedding is mathematically similar to a title's embedding, that's a potential recommendation. With over 300 million users generating hundreds of billions of interactions, Netflix's foundation model learns long-term preferences that transcend simple genre matching—enabling it to surface hidden gems you didn't know you'd love.

Source 1: Netflix Tech Blog - Foundation Model for Personalized Recommendation

URL: https://netflixtechblog.com/foundation-model-for-personalized-recommendation-1a0bd8e02d39Authors: Ko-Jen Hsiao, Yesu Feng, and Sudarshan LamkhedeDate:
March 21, 2025Publisher: Netflix Technology Blog

Key Information:
- Netflix uses foundation models with vector embeddings to represent users and content in high-dimensional space
- The model processes hundreds of billions of user interactions from over 300 million users
- Uses embedding layers in neural networks to create user and item representations
- Implements metadata-based embeddings combined with ID-based embeddings for recommendations
- The embeddings capture long-term member preferences and enable personalized recommendations


**How does Google Photos find every picture of your dog?** You never tagged those photos. Google's deep convolutional neural networks embed each image into a vector space where similar images cluster together. They call it "universal image embeddings" - launched in Google Photos back in March 2018. Nearest neighbor search in that vector space finds all your dog photos instantly.

**How does ChatGPT answer questions about your documents?** When you upload files to a custom GPT, it's using RAG - Retrieval Augmented Generation. Your documents get converted to vector embeddings, stored in a vector database. When you ask a question, it converts your question to a vector, finds the closest matching document chunks, and uses those to ground its response. This is straight from OpenAI's help documentation.

These aren't magic - they're vector databases doing similarity search. And by the end of today, you'll know how to build this yourself."

## Visual Elements Needed
- [ ] Netflix screenshot showing recommendation interface
- [ ] Google Photos screenshot showing search results (e.g., "dog" search)
- [ ] ChatGPT screenshot showing document Q&A
- [ ] Small citation text at bottom for each example
- [ ] Visual connector showing all three use "vector similarity"
- [ ] Animated highlights or arrows drawing attention to each example

## Examples/Analogies
- **Netflix:** "That documentary you didn't know existed but now can't stop thinking about"
- **Google Photos:** "Every picture of your dog, even the blurry ones from 2015"
- **ChatGPT:** "Answering questions about 1000-page documents it read in seconds"

## Interactive Elements
"Show of hands: How many use ChatGPT regularly? How about LangChain?"
- Gauge audience experience level
- Create engagement right away
- Build connection with audience

## Notes/Considerations
- **CRITICAL:** All claims are defendable with sources (see sources.md)
- Emphasize these are REAL technologies, not demos
- Create curiosity - "how does this actually work?"
- Don't explain the technology yet - just create the mystery
- Keep energy high
- Citations should be subtle but visible (small text at bottom)

### Technical Evidence to Have Ready (if questioned):
**Netflix:**
- Source: Netflix TechBlog "Foundation Model for Personalized Recommendation"
- Embedding layers for users and items
- 1,300+ clusters

**Google Photos:**
- Source: Google Research Blog on Universal Image Embeddings
- Deep CNNs for image vectors
- Launched March 2018

**ChatGPT:**
- Source: OpenAI Help Center on RAG
- Vector embeddings for documents
- Nearest neighbor retrieval

## Breakdown Needed?
- [x] Yes - Consider splitting into two slides if timing too tight
- [ ] No

### Proposed Breakdown (if needed):
**Slide 2a: The Mystery - Consumer Examples**
- Netflix recommendations
- Google Photos search
- Focus on "you use these every day"

**Slide 2b: The Mystery - AI Integration**
- ChatGPT RAG
- Technical evidence
- Bridge to "this is what we're building"

**Decision:** Keep as one slide for now, but prepare to split if 2 minutes isn't enough to cover all three examples with proper emphasis.
