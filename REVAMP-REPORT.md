# knobe.org front door: build report

Branch `front-door`, seven commits on top of `main` at `c7ada1f`. Built against the brief "knobe.org Front Door: Build Brief for Claude Code" (October 2026). Nothing on `main` was deleted; every existing page keeps its path.

## What was built

| Path | Status | Notes |
| --- | --- | --- |
| `/` | replaced | New front door: hero, equation, two-act illustration, Severed knowledge, three layers, collapsed real example reusing the existing verifier, three doors, footer. 492 words above the doors including the active scene caption; the three-scene illustration added its captions to the count. |
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
| Front door word count above the doors ≤ 350 | **Not met as written.** 492 words including the active scene caption and interface labels. David chose three switchable scenes over one, and each needs its caption; the overage is that choice plus the Severance paragraph, both his calls. |
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
2. **Scene wording.** The oral-history example was replaced by three scenes in `site/stage.js` (KNOBE_SCENES): a house, a job, a product, a study (pilot dataset to policy brief), an agent (pricing memo to automated reply). Station names, chips, captions and the two verdict stamps per scene are all in that one array. The front door opens on the house, /make on the study, /build on the agent, /decide on the job; /policy carries the job case as prose above the obligation map. If you change the house chips or verdicts, regenerate the share cards.
3. **Acronym expansion in the footer.** No preference given; omitted. The footer is in `site/index.html` and in the generator's `FOOT` template for the other pages.
4. **Door framing paragraphs** (`site/make.html`, `site/build.html`, `site/decide.html`, each marked `<!-- DAVID: framing paragraph drafted by Claude; edit freely -->`).
5. **Policy obligation map** (`site/policy.html`). The Decree 179/2026 rows rest on PwC Italia and Il Sole 24 ORE reporting. Remove the amber under-review note once confirmed against the decree text.
6. **Manifesto text** (`site/portability.html`). Two em dashes in the supplied draft were replaced with commas, in the heading "Reverse the dependency, without abolishing the platform" and in "what remains ours, and what remains intelligible". Revert if you prefer the dashes. The eyebrow calls it a working publication draft; change when it is final.
7. **Zenodo and a DOI** for the manifesto are not part of this build.

## The illustration, after the scene swap

Five scenes, one mechanism, switchable in place: the scene tabs (A house, A job, A product, A study, An agent) sit beside the Without/With toggle. The study runs a pilot dataset to a policy brief (the stamp: "The treatment works." against "Pilot, n = 42. Correlation only."); the agent runs a pricing memo through two agent hops to an automated reply with no person in the chain ("$14 per seat, locked in." against "Draft. Internal. Expires Dec 31."). /make now opens on the study, /build on the agent. Each run ends with a stamped verdict on the last station: in act one the false confidence ("Roof in good condition." / "Consistently underperforms." / "Yes, fine for outdoor use."), in act two the preserved truth. Chips fall with weight (rotation and gravity easing), stations render as paper documents with a folded corner, and the stamp thunks in half a second after the last arrival. Reduced motion renders the final frame with the stamp, no animation. The share cards carry the house scene with its stamp.

## The night pass

The all-paper page read calm to David ("like picking out a mattress"), so the lighting now carries the argument: the masthead, hero and Severed-knowledge band sit on a near-black green (--night), the explanation and tools stay on paper, and red (--alarm) appears only on loss states: lost chips, zero counters, the act-one stamp. The share cards moved to the night background, white documents on dark. Contrast ratios on the dark surfaces run 8:1 or better. Georgia is unchanged throughout.

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
