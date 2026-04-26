# Change: Add Environment Configuration Documentation and Template

## Why
The embeddings-demo project lacks proper environment configuration documentation and template files, making it difficult for new developers to set up the project. The `.env` file is missing from `.gitignore`, and there's no `.env.example` to guide users on required environment variables.

**Current Issues:**
1. No `.env` entry in `.gitignore` (risk of committing secrets)
2. No `.env.example` file to guide configuration
3. README.md contains only Vite boilerplate, not project-specific setup instructions
4. Environment variables are hardcoded with defaults in `server.mjs`, but not documented

This violates the project conventions stated in `openspec/project.md`:
- "Never commit `.env` files or API keys"
- "Use `.env.example` for template"

## What Changes
- Add `.env` to `.gitignore` to prevent accidental commits of secrets
- Create `.env.example` with all required environment variables and documentation
- Update README.md with project-specific setup instructions
- Document the environment variables in a clear, copy-paste friendly format

## Impact
- **Affected files:**
  - `demos/embeddings-demo/.gitignore` (add .env)
  - `demos/embeddings-demo/.env.example` (new file)
  - `demos/embeddings-demo/README.md` (completely rewritten)
- **Breaking changes:** None
- **Benefits:**
  - Prevents accidental commit of secrets
  - Easier onboarding for new developers
  - Clear documentation of required configuration
  - Follows security best practices
  - Aligns with project conventions
