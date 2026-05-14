## 2024-05-24 - [Local State Updates to Prevent N+1 API Refetches]
**Learning:** Calling a full data refetch (`fetchPrompts`) after every mutation creates massive N+1 HTTP request bottlenecks during bulk operations (like importing files) and unnecessarily blocks UI responsiveness.
**Action:** Use local state updates (updating `allPrompts` array directly) after mutations and accept a `skipRender` flag to batch UI updates efficiently during bulk processing instead of forcing synchronous refetches.
