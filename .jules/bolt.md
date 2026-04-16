## 2026-04-16 - [Optimistic UI updates to fix N+1 refetch bottlenecks]
**Learning:** During bulk operations (like importing files), triggering full data refetches inside iterative save operations (e.g., `savePrompt`) creates a severe N+1 HTTP request bottleneck, causing slow frontend performance and unnecessary server load.
**Action:** Implement optimistic UI updates by directly updating the local state array (e.g., `allPrompts`) and re-rendering the UI (e.g., `renderPromptList`) after a successful mutation, rather than refetching the entire dataset.
