## 2026-04-06 - Optimistic UI Updates
**Learning:** Avoid full data refetches like fetchPrompts() inside operations like savePrompt, as it triggers massive N+1 HTTP request bottlenecks during bulk operations like file imports.
**Action:** Use optimistic local state updates instead.
