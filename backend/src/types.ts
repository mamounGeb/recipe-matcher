export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  dietaryTags: DietaryTag[];
  prepTime: number; // in minutes
  servings: number;
}

export type DietaryTag = 
  | 'vegan'
  | 'vegetarian'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'low-carb'
  | 'keto'
  | 'paleo';

export interface RecipeMatch {
  recipe: Recipe;
  score: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  matchPercentage: number;
}
