import express from "express";
import ViteExpress from "vite-express";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import {ChatOllama, OllamaEmbeddings} from "@langchain/ollama";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen3:0.6b";
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || "qwen3-embedding:0.6b";

// Log configuration at startup
console.log("=== Ollama Configuration ===");
console.log(`  Base URL: ${OLLAMA_BASE_URL}`);
console.log(`  Chat Model: ${OLLAMA_MODEL}`);
console.log(`  Embedding Model: ${OLLAMA_EMBEDDING_MODEL}`);
console.log("============================");

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
  console.log("[/ai] Request received:", { prompt: prompt?.substring(0, 50) });

  if (prompt == null || typeof prompt !== "string" || prompt.trim() === "") {
    console.log("[/ai] Error: Prompt is empty");
    return res.status(400).json({ error: "Prompt is empty" });
  }
  try {
    console.log(`[/ai] Calling ${OLLAMA_MODEL} at ${OLLAMA_BASE_URL}...`);
    const startTime = Date.now();

    const result = await llm.invoke([systemPrompt, new HumanMessage(prompt)]);
    const content = Array.isArray(result.content)
      ? result.content.map((c) => (typeof c === "string" ? c : c.text ?? "")).join("")
      : result.content;

    const elapsed = Date.now() - startTime;
    console.log(`[/ai] Success in ${elapsed}ms, response length: ${content.length}`);

    return res.json({ model: OLLAMA_MODEL, baseUrl: OLLAMA_BASE_URL, output: content });
  } catch (err) {
    console.error("[/ai] ERROR:", err.message);
    console.error("[/ai] Full error:", err);
    if (err.cause) {
      console.error("[/ai] Cause:", err.cause);
    }
    return res.status(502).json({ error: "Ollama request failed", details: String(err) });
  }
});

// POST /vectorstore/add - Add a prompt to the vector store
app.post("/vectorstore/add", async (req, res) => {
  const { prompt } = req.body || {};
  console.log("[/vectorstore/add] Request received:", { prompt: prompt?.substring(0, 50) });

  if (prompt == null || typeof prompt !== "string" || prompt.trim() === "") {
    console.log("[/vectorstore/add] Error: Prompt is empty");
    return res.status(400).json({ error: "Prompt is empty" });
  }
  try {
    console.log(`[/vectorstore/add] Generating embedding via ${OLLAMA_BASE_URL}...`);
    const startTime = Date.now();

    // Generate embedding
    const vector = await embeddings.embedQuery(prompt);

    const elapsed = Date.now() - startTime;
    console.log(`[/vectorstore/add] Embedding generated in ${elapsed}ms (dim=${vector.length})`);

    // Add vector and document to vector store
    // Note: addVectors expects arrays for both parameters
    await vectorStore.addVectors(
      [vector],
      [{ pageContent: prompt, metadata: { timestamp: new Date().toISOString() } }]
    );

    console.log("[/vectorstore/add] Success: Added to vector store");

    return res.json({
      success: true,
      message: "Prompt added to vector store",
      prompt,
      embedding: vector,
      embeddingDimension: vector.length
    });
  } catch (err) {
    console.error("[/vectorstore/add] ERROR:", err.message);
    console.error("[/vectorstore/add] Full error:", err);
    if (err.cause) {
      console.error("[/vectorstore/add] Cause:", err.cause);
    }
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
  console.log("[/vectorstore/similarity] Request received:", { prompt: prompt?.substring(0, 50), k });

  if (prompt == null || typeof prompt !== "string" || prompt.trim() === "") {
    console.log("[/vectorstore/similarity] Error: Prompt is empty");
    return res.status(400).json({ error: "Prompt is empty" });
  }
  try {
    console.log(`[/vectorstore/similarity] Searching for top ${k} similar...`);
    const startTime = Date.now();

    // Perform similarity search with scores
    const results = await vectorStore.similaritySearchWithScore(prompt, k);

    const elapsed = Date.now() - startTime;
    console.log(`[/vectorstore/similarity] Found ${results.length} results in ${elapsed}ms`);

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
    console.error("[/vectorstore/similarity] ERROR:", err.message);
    console.error("[/vectorstore/similarity] Full error:", err);
    if (err.cause) {
      console.error("[/vectorstore/similarity] Cause:", err.cause);
    }
    return res.status(502).json({ error: "Failed to search vector store", details: String(err) });
  }
});

// POST /embedding - Batch embeddings endpoint (OpenAI-compatible format)
app.post("/embedding", async (req, res) => {
  const { input, model } = req.body || {};

  console.log("[/embedding] Request received:", { input: typeof input === 'string' ? input.substring(0, 50) + '...' : `Array(${input?.length})`, model });

  // Support both single string and array of strings
  const inputs = Array.isArray(input) ? input : [input];

  if (!inputs.length || inputs.some(i => typeof i !== "string" || i.trim() === "")) {
    console.log("[/embedding] Error: Invalid input");
    return res.status(400).json({ error: "Input must be a non-empty string or array of strings" });
  }

  // Use provided model or default
  const embeddingModel = model || OLLAMA_EMBEDDING_MODEL;

  console.log(`[/embedding] Using model: ${embeddingModel} at ${OLLAMA_BASE_URL}`);

  try {
    // Create embeddings instance with the selected model
    const modelEmbeddings = new OllamaEmbeddings({
      model: embeddingModel,
      baseUrl: OLLAMA_BASE_URL,
    });

    console.log(`[/embedding] Generating embeddings for ${inputs.length} input(s)...`);
    const startTime = Date.now();

    // Generate embeddings for all inputs
    const embeddingPromises = inputs.map(text => modelEmbeddings.embedQuery(text));
    const vectors = await Promise.all(embeddingPromises);

    const elapsed = Date.now() - startTime;
    console.log(`[/embedding] Success: Generated ${vectors.length} embedding(s) in ${elapsed}ms (dim=${vectors[0]?.length})`);

    // Format response to match OpenAI API format
    const data = vectors.map((embedding, index) => ({
      object: "embedding",
      index: index,
      embedding: embedding
    }));

    return res.json({
      object: "list",
      data: data,
      model: embeddingModel
    });
  } catch (err) {
    console.error("[/embedding] ERROR:", err.message);
    console.error("[/embedding] Full error:", err);
    if (err.cause) {
      console.error("[/embedding] Cause:", err.cause);
    }
    return res.status(502).json({ error: "Ollama request failed", details: String(err) });
  }
});

// Legacy endpoint - kept for backwards compatibility
app.post("/ai/embedding", async (req, res) => {
  const { prompt } = req.body || {};
  console.log("[/ai/embedding] Request received:", { prompt: prompt?.substring(0, 50) });

  if (prompt == null || typeof prompt !== "string" || prompt.trim() === "") {
    console.log("[/ai/embedding] Error: Prompt is empty");
    return res.status(400).json({ error: "Prompt is empty" });
  }
  try {
    console.log(`[/ai/embedding] Generating embedding via ${OLLAMA_BASE_URL}...`);
    const startTime = Date.now();

    const vector = await embeddings.embedQuery(prompt);

    const elapsed = Date.now() - startTime;
    console.log(`[/ai/embedding] Success in ${elapsed}ms (dim=${vector.length})`);

    return res.json(vector);
  } catch (err) {
    console.error("[/ai/embedding] ERROR:", err.message);
    console.error("[/ai/embedding] Full error:", err);
    if (err.cause) {
      console.error("[/ai/embedding] Cause:", err.cause);
    }
    return res.status(502).json({ error: "Ollama request failed", details: String(err) });
  }
});

ViteExpress.listen(app, 3000, () => console.log("Server is listening..."));