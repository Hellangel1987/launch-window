# Launch Window

A fast browser game about building hype, managing runway, and shipping at the right moment.

**Play now:**
- GitHub Pages: https://hellangel1987.github.io/launch-window/
- itch.io: https://hellangel1987.itch.io/launch-window

## What it is

Launch Window is a tiny strategy score-run.
You get **7 in-game days** to turn a small product idea into a successful launch.

Each day you pick one move:
- **Build features**
- **Polish UX**
- **Run a hype campaign**
- **Offer founder pricing**
- **Micro pivot**
- **Launch now**

The challenge is balancing:
- product readiness
- market fit
- hype
- cash runway
- timing

It is designed for quick runs, instant restarts, and one-more-try energy.

## Why this game works

- short sessions
- easy to understand in seconds
- replayable score chase
- mobile-friendly
- no install needed
- fully static, no backend

## Core loop

1. Start a run with a random product concept
2. Read the current market pulse
3. Spend one move per day
4. Launch when the numbers line up
5. Try to beat your previous score

## Controls

- **Mouse / touch**: choose actions
- **New Run**: restart instantly
- **Play again**: jump straight into another run after game over

## Files

- `index.html` - app shell, SEO, metadata
- `style.css` - responsive UI and layout
- `game.js` - game systems and balancing
- `cover.svg` - 1200x630 share image
- `poster.svg` - vertical promo graphic for social/store use
- `MARKETING.md` - store copy and launch messaging
- `OPERATIONS.md` - maintenance and update notes

## Local development

Because this project is plain HTML/CSS/JS, there is no build step.

### Quick run

Open `index.html` directly in a browser, or run a tiny local server:

```bash
python3 -m http.server 8080
```

Then visit:

```text
http://localhost:8080
```

## Deploy

### GitHub Pages

This game is already deployed via GitHub Pages.

Primary URL:
- https://hellangel1987.github.io/launch-window/

### itch.io

This game is also published as a browser build on itch.io.

Store URL:
- https://hellangel1987.itch.io/launch-window

## Store pitch

**Short description**

A fast browser game about building hype, surviving your runway, and launching at the perfect moment.

**Long description**

Launch Window is a compact strategy game where you have seven days to build, polish, promote, pivot, and ship a product into a moving market.

Every run is a small launch story. Push too early and the product underdelivers. Wait too long and the runway disappears. Nail the timing and you can turn a tiny idea into a breakout score.

## Current roadmap

Short-term improvements:
- stronger feedback and juice
- better balancing between early and late launch choices
- sharper end screen and replay hooks
- additional micro-events and market variety
- improved mobile feel

Medium-term improvements:
- daily challenge mode
- more products and trend sets
- sound effects and music layer
- share-your-score flow

## Project principles

- keep it fast
- keep it readable
- keep it replayable
- avoid unnecessary complexity
- ship small improvements often

## License

Currently unpublished as a formal open-source license.
Treat it as project-owned game code unless a dedicated license file is added.
