## 2026-05-12 - N+1 Network Requests in UI Actions
**Learning:** Relying on network requests (like `fetchPrompts`) after mutating operations in bulk actions causes severe N+1 bottlenecks and performance drops.
**Action:** Use optimistic UI updates and modify local state arrays (like `allPrompts`) directly. Incorporate a flag (e.g., `skipRender`) to skip frequent DOM renders during batched updates to avoid main thread blocking.
