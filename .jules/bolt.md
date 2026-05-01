## 2023-10-24 - N+1 API request bottleneck in bulk mutations
**Learning:** Triggering a full data refetch `fetchPrompts()` inside mutation functions like `savePrompt()` causes massive N+1 API request bottlenecks during bulk operations (like iterating over an array to save multiple imported prompts).
**Action:** Use local state updates (updating the frontend array directly) after awaited mutations to avoid unnecessary network roundtrips, ensuring UI rendering functions like `renderPromptList()` are explicitly called afterward.
