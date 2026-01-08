import { useState } from 'react';
import { RecipeMatch, Favorite } from '../types';
import { addToFavorites, removeFromFavorites, findFavoriteId } from '../services/favorites';
import './RecipeCard.css';

interface RecipeCardProps {
  match: RecipeMatch;
  userId?: string;
  favorites?: Favorite[];
}

export default function RecipeCard({ match, userId, favorites = [] }: RecipeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { recipe, matchedIngredients, missingIngredients, matchPercentage } = match;
  
  const favoriteId = userId ? findFavoriteId(favorites, userId, recipe.id) : null;
  const isFavorited = favoriteId !== null;

  const handleToggleFavorite = () => {
    if (!userId) return;
    
    if (isFavorited && favoriteId) {
      removeFromFavorites(favoriteId);
    } else {
      addToFavorites(userId, recipe.id);
    }
  };

  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <div className="recipe-title-row">
          <h3 className="recipe-name">{recipe.name}</h3>
          {userId && (
            <button
              onClick={handleToggleFavorite}
              className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorited ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <div className="recipe-meta">
          <span className="match-badge">{Math.round(matchPercentage)}% match</span>
          <span className="prep-time">⏱ {recipe.prepTime} min</span>
          <span className="servings">🍽 {recipe.servings} servings</span>
        </div>
      </div>

      <div className="recipe-tags">
        {recipe.dietaryTags.map(tag => (
          <span key={tag} className="dietary-tag">
            {tag}
          </span>
        ))}
      </div>

      <div className="ingredients-section">
        <div className="matched-ingredients">
          <strong>You have:</strong>
          <div className="ingredient-list">
            {matchedIngredients.map((ing, idx) => (
              <span key={idx} className="ingredient-badge matched">
                ✓ {ing}
              </span>
            ))}
          </div>
        </div>
        
        {missingIngredients.length > 0 && (
          <div className="missing-ingredients">
            <strong>You need:</strong>
            <div className="ingredient-list">
              {missingIngredients.map((ing, idx) => (
                <span key={idx} className="ingredient-badge missing">
                  {ing}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="toggle-instructions-button"
      >
        {isExpanded ? 'Hide Instructions' : 'Show Instructions'}
      </button>

      {isExpanded && (
        <div className="instructions-section">
          <h4>Instructions:</h4>
          <ol className="instructions-list">
            {recipe.instructions.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
