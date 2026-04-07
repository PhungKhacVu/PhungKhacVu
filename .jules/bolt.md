## 2024-04-07 - Avoid N+1 requests during UI state updates
**Learning:** The frontend file import feature iterates over `savePrompt`. Avoid calling full data refetches (like `fetchPrompts()`) inside operations like `savePrompt`, as it triggers massive N+1 HTTP request bottlenecks during bulk operations.
**Action:** Use optimistic UI updates instead by modifying local state arrays directly and re-rendering, avoiding unnecessary network refetches after atomic operations.
