## 2025-02-12 - Local state update over re-fetch

**Learning:** Optimistic or local state updates in client side data rendering greatly reduces N+1 API bottlenecks. During bulk imports, mapping across imports to save individual prompts triggered massive simultaneous UI re-renders and network fetch requests when saving each.

**Action:** Whenever possible avoid `fetchPrompts()` style methods unless necessary, by locally injecting/updating/deleting from arrays stored in state (`allPrompts`) and selectively calling render using the `skipRender` parameter for operations running in bulk batches.
