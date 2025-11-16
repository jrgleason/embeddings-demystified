import express from "express";
import ViteExpress from "vite-express";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {ChatOllama, OllamaEmbeddings} from "@langchain/ollama";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://10.0.0.9:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3:0.6b";
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "qwen3-embedding:0.6b";

const llm = new ChatOllama({
  baseUrl: OLLAMA_BASE_URL,
  model: OLLAMA_MODEL,
  temperature: 0.2,
  maxRetries: 2,
});

const embeddings = new OllamaEmbeddings({
  model: OLLAMA_EMBEDDING_MODEL,
  baseUrl: OLLAMA_BASE_URL, // Default value
});

const systemPrompt = new SystemMessage("You are a helpful assistant.");

// Use an object to hold the vector store so we can replace it
let vectorStore = new MemoryVectorStore(embeddings);

const app = express();

// Basic request logger to verify which process handles requests
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Parse JSON request bodies
app.use(express.json());

app.get("/message", (_, res) => res.send("Hello from express!"));


// POST /ai { prompt: string }
app.post("/ai", async (req, res) => {
  const { prompt } = req.body || {};
  if (prompt == null || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is empty" });
  }
  try {
    const result = await llm.invoke([systemPrompt, new HumanMessage(prompt)]);
    const content = Array.isArray(result.content)
      ? result.content.map((c) => (typeof c === "string" ? c : c.text ?? "")).join("")
      : result.content;
    return res.json({ model: OLLAMA_MODEL, baseUrl: OLLAMA_BASE_URL, output: content });
  } catch (err) {
    return res.status(502).json({ error: "Ollama request failed", details: String(err) });
  }
});

// POST /vectorstore/add - Add a prompt to the vector store
app.post("/vectorstore/add", async (req, res) => {
  const { prompt } = req.body || {};
  if (prompt == null || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is empty" });
  }
  try {
    // Generate embedding
    const vector = await embeddings.embedQuery(prompt);

    // Add vector and document to vector store
    // Note: addVectors expects arrays for both parameters
    await vectorStore.addVectors(
      [vector],
      [{ pageContent: prompt, metadata: { timestamp: new Date().toISOString() } }]
    );

    return res.json({
      success: true,
      message: "Prompt added to vector store",
      prompt,
      embedding: vector,
      embeddingDimension: vector.length
    });
  } catch (err) {
    return res.status(502).json({ error: "Failed to add to vector store", details: String(err) });
  }
});

// POST /vectorstore/clear - Clear the vector store
app.post("/vectorstore/clear", async (req, res) => {
  try {
    // Create a new empty vector store to replace the old one
    vectorStore = new MemoryVectorStore(embeddings);
    return res.json({
      success: true,
      message: "Vector store cleared"
    });
  } catch (err) {
    return res.status(502).json({ error: "Failed to clear vector store", details: String(err) });
  }
});

// POST /vectorstore/similarity - Find similar prompts
app.post("/vectorstore/similarity", async (req, res) => {
  const { prompt, k = 5 } = req.body || {};
  if (prompt == null || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is empty" });
  }
  try {
    // Perform similarity search with scores
    const results = await vectorStore.similaritySearchWithScore(prompt, k);

    // Format results
    const formattedResults = results.map(([doc, score]) => ({
      content: doc.pageContent,
      score: score,
      metadata: doc.metadata
    }));

    return res.json({
      query: prompt,
      results: formattedResults,
      count: formattedResults.length
    });
  } catch (err) {
    return res.status(502).json({ error: "Failed to search vector store", details: String(err) });
  }
});

// Legacy endpoint - kept for backwards compatibility
app.post("/ai/embedding", async (req, res) => {
  const { prompt } = req.body || {};
  if (prompt == null || typeof prompt !== "string" || prompt.trim() === "") {
    return res.status(400).json({ error: "Prompt is empty" });
  }
  try {
    const vector = await embeddings.embedQuery(prompt);
    return res.json(vector);
  } catch (err) {
    return res.status(502).json({ error: "Ollama request failed", details: String(err) });
  }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));