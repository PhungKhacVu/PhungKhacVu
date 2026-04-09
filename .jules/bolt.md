## 2024-05-24 - Optimistic UI Updates to Prevent N+1 Fetches
**Learning:** Calling full data refetches (like `fetchPrompts()`) inside CRUD operations (like `savePrompt` or `deletePrompt`) triggers massive N+1 HTTP request bottlenecks during bulk operations.
**Action:** Use optimistic UI updates by mutating local state (e.g., arrays) directly and triggering localized renders to improve frontend performance and reduce server load.
