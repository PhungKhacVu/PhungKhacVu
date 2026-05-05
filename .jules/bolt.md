## 2024-05-14 - [Local State Update for Performance]
**Learning:** In a vanilla JS/DOM app with a REST API, re-fetching all data (`fetchPrompts`) after every creation, update, and deletion is an easy way to ensure the UI is fresh but scales poorly and blocks the UI waiting for a network round-trip. This creates an N+1 problem on the frontend during bulk actions (like import).
**Action:** Update the local memory array (`allPrompts`) synchronously immediately after the specific REST action succeeds, and re-render from local state. Added a `skipRender` option to `savePrompt` so during batch imports, rendering only occurs once at the end.

## 2024-05-14 - [Debounce Search Input]
**Learning:** Re-rendering a large DOM list on every keystroke synchronously blocks the main thread and makes typing feel sluggish.
**Action:** Implemented a 300ms debounce on the `searchInput` event listener to batch `renderPromptList` calls.
