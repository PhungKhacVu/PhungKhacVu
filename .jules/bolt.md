## 2024-11-20 - Redundant Server State Fetches
**Learning:** The frontend historically refetched all prompts via `fetchPrompts()` on every mutation (save, delete, import). This effectively resulted in an O(N) payload bottleneck for every small data change.
**Action:** Replace `fetchPrompts()` calls with targeted local state array mutations (`push`, `findIndex`, `filter`) and manually invoke single re-renders to bypass unnecessary HTTP round trips.

## 2024-11-20 - Debounce Missing on Frequent Re-renders
**Learning:** `renderPromptList` was bound directly to the input event of `searchInput` with no debounce, blocking the main thread on every keystroke.
**Action:** Implement simple `setTimeout` based debouncing to batch search updates.
