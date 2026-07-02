## 2024-10-24 - N+1 HTTP Request Bottleneck on Bulk Import
**Learning:** The bulk import feature iterates over `savePrompt`, which previously called `await fetchPrompts()` on every execution. This caused a massive N+1 HTTP request bottleneck and unnecessary DOM re-renders during imports.
**Action:** Always prefer local state updates (upsert) and batched DOM re-renders (using a `skipRender` flag) over full data refetches and individual re-renders, especially for operations that may be called in loops.
