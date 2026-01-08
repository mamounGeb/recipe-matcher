import { db } from '../lib/instantdb';
import { Recipe, Favorite } from '../types';
import RecipeCard from './RecipeCard';
import './FavoritesList.css';

interface FavoritesListProps {
  userId: string;
}

export default function FavoritesList({ userId }: FavoritesListProps) {
  const { data, isLoading } = db.useQuery({
    favorites: {
      $: {
        where: { userId },
      },
    },
  });

  // Query recipes separately
  const { data: recipesData } = db.useQuery({ recipes: {} });

  if (isLoading) {
    return (
      <div className="favorites-list-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your favorites...</p>
        </div>
      </div>
    );
  }

  const favorites = (data?.favorites || []) as any[];
  const recipes = (recipesData?.recipes || []) as Recipe[];

  if (favorites.length === 0) {
    return (
      <div className="favorites-list-container">
        <div className="empty-state">
          <p>You haven't favorited any recipes yet.</p>
          <p className="empty-hint">Search for recipes and click the heart icon to add them to your favorites!</p>
        </div>
      </div>
    );
  }

  // Create RecipeMatch objects for favorited recipes
  const favoriteMatches = favorites
    .map((favorite: any) => {
      const recipe = recipes.find(r => r.id === favorite.recipeId);
      if (!recipe) return null;

      return {
        recipe,
        score: 100,
        matchedIngredients: recipe.ingredients,
        missingIngredients: [],
        matchPercentage: 100,
      };
    })
    .filter((match): match is NonNullable<typeof match> => match !== null);

  return (
    <div className="favorites-list-container">
      <div className="results-header">
        <h2>Your Favorites ({favoriteMatches.length})</h2>
      </div>
      <div className="recipe-grid">
        {favoriteMatches.map((match) => (
          <RecipeCard
            key={match.recipe.id}
            match={match}
            userId={userId}
            favorites={favorites as Favorite[]}
          />
        ))}
      </div>
    </div>
  );
}

