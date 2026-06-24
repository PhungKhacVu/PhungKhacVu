## 2024-05-24 - Frontend State Updates vs Refetches
**Learning:** The frontend file import feature iterates over `savePrompt`. It uses local state updates to avoid massive N+1 HTTP request bottlenecks during bulk operations that would occur if full data refetches (like `fetchPrompts()`) were called.
**Action:** When implementing mutations in vanilla JS SPAs, update local state arrays directly and selectively re-render instead of awaiting full refetches from the server.
