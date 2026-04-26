import { useState, useCallback, useRef } from 'react';
import {
    AssistantRuntimeProvider,
    useLocalRuntime,
    ThreadPrimitive,
    MessagePrimitive,
    ComposerPrimitive,
    useMessage,
    useThreadRuntime,
} from '@assistant-ui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
    Alert, Box, Button, Card, CardContent, Chip,
    Collapse, Divider, FormControlLabel, IconButton, Paper,
    Slider, Switch, TextField, Tooltip, Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SendIcon from '@mui/icons-material/Send';
import StorageIcon from '@mui/icons-material/Storage';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const DEFAULT_SYSTEM_PROMPT =
    'You are a helpful assistant. Answer questions based on the provided context. ' +
    'If the context does not contain relevant information, say so clearly.';

function SourceDocs({ sources }) {
    const [open, setOpen] = useState(false);
    if (!sources || sources.length === 0) return null;
    return (
        <Box sx={{ mt: 0.75, pl: 0.5 }}>
            <Button
                size="small"
                startIcon={<StorageIcon sx={{ fontSize: '14px !important' }} />}
                onClick={() => setOpen(o => !o)}
                sx={{ textTransform: 'none', fontSize: '0.72rem', py: 0.25 }}
                endIcon={open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            >
                {sources.length} context doc{sources.length !== 1 ? 's' : ''} retrieved
            </Button>
            <Collapse in={open}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 0.5 }}>
                    {sources.map((src, i) => (
                        <Paper key={i} variant="outlined" sx={{ p: 1.25 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Document {i + 1}
                                </Typography>
                                <Chip
                                    label={`Score: ${src.score.toFixed(4)}`}
                                    size="small"
                                    color={src.score < 0.5 ? 'success' : 'default'}
                                    variant="outlined"
                                />
                            </Box>
                            <Typography variant="body2" sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}>
                                &ldquo;{src.content}&rdquo;
                            </Typography>
                            {src.metadata?.timestamp && (
                                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mt: 0.5 }}>
                                    Added {new Date(src.metadata.timestamp).toLocaleString()}
                                </Typography>
                            )}
                        </Paper>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
}

const markdownComponents = {
    p: ({ children }) => (
        <Typography variant="body1" sx={{ mb: 1, '&:last-child': { mb: 0 }, lineHeight: 1.6 }}>
            {children}
        </Typography>
    ),
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    ul: ({ children }) => <Box component="ul" sx={{ pl: 2.5, mb: 1 }}>{children}</Box>,
    ol: ({ children }) => <Box component="ol" sx={{ pl: 2.5, mb: 1 }}>{children}</Box>,
    li: ({ children }) => <Typography component="li" variant="body1" sx={{ mb: 0.25 }}>{children}</Typography>,
    code: ({ inline, children }) =>
        inline
            ? <Box component="code" sx={{ bgcolor: 'action.hover', px: 0.5, borderRadius: 0.5, fontFamily: 'monospace', fontSize: '0.85em' }}>{children}</Box>
            : <Box component="pre" sx={{ bgcolor: 'action.hover', p: 1.5, borderRadius: 1, overflow: 'auto', mb: 1, fontFamily: 'monospace', fontSize: '0.85em' }}><code>{children}</code></Box>,
    blockquote: ({ children }) => (
        <Box sx={{ borderLeft: 3, borderColor: 'primary.main', pl: 2, my: 1, color: 'text.secondary' }}>
            {children}
        </Box>
    ),
};

function UserMessage() {
    const message = useMessage();
    const text = message.content
        ?.filter(p => p.type === 'text')
        .map(p => p.text)
        .join('') || '';

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <Paper
                elevation={2}
                sx={{
                    p: 1.5,
                    maxWidth: '82%',
                    bgcolor: 'primary.main',
                    borderRadius: '16px 16px 4px 16px',
                }}
            >
                <Typography sx={{ color: 'primary.contrastText', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: 1.6 }}>
                    {text}
                </Typography>
            </Paper>
        </Box>
    );
}

function AssistantMessage({ sourcesMap, showContext }) {
    const message = useMessage();
    const msgId = message.id;
    const sources = sourcesMap.get(msgId) ?? null;
    const isInProgress = message.status?.type === 'running';

    const textContent = message.content
        ?.filter(p => p.type === 'text')
        .map(p => p.text)
        .join('') || '';

    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Box sx={{ maxWidth: '82%' }}>
                <Paper
                    elevation={1}
                    sx={{
                        p: 1.5,
                        bgcolor: 'background.paper',
                        borderRadius: '16px 16px 16px 4px',
                    }}
                >
                    {textContent ? (
                        <Box sx={{ color: 'text.primary', wordBreak: 'break-word' }}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents}
                            >
                                {textContent}
                            </ReactMarkdown>
                            {isInProgress && <TypingCaret />}
                        </Box>
                    ) : (
                        isInProgress ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                                <ThinkingDots />
                                <Typography variant="body2" color="text.secondary">
                                    Thinking…
                                </Typography>
                            </Box>
                        ) : (
                            <Typography variant="body1" color="text.secondary">(empty response)</Typography>
                        )
                    )}
                </Paper>

                {showContext && sources !== null && sources.length > 0 && (
                    <SourceDocs sources={sources} />
                )}
                {showContext && sources !== null && sources.length === 0 && !isInProgress && (
                    <Typography variant="caption" color="warning.main" sx={{ pl: 0.5, display: 'block', mt: 0.5 }}>
                        No context found — add documents via Vector Store first
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

function TypingCaret() {
    return (
        <Box
            component="span"
            sx={{
                display: 'inline-block',
                width: '2px',
                height: '1em',
                bgcolor: 'primary.main',
                ml: 0.5,
                verticalAlign: 'text-bottom',
                animation: 'blink 1s step-end infinite',
                '@keyframes blink': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0 },
                },
            }}
        />
    );
}

function ThinkingDots() {
    return (
        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {[0, 1, 2].map(i => (
                <Box
                    key={i}
                    sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        animation: 'bounce 1.4s infinite ease-in-out',
                        animationDelay: `${i * 0.16}s`,
                        '@keyframes bounce': {
                            '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: 0.4 },
                            '40%': { transform: 'scale(1)', opacity: 1 },
                        },
                    }}
                />
            ))}
        </Box>
    );
}

function ChatThread({ sourcesMap, showContext }) {
    return (
        <ThreadPrimitive.Root
            style={{
                height: 500,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <ThreadPrimitive.Viewport
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    paddingRight: 4,
                }}
            >
                <ThreadPrimitive.Empty>
                    <Box sx={{
                        height: '100%',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        gap: 1, color: 'text.secondary', minHeight: 400,
                    }}>
                        <AutoAwesomeIcon sx={{ fontSize: 52, opacity: 0.25 }} />
                        <Typography variant="body1" sx={{ opacity: 0.45 }}>
                            Ask a question to get started
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.35 }}>
                            The LLM will answer using your vector store as context
                        </Typography>
                    </Box>
                </ThreadPrimitive.Empty>

                <ThreadPrimitive.Messages
                    components={{
                        UserMessage,
                        AssistantMessage: () => (
                            <AssistantMessage sourcesMap={sourcesMap} showContext={showContext} />
                        ),
                    }}
                />
            </ThreadPrimitive.Viewport>
        </ThreadPrimitive.Root>
    );
}

function ChatComposer({ isLoading }) {
    return (
        <ComposerPrimitive.Root>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-end' }}>
                <ComposerPrimitive.Input
                    autoFocus
                    placeholder="Ask a question… (Enter to send, Shift+Enter for newline)"
                    rows={1}
                    maxRows={5}
                    style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: 'rgba(128,128,128,0.3)',
                        backgroundColor: 'transparent',
                        color: 'inherit',
                        fontFamily: 'inherit',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        resize: 'none',
                        outline: 'none',
                    }}
                />
                <ComposerPrimitive.Send asChild>
                    <Button
                        variant="contained"
                        disabled={isLoading}
                        sx={{ minWidth: 48, height: 40 }}
                    >
                        <SendIcon />
                    </Button>
                </ComposerPrimitive.Send>
            </Box>
        </ComposerPrimitive.Root>
    );
}

export default function RAGChat() {
    const [error, setError] = useState(null);
    const [configOpen, setConfigOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [temperature, setTemperature] = useState(0.2);
    const [k, setK] = useState(4);
    const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
    const [showContext, setShowContext] = useState(true);

    const sourcesMapRef = useRef(new Map());
    const [sourcesVersion, setSourcesVersion] = useState(0);
    const configRef = useRef({ temperature, k, systemPrompt });
    configRef.current = { temperature, k, systemPrompt };

    const sourcesMap = sourcesMapRef.current;

    const adapter = useCallback(() => ({
        async *run({ messages, abortSignal }) {
            const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
            if (!lastUserMsg) return;

            const userText = lastUserMsg.content
                .filter(p => p.type === 'text')
                .map(p => p.text)
                .join('');

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('/rag/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: userText,
                        k: configRef.current.k,
                        temperature: configRef.current.temperature,
                        systemPrompt: configRef.current.systemPrompt,
                    }),
                    signal: abortSignal,
                });

                if (!response.ok) {
                    const data = await response.json().catch(() => ({}));
                    throw new Error(data.error || `Server error ${response.status}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let buffer = '';
                let text = '';
                let currentSources = null;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() ?? '';

                    for (const line of lines) {
                        if (!line.startsWith('data: ')) continue;
                        try {
                            const event = JSON.parse(line.slice(6));
                            if (event.type === 'sources') {
                                currentSources = event.sources;
                            } else if (event.type === 'token') {
                                text += event.token;
                                yield { content: [{ type: 'text', text }] };
                            }
                        } catch (_) { /* skip malformed */ }
                    }
                }

                if (currentSources) {
                    sourcesMapRef.current.set('pending', currentSources);
                }

                yield { content: [{ type: 'text', text }], status: { type: 'complete', reason: 'stop' } };
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
    }), []);

    const runtime = useLocalRuntime(adapter());

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            <RAGChatInner
                error={error}
                setError={setError}
                configOpen={configOpen}
                setConfigOpen={setConfigOpen}
                isLoading={isLoading}
                temperature={temperature}
                setTemperature={setTemperature}
                k={k}
                setK={setK}
                systemPrompt={systemPrompt}
                setSystemPrompt={setSystemPrompt}
                showContext={showContext}
                setShowContext={setShowContext}
                sourcesMap={sourcesMap}
                sourcesVersion={sourcesVersion}
                setSourcesVersion={setSourcesVersion}
                sourcesMapRef={sourcesMapRef}
            />
        </AssistantRuntimeProvider>
    );
}

function RAGChatInner({
    error, setError,
    configOpen, setConfigOpen,
    isLoading,
    temperature, setTemperature,
    k, setK,
    systemPrompt, setSystemPrompt,
    showContext, setShowContext,
    sourcesMap,
    sourcesMapRef,
}) {
    const threadRuntime = useThreadRuntime();

    const handleNewMessage = useCallback(() => {
        const messages = threadRuntime.getState().messages;
        if (messages.length === 0) return;
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role === 'assistant' && sourcesMapRef.current.has('pending')) {
            const pending = sourcesMapRef.current.get('pending');
            sourcesMapRef.current.delete('pending');
            sourcesMapRef.current.set(lastMsg.id, pending);
        }
    }, [threadRuntime, sourcesMapRef]);

    const originalOnNew = threadRuntime.composer?.send;

    return (
        <Box sx={{ maxWidth: '880px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                    <Typography variant="h4" component="h1">RAG Chat</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Chat with the LLM augmented by your vector store. Add documents on the Vector Store page first.
                    </Typography>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
            )}

            {/* Configuration */}
            <Card>
                <CardContent sx={{ pb: '12px !important' }}>
                    <Box
                        sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                        onClick={() => setConfigOpen(o => !o)}
                    >
                        <Typography variant="h6">Configuration</Typography>
                        <IconButton size="small" tabIndex={-1}>
                            {configOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                    </Box>

                    <Collapse in={configOpen}>
                        <Divider sx={{ my: 1.5 }} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 3 }}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="body2">Temperature</Typography>
                                    <Chip label={temperature.toFixed(1)} size="small" variant="outlined" />
                                </Box>
                                <Slider
                                    value={temperature}
                                    onChange={(_, v) => setTemperature(v)}
                                    min={0} max={1.5} step={0.1}
                                    marks={[
                                        { value: 0, label: '0' },
                                        { value: 0.7, label: '0.7' },
                                        { value: 1.5, label: '1.5' },
                                    ]}
                                    disabled={isLoading}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    Lower = focused/deterministic · Higher = creative/varied
                                </Typography>
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Typography variant="body2">Retrieved Documents (k)</Typography>
                                    <Chip label={k} size="small" variant="outlined" />
                                </Box>
                                <Slider
                                    value={k}
                                    onChange={(_, v) => setK(v)}
                                    min={1} max={10} step={1}
                                    marks={[
                                        { value: 1, label: '1' },
                                        { value: 5, label: '5' },
                                        { value: 10, label: '10' },
                                    ]}
                                    disabled={isLoading}
                                />
                                <Typography variant="caption" color="text.secondary">
                                    How many similar docs to inject as context per query
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" gutterBottom>System Prompt</Typography>
                            <TextField
                                fullWidth multiline rows={2} size="small"
                                value={systemPrompt}
                                onChange={(e) => setSystemPrompt(e.target.value)}
                                disabled={isLoading}
                                placeholder="Instructions for the AI..."
                            />
                        </Box>

                        <Box sx={{ mt: 1.5 }}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={showContext}
                                        onChange={(e) => setShowContext(e.target.checked)}
                                        size="small"
                                    />
                                }
                                label={<Typography variant="body2">Show retrieved context documents</Typography>}
                            />
                        </Box>
                    </Collapse>
                </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card>
                <CardContent sx={{ p: '16px !important' }}>
                    <ChatThread sourcesMap={sourcesMap} showContext={showContext} />
                </CardContent>
            </Card>

            {/* Input */}
            <Card>
                <CardContent sx={{ pb: '16px !important' }}>
                    <ChatComposer isLoading={isLoading} />
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
                        Temperature {temperature.toFixed(1)} · k = {k} docs
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
