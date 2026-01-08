import { db } from '../lib/instantdb';
import { id, tx } from '@instantdb/react';
import { Favorite } from '../types';

/**
 * Add a recipe to user's favorites
 */
export function addToFavorites(userId: string, recipeId: string): void {
  db.transact(
    tx.favorites[id()].update({
      userId,
      recipeId,
      addedAt: Date.now(),
    })
  );
}

/**
 * Remove a recipe from favorites
 */
export function removeFromFavorites(favoriteId: string): void {
  db.transact(tx.favorites[favoriteId].delete());
}

/**
 * Check if a recipe is favorited by a user
 * Returns the favorite ID if found, null otherwise
 */
export function findFavoriteId(
  favorites: Favorite[],
  userId: string,
  recipeId: string
): string | null {
  const favorite = favorites.find(
    fav => fav.userId === userId && fav.recipeId === recipeId
  );
  return favorite ? favorite.id : null;
}

