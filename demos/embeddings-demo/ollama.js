import { OllamaEmbeddings } from "@langchain/ollama";
(async ()=>{
    console.log("Starting embedding test...");
    const embeddings = new OllamaEmbeddings({
        model: "qwen3-embedding:0.6b",
        baseUrl: "http://localhost:11434", // Default value
    });
    console.log("Getting the vector for 'Hello world'...");
    const vector = await embeddings.embedQuery("Hello world");
    console.log("Vector size", vector.length);
})();