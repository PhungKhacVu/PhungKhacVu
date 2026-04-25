## 2024-04-25 - Local State Updates on Data Arrays
**Learning:** In the frontend, `savePrompt` sends an empty `id` when creating a new prompt if the form has a hidden `id` field. This bypasses the backend's ID generation or inserts corrupted data if not handled properly.
**Action:** When saving new records, ensure fields like `id` are omitted (`delete payload.id;`) before stringifying to JSON so the backend can properly assign a unique identifier.
