## 2026-04-15 - Prevent N+1 requests on bulk imports
**Learning:** Using `await fetchPrompts()` inside iterative `savePrompt` functions triggered during bulk imports creates a massive N+1 bottleneck, making UI lag.
**Action:** Implemented local state updates by updating the local `allPrompts` array directly and calling `renderPromptList()` without network trips, turning O(N) fetch calls into 0 per save.
