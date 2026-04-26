# Change: Expand Fine-Tuning Dataset to 500-1000 Examples

## Why
The current sample dataset contains only 38 examples, which is sufficient for a quick demo but insufficient for meaningful fine-tuning results. Expanding to 500-1000 high-quality IoT/Arduino/MQTT examples will produce a model with better domain knowledge while still being trainable in a reasonable timeframe.

## What Changes
- Expand `sample_iot_dataset.json` from 38 to 500-1000 curated examples
- Maintain 75% reasoning / 25% non-reasoning split for preserving thinking capability
- Source examples from HuggingFace Arduino dataset and supplement with MQTT/LoRa-specific examples
- Update notebook DEMO_MODE to use subset (50 examples) while FULL_MODE uses entire dataset

## Impact
- Affected specs: finetune-notebook
- Affected code:
  - `demos/finetune-qwen/sample_iot_dataset.json` (main change)
  - `demos/finetune-qwen/fine_tune_qwen3_iot.ipynb` (update example counts in documentation)
