# Friend Maker Missions

Single-page Next.js app for weekly friend-making missions (3 cards/week).

## Run locally

```bash
npm i
npm run dev
```

## Content

Add missions as MDX in `content/missions/*.mdx`.

Frontmatter fields:
- `id` (string)
- `title` (string)
- `tags` (array of strings)

The MDX body should be **<= 20 words**.

## Weekly logic

- Week key is **week starting Monday UTC**
- Missions are shuffled deterministically by the week key
- Shows 3 missions for the week
- Stores "accomplished" state per week in `localStorage`
- Remembers theme (dark/light) in `sessionStorage` (dark by default)
