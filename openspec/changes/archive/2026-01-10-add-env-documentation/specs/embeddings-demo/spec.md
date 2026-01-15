## ADDED Requirements

### Requirement: Environment Configuration Security
The embeddings-demo project SHALL prevent accidental commit of sensitive environment variables and secrets.

#### Scenario: Gitignore protection
- **WHEN** environment files contain sensitive data
- **THEN** `.env` and `.env.local` MUST be listed in `.gitignore`
- **AND** these files SHALL NOT be committed to version control

#### Scenario: Example template
- **WHEN** a developer needs to configure the application
- **THEN** a `.env.example` file MUST be provided
- **AND** it SHALL document all required environment variables
- **AND** it SHALL include example values or placeholders

### Requirement: Setup Documentation
The embeddings-demo project SHALL provide clear setup and usage documentation for developers.

#### Scenario: README completeness
- **WHEN** a developer reads the README
- **THEN** it SHALL include project description and purpose
- **AND** it SHALL list all prerequisites (Node.js version, Ollama)
- **AND** it SHALL provide step-by-step installation instructions
- **AND** it SHALL explain environment configuration
- **AND** it SHALL document how to run the application

#### Scenario: Environment variable documentation
- **WHEN** environment variables are required
- **THEN** each variable MUST be documented with:
  - Variable name
  - Purpose/description
  - Example or default value
  - Whether it's required or optional

#### Scenario: API documentation
- **WHEN** the server exposes API endpoints
- **THEN** the README MUST document:
  - Available endpoints
  - Request/response formats
  - Example usage

### Requirement: Onboarding Experience
The embeddings-demo project SHALL enable new developers to set up and run the project within 10 minutes.

#### Scenario: Fresh clone setup
- **WHEN** a developer clones the repository for the first time
- **THEN** they SHALL be able to follow README instructions
- **AND** successfully run the application
- **AND** without needing to ask for additional configuration details
