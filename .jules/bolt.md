## 2026-06-18 - N+1 HTTP Request Bottleneck in Bulk Operations
**Learning:** Found a critical bottleneck where the `savePrompt` frontend function made a full GET `/api/prompts` request (`await fetchPrompts()`) upon every save. When importing bulk data, this triggered N full list refetches, causing massive network congestion.
**Action:** Always use local state updates to mutate cached arrays instead of full refetches for single-item mutations. Implement a `skipRender` parameter in mutation functions to allow batching DOM updates during loop operations.
