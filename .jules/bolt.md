## 2026-05-21 - Local state updates for bulk operations
**Learning:** Bulk save operations triggering full data refetches (N+1) create significant bottleneck.
**Action:** Use local state updates with a skipRender flag for batched operations.
