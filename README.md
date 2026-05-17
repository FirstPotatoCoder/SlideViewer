# SlideView

A browser-based viewer for slide decks generated with [Manim](https://www.manim.community/).

## How it works

Each slide is a pre-rendered `.mp4` video. The player streams forward and backward animations between slides, with a double-buffer system for smooth transitions.

## Setup

1. Place your rendered videos in the following structure:

```
public/slides/<DeckName>/forward/1.mp4
public/slides/<DeckName>/backward/1.mp4
...

```

2. Create a manifest at `public/slides/manifest.json`:

```json
[{ "name": "MyDeck", "slides": 42 }]
```

3. Serve the project with any local server and open `index.html`.

## Controls

| Key        | Action                           |
| ---------- | -------------------------------- |
| `← →`      | Previous / Next slide            |
| Hold `← →` | Fast scan                        |
| `F`        | Toggle fullscreen / present mode |
| `Esc`      | Exit present mode                |

## Present Mode

Enters fullscreen and shows the first frame of the current slide, playing the animation only when you advance — useful for live presentations.
