# Recipe Finder Application

A full-stack web application that helps users find recipes based on available ingredients, with support for dietary restriction filtering and user favorites.

## Features

- **User Authentication**: Magic code email authentication powered by InstantDB
- **Ingredient Input**: Enter multiple ingredients with autocomplete suggestions
- **Smart Recipe Matching**: Finds recipes that use your ingredients with intelligent scoring
- **Dietary Filters**: Filter recipes by dietary restrictions (vegan, vegetarian, gluten-free, keto, low-carb, etc.)
- **Recipe Details**: View full recipe instructions, ingredients, prep time, and servings
- **Match Scoring**: Recipes sorted by relevance based on ingredient matches
- **Favorites**: Save your favorite recipes for quick access
- **Real-time Updates**: InstantDB provides real-time synchronization across devices
- **Recipe Database**: 25+ sample recipes included, easily seedable

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Database & Backend**: InstantDB (real-time database with built-in authentication)
- **State Management**: React hooks with InstantDB reactive queries

## Project Structure

```
recipe-finder/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── Auth.tsx         # Authentication component
│   │   │   ├── Auth.css
│   │   │   ├── IngredientInput.tsx
│   │   │   ├── IngredientInput.css
│   │   │   ├── FilterBar.tsx
│   │   │   ├── FilterBar.css
│   │   │   ├── RecipeCard.tsx   # Recipe card with favorite button
│   │   │   ├── RecipeCard.css
│   │   │   ├── RecipeList.tsx
│   │   │   ├── RecipeList.css
│   │   │   ├── FavoritesList.tsx
│   │   │   ├── FavoritesList.css
│   │   │   ├── SeedRecipes.tsx  # Database seeding component
│   │   │   └── SeedRecipes.css
│   │   ├── services/            # Business logic services
│   │   │   ├── api.ts          # API utilities
│   │   │   ├── recipes.ts      # Recipe search and matching
│   │   │   └── favorites.ts    # Favorites operations
│   │   ├── lib/                # Library configurations
│   │   │   └── instantdb.ts   # InstantDB setup and schema
│   │   ├── types.ts            # TypeScript type definitions
│   │   ├── App.tsx             # Main application component
│   │   ├── App.css             # Main application styles
│   │   ├── index.css           # Global styles
│   │   └── main.tsx            # Application entry point
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- An InstantDB account (free tier available at [instantdb.com](https://instantdb.com))

### Installation

1. **Install frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   Then edit `.env.local` and add your InstantDB App ID (see [InstantDB Configuration](#instantdb-configuration) below).

### Running the Application

1. **Start the frontend development server:**
   ```bash
   cd frontend
   npm run dev
   ```
   The application will run on `http://localhost:5173` (or another port if 5173 is in use)

2. **Open your browser:**
   Navigate to the URL shown in the terminal to use the application

3. **Seed sample recipes:**
   - When you first open the app, you'll see a "Seed Recipes" button
   - Click it to add 25 sample recipes to your InstantDB database
   - You can also seed recipes when signed in if the database is empty

4. **Sign in:**
   - Enter your email address
   - Click "Send Magic Code"
   - Check your email for the 6-digit code
   - Enter the code to sign in

5. **Start searching:**
   - Add ingredients you have available
   - Click "Search Recipes" to find matching recipes
   - Use dietary filters to narrow down results
   - Click the heart icon to save favorites

## Database Schema

The application uses InstantDB with the following schema:

### Entities

- **users**: User accounts
  - `email`: Unique email address
  - `name`: Optional display name
  - `createdAt`: Timestamp

- **recipes**: Recipe data
  - `name`: Recipe title
  - `ingredients`: Array of ingredient strings
  - `instructions`: Array of instruction strings
  - `dietaryTags`: Array of dietary tags (vegan, vegetarian, gluten-free, etc.)
  - `prepTime`: Preparation time in minutes
  - `servings`: Number of servings
  - `createdAt`: Timestamp

- **favorites**: User-recipe relationships
  - `userId`: Reference to user
  - `recipeId`: Reference to recipe
  - `addedAt`: Timestamp

## How It Works

### Recipe Search Algorithm

1. **Ingredient Matching**: The algorithm normalizes ingredient names (case-insensitive, handles plurals) and matches them against recipe ingredients
2. **Scoring**: Recipes are scored based on:
   - Number of matching ingredients
   - Percentage of recipe ingredients covered
   - Missing ingredients penalty
3. **Filtering**: Recipes are filtered by dietary restrictions before scoring
4. **Sorting**: Results are sorted by match score (highest first)

### Data Flow

1. **User Authentication**: Users sign in via InstantDB magic code authentication
2. **Recipe Storage**: Recipes are stored in InstantDB and queried reactively using `useQuery`
3. **Search**: When ingredients are entered and "Search Recipes" is clicked, the matching algorithm processes all recipes from InstantDB
4. **Favorites**: Users can add/remove favorites, which are stored in InstantDB and sync in real-time
5. **Real-time Updates**: InstantDB provides real-time synchronization, so changes appear instantly across all devices

## Development

### Frontend Scripts
- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### InstantDB Configuration

The app uses InstantDB for database and authentication. The App ID is configured via environment variables.

**Local Development:**
1. Copy `.env.example` to `.env.local`:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
2. Update `.env.local` with your InstantDB App ID:
   ```
   VITE_INSTANTDB_APP_ID=your-instantdb-app-id-here
   ```

**Production (Vercel):**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add a new variable:
   - Name: `VITE_INSTANTDB_APP_ID`
   - Value: Your InstantDB App ID
   - Environment: Production (and Preview if needed)
4. Redeploy your application

**To use your own InstantDB instance:**
1. Sign up at [instantdb.com](https://instantdb.com)
2. Create a new app
3. Get your App ID from the dashboard
4. Set the `VITE_INSTANTDB_APP_ID` environment variable as described above
5. Define your schema in the InstantDB dashboard or via the schema definition in the code

**Default App ID:** The code includes a fallback App ID (`c278a485-c42a-4c8d-b6e2-0353122b264c`) for backward compatibility, but using environment variables is recommended for production.

## Key Features Explained

### Authentication
- Uses InstantDB's built-in magic code authentication
- No password required - users receive a code via email
- Session persists across page refreshes

### Recipe Matching
- Intelligent ingredient matching handles plurals and case variations
- Scores recipes based on ingredient coverage
- Shows matched and missing ingredients for each recipe

### Favorites
- One-click favorite/unfavorite with heart icon
- Favorites are user-specific and sync in real-time
- View all favorites in dedicated "My Favorites" view

### Real-time Sync
- All data changes sync instantly across devices
- No manual refresh needed
- Powered by InstantDB's real-time subscriptions

## Future Enhancements

- Recipe images and photos
- Advanced filtering (cuisine type, cooking time, difficulty level)
- Recipe recommendations based on user preferences
- Shopping list generation from recipes
- Recipe sharing between users
- Meal planning features
- Nutritional information
