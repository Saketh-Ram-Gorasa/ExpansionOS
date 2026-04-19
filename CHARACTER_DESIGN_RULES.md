# Character Design Rules for ExpansionOS Agents

Last updated: 2026-04-19

## Scope
These rules apply to every visual form used in `AgentAvatar`, `AgentSprite`, and any future agent renderer.

## 1) Core Principles
- Agents must read as distinct people, not abstract icons.
- Every agent should show 3 visual cues in under 3 seconds: head, face, and posture.
- Motion should communicate state before labels.
- No floating blobs, no ambiguous body fragments.
- Do not use full realism. Pixel/boardgame density is allowed, but anatomy should be legible.

## 2) Human Form Grammar
- Head: round or box shape plus clear face slot.
- Face: two eyes and one mouth, minimum size and contrast visible at 64x80.
- Torso and limbs: must have at least shoulder-to-hip silhouette.
- Identity: each style must imply one distinct identity.
- Expression: use mouth/eye angle for the active state.

## 3) State Language
- `idle`: neutral head and relaxed posture.
- `thinking`: slight head tilt + raised eyebrow or focus line.
- `calling`: shoulder pulse, active mouth line, and one outbound cue.
- `done`: calm pulse, eyes open, posture upright.

## 4) Pixel Style Variants
- **vector**: clean rounded edges, larger readable silhouette, subtle skin tones.
- **pixel**: strict block and staircase shapes, but with facial details.
- **lego**: blocky proportions with hand/arm blocks and visible studs.

## 5) Color Rules
- Keep skin tones at least 2 steps away from panel background.
- Accent must be used as clothing/outline only.
- Avoid full-surface fill of only accent color.
- State indicators can use accent variants only.

## 6) Motion Rules
- Use small, repetitive movement, no chaotic jitter.
- Avoid full scale pulsing.
- Motion must stop at idle state.

## 7) Accessibility / Readability
- Body contrast ratio for key edges should stay above 4.5:1 against white surfaces.
- Never place light-on-light text or shape with only subtle contrast.

## 8) Anti-patterns (do not do)
- Single-color torso with no face detail.
- No mouth in any state.
- No disconnected limbs.
- Animated spinning without semantic purpose.

## 9) Reusable Output Contract
- Character SVG must expose one root class `agent-avatar-svg` and optional state class.
- Component props: `{ style, accent, state }` only.

## 10) Character File Ownership
- Authoritative file: `src/components/AgentAvatar.tsx`
- Any review changes should reference these rules first.
