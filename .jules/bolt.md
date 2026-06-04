
## 2024-05-24 - N+1 Bottleneck in Bulk Operations via Local State
**Learning:** In a vanilla JS SPA without global state management (like Redux/Vuex), performing bulk operations (like importing files) by iterating over a `savePrompt` function that triggers a full `fetchPrompts()` on every loop causes severe N+1 HTTP request bottlenecks and UI render thrashing.
**Action:** Always implement optional `skipRender` parameters for UI updates and update local state directly via upsert operations when mutations succeed, bypassing the need for redundant HTTP GET operations.
