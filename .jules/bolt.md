## 2023-10-25 - Prevent O(N) layout thrashing on selection
**Learning:** Calling `renderPromptList` completely recreates the DOM for the prompt list just to update the 'active' class on a single item. This causes unnecessary layout thrashing.
**Action:** When updating the active state of an item in a list, manipulate the classList directly instead of completely rebuilding the list's DOM.
