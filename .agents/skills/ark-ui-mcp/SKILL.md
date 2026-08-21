---
name: ark-ui-mcp
description: Use the Ark UI MCP server to discover Ark UI components, retrieve framework-specific examples, and apply Ark UI styling guidance when building or modifying Ark UI interfaces in React, Vue, Solid, or Svelte.
compatibility: Requires an MCP-capable client with Node.js and npx. The server runs over stdio as @ark-ui/mcp.
---

# Ark UI MCP Server

Use Ark UI's MCP server as the source of truth whenever implementing or changing an Ark UI component. Do not guess component APIs, parts, data attributes, CSS variables, or framework-specific syntax.

## Configure the server

Register this stdio server with the active MCP client:

```json
{
  "mcpServers": {
    "ark-ui": {
      "command": "npx",
      "args": ["-y", "@ark-ui/mcp"]
    }
  }
}
```

For VS Code, use the same server definition in `.vscode/mcp.json`, but use `servers` rather than `mcpServers`:

```json
{
  "servers": {
    "ark-ui": {
      "command": "npx",
      "args": ["-y", "@ark-ui/mcp"]
    }
  }
}
```

The server supports stdio transport only. It requires Node.js and makes `npx` download the package on first run.

## Available tools

- `list_components`: discover available Ark UI components.
- `list_examples`: find examples for a component or pattern.
- `get_example`: retrieve framework-specific implementation and usage examples.
- `styling_guide`: retrieve component data attributes and CSS custom properties.

## Workflow

1. Use `list_components` when choosing a component or when its name is uncertain.
2. Use `list_examples` and then `get_example` before writing component code. Request the project's framework: React, Vue, Solid, or Svelte.
3. Use `styling_guide` before adding component CSS or state-based selectors.
4. Preserve the documented part structure, accessibility behavior, and controlled/uncontrolled state patterns in the returned example.
5. If the server is unavailable, say so plainly and use the official docs at <https://ark-ui.com/docs> rather than inventing APIs.

## Prompt examples

- “Build an Ark UI checkbox for Svelte and style its checked and disabled states.”
- “Find the Ark UI React combobox example and adapt it for async search.”
- “What data attributes and CSS variables does Ark UI Dialog expose?”

Source: <https://ark-ui.com/docs/ai/mcp-server>
