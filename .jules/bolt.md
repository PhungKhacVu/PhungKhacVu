## 2024-05-18 - Avoid N+1 requests in bulk operations
**Learning:** Calling full data refetches (like `fetchPrompts()`) inside individual item operations (like `savePrompt`) triggers massive N+1 HTTP request bottlenecks when those operations are called in a loop (e.g., during file imports).
**Action:** Use optimistic UI updates (e.g., modifying local state arrays directly) and re-render instead of triggering full API refetches on every create/update/delete.
