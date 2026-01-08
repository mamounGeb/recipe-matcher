import { useState, useEffect } from 'react';
import { RecipeMatch, DietaryTag, Recipe, Favorite } from './types';
import { db, useAuth } from './lib/instantdb';
import { searchRecipesFromList } from './services/recipes';
import IngredientInput from './components/IngredientInput';
import FilterBar from './components/FilterBar';
import RecipeList from './components/RecipeList';
import Auth from './components/Auth';
import FavoritesList from './components/FavoritesList';
import SeedRecipes from './components/SeedRecipes';
import './App.css';

type View = 'search' | 'favorites';

function App() {
  const { user } = useAuth();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState<DietaryTag[]>([]);
  const [matches, setMatches] = useState<RecipeMatch[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentView, setCurrentView] = useState<View>('search');

  // Query recipes and favorites from InstantDB
  const { data: recipesData, isLoading: recipesLoading } = db.useQuery({ recipes: {} });
  const { data: favoritesData, isLoading: favoritesLoading } = db.useQuery(
    user
      ? {
          favorites: {
            $: {
              where: { userId: user.id },
            },
          },
        }
      : {}
  );

  const recipes = (recipesData?.recipes || []) as Recipe[];
  const favorites = (favoritesData?.favorites || []) as Favorite[];

  // Manual search function
  const handleSearch = () => {
    if (ingredients.length > 0) {
      if (recipes.length > 0) {
        const results = searchRecipesFromList(recipes, ingredients, dietaryFilters);
        setMatches(results);
        setHasSearched(true);
      } else {
        // No recipes in database
        setMatches([]);
        setHasSearched(true);
      }
    }
  };

  // Auto-search when filters change (but not when ingredients are added)
  useEffect(() => {
    if (hasSearched && recipes.length > 0 && ingredients.length > 0) {
      const results = searchRecipesFromList(recipes, ingredients, dietaryFilters);
      setMatches(results);
    }
  }, [dietaryFilters, recipes, hasSearched, ingredients]);

  const loading = recipesLoading || favoritesLoading;

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>🍳 Recipe Finder</h1>
          <p>Discover delicious recipes from the ingredients you have</p>
          <div className="auth-section">
            <Auth />
          </div>
        </header>

        {!user ? (
          <main className="app-main">
            <div className="auth-prompt">
              <p>Please sign in to search recipes and save your favorites!</p>
            </div>
            <SeedRecipes />
          </main>
        ) : (
          <>
            <nav className="app-nav">
              <button
                onClick={() => setCurrentView('search')}
                className={`nav-button ${currentView === 'search' ? 'active' : ''}`}
              >
                Search Recipes
              </button>
              <button
                onClick={() => setCurrentView('favorites')}
                className={`nav-button ${currentView === 'favorites' ? 'active' : ''}`}
              >
                My Favorites
              </button>
            </nav>

            <main className="app-main">
              {currentView === 'search' ? (
                <>
                  <IngredientInput
                    ingredients={ingredients}
                    onIngredientsChange={setIngredients}
                  />

                  <FilterBar
                    selectedFilters={dietaryFilters}
                    onFiltersChange={setDietaryFilters}
                  />

                  {recipes.length === 0 && !recipesLoading && (
                    <div className="seed-recipes-section">
                      <SeedRecipes />
                    </div>
                  )}

                  {ingredients.length > 0 && (
                    <div className="search-button-container">
                      <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="search-recipes-button"
                      >
                        {loading ? 'Loading...' : 'Search Recipes'}
                      </button>
                    </div>
                  )}

                  <RecipeList
                    matches={matches}
                    loading={loading}
                    error={null}
                    hasSearched={hasSearched}
                    userId={user.id}
                    favorites={favorites}
                  />
                </>
              ) : (
                <FavoritesList userId={user.id} />
              )}
            </main>
          </>
        )}

        <footer className="app-footer">
          <p>Made with ❤️ for food lovers</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
