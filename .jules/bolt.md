## 2024-05-24 - Avoid N+1 HTTP Refetches on Bulk Import
**Learning:** Calling a full data refetch (`fetchPrompts()`) inside a mutation function (`savePrompt`) that is iterated over during bulk operations (like file import) causes a massive N+1 HTTP request bottleneck and layout thrashing.
**Action:** Use local state updates with an upsert logic instead of full refetches, and add a `skipRender` parameter to batch DOM updates during bulk operations.
