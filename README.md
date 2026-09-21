# Anong Lutuin Ngayon? (Random Pinoy Recipe Picker)

A simple recipe picker that pulls from a hand-built JSON file of Filipino
dishes — adobo, sinigang, pancit, sisig, and more — and shows a random one
with full ingredients and steps every time you click.

**[Live demo →](#)** *(add your deployed link here once you host it)*

## Why I built this

Most beginner "recipe" projects just call a public recipe API. I wanted to
build my own dataset instead — a `recipes.json` file I wrote myself — and
practice `fetch`, `async/await`, and rendering lists dynamically from real
JSON instead of hardcoding everything into the HTML.

## Features

- 13 Filipino recipes (ulam, sabaw, panghimagas) with full ingredients, steps, and a personal cooking tip
- Search bar — filter recipes by name as you type
- Category filter chips (Lahat / Ulam / Sabaw / Panghimagas)
- Favorites — star any recipe, saved in your browser with `localStorage` so it's still there next time you open the page
- "Paborito lang" toggle to view only your starred recipes
- Random picker respects whatever search/filter/favorites view is currently active, and avoids repeating the recipe you just saw
- Recipes are stored in their own `recipes.json` file, not hardcoded in JS
- Fully responsive layout
- No frameworks, no build tools — just HTML, CSS, JavaScript, and JSON

## Tech stack

- HTML5
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (fetch API, async/await)
- JSON for the recipe data

## Running it locally — important!

Because this project uses `fetch()` to load `recipes.json`, **just double-clicking
`index.html` may not work** in some browsers (Chrome especially blocks local
file access for security reasons). Use one of these instead:

**Option A — VS Code Live Server (easiest)**
1. Install the "Live Server" extension in VS Code (Recommended nako ni)
2. Right-click `index.html` → "Open with Live Server"


**Option B — Python's built-in server**
1. Open a terminal in the project folder
2. Run: `python3 -m http.server`
3. Open `http://localhost:8000` in your browser

Once deployed to Vercel or GitHub Pages, this issue disappears — those serve
files over `http`, so `fetch()` works normally.

## What I'd add next

- Sort options (by cook time, or A-Z)
- A print-friendly view for a selected recipe
- Ratings or notes you can leave on a recipe

## Author

Built by Dharel Khin Melegrito. You can call me Milo ^_^
