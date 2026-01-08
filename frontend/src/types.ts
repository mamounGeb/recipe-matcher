export type DietaryTag = 
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'low-carb'
  | 'keto'
  | 'paleo';

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  dietaryTags: DietaryTag[];
  prepTime: number;
  servings: number;
}

export interface RecipeMatch {
  recipe: Recipe;
  score: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
}

export interface SearchResponse {
  count: number;
  matches: RecipeMatch[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: number;
}

export interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
  addedAt: number;
}
