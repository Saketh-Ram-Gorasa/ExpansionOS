# ExpansionOS UI/UX — Locked Style Runs

## Date
- 2026-04-19

## Status
- `LOCKED` for hackathon delivery.
- Use this file as the source of truth for all visual decisions unless explicitly changed in a new run.

## Style Run 01 — `run-white-pixel-human-core`

### 1) Core direction
- **Theme name:** Pixel Human Command
- **Look:** Light/base-white interface with subtle pixel-grid atmosphere and sharp arcade-inspired surfaces.
- **Goal:** Distinctive, memorable, and immediately understandable startup strategy cockpit.
- **Constraint:** No purple-heavy dark dashboards. No generic SaaS card stacks.

### 2) Brand voice
- Tone is **decisive, founder-friendly, and execution-focused**.
- Language is short and outcome-oriented.
- Every view should answer:  
  - What are agents doing now?  
  - What evidence was used?  
  - What is the immediate next startup move?

### 3) Visual tokens
- **Background:** white-forward gradients with low-intensity tints from `--bg-void`, `--bg-elev`, `--panel`.
- **Line treatment:** thin, high-contrast borders with mild dashed micro accents.
- **Typography:**  
  - Display/labels: `Press Start 2P` (`--font-pixel`)  
  - Body/paragraphs: `VT323` (`--font-terminal`)  
- **Mode tokens:** keep one strong accent + one secondary per mode, all with high legibility on white.
  - Core `#6c8dff / #56f7ff`
  - Mission Control `#2fb6c5 / #a7e8ff`
  - Retro Ops `#ff9f2f / #ffd39e`
  - Detective Board `#bf7f3f / #ffd28c`
  - Boardroom `#ff6f88 / #ffc2d2`
  - AI OS `#44d7a7 / #8efecf`

### 4) Layout structure (locked)
Use this exact hierarchy:
1. **Top rail:** mode switch + title + status indicators + cues.
2. **Primary grid:** mission dossier, live call bus, agent rack.
3. **Secondary grid:** expansion ranking, YC lens.
4. **Tertiest:** verdict ticker + demo checklist.

No route should rearrange this structure.

### 5) Character system (hard requirement)
- Agents must be human-readable figures (not icon blobs).
- Minimum visible anatomy:
  - head
  - eyes + mouth
  - torso + limbs
- One style family is allowed per avatar render:
  - `vector` (rounded clean), `pixel` (blocky), `lego` (chunky studs).
- State language is fixed:
  - `idle`: neutral
  - `thinking`: small focus micro-expression
  - `calling`: active phone/action cue
  - `done`: calm completion glow
- Full rule set is in [`CHARACTER_DESIGN_RULES.md`](./CHARACTER_DESIGN_RULES.md).

### 6) Motion rules (locked)
- Keep motion readable and purposeful:
  - idle breathing/quiet
  - call pulse + bus pulse
  - reveal animations only
- No chaotic jitter. No full-component scaling.
- Duration should stay sub-second for critical feedback, no long blocking animations.

### 7) Interaction rules
- Mode navigation is always visible and sticky within header.
- Every actionable state must have visible text label + visual state chip.
- Status and confidence are always shown per agent.
- Calls are shown as moving packets or chips so “AI is working” is obvious.

### 8) Accessibility and contrast
- Text contrast must remain readable on white backgrounds.
- Never place light text on light shape.
- Preserve clear spacing hierarchy; avoid cramped dense blocks.

### 9) Anti-patterns (do not ship)
- Generic rectangle icon agents.
- Flat dark-gradient background with low-contrast text.
- Repeated heavy panels with equal visual weight.
- Untuned mode differences that do not clearly switch the experience.

### 10) Future runs
- New runs must be tagged with:
  - `run-<name>-v#`
  - `status: LOCKED | PROPOSAL | DEPRECATED`
- New runs inherit token names from this file; any deltas require explicit mode and component diffs.
