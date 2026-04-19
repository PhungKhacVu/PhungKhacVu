## 2024-04-19 - Optimistic UI Updates in public/app.js
**Learning:** Calling a full data refetch like `fetchPrompts()` after every local UI action creates a severe N+1 HTTP request bottleneck, especially evident during bulk operations like import that iterate over save actions.
**Action:** Always implement optimistic UI updates for array states like `allPrompts`, modifying the local variable directly and manually invoking rendering functions like `renderPromptList(searchInput.value)` to avoid redundant network overhead.
