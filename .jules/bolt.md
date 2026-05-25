## 2026-05-25 - [N+1 API Requests in Bulk Imports]
**Learning:** Calling fetchPrompts() unconditionally in savePrompt caused N+1 full list refetches during bulk imports via importFileInput. Local state updates are necessary to avoid massive performance drops during batch operations.
**Action:** Use local state updates for single mutations and introduce a skipRender flag for batch operations.
