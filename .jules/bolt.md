## 2023-10-24 - [Avoid N+1 Fetch Storms with Optimistic UI]
**Learning:** Bulk operations (like importing prompts) trigger N+1 fetch storms if individual save operations refetch the entire list.
**Action:** Always use optimistic UI updates for local state (e.g., updating an array directly) instead of full refetches after modifications.
