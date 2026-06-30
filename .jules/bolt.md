## 2024-06-30 - Local state arrays update instead of full data refetches
**Learning:** Avoid massive N+1 HTTP request bottlenecks during bulk operations (like frontend file imports that iterate over savePrompt) by updating local state (e.g. `allPrompts` array) directly instead of calling full data refetches (`fetchPrompts()`).
**Action:** Always verify if a full refetch can be skipped in favor of an upsert to a locally managed state object or array. Ensure to trigger necessary UI updates afterward and omit internal parameters like hidden IDs appropriately.
