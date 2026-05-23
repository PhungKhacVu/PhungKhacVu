## 2024-05-24 - N+1 HTTP request bottlenecks mitigated by local state updates

**Learning:** When performing bulk operations (like importing multiple prompts), relying on full list refetches (`fetchPrompts()`) after each individual save (`savePrompt()`) can lead to severe N+1 HTTP request bottlenecks and unnecessary re-renders.
**Action:** Always prefer local state updates (e.g., upserting into the local array) combined with a batch rendering approach using an optional `skipRender` parameter, to ensure DOM updates are efficient and network overhead is minimized during bulk mutations.
