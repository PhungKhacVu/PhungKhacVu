## 2024-05-18 - [Local State Sync to prevent N+1 refetch]
**Learning:** During bulk operations (like importing multiple prompts), calling `fetchPrompts()` inside `savePrompt` triggers an N+1 HTTP request bottleneck because every saved item causes a full refetch of all items.
**Action:** Use local state synchronization (often called optimistic UI, though technically it's a cache update after success) to modify the local `allPrompts` array directly with the server response instead of re-fetching the entire dataset. Ensure a corresponding UI render function is explicitly called afterward.
