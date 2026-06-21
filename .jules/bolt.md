## 2024-05-20 - Prevent N+1 Fetch on Bulk Save
**Learning:** The frontend's bulk import calls `savePrompt` which individually calls `fetchPrompts` after every save. This causes massive N+1 HTTP request bottlenecks when saving multiple items. Local state updates are necessary to batch updates.
**Action:** Use local state arrays and batch render updates instead of full refetches for individual mutation functions that are used in loops.
