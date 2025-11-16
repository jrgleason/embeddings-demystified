import OpenAI from "openai";
import { TSNE } from "@thi.ng/tsne";
import fs from "fs";

// Override environment variables to use real OpenAI (not Ollama)
const openai = new OpenAI({
  baseURL: "https://api.openai.com/v1",
  apiKey: process.env.OPENAI_API_KEY
});

console.log("Fetching embeddings from OpenAI...");

// Get embeddings for our words
const response = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: ["King", "Man", "Queen", "Woman"],
  encoding_format: "float",
});

// Extract embeddings
const words = ["King", "Man", "Queen", "Woman"];
const embeddings = response.data.map(d => d.embedding);

console.log(`Got ${embeddings.length} embeddings of dimension ${embeddings[0].length}`);

console.log("Running t-SNE algorithm...");

// Create t-SNE instance with embeddings
const tsne = new TSNE(embeddings, {
  dim: 2,                    // Output dimensions (2D for visualization)
  perplexity: 2,             // Small perplexity for small dataset (typically 5-50)
  epsilon: 10,               // Learning rate (similar to learningRate in tsne-js)
  exaggeration: 4.0,         // Early exaggeration (spacing between clusters)
});

// Run t-SNE iterations
const maxIter = 1000;
let cost = 0;
for (let i = 0; i < maxIter; i++) {
  cost = tsne.update();
  if (i % 100 === 0) {
    console.log(`Iteration ${i}, cost: ${cost.toFixed(4)}`);
  }
}
console.log(`t-SNE completed after ${maxIter} iterations with final cost ${cost.toFixed(4)}`);

// Get the 2D output - tsne.points contains the result
const rawOutput = tsne.points;

// Scale output to [-1, 1] range for visualization
function scaleToRange(points) {
  const mins = [Infinity, Infinity];
  const maxs = [-Infinity, -Infinity];

  // Find min/max for each dimension
  points.forEach(p => {
    mins[0] = Math.min(mins[0], p[0]);
    mins[1] = Math.min(mins[1], p[1]);
    maxs[0] = Math.max(maxs[0], p[0]);
    maxs[1] = Math.max(maxs[1], p[1]);
  });

  const ranges = [maxs[0] - mins[0], maxs[1] - mins[1]];
  const maxRange = Math.max(...ranges);

  // Scale to [-1, 1]
  return points.map(p => [
    2 * (p[0] - mins[0]) / maxRange - 1,
    2 * (p[1] - mins[1]) / maxRange - 1
  ]);
}

const output = scaleToRange(rawOutput);

console.log("\n2D Coordinates:");
words.forEach((word, i) => {
  console.log(`${word}: [${output[i][0].toFixed(4)}, ${output[i][1].toFixed(4)}]`);
});

// Create HTML visualization
const html = `<!DOCTYPE html>
<html>
<head>
  <title>Word Embeddings t-SNE Visualization</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 {
      text-align: center;
      color: #333;
    }
    #canvas {
      border: 1px solid #ddd;
      background: white;
    }
    .info {
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Word Embeddings Visualization (t-SNE)</h1>
    <canvas id="canvas" width="600" height="600"></canvas>
    <div class="info">
      <p><strong>Model:</strong> text-embedding-3-small</p>
      <p><strong>Words:</strong> ${words.join(", ")}</p>
      <p><strong>Original Dimensions:</strong> ${embeddings[0].length}</p>
      <p><strong>Reduced to:</strong> 2D using t-SNE</p>
    </div>
  </div>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const data = ${JSON.stringify(
      words.map((word, i) => ({
        word,
        x: output[i][0],
        y: output[i][1]
      }))
    )};

    // Scale coordinates to canvas
    const padding = 80;
    const scale = (canvas.width - 2 * padding) / 2; // scale from [-1,1] to canvas

    function toCanvasX(x) {
      return canvas.width / 2 + x * scale;
    }

    function toCanvasY(y) {
      return canvas.height / 2 - y * scale; // flip Y axis
    }

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height / 2);
    ctx.lineTo(canvas.width - padding, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, padding);
    ctx.lineTo(canvas.width / 2, canvas.height - padding);
    ctx.stroke();

    // Draw points and labels
    data.forEach((point, i) => {
      const x = toCanvasX(point.x);
      const y = toCanvasY(point.y);

      // Choose color based on word
      const colors = ['#e74c3c', '#3498db', '#e67e22', '#9b59b6'];
      ctx.fillStyle = colors[i];

      // Draw circle
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(point.word, x, y - 15);

      // Draw coordinates
      ctx.fillStyle = '#999';
      ctx.font = '10px Arial';
      ctx.fillText(
        \`(\${point.x.toFixed(2)}, \${point.y.toFixed(2)})\`,
        x, y + 25
      );
    });
  </script>
</body>
</html>`;

// Save HTML file
fs.writeFileSync('tsne-visualization.html', html);
console.log("\nVisualization saved to: tsne-visualization.html");
console.log("Open this file in your browser to see the 2D plot!");
