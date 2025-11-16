import OpenAI from "openai";

// Override environment variables to use real OpenAI (not Ollama)
const openai = new OpenAI();

const base = {
  model: "text-embedding-3-small",
  encoding_format: "float",
};
const response = await openai.embeddings.create({
  ...base,
  input: ["King", "Man", "Queen", "Woman"]
});

const [kingEmbed, manEmbed, queenEmbed, womanEmbed] = response.data;
console.log({ name: "King", value: kingEmbed}, {name: "Man", value: manEmbed}, {name: "Queen", value: queenEmbed}, {name: "Woman", value: womanEmbed});