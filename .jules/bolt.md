## 2024-07-03 - Optimizing List Selection Rendering
**Learning:** In vanilla JS apps, re-rendering an entire list just to change an active item state causes O(N) layout thrashing and unnecessary DOM manipulation.
**Action:** Update the active class directly via DOM manipulation (`classList.remove`/`add`) instead of calling the list render function.
