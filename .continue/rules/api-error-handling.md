---
{}
---

Always handle API responses with proper error checking. Return structured objects with error flags instead of throwing exceptions that can break UI. Check for valid JSON and content-type before parsing responses.