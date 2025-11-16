import { useState, useEffect, useRef } from 'react';
import { TSNE } from '@thi.ng/tsne';

const TSNEVisualization = () => {
  const canvasRef = useRef(null);
  const [status, setStatus] = useState('Initializing...');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAndVisualize = async () => {
      try {
        setStatus('Fetching embeddings from backend...');

        // Get embeddings for our words
        const words = ['King', 'Man', 'Queen', 'Woman'];

        // Call our backend API instead of OpenAI directly
        // Uses relative URL - Vite proxy will forward to backend
        const response = await fetch('/embedding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            input: words,
            model: 'text-embedding-3-small'
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch embeddings');
        }

        const result = await response.json();
        const embeddings = result.data.map(d => d.embedding);
        setStatus(`Got ${embeddings.length} embeddings of dimension ${embeddings[0].length}`);

        // Run t-SNE
        setStatus('Running t-SNE algorithm...');
        const tsne = new TSNE(embeddings, {
          dim: 2,
          perplexity: 2,
          epsilon: 10,
          exaggeration: 4.0,
        });

        const maxIter = 1000;
        for (let i = 0; i < maxIter; i++) {
          const cost = tsne.update();
          if (i % 100 === 0) {
            setStatus(`t-SNE iteration ${i}/${maxIter}, cost: ${cost.toFixed(4)}`);
          }
        }

        // Scale output to [-1, 1] range
        const rawOutput = tsne.points;
        const scaled = scaleToRange(rawOutput);

        setData({
          words,
          points: scaled,
          embedDim: embeddings[0].length
        });
        setStatus('Visualization complete!');
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setStatus('Error occurred');
      }
    };

    fetchAndVisualize();
  }, []);

  // Scale points to [-1, 1] range
  const scaleToRange = (points) => {
    const mins = [Infinity, Infinity];
    const maxs = [-Infinity, -Infinity];

    points.forEach(p => {
      mins[0] = Math.min(mins[0], p[0]);
      mins[1] = Math.min(mins[1], p[1]);
      maxs[0] = Math.max(maxs[0], p[0]);
      maxs[1] = Math.max(maxs[1], p[1]);
    });

    const ranges = [maxs[0] - mins[0], maxs[1] - mins[1]];
    const maxRange = Math.max(...ranges);

    return points.map(p => [
      2 * (p[0] - mins[0]) / maxRange - 1,
      2 * (p[1] - mins[1]) / maxRange - 1
    ]);
  };

  // Draw visualization on canvas
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { words, points } = data;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Settings
    const padding = 80;
    const scale = (canvas.width - 2 * padding) / 2;

    const toCanvasX = (x) => canvas.width / 2 + x * scale;
    const toCanvasY = (y) => canvas.height / 2 - y * scale;

    // Draw axes
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, canvas.height / 2);
    ctx.lineTo(canvas.width - padding, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, padding);
    ctx.lineTo(canvas.width / 2, canvas.height - padding);
    ctx.stroke();

    // Colors for each word
    const colors = ['#e74c3c', '#3498db', '#e67e22', '#9b59b6'];

    // Draw points and labels
    points.forEach((point, i) => {
      const x = toCanvasX(point[0]);
      const y = toCanvasY(point[1]);

      // Draw circle
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw word label
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(words[i], x, y - 15);

      // Draw coordinates
      ctx.fillStyle = '#999';
      ctx.font = '10px Arial';
      ctx.fillText(
        `(${point[0].toFixed(2)}, ${point[1].toFixed(2)})`,
        x,
        y + 25
      );
    });
  }, [data]);

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2 style={{ color: '#e74c3c' }}>Error</h2>
        <p>{error}</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Make sure the backend server is running and OPENAI_API_KEY is set
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>
        Word Embeddings Visualization (t-SNE)
      </h1>

      <p style={{
        color: '#666',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        {status}
      </p>

      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: 'white'
        }}
      />

      {data && (
        <div style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#666',
          textAlign: 'left',
          maxWidth: '600px'
        }}>
          <p><strong>Model:</strong> text-embedding-3-small</p>
          <p><strong>Words:</strong> {data.words.join(', ')}</p>
          <p><strong>Original Dimensions:</strong> {data.embedDim}</p>
          <p><strong>Reduced to:</strong> 2D using t-SNE</p>
          <p style={{ marginTop: '10px', fontSize: '12px', fontStyle: 'italic' }}>
            Similar words should appear closer together in the 2D space
          </p>
        </div>
      )}
    </div>
  );
};

export default TSNEVisualization;
