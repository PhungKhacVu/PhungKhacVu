## 2024-05-23 - [Optimistic UI updates for save/delete]
**Learning:** Calling `fetchPrompts()` inside `savePrompt` during bulk imports (or rapid updates) triggers an N+1 HTTP request bottleneck, slowing down the frontend significantly.
**Action:** Use optimistic UI updates to modify the local state directly (`allPrompts`) and re-render without fetching the entire list from the server again.
