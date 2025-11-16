import { useState, useEffect, useRef } from 'react';
import { TSNE } from '@thi.ng/tsne';

const InteractiveTSNEVisualization = () => {
  const canvasRef = useRef(null);
  const [words, setWords] = useState(['King', 'Man', 'Queen', 'Woman']);
  const [newWord, setNewWord] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [status, setStatus] = useState('Ready to visualize');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const addWord = () => {
    if (newWord.trim() && !words.includes(newWord.trim())) {
      setWords([...words, newWord.trim()]);
      setNewWord('');
      setData(null); // Clear visualization
    }
  };

  const removeWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
    setData(null); // Clear visualization
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingValue(words[index]);
  };

  const saveEdit = (index) => {
    if (editingValue.trim() && !words.includes(editingValue.trim())) {
      const newWords = [...words];
      newWords[index] = editingValue.trim();
      setWords(newWords);
      setData(null); // Clear visualization
    }
    setEditingIndex(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingValue('');
  };

  const visualize = async () => {
    if (words.length < 2) {
      setError('Please add at least 2 words to visualize');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setStatus('Fetching embeddings from backend...');

      // Call our backend API
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
      const perplexity = Math.min(Math.max(2, Math.floor(words.length / 3)), 30);
      const tsne = new TSNE(embeddings, {
        dim: 2,
        perplexity,
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
    } finally {
      setIsLoading(false);
    }
  };

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

  // Generate color for each word
  const getColor = (index) => {
    const colors = [
      '#e74c3c', '#3498db', '#e67e22', '#9b59b6',
      '#2ecc71', '#f1c40f', '#1abc9c', '#34495e',
      '#e91e63', '#00bcd4', '#ff5722', '#795548'
    ];
    return colors[index % colors.length];
  };

  // Draw visualization on canvas
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { words: dataWords, points } = data;

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

    // Draw points and labels
    points.forEach((point, i) => {
      const x = toCanvasX(point[0]);
      const y = toCanvasY(point[1]);

      // Draw circle
      ctx.fillStyle = getColor(i);
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Draw word label
      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(dataWords[i], x, y - 15);

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

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '30px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', marginBottom: '10px' }}>
        Interactive Word Embeddings Visualization
      </h1>

      {/* Word Management Section */}
      <div style={{
        width: '600px',
        marginBottom: '20px',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: 'white'
      }}>
        <h3 style={{ marginTop: 0 }}>Manage Words</h3>

        {/* Add new word */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addWord()}
            placeholder="Add a new word..."
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white',
              color: 'black'
            }}
          />
          <button
            onClick={addWord}
            disabled={!newWord.trim() || isLoading}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Add
          </button>
        </div>

        {/* Word list */}
        <div style={{ marginBottom: '15px' }}>
          {words.map((word, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px',
                marginBottom: '5px',
                backgroundColor: '#f9f9f9',
                borderRadius: '4px',
                borderLeft: `4px solid ${getColor(index)}`
              }}
            >
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') saveEdit(index);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      border: '1px solid #3498db',
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                      color: 'black'
                    }}
                    autoFocus
                  />
                  <button
                    onClick={() => saveEdit(index)}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#2ecc71',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontSize: '14px', color: '#333' }}>{word}</span>
                  <button
                    onClick={() => startEditing(index)}
                    disabled={isLoading}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#f1c40f',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeWord(index)}
                    disabled={isLoading || words.length <= 2}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      opacity: words.length <= 2 ? 0.5 : 1
                    }}
                  >
                    Remove
                  </button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Visualize button */}
        <button
          onClick={visualize}
          disabled={isLoading || words.length < 2}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isLoading ? '#95a5a6' : '#9b59b6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Processing...' : 'Visualize Embeddings'}
        </button>
      </div>

      {/* Status */}
      <p style={{
        color: error ? '#e74c3c' : '#666',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        {error || status}
      </p>

      {/* Canvas */}
      {data && (
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
      )}

      {data && (
        <div style={{
          marginTop: '20px',
          fontSize: '14px',
          color: '#666',
          textAlign: 'left',
          maxWidth: '600px'
        }}>
          <p><strong>Model:</strong> text-embedding-3-small</p>
          <p><strong>Words Count:</strong> {data.words.length}</p>
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

export default InteractiveTSNEVisualization;
