## 2024-05-24 - N+1 Bottleneck on Bulk Import
**Learning:** Calling a full data refetch (`fetchPrompts()`) inside individual operations like `savePrompt` triggers massive N+1 HTTP request bottlenecks during bulk operations (e.g., file imports).
**Action:** Use optimistic UI updates by directly mutating local state (`allPrompts`) and selectively re-rendering instead of making redundant API round-trips for the entire data set after single modifications.
