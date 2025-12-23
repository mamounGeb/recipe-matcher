import { Router, Request, Response } from 'express';
import { Recipe, DietaryTag, RecipeMatch } from '../types';
import recipesData from '../data/recipes.json';
import { findMatchingRecipes } from '../services/recipeMatcher';

const router = Router();

// Type assertion for imported JSON
const recipes: Recipe[] = recipesData as Recipe[];

/**
 * GET /api/recipes
 * Get all recipes
 */
router.get('/', (req: Request, res: Response) => {
  try {
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

/**
 * GET /api/recipes/search
 * Search recipes by ingredients and optional dietary filters
 * Query params:
 *   - ingredients: comma-separated list of ingredients
 *   - diet: comma-separated list of dietary tags (vegan, vegetarian, etc.)
 */
router.get('/search', (req: Request, res: Response) => {
  try {
    const ingredientsParam = req.query.ingredients as string;
    const dietParam = req.query.diet as string;
    
    if (!ingredientsParam) {
      return res.status(400).json({ 
        error: 'Ingredients parameter is required',
        message: 'Please provide ingredients as a comma-separated list'
      });
    }
    
    // Parse ingredients
    const ingredients = ingredientsParam
      .split(',')
      .map(ing => ing.trim())
      .filter(ing => ing.length > 0);
    
    if (ingredients.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid ingredients',
        message: 'Please provide at least one ingredient'
      });
    }
    
    // Parse dietary filters
    const dietaryFilters: DietaryTag[] = dietParam
      ? dietParam
          .split(',')
          .map(tag => tag.trim().toLowerCase())
          .filter((tag): tag is DietaryTag => 
            ['vegan', 'vegetarian', 'gluten-free', 'dairy-free', 'nut-free', 'low-carb', 'keto', 'paleo'].includes(tag)
          )
      : [];
    
    // Find matching recipes
    const matches: RecipeMatch[] = findMatchingRecipes(
      recipes,
      ingredients,
      dietaryFilters
    );
    
    res.json({
      count: matches.length,
      matches
    });
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
});

/**
 * GET /api/recipes/ingredients/suggestions
 * Get ingredient suggestions based on query string
 * Query params:
 *   - q: search query string
 */
router.get('/ingredients/suggestions', (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string)?.trim().toLowerCase() || '';
    
    if (query.length < 1) {
      return res.json([]);
    }
    
    // Collect all unique ingredients from all recipes (preserve original casing)
    const allIngredients = new Map<string, string>(); // lowercase -> original
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const lowerKey = ingredient.toLowerCase();
        if (!allIngredients.has(lowerKey)) {
          allIngredients.set(lowerKey, ingredient);
        }
      });
    });
    
    // Filter ingredients that match the query (compare lowercase, return original)
    const suggestions = Array.from(allIngredients.entries())
      .filter(([lowerKey]) => lowerKey.includes(query))
      .map(([, original]) => original)
      .sort((a, b) => a.localeCompare(b))
      .slice(0, 10); // Limit to 10 suggestions
    
    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching ingredient suggestions:', error);
    res.status(500).json({ error: 'Failed to fetch ingredient suggestions' });
  }
});

/**
 * GET /api/recipes/:id
 * Get a specific recipe by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const recipe = recipes.find(r => r.id === id);
    
    if (!recipe) {
      return res.status(404).json({ 
        error: 'Recipe not found',
        message: `No recipe found with ID: ${id}`
      });
    }
    
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

export default router;
