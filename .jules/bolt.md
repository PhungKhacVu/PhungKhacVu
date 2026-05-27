## 2024-05-14 - Optimize Bulk Imports and Local State Updates
**Learning:** Relying on full data refetches for local state updates can cause massive N+1 HTTP request bottlenecks during bulk operations.
**Action:** When saving or deleting records, perform local state updates and conditionally batch UI re-renders to prevent redundant fetch requests and DOM repaints, especially during iterations over arrays.
