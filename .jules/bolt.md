## 2024-06-13 - Batched DOM Updates on Bulk Import
**Learning:** Iterating over savePrompt during bulk operations causes severe N+1 HTTP request bottlenecks when full data refetches like fetchPrompts() are awaited within the loop.
**Action:** Use an optional skipRender flag combined with local state updates (upserts) to allow DOM updates to be batched efficiently during bulk operations, eliminating unnecessary refetches and layout thrashing.
