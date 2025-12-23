import { describe, it, expect } from 'vitest';
import { findMatchingRecipes } from '../recipeMatcher';
import { Recipe, DietaryTag } from '../../types';

describe('recipeMatcher', () => {
  const mockRecipes: Recipe[] = [
    {
      id: '1',
      name: 'Simple Pasta',
      ingredients: ['pasta', 'tomatoes', 'garlic'],
      instructions: ['Cook pasta', 'Add tomatoes and garlic'],
      dietaryTags: ['vegetarian'],
      prepTime: 15,
      servings: 2,
    },
    {
      id: '2',
      name: 'Vegan Salad',
      ingredients: ['lettuce', 'tomatoes', 'cucumber'],
      instructions: ['Mix vegetables'],
      dietaryTags: ['vegan', 'vegetarian', 'gluten-free'],
      prepTime: 10,
      servings: 2,
    },
    {
      id: '3',
      name: 'Chicken Dish',
      ingredients: ['chicken', 'onion', 'garlic'],
      instructions: ['Cook chicken'],
      dietaryTags: [],
      prepTime: 30,
      servings: 4,
    },
    {
      id: '4',
      name: 'Complete Match',
      ingredients: ['tomatoes', 'garlic'],
      instructions: ['Cook'],
      dietaryTags: ['vegetarian'],
      prepTime: 5,
      servings: 1,
    },
  ];

  describe('findMatchingRecipes', () => {
    it('should return empty array when no ingredients provided', () => {
      const result = findMatchingRecipes(mockRecipes, []);
      expect(result).toEqual([]);
    });

    it('should find recipes with matching ingredients', () => {
      const result = findMatchingRecipes(mockRecipes, ['tomatoes', 'garlic']);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].recipe.name).toBe('Complete Match');
      expect(result[0].matchedIngredients).toContain('tomatoes');
      expect(result[0].matchedIngredients).toContain('garlic');
    });

    it('should handle case-insensitive ingredient matching', () => {
      const result = findMatchingRecipes(mockRecipes, ['TOMATOES', 'GARLIC']);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(m => m.recipe.name === 'Simple Pasta')).toBe(true);
    });

    it('should handle plural/singular ingredient matching', () => {
      const result = findMatchingRecipes(mockRecipes, ['tomato', 'garlic']);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.some(m => m.recipe.name === 'Simple Pasta')).toBe(true);
    });

    it('should calculate match percentage correctly', () => {
      const result = findMatchingRecipes(mockRecipes, ['tomatoes', 'garlic']);
      
      const completeMatch = result.find(m => m.recipe.name === 'Complete Match');
      expect(completeMatch).toBeDefined();
      expect(completeMatch!.matchPercentage).toBe(100);
      
      const simplePasta = result.find(m => m.recipe.name === 'Simple Pasta');
      expect(simplePasta).toBeDefined();
      expect(simplePasta!.matchPercentage).toBeLessThan(100);
    });

    it('should identify matched and missing ingredients', () => {
      const result = findMatchingRecipes(mockRecipes, ['tomatoes', 'garlic']);
      
      const simplePasta = result.find(m => m.recipe.name === 'Simple Pasta');
      expect(simplePasta).toBeDefined();
      expect(simplePasta!.matchedIngredients).toContain('tomatoes');
      expect(simplePasta!.matchedIngredients).toContain('garlic');
      expect(simplePasta!.missingIngredients).toContain('pasta');
    });

    it('should filter by dietary restrictions', () => {
      const result = findMatchingRecipes(mockRecipes, ['tomatoes'], ['vegan']);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.every(m => m.recipe.dietaryTags.includes('vegan'))).toBe(true);
      expect(result.some(m => m.recipe.name === 'Chicken Dish')).toBe(false);
    });

    it('should filter by multiple dietary restrictions', () => {
      const result = findMatchingRecipes(
        mockRecipes,
        ['lettuce', 'tomatoes'],
        ['vegan', 'gluten-free']
      );
      
      expect(result.length).toBeGreaterThan(0);
      result.forEach(match => {
        expect(match.recipe.dietaryTags).toContain('vegan');
        expect(match.recipe.dietaryTags).toContain('gluten-free');
      });
    });

    it('should return empty array when no recipes match dietary filters', () => {
      const result = findMatchingRecipes(mockRecipes, ['chicken'], ['vegan']);
      
      expect(result).toEqual([]);
    });

    it('should sort results by score (highest first)', () => {
      const result = findMatchingRecipes(mockRecipes, ['tomatoes', 'garlic']);
      
      expect(result.length).toBeGreaterThan(1);
      
      // Complete Match should be first (100% match)
      expect(result[0].recipe.name).toBe('Complete Match');
      expect(result[0].matchPercentage).toBeGreaterThanOrEqual(
        result[1].matchPercentage
      );
    });

    it('should only return recipes with at least one matching ingredient', () => {
      const result = findMatchingRecipes(mockRecipes, ['nonexistent']);
      
      expect(result).toEqual([]);
    });

    it('should handle ingredients with extra whitespace', () => {
      const result = findMatchingRecipes(mockRecipes, ['  tomatoes  ', '  garlic  ']);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle partial ingredient name matches', () => {
      // "parmesan cheese" should match "cheese"
      const recipesWithCheese: Recipe[] = [
        {
          id: '5',
          name: 'Cheese Pasta',
          ingredients: ['pasta', 'parmesan cheese'],
          instructions: ['Cook'],
          dietaryTags: [],
          prepTime: 10,
          servings: 2,
        },
      ];
      
      const result = findMatchingRecipes(recipesWithCheese, ['cheese']);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should calculate score correctly', () => {
      const result = findMatchingRecipes(mockRecipes, ['tomatoes', 'garlic']);
      
      result.forEach(match => {
        expect(match.score).toBeGreaterThanOrEqual(0);
        expect(typeof match.score).toBe('number');
      });
      
      // Complete match should have higher score than partial match
      const completeMatch = result.find(m => m.recipe.name === 'Complete Match');
      const simplePasta = result.find(m => m.recipe.name === 'Simple Pasta');
      
      if (completeMatch && simplePasta) {
        expect(completeMatch.score).toBeGreaterThan(simplePasta.score);
      }
    });

    it('should handle empty dietary filters array', () => {
      const result = findMatchingRecipes(mockRecipes, ['tomatoes'], []);
      
      expect(result.length).toBeGreaterThan(0);
      // Should return all matching recipes regardless of dietary tags
    });
  });
});
