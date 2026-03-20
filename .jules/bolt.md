## 2025-03-20 - Debounce search input
**Learning:** The `renderPromptList` function in `public/app.js` re-renders the DOM for every keystroke in the search input. This could become a performance bottleneck with a large list of prompts.
**Action:** Use a debounce function on the search input event listener to limit the rate at which `renderPromptList` is called.
