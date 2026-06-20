## 2025-02-23 - Frontend N+1 Bottleneck on Imports
**Learning:** `fetchPrompts()` was called inside `savePrompt()` causing N+1 GET requests during bulk operations, and causing unnecessary network calls.
**Action:** Use local state update (upsert) in memory, and only re-render the view conditionally (via a `skipRender` parameter).
