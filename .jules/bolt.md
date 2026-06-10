## 2026-06-10 - Eliminate N+1 Fetch Bottleneck on Bulk Import
**Learning:** During bulk operations like importing many items simultaneously, triggering a full network list refetch `fetchPrompts()` on every loop iteration creates a severe N+1 request and DOM render bottleneck.
**Action:** Implemented local state upserting logic in `savePrompt` to update the array directly. Added an optional `skipRender` parameter to batch DOM updates until all items are fully mapped, eliminating network overhead and speeding up batch updates.
