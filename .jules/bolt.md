## 2024-06-16 - Local State Updates vs N+1 Refetches
**Learning:** The frontend's `savePrompt` function originally fired a full data refetch (`fetchPrompts`) after every successful save. During bulk operations like file imports (iterating over `savePrompt`), this architectural bottleneck caused massive N+1 HTTP request spikes and UI layout thrashing.
**Action:** Implement local state updates (upserting into arrays) instead of relying on full API refetches after mutations. For bulk operations, introduce a `skipRender` flag to batch DOM updates efficiently until all items are processed.
