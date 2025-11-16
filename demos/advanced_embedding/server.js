import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { dot, magnitude } from '@xenova/transformers';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5132;

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoints should come before static file serving
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Embeddings endpoint - THIS IS WHERE THE OPENAI CALL HAPPENS
app.post('/embedding', async (req, res) => {
  try {
    const { input, model = 'text-embedding-3-small' } = req.body;

    if (!input || !Array.isArray(input)) {
      return res.status(400).json({
        error: 'Invalid input. Expected an array of strings.'
      });
    }

    console.log(`Fetching embeddings for ${input.length} items...`);

    // ⭐ THIS IS THE OPENAI API CALL FOR EMBEDDINGS ⭐
    const response = await openai.embeddings.create({
      model,
      input,
      encoding_format: 'float'
    });

    console.log(`Successfully fetched ${response.data.length} embeddings`);

    // Return embeddings to client
    res.json({
      data: response.data,
      model: response.model,
      usage: response.usage
    });

  } catch (error) {
    console.error('Error fetching embeddings:', error);

    res.status(500).json({
      error: 'Failed to fetch embeddings',
      message: error.message
    });
  }
});

// ⭐ NEW ENDPOINT: Step-by-step cosine similarity calculation ⭐
app.post('/similarity', async (req, res) => {
  try {
    const { text1, text2, model = 'text-embedding-3-small' } = req.body;

    if (!text1 || !text2) {
      return res.status(400).json({
        error: 'Invalid input. Expected text1 and text2 strings.'
      });
    }

    console.log(`Calculating similarity: "${text1}" vs "${text2}"`);

    // STEP 1: Get embeddings from OpenAI
    const response = await openai.embeddings.create({
      model,
      input: [text1, text2],
      encoding_format: 'float'
    });

    const vector1 = response.data[0].embedding;
    const vector2 = response.data[1].embedding;

    // STEP 2: Calculate dot product using transformers.js
    const dotProduct = dot(vector1, vector2);

    // STEP 3: Calculate magnitudes using transformers.js
    const magnitude1 = magnitude(vector1);
    const magnitude2 = magnitude(vector2);

    // STEP 4: Calculate cosine similarity
    const cosineSimilarity = dotProduct / (magnitude1 * magnitude2);

    // STEP 5: Interpret the result
    let interpretation = '';
    if (cosineSimilarity > 0.9) {
      interpretation = 'Very High Similarity - Texts are semantically very similar';
    } else if (cosineSimilarity > 0.7) {
      interpretation = 'High Similarity - Texts are semantically similar';
    } else if (cosineSimilarity > 0.5) {
      interpretation = 'Moderate Similarity - Texts share some semantic meaning';
    } else if (cosineSimilarity > 0.3) {
      interpretation = 'Low Similarity - Texts are somewhat different';
    } else {
      interpretation = 'Very Low Similarity - Texts are semantically different';
    }

    console.log(`✓ Similarity: ${cosineSimilarity.toFixed(4)} - ${interpretation}`);

    // Return detailed results
    res.json({
      text1,
      text2,
      model,
      steps: {
        step1_embeddings: {
          description: 'Generate vector embeddings using OpenAI',
          vector1_dimensions: vector1.length,
          vector2_dimensions: vector2.length,
          vector1_preview: vector1.slice(0, 5),
          vector2_preview: vector2.slice(0, 5)
        },
        step2_dot_product: {
          description: 'Calculate dot product: sum of element-wise products',
          formula: 'dot(A, B) = A₁×B₁ + A₂×B₂ + ... + Aₙ×Bₙ',
          result: dotProduct,
          example_terms: [
            { term: 1, calculation: `${vector1[0]} × ${vector2[0]} = ${vector1[0] * vector2[0]}` },
            { term: 2, calculation: `${vector1[1]} × ${vector2[1]} = ${vector1[1] * vector2[1]}` },
            { term: 3, calculation: `${vector1[2]} × ${vector2[2]} = ${vector1[2] * vector2[2]}` }
          ]
        },
        step3_magnitudes: {
          description: 'Calculate vector magnitudes (lengths)',
          formula: 'magnitude(A) = √(A₁² + A₂² + ... + Aₙ²)',
          magnitude1,
          magnitude2,
          example_terms_vector1: [
            { term: 1, calculation: `${vector1[0]}² = ${vector1[0] ** 2}` },
            { term: 2, calculation: `${vector1[1]}² = ${vector1[1] ** 2}` },
            { term: 3, calculation: `${vector1[2]}² = ${vector1[2] ** 2}` }
          ]
        },
        step4_cosine_similarity: {
          description: 'Calculate cosine similarity',
          formula: 'cosine_similarity = dot(A, B) / (magnitude(A) × magnitude(B))',
          numerator: dotProduct,
          denominator: magnitude1 * magnitude2,
          result: cosineSimilarity
        },
        step5_interpretation: {
          similarity_score: cosineSimilarity,
          interpretation,
          scale: {
            '1.0': 'Perfect similarity',
            '0.7-0.9': 'High similarity',
            '0.5-0.7': 'Moderate similarity',
            '0.3-0.5': 'Low similarity',
            '0.0-0.3': 'Very low similarity'
          }
        }
      },
      summary: {
        similarity: cosineSimilarity,
        interpretation,
        dot_product: dotProduct,
        magnitude1,
        magnitude2
      }
    });

  } catch (error) {
    console.error('Error calculating similarity:', error);

    res.status(500).json({
      error: 'Failed to calculate similarity',
      message: error.message
    });
  }
});

// SPA fallback - serve index.html for all other GET requests
// This must come after API routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - GET  /api/health`);
  console.log(`  - POST /embedding`);
  console.log(`  - POST /similarity  (⭐ NEW: Step-by-step cosine similarity)`);
  console.log(`\nServing React app from /dist`);
});
