## 2024-05-24 - [Avoid N+1 HTTP Request Bottleneck in Bulk Operations]
**Learning:** During bulk operations like file import, calling a full refetch (`fetchPrompts()`) for each item causes a massive N+1 HTTP request bottleneck, blocking the UI and spamming the server.
**Action:** Use local state updates (`allPrompts.push` or upsert) paired with a batched/deferred re-render (`skipRender`) to avoid fetching everything multiple times, thus dramatically improving bulk operation performance.
