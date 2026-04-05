## 2026-04-05 - Optimistic UI updates to prevent N+1 requests
**Learning:** The frontend file import feature iterates over `savePrompt`. Calling full data refetches (like `fetchPrompts()`) inside operations like `savePrompt` triggers massive N+1 HTTP request bottlenecks during bulk operations.
**Action:** Use optimistic UI updates instead of full refetches for individual item modifications.
