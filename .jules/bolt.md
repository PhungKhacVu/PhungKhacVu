## 2024-05-19 - Batch DOM updates during bulk file import
**Learning:** In public/app.js, replacing the list refetch with individual optimistic UI updates inside the map iteration for savePrompt led to N+1 re-renders and HTTP requests during bulk file imports.
**Action:** When handling bulk item creations or imports on the frontend, batch the DOM updates by adding a skipRender option to save/update functions, removing iterative refetches, and calling a single manual list render after Promise.all resolves.
