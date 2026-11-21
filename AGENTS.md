# AGENTS.md

## Operational Rules & Agent Environment Guidelines

This file governs agent behavior, tool selection, token efficiency, and implementation workflows for this workspace.

---

### Code Exploration & Navigation
- **Semantic Navigation**: Use **Serena** for semantic code navigation, symbol lookup, reference tracking, and symbol-level code manipulation.
- **Symbol Retrieval over File Dumps**: Retrieve individual symbols (functions, classes, interfaces) rather than loading entire files whenever possible.
- **Dependency & Call Tracking**: Trace relevant callers, callees, and dependencies before modifying code using Serena or repograph.
- **Syntax-Aware Search**: Use **ast-grep** (`sg`) for structural search and syntax-aware transformations across TypeScript/TSX/JavaScript files.
- **Exact Search**: Use exact text search tools (`grep`, `find_file`) only when structural/symbol tools are not suitable.
- **Avoid Directory Scanning**: Avoid repeatedly scanning the same directories or listing entire trees.

---

### Documentation Retrieval
- **External Libraries**: Use **Context7** (`resolve-library-id`, `query-docs`) to retrieve documentation for external libraries and frameworks (e.g. Next.js, Medusa, Tailwind, React).
- **Targeted Retrieval**: Retrieve only documentation specifically relevant to the task at hand rather than loading complete documentation sets.
- **Version Verification**: Verify installed package versions against `package.json` before querying APIs to ensure version-accurate documentation.

---

### Repository Context & Analysis
- **Selective Repomix Usage**: Use **Repomix** only for tasks requiring broad architectural overviews or large-scale codebase investigations.
- **No Blanket Dumps**: Never inject complete repository dumps into everyday conversations or prompts.
- **Configured Packing**: When running Repomix, use the project-level `repomix.config.json` (which automatically ignores dependencies, lockfiles, build artifacts, and enables Tree-sitter code compression).
- **Concise Architecture**: Keep project notes and architecture summaries focused and current.

---

### Frontend Verification & Testing
- **Playwright CLI**: Use **Playwright CLI** (`playwright-cli`) to validate actual browser behavior, test user flows, check responsive layouts, verify forms, and capture screenshots.
- **Runtime Debugging**: Use **Chrome DevTools MCP** when deep browser console inspection, network request inspection, or performance tracing is specifically required.
- **No Compilation Assumptions**: Do not assume successful TypeScript compilation or build completion means the UI renders or functions correctly. Verify via browser inspection.

---

### Token Efficiency
- **Avoid Redundant Calls**: Do not invoke multiple tools for the same purpose without a clear, specific reason.
- **Filtered Outputs**: Avoid dumping complete command or file outputs; prefer targeted line ranges, filtered queries, and concise summaries.
- **No Rereading**: Do not reread unchanged files or re-fetch documentation already retrieved in the conversation.
- **Minimal Context Bloat**: Always select the lightest tool that solves the problem.

---

### Implementation Guidelines
- **Inspect Before Modifying**: Inspect existing architecture and conventions before introducing new patterns or abstractions.
- **Minimal, Targeted Changes**: Prefer localized, minimal edits over wholesale file rewrites.
- **Verification & Testing**: Run relevant typechecks, unit tests, and browser verifications to confirm implementations.
- **Ground Assumptions**: Verify important assumptions against actual source code before concluding.

