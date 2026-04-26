# Embeddings Demo

An interactive web application demonstrating vector embeddings, semantic similarity, and vector databases using Ollama, LangChain, and React. This demo showcases how text can be transformed into high-dimensional vectors and how these vectors can be used for semantic search and similarity matching.

## Features

- **Interactive Embedding Generation**: Generate embeddings for any text using Ollama models
- **Vector Store Management**: Add, search, and clear vectors in an in-memory vector database
- **Semantic Similarity Search**: Find semantically similar text based on vector similarity
- **t-SNE Visualization**: Visualize high-dimensional embeddings in 2D space
- **AI Chat Interface**: Interact with Ollama language models
- **Multiple Embedding Models**: Support for various Ollama embedding models

## Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Ollama** running on a server or locally
  - Download from: https://ollama.ai
  - Pull required models:
    ```bash
    ollama pull qwen3:0.6b
    ollama pull qwen3-embedding:0.6b
    ```

## Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone <repository-url>
   cd demos/embeddings-demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your preferred editor
   nano .env  # or vim, code, etc.
   ```

   Update the following variables in your `.env` file:
   - `OLLAMA_BASE_URL`: URL where Ollama is running (default: `http://10.0.0.9:11434`)
   - `OLLAMA_MODEL`: Chat model to use (default: `qwen3:0.6b`)
   - `OLLAMA_EMBEDDING_MODEL`: Embedding model to use (default: `qwen3-embedding:0.6b`)

## Running the Application

Start the development server:

```bash
npm start
```

The application will be available at: **http://localhost:3000**

The server uses Vite for the frontend and Express for the backend API, running in a single process.

## API Endpoints

The backend provides the following REST API endpoints:

### Chat & AI

#### `POST /ai`
Generate text completions using the Ollama language model.

**Request:**
```json
{
  "prompt": "What is a vector database?"
}
```

**Response:**
```json
{
  "model": "qwen3:0.6b",
  "baseUrl": "http://10.0.0.9:11434",
  "output": "A vector database is..."
}
```

### Embeddings

#### `POST /embedding`
Generate embeddings for text (OpenAI-compatible format). Supports batch processing.

**Request:**
```json
{
  "input": "Hello world",
  "model": "qwen3-embedding:0.6b"
}
```

**Response:**
```json
{
  "object": "list",
  "data": [
    {
      "object": "embedding",
      "index": 0,
      "embedding": [0.123, -0.456, ...]
    }
  ],
  "model": "qwen3-embedding:0.6b"
}
```

#### `POST /ai/embedding` (Legacy)
Generate embedding for a single text prompt.

**Request:**
```json
{
  "prompt": "Hello world"
}
```

**Response:**
```json
[0.123, -0.456, 0.789, ...]
```

### Vector Store

#### `POST /vectorstore/add`
Add text to the vector store with automatic embedding generation.

**Request:**
```json
{
  "prompt": "The quick brown fox jumps over the lazy dog"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Prompt added to vector store",
  "prompt": "The quick brown fox jumps over the lazy dog",
  "embedding": [0.123, ...],
  "embeddingDimension": 768
}
```

#### `POST /vectorstore/similarity`
Find semantically similar text in the vector store.

**Request:**
```json
{
  "prompt": "fast animal",
  "k": 5
}
```

**Response:**
```json
{
  "query": "fast animal",
  "results": [
    {
      "content": "The quick brown fox jumps over the lazy dog",
      "score": 0.92,
      "metadata": {
        "timestamp": "2024-01-15T10:30:00.000Z"
      }
    }
  ],
  "count": 1
}
```

#### `POST /vectorstore/clear`
Clear all vectors from the vector store.

**Response:**
```json
{
  "success": true,
  "message": "Vector store cleared"
}
```

## Project Structure

```
embeddings-demo/
├── src/
│   ├── components/        # React components
│   │   ├── navbar/       # Navigation bar
│   │   ├── footer/       # Footer component
│   │   └── pages/        # Page components
│   │       ├── embedding/    # Embedding generation page
│   │       ├── lorem/        # Sample text generator
│   │       ├── main/         # Main landing page
│   │       ├── tsne/         # t-SNE visualization
│   │       └── vectorstore/  # Vector store demo
│   ├── hooks/            # Custom React hooks
│   ├── App.jsx           # Main app component
│   ├── routes.jsx        # Route configuration
│   └── theme.js          # MUI theme configuration
├── server.mjs            # Express + Vite backend server
├── .env.example          # Environment variables template
└── package.json          # Dependencies and scripts
```

## Technologies Used

- **Frontend**: React, Material-UI (MUI), React Router, Tailwind CSS
- **Backend**: Express, Vite Express
- **AI/ML**: LangChain, Ollama
- **Vector Store**: LangChain MemoryVectorStore
- **Visualization**: @thi.ng/tsne for dimensionality reduction

## Troubleshooting

### Cannot connect to Ollama

**Problem**: API requests fail with connection errors.

**Solutions**:
1. Verify Ollama is running:
   ```bash
   curl http://localhost:11434/api/tags
   ```
2. Check `OLLAMA_BASE_URL` in your `.env` file matches where Ollama is running
3. Ensure firewall rules allow connections to the Ollama port (default: 11434)

### Model not found

**Problem**: Error message indicates the model doesn't exist.

**Solution**: Pull the required models:
```bash
ollama pull qwen3:0.6b
ollama pull qwen3-embedding:0.6b
```

To see available models:
```bash
ollama list
```

### Port 3000 already in use

**Problem**: Another application is using port 3000.

**Solutions**:
1. Stop the other application using port 3000
2. Modify `server.mjs` (line 185) to use a different port:
   ```javascript
   ViteExpress.listen(app, 3001, () => console.log("Server is listening..."));
   ```

### Embedding dimension mismatch

**Problem**: Vectors have different dimensions when using different models.

**Solution**: Clear the vector store when switching embedding models:
```bash
curl -X POST http://localhost:3000/vectorstore/clear
```

### npm install fails

**Problem**: Dependency installation errors.

**Solutions**:
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```
2. Delete `node_modules` and `package-lock.json`:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```
3. Ensure you're using Node.js v18 or higher:
   ```bash
   node --version
   ```

## Development

### Available Scripts

- `npm start` - Start the development server (frontend + backend)
- `npm run build` - Build the production bundle
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview the production build

### Environment Variables

All environment variables are optional and have sensible defaults. See `.env.example` for details.

## Security Notes

- **Never commit `.env` files** - They may contain sensitive configuration
- The `.env` file is excluded in `.gitignore` to prevent accidental commits
- For production deployments, use proper secret management
- The default Ollama URL (`http://10.0.0.9:11434`) should be changed to match your setup

## License

This project is part of the Vector Databases educational presentation.

## Contributing

This is a demonstration project for educational purposes. Feel free to fork and modify for your own learning!
