## 1. Implementation
- [x] 1.1 Update cell-16 in fine_tune_qwen3_iot.ipynb to use `dtype` instead of `torch_dtype`
- [x] 1.2 Rename local variable from `torch_dtype` to `dtype` for consistency

## 2. Validation
- [x] 2.1 Run notebook in Jupyter container to verify no deprecation warning
- [x] 2.2 Verify model loads correctly with the new parameter
