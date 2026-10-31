# Mahandar Kumar — The House (3D Game Portfolio)

An interactive 3D portfolio you **walk through like a game**. Open a lone door
floating in space, step through it into a house, explore rooms about me (Home, Skills, Projects, About),
and hunt for hidden keys that open a secret vault.

Built for the **AWS Student Portfolio Hackathon** and hosted on **AWS Amplify Hosting**.

> **Live site:** https://main.d2gaf2v937ut0e.amplifyapp.com
> **Prefer plain text?** Every visitor can switch to the **Classic view** (top-right) —
> a fast, accessible, mobile-friendly version of the same content.

## The three core sections

| Section | Where |
|---|---|
| About Me | the About room (and *About Me* in Classic view) |
| Skills / Tech Superpowers | the Skills room |
| Projects | the Projects room: one chest per project, six featured projects |

## The creative feature: The Three Keys

Three brass keys are hidden in the house. A badge in the corner (`0/3`) shows
your progress, and the welcome screen tells you the hunt exists. Collect all
three to unlock the vault at the end of the corridor.

The hunt never blocks navigation: the four main rooms are always open.

## Tech stack

- **Next.js 16** (App Router), React 19, TypeScript — exported as a **fully static site**
- **React Three Fiber** + drei + three.js — every wall, lamp and key is built from code
  (procedural geometry and shaders; there are no heavy 3D model files)
- **GSAP** — intro and camera transitions · **Zustand** — game state · **Tailwind CSS v4**
- **AWS Amplify Hosting** — CI/CD from this repo, served through CloudFront

### Why a static export?

The portfolio is identical for every visitor, so nothing needs a server per
request. `next build` writes plain files to `out/`, and Amplify serves them from
a CDN: fast, cheap, and there is no server to crash while judges test it.
(`output: "export"` in `next.config.ts`, `baseDirectory: out` in `amplify.yml`.)

## Accessibility and SEO

The 3D scene is drawn on a `<canvas>`, which crawlers and screen readers cannot
read. So the real text (About, Skills, Projects, Contact) is also rendered as
semantic HTML — a visible **Classic view**, plus a hidden copy in the static HTML —
along with Open Graph tags and JSON-LD. The intro is skippable and respects
`prefers-reduced-motion`.

## Run it locally

```bash
npm ci
npm run dev      # http://localhost:3000
npm run build    # static export into ./out
```

## Project structure

```
src/
  app/             Next.js entry (layout, metadata, page)
  components/
    intro/         the floating door intro (3D scene + overlay)
    space/         shared procedural space: nebula, planet, sun, rocks
    scene/         corridor, rooms (Home/Skills/Projects/About/Attic), props
    hud/           navigation menu, key badge, overlays
    classic/       plain-HTML Classic view + hidden SEO copy
  content/         text content in one place (site + attic)
  store/           Zustand stores (app stage, keys, player, space)
amplify.yml        Amplify build settings
```

## Notes

- Fonts: Bacley (demo, personal use) and Spirtush.
- This site was first prototyped on another host and then rebuilt for the
  hackathon: new intro, Classic view, SEO layer, key hunt, and AWS deployment.
