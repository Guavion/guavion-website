# Graph Report - guavion-website  (2026-10-13)

## Corpus Check
- 12 files · ~35,436 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 63 nodes · 65 edges · 8 communities (6 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c7b6be44`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.js
- contact.js
- Guavion website
- package.json
- Content and asset provenance
- index.js
- validation.md
- package.json

## God Nodes (most connected - your core abstractions)
1. `Guavion website` - 7 edges
2. `scripts` - 6 edges
3. `handleContact()` - 6 edges
4. `contactMiddleware()` - 6 edges
5. `Content and asset provenance` - 4 edges
6. `json()` - 3 edges
7. `handler()` - 2 edges
8. `configureServer()` - 2 edges
9. `private` - 1 edges
10. `dev` - 1 edges

## Surprising Connections (you probably didn't know these)
- `handler()` --calls--> `handleContact()`  [EXTRACTED]
  api/contact.js → server/contact.js
- `configureServer()` --calls--> `contactMiddleware()`  [EXTRACTED]
  vite.config.js → server/contact.js

## Import Cycles
- None detected.

## Communities (8 total, 2 thin omitted)

### Community 0 - "main.js"
Cohesion: 0.13
Nodes (11): applications, form, menu, motionPreference, nav, selectStep, status, steps (+3 more)

### Community 1 - "contact.js"
Cohesion: 0.23
Nodes (9): handler(), contactMiddleware(), handleContact(), interests, json(), limits, data, env (+1 more)

### Community 2 - "Guavion website"
Cohesion: 0.25
Nodes (7): Build and production preview, Guavion website, Interactions and accessibility, Local development, Private enquiry email, Validation, Vercel deployment

### Community 3 - "package.json"
Cohesion: 0.15
Nodes (12): devDependencies, vite, name, private, scripts, build, dev, preview (+4 more)

### Community 5 - "Content and asset provenance"
Cohesion: 0.40
Nodes (4): Bundled assets, Content and asset provenance, Design references, Source of truth

### Community 6 - "index.js"
Cohesion: 0.50
Nodes (3): port, root, types

## Knowledge Gaps
- **39 isolated node(s):** `type`, `name`, `private`, `version`, `type` (+34 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `type`, `name`, `private` to the rest of the system?**
  _39 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._