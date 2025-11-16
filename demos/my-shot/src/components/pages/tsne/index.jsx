import { useState, useEffect, useRef } from 'react';
import { TSNE } from '@thi.ng/tsne';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Box,
  Chip,
  IconButton,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function TSNEVisualization() {
  const canvasRef = useRef(null);
  const [words, setWords] = useState(['King', 'Man', 'Queen', 'Woman']);
  const [newWord, setNewWord] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [status, setStatus] = useState('Ready to visualize');
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const addWord = () => {
    if (newWord.trim() && !words.includes(newWord.trim())) {
      setWords([...words, newWord.trim()]);
      setNewWord('');
      setData(null);
    }
  };

  const removeWord = (index) => {
    setWords(words.filter((_, i) => i !== index));
    setData(null);
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
      setData(null);
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
      setLoading(true);
      setError(null);
      setStatus('Fetching embeddings from backend...');

      const response = await fetch('/embedding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: words,
          model: 'qwen3-embedding:0.6b'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch embeddings');
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
      setLoading(false);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <Typography variant="h4" component="h1" gutterBottom>
        t-SNE Word Embeddings Visualization
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Alert severity="info">
        {status}
      </Alert>

      {/* Word Management Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Manage Words
          </Typography>

          {/* Add new word */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              fullWidth
              label="Add a new word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addWord()}
              placeholder="Enter a word..."
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={addWord}
              disabled={!newWord.trim() || loading}
              sx={{ minWidth: 100 }}
            >
              Add
            </Button>
          </Box>

          {/* Word list */}
          <Stack spacing={1} sx={{ mb: 2 }}>
            {words.map((word, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  p: 1,
                  backgroundColor: '#f9f9f9',
                  borderRadius: 1,
                  borderLeft: `4px solid ${getColor(index)}`
                }}
              >
                {editingIndex === index ? (
                  <>
                    <TextField
                      fullWidth
                      size="small"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') saveEdit(index);
                        if (e.key === 'Escape') cancelEdit();
                      }}
                      autoFocus
                    />
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => saveEdit(index)}
                    >
                      Save
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={cancelEdit}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography sx={{ flex: 1 }}>{word}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => startEditing(index)}
                      disabled={loading}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeWord(index)}
                      disabled={loading || words.length <= 2}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </>
                )}
              </Box>
            ))}
          </Stack>

          {/* Visualize button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={visualize}
            disabled={loading || words.length < 2}
          >
            {loading ? 'Processing...' : 'Visualize Embeddings'}
          </Button>
        </CardContent>
      </Card>

      {/* Canvas */}
      {data && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
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
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Model:</strong> qwen3-embedding:0.6b
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Words Count:</strong> {data.words.length}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Original Dimensions:</strong> {data.embedDim}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Reduced to:</strong> 2D using t-SNE
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                Similar words should appear closer together in the 2D space
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
