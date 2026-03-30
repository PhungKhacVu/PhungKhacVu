## 2026-03-30 - Optimistic Local Updates & Debouncing
**Learning:** Re-fetching the entire prompt list on every save/delete operation and re-rendering on every keystroke causes unnecessary network traffic and DOM updates, degrading performance.
**Action:** Replaced `fetchPrompts()` with optimistic local state updates in `savePrompt` and `deletePrompt`, and added a 300ms debounce to the search input. This pattern should be applied to prevent unnecessary API calls and reflows.
