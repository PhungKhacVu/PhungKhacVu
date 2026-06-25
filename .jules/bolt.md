## 2024-06-25 - Local State Updates for Fast Rendering
**Learning:** In bulk operations (like importing multiple files), calling `fetchPrompts()` after every save leads to an N+1 HTTP request bottleneck and layout thrashing.
**Action:** Update the local data array (e.g., `allPrompts`) directly and use an optional `skipRender` flag to batch DOM updates efficiently.
