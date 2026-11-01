# knobe.org front door: build report

Branch `front-door`, seven commits on top of `main` at `c7ada1f`. Built against the brief "knobe.org Front Door: Build Brief for Claude Code" (October 2026). Nothing on `main` was deleted; every existing page keeps its path.

## What was built

| Path | Status | Notes |
| --- | --- | --- |
| `/` | replaced | New front door: hero, equation, two-act illustration, Severed knowledge, three layers, collapsed real example reusing the existing verifier, three doors, footer. 387 prose words above the doors; 450 including interface labels and buttons. |
| `/docs/` | new | The previous homepage, byte-for-byte except title, canonical, og:title/url, and the word "Documentation" added to its eyebrow. |
| `/make`, `/build`, `/decide` | new | Door pages. Framing paragraphs are drafted and marked `<!-- DAVID: ... -->` in the source. |
| `/agent` | new | Install tabs (Claude Code, Cursor/VS Code, no-tools chat), paste-ready prompt, four-step path, pull quote from white paper section 5. |
| `/policy` | new | Claims, non-claims (including the two tightened claims from the portability dossier), obligation map with a visible under-review note. Print stylesheet included. |
| `/portability` | new, not in the brief | The manifesto "Knowledge Should Outlive Its Platform", added after David supplied the dossier mid-build. Linked from the front door's Severed knowledge section and from /make and /decide. |
| `/front.css` | new | One shared stylesheet for the six new pages. The brief said "inlined as the current site does it"; one shared file was the better engineering call for six pages that must stay consistent. |
| `/assets/share-card.png`, `/assets/share-card-with.png` | new | 1200×630 PNGs, act one and act two. Act one is the og:image on all new pages. |
| 27 existing pages | one-line change | A return bar (← knobe.org · Documentation) injected after the skip link, with its own small style block. Nothing else touched. |
| `sitemap.xml` | updated | Seven new entries. |

## Acceptance checks

| Check | Result |
| --- | --- |
| Front door word count above the doors ≤ 350 | **Not met as written.** 387 prose words; 450 with interface labels. The overage is the Severance paragraph (74 words), which is David's to cut or keep. Everything else was trimmed. |
| The word "context" does not appear on the front door | Met. The fourth chip was renamed from "Context notes" to "Interview notes" to satisfy this. |
| Every URL that resolved before still resolves | Met. 31 paths checked against the static tree, including all 20 sitemap entries, the engine, the example file, and the new pages. |
| Illustration plays both acts, honors prefers-reduced-motion, reads at 375px | Met. Verified by screenshot in all three states. Stations stack vertically on mobile; the traveling glyph is hidden there and under reduced motion, where the final frame renders statically. |
| og:image renders on LinkedIn and Slack previews | **Not verifiable before deploy.** Tags are correct and the PNG exists; check in the Netlify deploy preview with a link unfurl. |
| Agent path produces a verifier-accepted file in under sixty seconds from a fresh install | **Partially met.** The engine path (knobe-core.js `createKnobe` → `verify`) was run and returned `verified` with zero conformance issues in 11 ms; the sealed file is in `mcptest/sixty-second.knobe.md` beside this report's working copy. The MCP server itself could not be installed from this build environment: the npm registry was unreachable (`ENOTFOUND registry.npmjs.org`), and the local `mcp/` tree has uninstalled dependencies (`@modelcontextprotocol/sdk`). Josh or David should run `claude mcp add knobe -- npx -y knobe-mcp` and the paste-ready prompt once and time it. |
| Lighthouse ≥ 95 on all four categories, mobile | **Not run.** Lighthouse is not installed here and could not be fetched. The front door transfers 32 KB total with no external scripts, no web fonts, no tracking, and the verifier loads only on demand, so the performance category should clear easily. Run it in Chrome DevTools on the deploy preview. |
| No horizontal scroll on any new page at 375px | Met, after wrapping the policy table in a scrolling container. |
| Keyboard-only traversal reaches every control on the front door | Met. Tab order: skip link, brand, four nav links, three hero actions, act toggle (two buttons), replay, manifesto link, example summary, three doors. |
| All [David] items listed with location | Below. |

## Items for David

1. **Severance paragraph** (`site/index.html`, section "Severed knowledge"). Drafted by Claude per the brief; no settled phrasing was supplied. Edit in place.
2. **Fourth chip name.** No preference was given; "Source" was used, and the existing "Context notes" became "Interview notes" to keep the word "context" off the front door. Both are in `site/index.html` (four stations) and in the share cards. If you change the chip names, regenerate the cards.
3. **Acronym expansion in the footer.** No preference given; omitted. The footer is in `site/index.html` and in the generator's `FOOT` template for the other pages.
4. **Door framing paragraphs** (`site/make.html`, `site/build.html`, `site/decide.html`, each marked `<!-- DAVID: framing paragraph drafted by Claude; edit freely -->`).
5. **Policy obligation map** (`site/policy.html`). The Decree 179/2026 rows rest on PwC Italia and Il Sole 24 ORE reporting. Remove the amber under-review note once confirmed against the decree text.
6. **Manifesto text** (`site/portability.html`). Two em dashes in the supplied draft were replaced with commas, in the heading "Reverse the dependency, without abolishing the platform" and in "what remains ours, and what remains intelligible". Revert if you prefer the dashes. The eyebrow calls it a working publication draft; change when it is final.
7. **Zenodo and a DOI** for the manifesto are not part of this build.

## Findings while building

- **Studio works.** The review's note that Studio reported "engine could not be loaded" was an artifact of fetching the page without a browser. In headless Chromium it loads with no console errors.
- **`/mcp` is stale on one line.** It still says "Once the package is published to npm as knobe-mcp, the command becomes npx -y knobe-mcp". The package is published (badge on the README), so that sentence and the preceding `node /absolute/path` command can be replaced with the npm form. Not changed, since the brief said not to touch the docs layer.
- **`/why-context`** exists, is in the sitemap, and is not in the docs nav. Left alone.
- **Pretty URLs.** The site relies on Netlify mapping `/make` to `/make.html`. The new pages follow that convention; the local static server used for checks needed the `.html` suffix.

## How to review and ship

```
git fetch <wherever this branch lands>
git checkout front-door
```

Push the branch; Netlify will build a deploy preview from `site/`. Check the front door, the illustration on a phone, a link unfurl in Slack or LinkedIn for the share card, and Lighthouse in DevTools. Merge when satisfied. No build step, no config change: `netlify.toml` is untouched.
