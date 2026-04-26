import {useEffect, useRef, useState} from 'react';
import {TSNE} from '@thi.ng/tsne';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControlLabel,
    IconButton,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export default function TSNEVisualization() {
    const canvasRef = useRef(null);
    const [words, setWords] = useState(['King', 'Queen', 'Man', 'Woman']);
    const [newWord, setNewWord] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingValue, setEditingValue] = useState('');
    const [status, setStatus] = useState('Ready to visualize');
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Visualization layer toggles
    const [showConnectingLines, setShowConnectingLines] = useState(false);
    const [showAngles, setShowAngles] = useState(false);
    const [applyNormalization, setApplyNormalization] = useState(false);

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

            // Run t-SNE with empirically optimal parameters (Gove et al., 2022)
            setStatus('Running t-SNE algorithm...');
            const perplexity = Math.min(16, Math.floor(words.length / 2)); // Cap at 16, ensure < num points
            const tsne = new TSNE(embeddings, {
                dim: 2,
                perplexity,
                epsilon: 10,        // Learning rate (optimal: 10)
                exaggeration: 1.0,  // Exaggeration (optimal: 1)
            });

            const maxIter = 1000;
            for (let i = 0; i < maxIter; i++) {
                const cost = tsne.update();
                if (i % 100 === 0) {
                    setStatus(`t-SNE iteration ${i}/${maxIter}, cost: ${cost.toFixed(4)}`);
                }
            }

            // Store both raw and scaled outputs
            const rawOutput = tsne.points;
            const scaled = scaleToRange(rawOutput);

            setData({
                words,
                rawPoints: rawOutput,
                scaledPoints: scaled,
                embedDim: embeddings[0].length
            });
            setStatus('Visualization complete!');
        } catch (err) {
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

    // Calculate angle between two vectors (in degrees)
    const calculateAngle = (p1, p2) => {
        // Angle of each vector from positive x-axis
        const angle1 = Math.atan2(p1[1], p1[0]);
        const angle2 = Math.atan2(p2[1], p2[0]);

        // Difference in angles
        let diff = angle2 - angle1;

        // Normalize to [-π, π]
        while (diff > Math.PI) diff -= 2 * Math.PI;
        while (diff < -Math.PI) diff += 2 * Math.PI;

        // Convert to degrees
        return Math.abs(diff * 180 / Math.PI);
    };

    // Draw visualization on canvas
    useEffect(() => {
        if (!data || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const {words: dataWords, rawPoints, scaledPoints} = data;

        // Use raw or scaled points based on toggle
        const points = applyNormalization ? scaledPoints : rawPoints;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate dynamic scale based on actual point ranges
        const padding = 80;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Find min/max for dynamic scaling
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        points.forEach(p => {
            minX = Math.min(minX, p[0]);
            maxX = Math.max(maxX, p[0]);
            minY = Math.min(minY, p[1]);
            maxY = Math.max(maxY, p[1]);
        });

        const rangeX = maxX - minX;
        const rangeY = maxY - minY;
        const maxRange = Math.max(rangeX, rangeY);
        const scale = (canvas.width - 2 * padding) / maxRange;

        const toCanvasX = (x) => centerX + (x - (minX + maxX) / 2) * scale;
        const toCanvasY = (y) => centerY - (y - (minY + maxY) / 2) * scale;

        // Draw axes
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, centerY);
        ctx.lineTo(canvas.width - padding, centerY);
        ctx.moveTo(centerX, padding);
        ctx.lineTo(centerX, canvas.height - padding);
        ctx.stroke();

        // LAYER 1: Connecting lines between all points
        if (showConnectingLines) {
            ctx.strokeStyle = '#bbb';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);

            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const x1 = toCanvasX(points[i][0]);
                    const y1 = toCanvasY(points[i][1]);
                    const x2 = toCanvasX(points[j][0]);
                    const y2 = toCanvasY(points[j][1]);

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();

                    // Calculate and display distance
                    const dx = points[i][0] - points[j][0];
                    const dy = points[i][1] - points[j][1];
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    const midX = (x1 + x2) / 2;
                    const midY = (y1 + y2) / 2;

                    ctx.fillStyle = '#666';
                    ctx.font = '9px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(`d=${distance.toFixed(2)}`, midX, midY - 5);
                }
            }
            ctx.setLineDash([]);
        }

        // LAYER 2: Angles from origin
        if (showAngles) {
            // Draw lines from origin to each point
            points.forEach((point, i) => {
                const x = toCanvasX(point[0]);
                const y = toCanvasY(point[1]);

                ctx.strokeStyle = getColor(i);
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            });

            // Draw angles between vectors
            for (let i = 0; i < points.length; i++) {
                for (let j = i + 1; j < points.length; j++) {
                    const angle = calculateAngle(points[i], points[j]);

                    // Calculate position for angle label (between the two vectors)
                    const avgAngle = (Math.atan2(points[i][1], points[i][0]) +
                        Math.atan2(points[j][1], points[j][0])) / 2;
                    const labelRadius = 60;
                    const labelX = centerX + Math.cos(avgAngle) * labelRadius;
                    const labelY = centerY - Math.sin(avgAngle) * labelRadius;

                    // Draw angle arc
                    const startAngle = Math.atan2(-points[i][1], points[i][0]);
                    const endAngle = Math.atan2(-points[j][1], points[j][0]);
                    const arcRadius = 40;

                    ctx.strokeStyle = '#ff6b6b';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, arcRadius, startAngle, endAngle);
                    ctx.stroke();

                    // Draw angle label
                    ctx.fillStyle = '#ff6b6b';
                    ctx.font = 'bold 11px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText(
                        `${dataWords[i]}-${dataWords[j]}: ${angle.toFixed(1)}°`,
                        labelX,
                        labelY
                    );
                }
            }

            // Draw origin point
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillText('Origin (0,0)', centerX, centerY - 10);
        }

        // LAYER 0 (always visible): Points and labels
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
    }, [data, showConnectingLines, showAngles, applyNormalization]);

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
                    <Box sx={{display: 'flex', gap: 2, mb: 2}}>
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
                            sx={{minWidth: 100}}
                        >
                            Add
                        </Button>
                    </Box>

                    {/* Word list */}
                    <Stack spacing={1} sx={{mb: 2}}>
                        {words.map((word, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    p: 1,
                                    backgroundColor: 'action.hover',
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
                                        <Typography sx={{flex: 1}}>{word}</Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() => startEditing(index)}
                                            disabled={loading}
                                        >
                                            <EditIcon fontSize="small"/>
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            color="error"
                                            onClick={() => removeWord(index)}
                                            disabled={loading || words.length <= 2}
                                        >
                                            <DeleteIcon fontSize="small"/>
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
                        {/* Visualization Layer Controls */}
                        <Paper elevation={2} sx={{p: 2, mb: 3, backgroundColor: '#f5f5f5'}}>
                            <Typography variant="h6" gutterBottom>
                                Visualization Layers
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{display: 'block', mb: 2}}>
                                Toggle layers to see how vectors relate to each other
                            </Typography>
                            <Stack direction="row" spacing={3} flexWrap="wrap">
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={applyNormalization}
                                            onChange={(e) => setApplyNormalization(e.target.checked)}
                                            color="success"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                Apply Normalization
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Scale points to [-1, 1] range
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showConnectingLines}
                                            onChange={(e) => setShowConnectingLines(e.target.checked)}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                Connecting Lines
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Show distances between all points
                                            </Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={showAngles}
                                            onChange={(e) => setShowAngles(e.target.checked)}
                                            color="secondary"
                                        />
                                    }
                                    label={
                                        <Box>
                                            <Typography variant="body2" fontWeight="bold">
                                                Angles from Origin
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Show vector angles (cosine similarity)
                                            </Typography>
                                        </Box>
                                    }
                                />
                            </Stack>
                        </Paper>

                        <Box sx={{display: 'flex', justifyContent: 'center', mb: 2}}>
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

                        <Box sx={{mt: 2}}>
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
                            <Typography variant="body2" gutterBottom>
                                <strong>t-SNE
                                    Parameters:</strong> Perplexity={Math.min(16, Math.floor(data.words.length / 2))},
                                Learning Rate=10, Exaggeration=1.0
                            </Typography>
                            <Typography variant="caption" color="text.secondary"
                                        sx={{display: 'block', mt: 1, fontStyle: 'italic'}}>
                                Parameters optimized based on Gove et al. (2022) empirical study. Similar words should
                                appear closer together in the 2D space.
                            </Typography>
                        </Box>

                        {/* Explanation of layers */}
                        {(applyNormalization || showConnectingLines || showAngles) && (
                            <Paper elevation={1} sx={{p: 2, mt: 3, backgroundColor: '#e3f2fd'}}>
                                <Typography variant="subtitle2" gutterBottom>
                                    💡 Understanding the Visualization
                                </Typography>
                                {applyNormalization && (
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>Normalization:</strong> Raw t-SNE output can have extreme coordinate
                                        values.
                                        Normalization scales all points to a [-1, 1] range, making the visualization
                                        easier to interpret.
                                        This doesn't change relative positions or distances between points.
                                    </Typography>
                                )}
                                {showConnectingLines && (
                                    <Typography variant="body2" sx={{mb: 1}}>
                                        <strong>Connecting Lines:</strong> The dashed lines show Euclidean distances
                                        between points.
                                        Shorter distances mean more similar word meanings in the reduced space.
                                    </Typography>
                                )}
                                {showAngles && (
                                    <Typography variant="body2">
                                        <strong>Angles:</strong> The angles between vectors from the origin represent
                                        cosine similarity.
                                        Smaller angles (0°) = highly similar, larger angles (180°) = opposite meanings.
                                        This is exactly how vector databases measure semantic similarity!
                                    </Typography>
                                )}
                            </Paper>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
