# Graph Report - guavion-website  (2026-10-12)

## Corpus Check
- 12 files · ~35,539 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 68 nodes · 70 edges · 10 communities (7 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `80b623ad`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- main.js
- contact.js
- Guavion website
- package.json
- scripts
- Content and asset provenance
- index.js
- contact.test.js
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

## Communities (10 total, 3 thin omitted)

### Community 0 - "main.js"
Cohesion: 0.10
Nodes (16): applications, form, gate, gateCode, gatedRegions, gateError, gateForm, menu (+8 more)

### Community 1 - "contact.js"
Cohesion: 0.36
Nodes (7): handler(), contactMiddleware(), handleContact(), interests, json(), limits, configureServer()

### Community 2 - "Guavion website"
Cohesion: 0.25
Nodes (7): Build and production preview, Guavion website, Interactions and accessibility, Local development, Private enquiry email, Validation, Vercel deployment

### Community 3 - "package.json"
Cohesion: 0.29
Nodes (6): devDependencies, vite, name, private, type, version

### Community 4 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, preview, start, test

### Community 5 - "Content and asset provenance"
Cohesion: 0.40
Nodes (4): Bundled assets, Content and asset provenance, Design references, Source of truth

### Community 6 - "index.js"
Cohesion: 0.50
Nodes (3): port, root, types

## Knowledge Gaps
- **44 isolated node(s):** `type`, `name`, `private`, `version`, `type` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `handleContact()` connect `contact.js` to `contact.test.js`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `type`, `name`, `private` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `main.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._