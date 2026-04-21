## 2024-05-18 - Optimistic UI to Fix N+1 Bottleneck
**Learning:** During bulk operations like file import, calling `fetchPrompts` inside iterating functions like `savePrompt` creates a severe N+1 HTTP request bottleneck, causing UI freezing and server spam.
**Action:** Implement optimistic local state updates directly in `allPrompts` for `savePrompt` and `deletePrompt` instead of waiting on `fetchPrompts` refetches to ensure bulk imports are performant.
