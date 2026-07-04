## 2024-07-04 - Local State Optimization vs Full Refetch
**Learning:** Optimistic UI local state updates during bulk operations like file imports (saving multiple items in a loop) prevent massive N+1 HTTP request bottlenecks compared to calling a full data refetch (e.g. `fetchPrompts()`) after every single save or delete operation.
**Action:** When updating single items, update the local data array manually and re-render instead of doing full network refetches, especially when those updates might happen repeatedly in a loop.
