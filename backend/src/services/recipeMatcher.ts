import { Recipe, RecipeMatch, DietaryTag } from '../types';

/**
 * Normalizes ingredient names for matching
 * Handles case-insensitive matching and basic pluralization
 */
function normalizeIngredient(ingredient: string): string {
  return ingredient
    .toLowerCase()
    .trim()
    .replace(/s$/, '') // Remove trailing 's' for plural handling
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Checks if two ingredients match (normalized comparison)
 */
function ingredientsMatch(ingredient1: string, ingredient2: string): boolean {
  const normalized1 = normalizeIngredient(ingredient1);
  const normalized2 = normalizeIngredient(ingredient2);
  
  // Exact match
  if (normalized1 === normalized2) return true;
  
  // Check if one contains the other (for cases like "parmesan cheese" vs "cheese")
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return true;
  }
  
  return false;
}

/**
 * Checks if a recipe matches dietary restrictions
 */
function matchesDietaryRestrictions(
  recipe: Recipe,
  dietaryFilters: DietaryTag[]
): boolean {
  if (dietaryFilters.length === 0) return true;
  
  // Recipe must have ALL specified dietary tags
  return dietaryFilters.every(tag => recipe.dietaryTags.includes(tag));
}

/**
 * Calculates match score for a recipe based on available ingredients
 */
function calculateMatchScore(
  recipe: Recipe,
  availableIngredients: string[]
): {
  score: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
} {
  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];
  
  // Check each recipe ingredient against available ingredients
  for (const recipeIngredient of recipe.ingredients) {
    const isMatched = availableIngredients.some(available =>
      ingredientsMatch(available, recipeIngredient)
    );
    
    if (isMatched) {
      matchedIngredients.push(recipeIngredient);
    } else {
      missingIngredients.push(recipeIngredient);
    }
  }
  
  // Calculate match percentage
  const matchPercentage = recipe.ingredients.length > 0
    ? (matchedIngredients.length / recipe.ingredients.length) * 100
    : 0;
  
  // Calculate score:
  // - Base score: number of matched ingredients
  // - Bonus: higher percentage of recipe ingredients covered
  // - Penalty: missing ingredients reduce score
  const baseScore = matchedIngredients.length;
  const percentageBonus = matchPercentage * 0.1;
  const missingPenalty = missingIngredients.length * 0.5;
  
  const score = baseScore + percentageBonus - missingPenalty;
  
  return {
    score: Math.max(0, score), // Ensure non-negative
    matchedIngredients,
    missingIngredients,
    matchPercentage: Math.round(matchPercentage * 100) / 100
  };
}

/**
 * Finds and scores recipes based on available ingredients and dietary filters
 */
export function findMatchingRecipes(
  recipes: Recipe[],
  availableIngredients: string[],
  dietaryFilters: DietaryTag[] = []
): RecipeMatch[] {
  if (availableIngredients.length === 0) {
    return [];
  }
  
  const matches: RecipeMatch[] = [];
  
  for (const recipe of recipes) {
    // Filter by dietary restrictions first
    if (!matchesDietaryRestrictions(recipe, dietaryFilters)) {
      continue;
    }
    
    // Calculate match score
    const matchData = calculateMatchScore(recipe, availableIngredients);
    
    // Only include recipes with at least one matching ingredient
    if (matchData.matchedIngredients.length > 0) {
      matches.push({
        recipe,
        ...matchData
      });
    }
  }
  
  // Sort by score (highest first), then by match percentage
  matches.sort((a, b) => {
    if (Math.abs(a.score - b.score) > 0.1) {
      return b.score - a.score;
    }
    return b.matchPercentage - a.matchPercentage;
  });
  
  return matches;
}
