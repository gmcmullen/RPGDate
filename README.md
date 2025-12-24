# RPGDate - Character Creator

A web-based dating app character creation interface using RPG-style point distribution.

## Features

- **Category Ranking**: Distribute 15, 10, and 5 points across three main categories (Looks, Social, Brain)
- **Subcategory Points**: Assign points to specific attributes within each category
- **Negative Values**: Go negative on any attribute to gain extra points for others
- **Visual Results**: See your character profile displayed as radar/web charts
- **Interactive**: Easily adjust your selections and see real-time updates

## Tech Stack

- Vue 3 (Composition API)
- Vite
- Tailwind CSS
- Chart.js

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## How It Works

### Screen 1: Category Ranking
Choose how to distribute 15, 10, and 5 points across:
- Looks
- Social
- Brain

### Screen 2: Subcategory Points
Distribute your allocated points across specific attributes:

**Looks**
- Height (Short → Tall)
- Attractiveness (Ugly → Beautiful)
- Fitness (Flab → Fit)
- Style (Frumpy → Fashionable)

**Social**
- Wealth (Broke → Rich)
- Power (Ignored → Influential)
- Success (Failure → Successful)
- Sociability (Introvert → Extrovert)

**Brain**
- Intellectual (Dumb → Smart)
- Psychological (Crazy → Stable)
- Creativity (None → Artist)
- Education (Dropout → PhD)

### Screen 3: Results
View your character profile as:
- Individual radar charts for each category
- Combined radar chart showing all attributes
- Detailed stats breakdown

## Chart Features

- Scales start at -3 to accommodate negative values
- Zero values appear 3 units from center (not as a point)
- Dynamic scaling based on your point distribution

