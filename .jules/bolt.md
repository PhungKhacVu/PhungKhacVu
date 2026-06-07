## 2024-06-07 - Frontend Local State Optimizations
**Learning:** In bulk operations like file imports, `savePrompt` calls `await fetchPrompts()` individually, resulting in O(N) network requests which is a massive bottleneck.
**Action:** Use local state updates (updating `allPrompts` directly) and skip individual UI renders during bulk saves by adding a `skipRender` parameter to `savePrompt`. Use upsert logic in local updates to prevent duplication. Call `renderPromptList()` only once at the end.
