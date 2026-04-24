## 2024-05-18 - [Optimistic UI to Prevent N+1 Refetches]
**Learning:** During concurrent bulk saves (like importing files which loops over items and calls savePrompt), calling full list refetches (`fetchPrompts()`) after every single save creates a massive N+1 request bottleneck and race conditions.
**Action:** Use optimistic UI updates (directly modifying local arrays like `allPrompts`) and selectively re-rendering instead of awaiting full server refetches for every mutating operation.
