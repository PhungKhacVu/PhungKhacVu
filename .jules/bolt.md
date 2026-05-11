## 2026-05-11 - Local state updates for list mutations
**Learning:** Full list refetches (`fetchPrompts()`) after every mutation (save/delete) cause an N+1 HTTP request bottleneck during bulk operations like file imports.
**Action:** Replace `fetchPrompts()` with local state updates of the data array, and add an optional `skipRender` parameter to mutation functions to batch DOM updates efficiently during bulk operations.
