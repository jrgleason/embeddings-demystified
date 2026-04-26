# Fine-Tuning LLMs: Slide Outline

## Terminology

| Term | What it means |
|------|---------------|
| **Pre-training** | Training from scratch on massive data (trillions of tokens). Creates the foundation model. Costs $millions. |
| **Fine-tuning** | Additional training on a pre-trained model with smaller, specialized data. Adapts it to your domain/task. Costs $1-100. |

Fine-tuning is a *type* of training—think of it as "specialized additional training" rather than starting from zero.

---

## Slide 1: What is Fine-Tuning?

**Key Points:**
- Pre-trained models are generalists (know a little about everything)
- Fine-tuning = teaching a specialist
- **Analogy:** Medical school (pre-training) → Residency in cardiology (fine-tuning)
- We're adapting Qwen3 0.6B to become an IoT/MQTT expert

**Visual:** Funnel diagram showing broad knowledge narrowing to specialized domain

---

## Slide 2: Why Not Just Use Prompts?

**Comparison:**

| Approach | How it works | Trade-offs |
|----------|--------------|------------|
| **Prompting** | "You are an IoT expert..." | Temporary, uses context window, inconsistent |
| **RAG** | Retrieve relevant docs at runtime | Good for facts, adds latency, needs vector DB |
| **Fine-tuning** | Knowledge baked into weights | Permanent, no context cost, consistent behavior |

**Fine-tuning benefits:**
- Consistent behavior without long system prompts
- Domain-specific vocabulary and patterns
- Smaller models can match larger ones on specific tasks
- Runs on edge devices (Raspberry Pi)

---

## Slide 3: LoRA - Efficient Fine-Tuning

**The Problem:**
- Full fine-tuning updates billions of parameters
- Expensive, slow, requires massive GPU memory
- Risk of "catastrophic forgetting" (losing general knowledge)

**The Solution - LoRA (Low-Rank Adaptation):**
- Freeze original model weights (don't change them)
- Add small "adapter" matrices to key layers
- Train only the adapters (~0.05% of parameters)

**Visual:**
```
Original Model          LoRA Approach
┌─────────────┐        ┌─────────────┐
│ Layer       │        │ Layer       │──┐
│ (frozen)    │        │ (frozen)    │  │ Small adapter
│ 494M params │        │ 494M params │←─┘ +270K params
└─────────────┘        └─────────────┘
     ↓                       ↓
 Update ALL            Update only
 parameters            adapter (0.05%)
```

**Result:** Same quality, 100x less compute, preserves base knowledge

---

## Slide 4: The Fine-Tuning Process

**Pipeline:**
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Base Model     │  +  │  Training Data   │  →  │  Adapted Model  │
│  (Qwen3 0.6B)   │     │  (IoT Q&A pairs) │     │  (IoT Expert)   │
└─────────────────┘     └──────────────────┘     └─────────────────┘
     494M params             38-1000 examples         +270K params
     (frozen)                                         (LoRA adapter)
```

**Steps:**
1. **Prepare Data** - Instruction-tuning format (user question → assistant answer)
2. **Load Model** - Pre-trained model + attach LoRA adapters
3. **Train** - Feed examples, update only adapter weights
4. **Merge & Export** - Combine adapter with base → GGUF for deployment

**Data Format (Qwen3 Chat):**
```
<|im_start|>system
You are an IoT expert.<|im_end|>
<|im_start|>user
What is the default MQTT port?<|im_end|>
<|im_start|>assistant
1883 (unencrypted) or 8883 (TLS).<|im_end|>
```

---

## Slide 5: Results & Deployment

**Training Performance:**
| Mode | Examples | Time (CPU) | Time (GPU) |
|------|----------|------------|------------|
| Demo | 10 | ~1 min | ~10 sec |
| Production | 1000+ | 4-8 hours | ~15 min |

**What the Model Learns:**
- IoT/Arduino/MQTT terminology and patterns
- Domain-specific problem-solving approaches
- Consistent response style for embedded systems questions
- Preserves general reasoning (75/25 reasoning split)

**Deployment to Edge:**
```
Fine-tuned Model → GGUF Quantization → Raspberry Pi
    (494M)            (Q4_K_M)           (400MB)
                                      5-10 tokens/sec
```

**Key Takeaway:** Fine-tuning lets you create specialized AI that runs anywhere—from cloud to Raspberry Pi.

---

## Bonus: When to Use Each Approach

| Approach | Best For | Example |
|----------|----------|---------|
| **Prompting** | Quick experiments, general tasks | "Summarize this text" |
| **RAG** | Factual Q&A, frequently changing data | Company knowledge base |
| **Fine-tuning** | Consistent style, domain expertise, edge deployment | IoT assistant on Raspberry Pi |
| **Combine all three** | Production systems | Fine-tuned model + RAG + good prompts |
