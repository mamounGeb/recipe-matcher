import { Recipe, RecipeMatch, DietaryTag } from '../types';

/**
 * Normalize ingredient name for matching (lowercase, remove plurals, trim)
 */
export function normalizeIngredient(ingredient: string): string {
  return ingredient.toLowerCase().trim().replace(/s$/, '');
}

/**
 * Check if an ingredient matches (handles plurals and case-insensitive)
 */
export function ingredientsMatch(userIngredient: string, recipeIngredient: string): boolean {
  const normalizedUser = normalizeIngredient(userIngredient);
  const normalizedRecipe = normalizeIngredient(recipeIngredient);
  
  return normalizedUser === normalizedRecipe || 
         normalizedUser === normalizedRecipe + 's' ||
         normalizedUser + 's' === normalizedRecipe;
}

/**
 * Calculate match score for a recipe based on user ingredients
 */
export function calculateMatchScore(
  recipe: Recipe,
  userIngredients: string[]
): {
  score: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
} {
  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];

  // Check each recipe ingredient against user ingredients
  for (const recipeIngredient of recipe.ingredients) {
    const isMatched = userIngredients.some(userIngredient =>
      ingredientsMatch(userIngredient, recipeIngredient)
    );

    if (isMatched) {
      matchedIngredients.push(recipeIngredient);
    } else {
      missingIngredients.push(recipeIngredient);
    }
  }

  // Calculate match percentage
  const matchPercentage =
    recipe.ingredients.length > 0
      ? (matchedIngredients.length / recipe.ingredients.length) * 100
      : 0;

  // Calculate score: base score from match percentage, bonus for more matches
  const baseScore = matchPercentage;
  const matchBonus = matchedIngredients.length * 10;
  const missingPenalty = missingIngredients.length * 5;
  const score = baseScore + matchBonus - missingPenalty;

  return {
    score,
    matchedIngredients,
    missingIngredients,
    matchPercentage,
  };
}

/**
 * Filter recipes by dietary tags
 */
export function filterByDietaryTags(
  recipes: Recipe[],
  dietaryFilters: DietaryTag[]
): Recipe[] {
  if (dietaryFilters.length === 0) {
    return recipes;
  }

  return recipes.filter(recipe =>
    dietaryFilters.every(filter => recipe.dietaryTags.includes(filter))
  );
}

/**
 * Search recipes by applying matching logic to a list of recipes
 * This function processes recipes that are already fetched from InstantDB
 */
export function searchRecipesFromList(
  recipes: Recipe[],
  ingredients: string[],
  dietaryFilters: DietaryTag[] = []
): RecipeMatch[] {
  // Filter by dietary tags first
  const filteredRecipes = filterByDietaryTags(recipes, dietaryFilters);

  // Calculate matches for each recipe
  const matches: RecipeMatch[] = filteredRecipes
    .map(recipe => {
      const matchData = calculateMatchScore(recipe, ingredients);
      return {
        recipe,
        ...matchData,
      };
    })
    // Filter out recipes with no matches
    .filter(match => match.matchedIngredients.length > 0)
    // Sort by score (highest first)
    .sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Get ingredient suggestions from a list of recipes
 */
export function getIngredientSuggestionsFromRecipes(
  recipes: Recipe[],
  query: string
): string[] {
  if (!query.trim()) {
    return [];
  }

  const allIngredients = new Set<string>();

  recipes.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      const normalized = ingredient.toLowerCase();
      if (normalized.includes(query.toLowerCase())) {
        allIngredients.add(ingredient);
      }
    });
  });

  return Array.from(allIngredients).slice(0, 10);
}

