import { RecipeMatch, Favorite } from '../types';
import RecipeCard from './RecipeCard';
import './RecipeList.css';

interface RecipeListProps {
  matches: RecipeMatch[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  userId?: string;
  favorites?: Favorite[];
}

export default function RecipeList({ matches, loading, error, hasSearched, userId, favorites = [] }: RecipeListProps) {
  if (loading) {
    return (
      <div className="recipe-list-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Finding the perfect recipes for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recipe-list-container">
        <div className="error-state">
          <p className="error-message">⚠️ {error}</p>
          <p className="error-hint">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  if (!hasSearched) {
    return (
      <div className="recipe-list-container">
        <div className="empty-state">
          <p>👨‍🍳 Enter some ingredients above to find delicious recipes!</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="recipe-list-container">
        <div className="empty-state">
          <p>😕 No recipes found matching your ingredients and filters.</p>
          <p className="empty-hint">Try adding more ingredients or adjusting your filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-list-container">
      <div className="results-header">
        <h2>Found {matches.length} recipe{matches.length !== 1 ? 's' : ''}</h2>
      </div>
      <div className="recipe-grid">
        {matches.map((match) => (
          <RecipeCard
            key={match.recipe.id}
            match={match}
            userId={userId}
            favorites={favorites}
          />
        ))}
      </div>
    </div>
  );
}
