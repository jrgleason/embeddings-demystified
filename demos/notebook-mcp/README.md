# Jupyter MCP Server Setup

This directory contains a Docker Compose configuration to run JupyterLab for use with the [jupyter-mcp-server](https://github.com/datalayer/jupyter-mcp-server).

## Architecture

```
┌─────────────────┐     MCP Protocol      ┌──────────────────────┐
│  Claude Code    │◄────────────────────►│ jupyter-mcp-server   │
│  (or other LLM) │     (stdio/docker)    │ (spawned container)  │
└─────────────────┘                       └──────────┬───────────┘
                                                     │
                                          HTTP API   │
                                                     ▼
                                          ┌──────────────────────┐
                                          │   JupyterLab         │
                                          │   (docker-compose)   │
                                          │   Port 8888          │
                                          └──────────────────────┘
```

## Quick Start

### 1. Start JupyterLab

```bash
cd demos/notebook-mcp
docker compose up -d
```

### 2. Verify JupyterLab is Running

Open http://localhost:8888 in your browser. You should see the JupyterLab interface.

### 3. Use with Claude Code

The MCP configuration is already set up in `.mcp.json` at the project root. Claude Code will automatically use the jupyter MCP server to interact with notebooks.

## Usage Examples

Once JupyterLab is running and Claude Code is configured, you can ask Claude to:

### Creating and Managing Notebooks

```
"Create a new notebook called data_analysis.ipynb"
"List all notebooks in the workspace"
"Open the existing notebook experiments.ipynb"
```

### Writing and Executing Code

```
"Add a cell that imports pandas and numpy"
"Run the current cell"
"Execute this code: print('Hello from Jupyter!')"
"Run all cells in the notebook"
```

### Data Analysis Workflows

```
"Create a notebook that loads a CSV file and shows basic statistics"
"Add a cell that creates a matplotlib visualization of the data"
"Execute the analysis and show me the results"
```

### Iterative Development

```
"Read the output of cell 3"
"Modify cell 2 to fix the syntax error"
"Delete the last cell"
"Insert a markdown cell explaining what the code does"
```

## Available MCP Tools

The jupyter-mcp-server provides these capabilities:

| Category | Tool | Description |
|----------|------|-------------|
| **Server** | `list_files` | List files and directories in Jupyter's file system |
| **Server** | `list_kernels` | List available and running kernel sessions |
| **Notebook** | `use_notebook` | Connect to, create, or switch between notebooks |
| **Notebook** | `list_notebooks` | View all notebooks and their status |
| **Notebook** | `read_notebook` | Read notebook cells (brief or detailed) |
| **Notebook** | `restart_notebook` | Reset the kernel for a notebook |
| **Notebook** | `unuse_notebook` | Disconnect from a notebook |
| **Cell** | `read_cell` | Read full content of a single cell |
| **Cell** | `insert_cell` | Add new code or markdown cells |
| **Cell** | `delete_cell` | Remove cells by index |
| **Cell** | `overwrite_cell_source` | Modify existing cell code |
| **Cell** | `execute_cell` | Execute a cell (supports images) |
| **Cell** | `insert_execute_code_cell` | Insert and execute in one step |
| **Cell** | `execute_code` | Execute code directly in kernel |
| **Batch** | `run-all-cells` | Execute all cells sequentially |

## Configuration

### Docker Compose

The `docker-compose.yml` runs:
- **Image**: `jupyter/scipy-notebook:latest` (includes Python, NumPy, Pandas, Matplotlib, etc.)
- **Port**: 8888
- **Auth**: Disabled (empty token) for local development
- **Volume**: `jupyter-workspace` for persistent notebook storage

### MCP Configuration

The `.mcp.json` in the project root includes:

```json
{
  "jupyter": {
    "type": "stdio",
    "command": "docker",
    "args": [
      "run", "-i", "--rm",
      "-e", "JUPYTER_URL",
      "-e", "ALLOW_IMG_OUTPUT",
      "datalayer/jupyter-mcp-server:latest"
    ],
    "env": {
      "JUPYTER_URL": "http://host.docker.internal:8888",
      "ALLOW_IMG_OUTPUT": "true"
    }
  }
}
```

## Commands

```bash
# Start JupyterLab
docker compose up -d

# View logs
docker compose logs -f

# Stop JupyterLab
docker compose down

# Stop and remove volumes (deletes all notebooks)
docker compose down -v
```

## Using with Other LLM Tools

The same MCP server configuration pattern works with other tools:

### OpenAI Codex / OpenCode

Add to your MCP configuration:
```json
{
  "jupyter": {
    "command": "docker",
    "args": ["run", "-i", "--rm", "-e", "JUPYTER_URL", "-e", "ALLOW_IMG_OUTPUT", "datalayer/jupyter-mcp-server:latest"],
    "env": {
      "JUPYTER_URL": "http://host.docker.internal:8888",
      "ALLOW_IMG_OUTPUT": "true"
    }
  }
}
```

## Troubleshooting

### "Cannot connect to Jupyter"

1. Ensure JupyterLab is running: `docker compose ps`
2. Check logs: `docker compose logs`
3. Verify port 8888 is accessible: `curl http://localhost:8888`

### Linux Users

If using Linux, replace `host.docker.internal` with `localhost` and add `--network=host`:

```json
{
  "jupyter": {
    "command": "docker",
    "args": ["run", "-i", "--rm", "-e", "JUPYTER_URL", "-e", "ALLOW_IMG_OUTPUT", "--network=host", "datalayer/jupyter-mcp-server:latest"],
    "env": {
      "JUPYTER_URL": "http://localhost:8888",
      "ALLOW_IMG_OUTPUT": "true"
    }
  }
}
```

### First Time Setup

The first run may take a few minutes to pull the Docker images:
- `jupyter/scipy-notebook` (~3GB)
- `datalayer/jupyter-mcp-server` (~200MB)

## Notes

- Authentication is disabled for local development simplicity
- Notebooks are stored in a Docker volume, separate from project files
- The jupyter-mcp-server container is spawned on-demand by Claude Code (not part of docker-compose)
