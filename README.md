# Recipe Finder Application

A full-stack web application that helps users find recipes based on available ingredients, with support for dietary restriction filtering.

## Features

- **Ingredient Input**: Enter multiple ingredients you have available
- **Smart Recipe Matching**: Finds recipes that use your ingredients with intelligent scoring
- **Dietary Filters**: Filter recipes by dietary restrictions (vegan, vegetarian, gluten-free, etc.)
- **Recipe Details**: View full recipe instructions, ingredients, prep time, and servings
- **Match Scoring**: Recipes sorted by relevance based on ingredient matches

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: JSON file (30 recipes included)

## Project Structure

```
recipe-finder/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API client
│   │   └── ...
│   └── package.json
├── backend/           # Express backend API
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # Business logic
│   │   ├── data/          # Recipe database
│   │   └── ...
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:3001`

2. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser:**
   Navigate to `http://localhost:3000` to use the application

## API Endpoints

### GET `/api/recipes`
Get all recipes

### GET `/api/recipes/search?ingredients=ing1,ing2&diet=vegan`
Search recipes by ingredients and optional dietary filters

**Query Parameters:**
- `ingredients` (required): Comma-separated list of ingredients
- `diet` (optional): Comma-separated list of dietary tags

**Example:**
```
GET /api/recipes/search?ingredients=tomatoes,garlic,onion&diet=vegan,gluten-free
```

### GET `/api/recipes/:id`
Get a specific recipe by ID

## How It Works

1. **Ingredient Matching**: The algorithm normalizes ingredient names (case-insensitive, handles plurals) and matches them against recipe ingredients
2. **Scoring**: Recipes are scored based on:
   - Number of matching ingredients
   - Percentage of recipe ingredients covered
   - Missing ingredients penalty
3. **Filtering**: Recipes are filtered by dietary restrictions before scoring
4. **Sorting**: Results are sorted by match score (highest first)

## Development

### Backend Scripts
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Future Enhancements

- Database integration (SQLite/PostgreSQL)
- User accounts and saved favorites
- Recipe images
- Advanced filtering (cuisine type, cooking time, etc.)
- Recipe recommendations based on user preferences
