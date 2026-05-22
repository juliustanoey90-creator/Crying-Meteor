# Crying Meteor

A nostalgic 8-bit web arcade — pixel-art claw machine collecting cute, awkward Indonesian folklore companions.

See [AGENTS.md](AGENTS.md) for product tone and design guardrails.

## Run locally

**Prerequisites:** Node.js 18+

```bash
npm install
cp .env.example .env.local   # edit VITE_SUPPORT_URL if needed
npm run dev
```

Open http://localhost:3000

```bash
npm run build   # output in dist/
npm run lint
```

### Blank page?

Usually a stale Vite cache or an old dev server still on port 3000:

```bash
# stop any running dev server, then:
rm -rf node_modules/.vite
npm run dev
```

Hard-refresh the browser (Cmd+Shift+R).

### Image assets

Replace PNGs in **`public/assets/images/`** (same filename = no code change). They are served at `/assets/images/<filename>`.

Character sprites are listed in `src/data/characters.ts` (folklore set uses PNGs; other sets use vector sprites in `PixelSprite.tsx`).

Machine art (claw, ghosts, meteor, capsules) is referenced in `ClawMachine.tsx` and `ClawGame.tsx`.

## Deploy to Vercel

1. Push this repo to GitHub (or import the folder in the Vercel dashboard).
2. Framework preset: **Vite** — build `npm run build`, output `dist`.
3. Environment variables:
   - `VITE_SUPPORT_URL` — tip-jar link (e.g. Ko-fi)
   - `VITE_QRIS_IMAGE_URL` — optional QR image override
4. `vercel.json` is included for SPA routing (`?find=` share links).

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Optional: connect custom domain `cryingmeteor.site` in Vercel → Domains.

## Origin

Exported from [Google AI Studio](https://ai.studio/apps/ba33bf1c-468b-474a-a6b8-368e122a8cd6).
