## 2024-07-05 - Avoid O(N) DOM list recreation for state updates
**Learning:** In vanilla JavaScript apps, re-rendering an entire list to update a single item's state (like an "active" class) causes O(N) layout thrashing and unnecessary DOM manipulation.
**Action:** When updating the active item selection, optimize by directly manipulating the 'active' class (e.g., `classList.remove` and `classList.add`) instead of calling `renderPromptList` to recreate the entire DOM structure.
