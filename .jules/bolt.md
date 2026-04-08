## 2024-05-24 - N+1 HTTP Requests During Bulk Import
**Learning:** Calling `fetchPrompts()` inside `savePrompt` causes massive N+1 HTTP requests when iterating over an array in bulk operations (like file import). Each saved item triggers a full list refetch.
**Action:** Use optimistic UI updates for local state (`allPrompts` array) on save/delete, and avoid full refetches unless necessary.
