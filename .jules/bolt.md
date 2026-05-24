## 2024-05-24 - [Avoid N+1 Bottlenecks with Local State Updates]
**Learning:** During bulk operations (like importing multiple prompts), awaiting a full `fetchPrompts()` after each individual save request creates a massive N+1 HTTP request bottleneck and causes UI blocking.
**Action:** Use "Local state update" to manually upsert/remove items from local arrays based on the server response instead of refetching the entire dataset. For bulk actions, allow rendering to be skipped to prevent excessive DOM re-renders.
