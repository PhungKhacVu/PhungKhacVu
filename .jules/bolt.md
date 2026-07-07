## 2024-07-25 - N+1 Bottleneck in Bulk Operations with Local State Re-fetch
**Learning:** The frontend iterated over `savePrompt` during bulk file imports, and `savePrompt` previously called `await fetchPrompts()` to refresh the state. This caused a massive N+1 HTTP request bottleneck, firing O(N) GET requests for every item saved.
**Action:** Always implement 'Local state update' logic inside mutation functions (like `savePrompt` and `deletePrompt`) combined with an optional `skipRender` parameter to allow batching DOM updates efficiently, thereby eliminating the need for a full refetch.
