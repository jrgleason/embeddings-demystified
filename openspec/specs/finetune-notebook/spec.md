# finetune-notebook Specification

## Purpose
TBD - created by archiving change fix-torch-dtype-deprecation. Update Purpose after archive.
## Requirements
### Requirement: Model Loading API Compatibility
The fine-tuning notebook SHALL use non-deprecated transformers API parameters to ensure forward compatibility with future library versions.

#### Scenario: Model loads without deprecation warnings
- **WHEN** the model loading cell is executed
- **THEN** the model loads successfully without deprecation warnings
- **AND** the `dtype` parameter is used instead of deprecated `torch_dtype`

### Requirement: Production-Ready Training Dataset
The fine-tuning notebook SHALL include a dataset of 500-1000 curated IoT examples sufficient for meaningful domain adaptation.

#### Scenario: Dataset contains adequate training examples
- **WHEN** the sample dataset is loaded
- **THEN** it contains between 500 and 1000 training examples
- **AND** examples cover Arduino, ESP32, MQTT, and LoRa topics

#### Scenario: Dataset maintains reasoning balance
- **WHEN** the dataset is analyzed for example types
- **THEN** approximately 75% of examples include reasoning traces (`<|thinking|>` tags)
- **AND** approximately 25% of examples are direct answers without reasoning

### Requirement: Scalable Training Modes
The notebook SHALL support both quick demo training and full production training from the same dataset.

#### Scenario: Demo mode uses subset
- **WHEN** DEMO_MODE is set to True
- **THEN** training uses a small subset (10-50 examples) for quick iteration
- **AND** training completes in under 10 minutes on CPU

#### Scenario: Full mode uses complete dataset
- **WHEN** DEMO_MODE is set to False
- **THEN** training uses the full 500-1000 example dataset
- **AND** the notebook provides time estimates based on hardware

