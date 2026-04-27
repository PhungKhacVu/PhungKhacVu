## 2024-05-01 - Avoid N+1 API Calls on Bulk Mutations
**Learning:** In applications with bulk operations (like importing lists of items), calling a "fetch all" function after every single save operation creates a massive N+1 HTTP request bottleneck, slowing down the frontend and overwhelming the server.
**Action:** Use local state updates (`allPrompts.push()`, etc.) instead of re-fetching the entire dataset after mutations. Always explicitly omit empty IDs to avoid server-side creation issues.
