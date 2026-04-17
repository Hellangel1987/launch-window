# Launch Window

A tiny, fully static browser game MVP built for fast publishing on GitHub Pages or itch.io.

## Concept

**Launch Window** is a 7-day score-run where the player tries to launch a small software product into a shifting market.

Each day, you choose one move:
- build features
- polish UX
- run hype
- discount early
- pivot a little
- or launch now

The goal is to balance runway, build progress, market fit, and hype to end the week with the best score.

## Files

- `index.html` - app shell and meta tags
- `style.css` - responsive UI styling
- `game.js` - all game logic, no dependencies
- `cover.svg` - lightweight 1200x630 social/share image

## Run locally

Because this is plain static HTML/CSS/JS, you can:

1. Open `index.html` directly in a browser, or
2. Serve the folder with a tiny static server

Example:

```bash
cd market-launch-game
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Publish to GitHub Pages

### Easiest option from this repo

If this repo is published with Pages from the root or `/docs`, copy the folder contents to the publish target, or configure Pages to serve this folder via your existing workflow.

Quick manual option:

1. Keep `market-launch-game/` in the repo
2. In GitHub, enable Pages with a workflow or branch setup
3. Publish this folder with your preferred static workflow

If you want the game to live at a clean path, publish it at:

- `https://yourname.github.io/repo/market-launch-game/`

No build step is required.

## Publish to itch.io

1. Zip the contents of `market-launch-game/` itself, not the parent folder
2. Upload as an **HTML** project
3. Enable **This file will be played in the browser**
4. Suggested viewport: 1280x720 or responsive

Example zip command:

```bash
cd market-launch-game
zip -r launch-window-itch.zip .
```

## Suggested store copy

**Title:** Launch Window

**Short description:**
Ship tiny products, catch market trends, and survive a 7-day startup sprint.

**Tags:**
strategy, management, score attack, startup, casual, browser game

## Notes

- Mobile-friendly layout included
- No external assets or libraries
- Social image uses inline-safe SVG and can be referenced directly as `cover.svg`
