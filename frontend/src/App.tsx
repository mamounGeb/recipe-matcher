import { useState, useEffect } from 'react';
import { RecipeMatch, DietaryTag } from './types';
import { searchRecipes } from './services/api';
import IngredientInput from './components/IngredientInput';
import FilterBar from './components/FilterBar';
import RecipeList from './components/RecipeList';
import './App.css';

function App() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [dietaryFilters, setDietaryFilters] = useState<DietaryTag[]>([]);
  const [matches, setMatches] = useState<RecipeMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Search recipes whenever ingredients or filters change
  useEffect(() => {
    if (ingredients.length > 0) {
      performSearch();
    } else {
      setMatches([]);
      setHasSearched(false);
      setError(null);
    }
  }, [ingredients, dietaryFilters]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await searchRecipes(ingredients, dietaryFilters);
      setMatches(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search recipes');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <header className="app-header">
          <h1>🍳 Recipe Finder</h1>
          <p>Discover delicious recipes from the ingredients you have</p>
        </header>

        <main className="app-main">
          <IngredientInput
            ingredients={ingredients}
            onIngredientsChange={setIngredients}
          />

          <FilterBar
            selectedFilters={dietaryFilters}
            onFiltersChange={setDietaryFilters}
          />

          <RecipeList
            matches={matches}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
          />
        </main>

        <footer className="app-footer">
          <p>Made with ❤️ for food lovers</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
