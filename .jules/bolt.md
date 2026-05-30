## 2024-05-30 - DOM Thrashing on Selection
**Learning:** Re-rendering an entire DOM list just to update a single CSS class (like `.active`) causes O(N) node destruction/creation, leading to severe layout thrashing on selection.
**Action:** Always prefer targeted O(1) DOM manipulations (e.g., `classList.add`/`remove`) for simple state changes rather than calling the main render function.

## 2024-05-30 - Frontend N+1 on Import
**Learning:** The `import` functionality loops over an array of prompts and calls `savePrompt` on each. Each `savePrompt` triggers a `fetchPrompts`! So an import of N prompts causes N POSTs AND N full GETs of the database.
**Action:** Bulk operations should not trigger individual UI/State refetches.
