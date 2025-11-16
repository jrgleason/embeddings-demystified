import { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Alert, Box, Chip } from '@mui/material';

export default function VectorStore() {
    const [prompt, setPrompt] = useState('');
    const [searchPrompt, setSearchPrompt] = useState('');
    const [k, setK] = useState(5);
    const [addResult, setAddResult] = useState(null);
    const [searchResults, setSearchResults] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAddPrompt = async () => {
        if (!prompt.trim()) {
            setError('Prompt cannot be empty');
            return;
        }

        setLoading(true);
        setError(null);
        setAddResult(null);

        try {
            const response = await fetch('/vectorstore/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add prompt');
            }

            setAddResult(data);
            setPrompt('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleClearStore = async () => {
        setLoading(true);
        setError(null);
        setAddResult(null);
        setSearchResults(null);

        try {
            const response = await fetch('/vectorstore/clear', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to clear store');
            }

            setAddResult({ success: true, message: data.message });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSimilarity = async () => {
        if (!searchPrompt.trim()) {
            setError('Search prompt cannot be empty');
            return;
        }

        setLoading(true);
        setError(null);
        setSearchResults(null);

        try {
            const response = await fetch('/vectorstore/similarity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: searchPrompt, k })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to search');
            }

            setSearchResults(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Typography variant="h4" component="h1" gutterBottom>
                Vector Store Demo
            </Typography>

            {error && (
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Add Prompt Section */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Add Prompt to Vector Store
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Enter a prompt to embed and store..."
                        />
                        <Button
                            variant="contained"
                            onClick={handleAddPrompt}
                            disabled={loading || !prompt.trim()}
                        >
                            Add Prompt
                        </Button>
                    </Box>

                    {addResult && addResult.embedding && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="success">
                                {addResult.message}
                            </Alert>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Embedding dimension: {addResult.embeddingDimension}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, wordBreak: 'break-all' }}>
                                Vector: [{addResult.embedding.slice(0, 5).map(v => v.toFixed(4)).join(', ')}...]
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Search Similarity Section */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Search Similar Prompts
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Search Prompt"
                            value={searchPrompt}
                            onChange={(e) => setSearchPrompt(e.target.value)}
                            placeholder="Enter a prompt to find similar ones..."
                        />
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <TextField
                                type="number"
                                label="Number of results (k)"
                                value={k}
                                onChange={(e) => setK(parseInt(e.target.value) || 5)}
                                sx={{ width: 200 }}
                                inputProps={{ min: 1, max: 20 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearchSimilarity}
                                disabled={loading || !searchPrompt.trim()}
                            >
                                Search
                            </Button>
                        </Box>
                    </Box>

                    {searchResults && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1" gutterBottom>
                                Found {searchResults.count} results for: "{searchResults.query}"
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                                {searchResults.results.map((result, index) => (
                                    <Card key={index} variant="outlined">
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Chip
                                                    label={`Score: ${result.score.toFixed(4)}`}
                                                    size="small"
                                                    color={result.score < 0.5 ? 'success' : 'default'}
                                                />
                                                {result.metadata?.timestamp && (
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(result.metadata.timestamp).toLocaleString()}
                                                    </Typography>
                                                )}
                                            </Box>
                                            <Typography variant="body1">
                                                {result.content}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>

            {/* Clear Store Section */}
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Clear Vector Store
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        This will remove all prompts from the vector store. This action cannot be undone.
                    </Typography>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={handleClearStore}
                        disabled={loading}
                    >
                        Clear Store
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
