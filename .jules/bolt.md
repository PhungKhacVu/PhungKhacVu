## 2024-05-24 - Avoid refetching full list after local mutation
**Learning:** In public/app.js, `savePrompt` and `deletePrompt` refetched the entire prompts array over the network via `fetchPrompts()` after each successful API call. This is an anti-pattern causing unnecessary O(N) network requests and delayed UI updates.
**Action:** Update the local array (`allPrompts`) directly using the response from the server, then re-render the UI based on local state. This eliminates the extra network call and makes the app significantly more responsive.
