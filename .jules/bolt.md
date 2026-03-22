# Bolt's Performance Journal

## 2024-05-24 - Frontend Performance Bottleneck
**Learning:** The `renderPromptList` function in `public/app.js` re-renders the DOM for every keystroke in the search input. This causes unnecessary processing and jank, especially with larger prompt lists.
**Action:** Implement debouncing for the `searchInput` event listener to limit the rate at which `renderPromptList` is called.
