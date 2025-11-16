import { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Box,
  Chip,
  Paper
} from '@mui/material';

export default function EmbeddingDisplay() {
  const [prompt, setPrompt] = useState('');
  const [embedding, setEmbedding] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateEmbedding = async () => {
    if (!prompt.trim()) {
      setError('Prompt cannot be empty');
      return;
    }

    setLoading(true);
    setError(null);
    setEmbedding(null);

    try {
      const response = await fetch('/embedding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: prompt })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate embedding');
      }

      // Extract the first (and only) embedding from the response
      const embeddingData = data.data[0].embedding;
      setEmbedding({
        vector: embeddingData,
        dimension: embeddingData.length,
        prompt: prompt,
        model: data.model
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateEmbedding();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Typography variant="h4" component="h1" gutterBottom>
        Embedding Display
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Enter text to generate and view its embedding vector
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Input Section */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Generate Embedding
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Text Prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter text to embed..."
              disabled={loading}
            />
            <Button
              variant="contained"
              onClick={generateEmbedding}
              disabled={loading || !prompt.trim()}
            >
              {loading ? 'Generating...' : 'Generate Embedding'}
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Embedding Display Section */}
      {embedding && (
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Embedding Vector
              </Typography>
              <Chip
                label={`Dimension: ${embedding.dimension}`}
                color="primary"
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Model:</strong> {embedding.model}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Prompt:</strong> {embedding.prompt}
              </Typography>
            </Box>

            {/* Scrollable embedding vector display */}
            <Paper
              sx={{
                p: 2,
                maxHeight: 400,
                overflow: 'auto',
                backgroundColor: '#f5f5f5',
                fontFamily: 'monospace'
              }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                First 10 values:
              </Typography>
              <Box sx={{ mb: 2, p: 1, backgroundColor: 'white', borderRadius: 1 }}>
                {embedding.vector.slice(0, 10).map((value, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, py: 0.5 }}>
                    <Typography variant="body2" color="primary" sx={{ minWidth: 40 }}>
                      [{index}]:
                    </Typography>
                    <Typography variant="body2">
                      {value.toFixed(6)}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Full vector ({embedding.dimension} dimensions):
              </Typography>
              <Box sx={{ p: 1, backgroundColor: 'white', borderRadius: 1, wordBreak: 'break-all' }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                  [{embedding.vector.map(v => v.toFixed(6)).join(', ')}]
                </Typography>
              </Box>
            </Paper>

            {/* Statistics */}
            <Box sx={{ mt: 2, p: 2, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Vector Statistics
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Min Value
                  </Typography>
                  <Typography variant="body2">
                    {Math.min(...embedding.vector).toFixed(6)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Max Value
                  </Typography>
                  <Typography variant="body2">
                    {Math.max(...embedding.vector).toFixed(6)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Mean Value
                  </Typography>
                  <Typography variant="body2">
                    {(embedding.vector.reduce((a, b) => a + b, 0) / embedding.vector.length).toFixed(6)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
