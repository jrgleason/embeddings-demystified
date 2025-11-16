# Advanced Embeddings: Step-by-Step Cosine Similarity

An interactive React application that demonstrates the mathematical calculations behind cosine similarity using vector embeddings. Perfect for presentations and teaching how vector databases work under the hood.

## Features

- **Step-by-Step Visualization**: Shows each step of the cosine similarity calculation
- **Live Calculations**: Uses transformers.js utilities for dot product and magnitude
- **OpenAI Embeddings**: Generates high-dimensional vectors (1536D) from text
- **Interactive UI**: Compare any two texts with real-time results
- **Educational Design**: Perfect for presentations and teaching
- **Clean Implementation**: Uses transformers.js for math operations
- Built with React, transformers.js (@xenova/transformers), and OpenAI API

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure OpenAI API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

**Security Note:** The API key is only used by the backend server and is never exposed to the browser.

### 3. Build and Run the Application

```bash
npm start
```

This will:
1. Build the React app for production
2. Start the Express server on `http://localhost:5132`
3. Open http://localhost:5132 in your browser

**For development with hot reloading:**

```bash
npm run dev
```

Then visit http://localhost:5173

## How It Works

1. **Enter Two Texts**: Type any two text phrases you want to compare
2. **Generate Embeddings**: Click "Calculate Similarity" to send both texts to OpenAI
3. **Calculate in Steps**: The backend uses transformers.js to calculate:
   - **Step 1**: Generate 1536-dimensional vectors from text
   - **Step 2**: Calculate dot product using `dot(vector1, vector2)`
   - **Step 3**: Calculate magnitudes using `magnitude(vector1)` and `magnitude(vector2)`
   - **Step 4**: Calculate cosine similarity: `dot / (mag1 × mag2)`
   - **Step 5**: Interpret the result
4. **Display Results**: See each calculation step with formulas, values, and examples

## Technologies

- **React** - UI framework
- **Vite** - Build tool and dev server
- **@xenova/transformers** - transformers.js for `dot()` and `magnitude()` utilities
- **OpenAI API** - For generating text embeddings (text-embedding-3-small)
- **Express** - Backend server for API calls

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│            Express Server (Port 5132)                     │
│                                                           │
│  ┌────────────────────┐      ┌────────────────────────┐  │         ┌─────────────┐
│  │  Static Files      │      │  API Routes            │  │         │             │
│  │  (React App)       │      │  /embedding            │  │────────►│   OpenAI    │
│  │  from /dist        │      │  /api/health           │  │         │             │
│  └────────────────────┘      └────────────────────────┘  │◄────────│             │
│           ▲                            ▲                  │         └─────────────┘
└───────────│────────────────────────────│──────────────────┘
            │                            │
            │  Browser loads             │  Fetch /embedding
            │  React app                 │  (same origin)
            │                            │
         ┌──┴────────────────────────────┴──┐
         │      Browser                     │
         │   http://localhost:5132          │
         └──────────────────────────────────┘
```

**Single Server Architecture:** The Express server serves both the static React files (from the `dist` folder) and handles API requests. This eliminates CORS issues and keeps the API key secure on the server.

## Files

- `server.js` - Express backend with `/similarity` endpoint
- `src/SimilarityCalculator.jsx` - Main similarity calculator component
- `src/SimilarityCalculator.css` - Styling for the calculator
- `src/App.jsx` - App wrapper
- `vite.config.js` - Vite configuration

## Usage

The application starts with example texts: "The cat sleeps on the mat" and "A feline rests on the rug"

**To compare two texts:**
1. Enter text in the "Text 1" field
2. Enter text in the "Text 2" field
3. Click "Calculate Similarity"
4. View the step-by-step calculation results

**Example comparisons to try:**

**High Similarity:**
- Text 1: "machine learning algorithms"
- Text 2: "artificial intelligence models"

**Low Similarity:**
- Text 1: "The weather is nice today"
- Text 2: "I enjoy playing basketball"

**Perfect Similarity:**
- Text 1: "Hello world"
- Text 2: "Hello world"

## What You'll See

The UI displays:

1. **Similarity Score** - Large colored number showing the cosine similarity (0-1 range)
2. **Interpretation** - Human-readable explanation of what the score means
3. **5 Detailed Steps**:
   - Step 1: Vector dimensions and preview of embedding values
   - Step 2: Dot product formula and calculation examples
   - Step 3: Magnitude calculations for both vectors
   - Step 4: Final cosine similarity calculation breakdown
   - Step 5: Similarity scale reference guide

## Understanding the Math

### Step 1: Embeddings
Text is converted into high-dimensional vectors (1536 dimensions) where semantically similar words are close together in vector space.

### Step 2: Dot Product
```
dot(A, B) = A₁×B₁ + A₂×B₂ + ... + Aₙ×Bₙ
```
Measures how much two vectors point in the same direction. Uses transformers.js `dot()` function.

### Step 3: Magnitude
```
magnitude(A) = √(A₁² + A₂² + ... + Aₙ²)
```
Calculates the "length" of each vector in high-dimensional space. Uses transformers.js `magnitude()` function.

### Step 4: Cosine Similarity
```
similarity = dot(A, B) / (magnitude(A) × magnitude(B))
```
Normalizes the dot product by dividing by the product of magnitudes. This gives us the cosine of the angle between vectors, ranging from -1 to 1.

### Why Cosine?
Cosine similarity focuses on the **direction** of vectors, not their magnitude. This is perfect for comparing semantic meaning, where we care about the relationship between concepts, not the length of the text.

## API Endpoint

**POST /similarity**

Request:
```json
{
  "text1": "your first text",
  "text2": "your second text",
  "model": "text-embedding-3-small"  // optional
}
```

Response includes:
- Complete step-by-step calculations
- Example terms from each calculation
- Final similarity score and interpretation

## References

- [Transformers.js Documentation](https://huggingface.co/docs/transformers.js)
- [Transformers.js Math Utilities](https://huggingface.co/docs/transformers.js/en/api/utils/maths)
- [Cosine Similarity Guide](https://alexop.dev/posts/how-to-implement-a-cosine-similarity-function-in-typescript-for-vector-comparison/)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)

## Presentation Tips

This demo is designed for live presentations:
- The UI is clean and easy to follow
- Each step is clearly labeled and explained
- Console logs are minimal (just success/error messages)
- Results update in real-time
- Perfect for explaining vector similarity in ~5 minutes

Try comparing:
- Synonyms (high similarity)
- Related concepts (moderate similarity)
- Unrelated phrases (low similarity)
- Identical text (perfect similarity of 1.0)

## License

MIT
