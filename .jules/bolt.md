## 2024-05-08 - Optimistic Frontend Updates for List Modifiers
**Learning:** In public/app.js, savePrompt and deletePrompt were re-fetching all prompts after successful updates, creating redundant O(N) API calls and forcing full DOM re-renders via fetchPrompts().
**Action:** Always implement optimistic updates on the client side (updating the local allPrompts array and re-calling renderPromptList) instead of relying on a complete fetch to refresh the list, minimizing latency and rendering overhead.
