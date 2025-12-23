import { Recipe, RecipeMatch, DietaryTag, SearchResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

/**
 * Search for recipes based on ingredients and dietary filters
 */
export async function searchRecipes(
  ingredients: string[],
  dietaryFilters: DietaryTag[] = []
): Promise<RecipeMatch[]> {
  try {
    const ingredientsParam = ingredients.join(',');
    const dietParam = dietaryFilters.length > 0 ? dietaryFilters.join(',') : '';
    
    const url = new URL(`${API_BASE_URL}/recipes/search`);
    url.searchParams.set('ingredients', ingredientsParam);
    if (dietParam) {
      url.searchParams.set('diet', dietParam);
    }
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to search recipes');
    }
    
    const data: SearchResponse = await response.json();
    return data.matches;
  } catch (error) {
    console.error('Error searching recipes:', error);
    throw error;
  }
}

/**
 * Get a recipe by ID
 */
export async function getRecipeById(id: string): Promise<Recipe> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch recipe');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching recipe:', error);
    throw error;
  }
}

/**
 * Get all recipes
 */
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    throw error;
  }
}

/**
 * Get ingredient suggestions based on query string
 */
export async function getIngredientSuggestions(query: string): Promise<string[]> {
  try {
    if (!query.trim()) {
      return [];
    }
    
    const url = new URL(`${API_BASE_URL}/recipes/ingredients/suggestions`);
    url.searchParams.set('q', query);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error('Failed to fetch ingredient suggestions');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching ingredient suggestions:', error);
    return [];
  }
}
