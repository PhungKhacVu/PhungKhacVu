## 2026-05-29 - Local State Updates over Refetches
**Learning:** In a local-first web app with bulk operations (like file imports), triggering full data refetches and UI re-renders on every individual save leads to massive N+1 HTTP bottlenecks and UI lag.
**Action:** Use local state updates with an optional `skipRender` parameter for mutations (upsert/delete) to batch UI updates and eliminate redundant GET requests.
