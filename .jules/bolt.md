## 2024-05-31 - [N+1 HTTP Bottleneck in File Imports]
**Learning:** During file imports, `app.js` loops over every item and calls `savePrompt()`, which internally calls `await fetchPrompts()` to update the UI. This causes N full API refetches during import, completely blocking the application.
**Action:** Replace `await fetchPrompts()` with batched local state updates, and use an optional `skipRender` parameter for `savePrompt` to avoid rendering until all promises resolve.
