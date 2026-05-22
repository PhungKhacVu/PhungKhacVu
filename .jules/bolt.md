## 2024-05-24 - N+1 Network Bottleneck on Frontend File Imports
**Learning:** Calling `fetchPrompts()` after every `savePrompt` creates a massive N+1 request bottleneck during file imports because `savePrompt` was issuing a full refetch on every loop iteration, locking the network and application.
**Action:** Replace full refetches with local state updates to `allPrompts` array after successful mutations. When bulk operations are running, use a `skipRender` flag to batch DOM updates efficiently.
