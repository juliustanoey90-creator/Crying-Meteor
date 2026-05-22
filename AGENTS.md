# Crying Meteor

## Project

**Crying Meteor** is a nostalgic 8-bit web arcade experience inspired by claw machines in Indonesian malls.

Users play a pixel-art claw machine to discover collectible Indonesian supernatural creatures reimagined as cute, emotionally awkward companions.

## Experience tone

The experience should feel:

- nostalgic
- whimsical
- emotionally soft
- slightly melancholic
- playful
- mysterious
- internet-art inspired

## Visual inspiration

- old arcade cabinets
- retro handheld games
- pixel-art indie games
- CRT monitors
- cozy web nostalgia
- abandoned arcade atmosphere

## Important

This is **NOT** horror.

The ghosts should feel:

- misunderstood
- awkward
- lovable
- emotionally expressive
- strange but comforting

## Avoid

- modern SaaS aesthetics
- overly polished mobile game UI
- crypto/NFT vibes
- dark horror presentation
- generic mascot designs

## Design principle

The emotional experience matters more than realism.

---

## Technical notes (for agents)

| Topic | Rule |
|-------|------|
| Stack | Vite + React SPA at repo root; static deploy to Vercel |
| Tone guardrails | All copy, UI, and new characters must match the sections above |
| Characters | Indonesian folklore, cute/awkward — see `src/data/characters.ts` |
| Share URLs | Preserve `?find=<characterId>` in `src/components/ClawMachine.tsx` |
| Env vars | `VITE_SUPPORT_URL`, optional `VITE_QRIS_IMAGE_URL` — never expose `GEMINI_API_KEY` as `VITE_*` |
| Gemini | Not used in current source; `metadata.json` capability flag is AI Studio boilerplate |
| Sensitive | QRIS payload in `src/components/QrSupportModal.tsx` — payment config; avoid casual refactors |
| Image assets | Replace or edit PNGs in `public/assets/images/` — served at `/assets/images/<filename>` |

### Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```
