import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import recipesRouter from '../recipes';

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/recipes', recipesRouter);

describe('Recipe Routes', () => {
  describe('GET /api/recipes', () => {
    it('should return all recipes', async () => {
      const response = await request(app).get('/api/recipes');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('ingredients');
    });
  });

  describe('GET /api/recipes/search', () => {
    it('should return 400 when ingredients parameter is missing', async () => {
      const response = await request(app).get('/api/recipes/search');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Ingredients parameter is required');
    });

    it('should return 400 when ingredients parameter is empty', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Invalid ingredients');
    });

    it('should return 400 when ingredients parameter has only whitespace', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=  ,  ,  ');
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should search recipes by ingredients', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=tomatoes,garlic');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('matches');
      expect(Array.isArray(response.body.matches)).toBe(true);
      expect(response.body.count).toBe(response.body.matches.length);
    });

    it('should handle comma-separated ingredients', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=tomatoes,garlic,onion');
      
      expect(response.status).toBe(200);
      expect(response.body.matches.length).toBeGreaterThanOrEqual(0);
    });

    it('should filter by dietary restrictions', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=tomatoes&diet=vegan');
      
      expect(response.status).toBe(200);
      if (response.body.matches.length > 0) {
        response.body.matches.forEach((match: any) => {
          expect(match.recipe.dietaryTags).toContain('vegan');
        });
      }
    });

    it('should filter by multiple dietary restrictions', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=lettuce&diet=vegan,gluten-free');
      
      expect(response.status).toBe(200);
      if (response.body.matches.length > 0) {
        response.body.matches.forEach((match: any) => {
          expect(match.recipe.dietaryTags).toContain('vegan');
          expect(match.recipe.dietaryTags).toContain('gluten-free');
        });
      }
    });

    it('should ignore invalid dietary tags', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=tomatoes&diet=invalid-tag,vegan');
      
      expect(response.status).toBe(200);
      // Should still work, just ignoring invalid tag
    });

    it('should trim whitespace from ingredients', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=  tomatoes  ,  garlic  ');
      
      expect(response.status).toBe(200);
      expect(response.body.matches.length).toBeGreaterThanOrEqual(0);
    });

    it('should return matches sorted by score', async () => {
      const response = await request(app).get('/api/recipes/search?ingredients=tomatoes,garlic');
      
      expect(response.status).toBe(200);
      if (response.body.matches.length > 1) {
        const scores = response.body.matches.map((m: any) => m.score);
        for (let i = 0; i < scores.length - 1; i++) {
          expect(scores[i]).toBeGreaterThanOrEqual(scores[i + 1]);
        }
      }
    });
  });

  describe('GET /api/recipes/:id', () => {
    it('should return a recipe by ID', async () => {
      // First get all recipes to find a valid ID
      const allRecipesResponse = await request(app).get('/api/recipes');
      const validId = allRecipesResponse.body[0].id;
      
      const response = await request(app).get(`/api/recipes/${validId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', validId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('ingredients');
      expect(response.body).toHaveProperty('instructions');
    });

    it('should return 404 for non-existent recipe ID', async () => {
      const response = await request(app).get('/api/recipes/nonexistent-id-12345');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toBe('Recipe not found');
    });

    it('should return recipe with all required fields', async () => {
      const allRecipesResponse = await request(app).get('/api/recipes');
      const validId = allRecipesResponse.body[0].id;
      
      const response = await request(app).get(`/api/recipes/${validId}`);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('ingredients');
      expect(response.body).toHaveProperty('instructions');
      expect(response.body).toHaveProperty('dietaryTags');
      expect(response.body).toHaveProperty('prepTime');
      expect(response.body).toHaveProperty('servings');
      expect(Array.isArray(response.body.ingredients)).toBe(true);
      expect(Array.isArray(response.body.instructions)).toBe(true);
      expect(Array.isArray(response.body.dietaryTags)).toBe(true);
    });
  });
});
