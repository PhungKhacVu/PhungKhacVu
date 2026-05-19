## 2024-05-19 - [Fix N+1 fetch bottleneck in savePrompt during bulk imports]
**Learning:** Found a major N+1 performance bottleneck. Calling `fetchPrompts` after every `savePrompt` triggers N full fetches during bulk imports where `savePrompt` is called in a loop over imported items. This stalls the server/browser completely for large imports.
**Action:** Always prefer updating local client state directly ("Local state update" logic) after mutations instead of relying on a full refresh loop, especially for bulk operations.
