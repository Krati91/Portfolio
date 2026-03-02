# Kartik Chaturvedi - Game Programmer Portfolio

Live site: [kartik-chaturvedi.netlify.app](https://kartik-chaturvedi.netlify.app/)

---

## About

Personal portfolio for **Kartik Chaturvedi**, an Unreal Engine C++ developer specialising in server-authoritative multiplayer systems and gameplay programming.

Built from scratch as a custom static site. No frameworks, no build tools.

---

## Projects Featured

| Project | Engine | Focus |
|---|---|---|
| **Battle Blasters** *(Ongoing)* | Unreal Engine 5 | Multiplayer replication, client prediction, Steam OSS |
| **Echoes of the Lost Sands** | Unreal Engine 5 | Animation-driven combat, AI behavior trees, lock-on targeting |
| **Apex Ruin** | Unreal Engine 4 | Modular weapon systems, hitscan, AI perception |
| **Countdown Carnage** | Unreal Engine 5 | Gameplay systems, UI/HUD |
| **Crimson Reign** | Unreal Engine 5 | Combat systems |
| **Dapper Dasher** | Raylib / C++ | 2D platformer |

---

## Tech Stack

- **Languages:** HTML, CSS, JavaScript (vanilla)
- **Styling:** Custom CSS + Bootstrap grid
- **Data:** JSON-driven project content (`data/projects.json`)
- **Deployment:** Netlify

---

## Structure

```
index.html            - Home / hero carousel
portfolio.html        - Project gallery
project-details.html  - Dynamic project detail pages
about.html            - About & timeline
contact.html          - Contact form
data/projects.json    - All project content (single source of truth)
css/                  - Stylesheets
js/                   - Scripts
assets/               - Project GIFs and media
```

---

## Running Locally

No build step needed. Open any `.html` file directly in a browser, or serve with any static file server:

```bash
npx serve .
```
