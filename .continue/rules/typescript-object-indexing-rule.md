---
{}
---

When working with objects of unknown shape, use one of these approaches: 1) Cast to 'any' or 'Record<string, any>' when you know the object will have dynamic properties, 2) Use optional chaining with explicit type guards, or 3) Define explicit interfaces with index signatures like 'Record<string, unknown>'.