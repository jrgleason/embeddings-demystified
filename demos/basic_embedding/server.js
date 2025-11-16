import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';

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
  console.log(`\nServing React app from /dist`);
});
