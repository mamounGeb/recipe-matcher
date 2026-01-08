import { init } from '@instantdb/react';

// Get App ID from environment variable, fallback to default for backward compatibility
const APP_ID = import.meta.env.VITE_INSTANTDB_APP_ID || 'c278a485-c42a-4c8d-b6e2-0353122b264c';

type Schema = {
  users: {
    email: string;
    name?: string;
    createdAt: number;
  };
  recipes: {
    name: string;
    ingredients: string[];
    instructions: string[];
    dietaryTags: string[];
    prepTime: number;
    servings: number;
    createdAt: number;
  };
  favorites: {
    userId: string;
    recipeId: string;
    addedAt: number;
  };
};

export const db = init<Schema>({ appId: APP_ID });
export const { useAuth } = db;

