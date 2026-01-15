# Change: Fix torch_dtype Deprecation Warning

## Why
The `torch_dtype` parameter in `AutoModelForCausalLM.from_pretrained()` is deprecated in transformers v4.57+ and will be removed in v5.0. The notebook currently produces a deprecation warning during execution.

## What Changes
- Replace `torch_dtype` parameter with `dtype` in model loading cell
- Update variable name from `torch_dtype` to `dtype` for clarity

## Impact
- Affected specs: finetune-notebook
- Affected code: `demos/finetune-qwen/fine_tune_qwen3_iot.ipynb` (cell-16)
