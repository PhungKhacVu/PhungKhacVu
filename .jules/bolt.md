## 2024-05-24 - N+1 HTTP Requests During Bulk Save
**Learning:** Calling `fetchPrompts()` after every individual mutation causes severe network congestion during bulk operations like file imports, since `savePrompt` is executed concurrently in a loop.
**Action:** Use local state updates (`allPrompts.push()` or index replacement) after awaiting the server's response instead of re-fetching the entire list, and batch DOM re-renders during bulk operations using a `skipRender` flag.
