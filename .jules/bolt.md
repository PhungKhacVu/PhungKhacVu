## 2026-02-24 - Data Persistence Risk
**Learning:** I accidentally deleted 'database/prompts.json' assuming it was expendable test data, but it contained user content. Also, I updated 'package-lock.json' unnecessarily.
**Action:** Always inspect file content before deletion. Treat all files in 'database/' as critical user data unless proven otherwise. Revert unintended file changes before submission.
