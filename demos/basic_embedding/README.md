# t-SNE Word Embeddings Visualization

An interactive React application that visualizes word embeddings in 2D space using t-SNE (t-distributed Stochastic Neighbor Embedding).

## Features

- **Interactive Word Management**: Add, remove, and edit words directly in the UI
- **OpenAI Embeddings**: Fetches embeddings from OpenAI's `text-embedding-3-small` model (1536D)
- **t-SNE Visualization**: Reduces high-dimensional embeddings to 2D for visualization
- **Canvas Rendering**: Interactive canvas visualization showing word relationships
- **Color-Coded**: Each word gets a unique color for easy identification
- **Secure Backend**: API keys are kept server-side, never exposed to the browser
- Built with React 19, Vite, and @thi.ng/tsne

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
3. Serve both the React frontend and API endpoints from the same server

Open your browser to `http://localhost:5132`

**For development with hot reloading (optional):**

If you want to develop with Vite's hot module replacement, you can run two terminals:
```bash
# Terminal 1: Backend server
node server.js

# Terminal 2: Vite dev server
npm run dev
```

Then visit `http://localhost:5123` (Vite will proxy API calls to port 5132)

## How It Works

1. **Interactive UI**: Add, remove, or edit words using the built-in word management interface
2. **Backend API**: A Node.js/Express server (`server.js`) handles OpenAI API calls securely
3. **Fetch Embeddings**: When you click "Visualize Embeddings", the app sends your word list to `/embedding`
4. **Dimensionality Reduction**: t-SNE reduces the 1536-dimensional vectors to 2D over 1000 iterations
5. **Visualization**: The 2D coordinates are rendered on an HTML canvas with color-coded labels

## Technologies

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **@thi.ng/tsne** - Modern, actively-maintained t-SNE implementation
- **OpenAI API** - For generating text embeddings
- **HTML Canvas** - For rendering the visualization

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

- `server.js` - Express backend API server
- `src/InteractiveTSNEVisualization.jsx` - Interactive visualization component with word management UI
- `src/TSNEVisualization.jsx` - Basic visualization component (non-interactive, for reference)
- `src/App.jsx` - App wrapper
- `visualize.js` - Original Node.js script (for reference)
- `vite.config.js` - Vite configuration with API proxy

## Usage

The application starts with four default words: "King", "Man", "Queen", "Woman" (the classic word embedding example).

**To add a word:**
1. Type the word in the input field
2. Click "Add" or press Enter
3. Click "Visualize Embeddings" to update the visualization

**To edit a word:**
1. Click the "Edit" button next to the word
2. Type the new word
3. Click "Save" or press Enter

**To remove a word:**
1. Click the "Remove" button next to the word
2. (Minimum 2 words required for visualization)

Each word is color-coded and displayed on a 2D canvas where similar words appear closer together in semantic space.

## License

MIT
