import { useState } from 'react';
import { db } from '../lib/instantdb';
import { id, tx } from '@instantdb/react';
import { Recipe } from '../types';
import './SeedRecipes.css';

const SAMPLE_RECIPES: Omit<Recipe, 'id'>[] = [
  {
    name: 'Classic Spaghetti Carbonara',
    ingredients: ['spaghetti', 'eggs', 'bacon', 'parmesan cheese', 'black pepper', 'garlic'],
    instructions: [
      'Cook spaghetti according to package directions.',
      'Cook bacon until crispy, then set aside.',
      'Whisk eggs and parmesan together in a bowl.',
      'Drain pasta, reserving some pasta water.',
      'Toss hot pasta with bacon, then add egg mixture off heat.',
      'Stir quickly, adding pasta water if needed.',
      'Season with black pepper and serve immediately.',
    ],
    dietaryTags: [],
    prepTime: 30,
    servings: 4,
  },
  {
    name: 'Vegan Buddha Bowl',
    ingredients: ['quinoa', 'chickpeas', 'sweet potato', 'kale', 'avocado', 'lemon', 'tahini'],
    instructions: [
      'Cook quinoa according to package directions.',
      'Roast sweet potato cubes at 400°F for 20 minutes.',
      'Roast chickpeas with spices until crispy.',
      'Massage kale with lemon juice.',
      'Arrange quinoa, sweet potato, chickpeas, and kale in a bowl.',
      'Top with avocado and drizzle with tahini dressing.',
    ],
    dietaryTags: ['vegan', 'gluten-free'],
    prepTime: 45,
    servings: 2,
  },
  {
    name: 'Grilled Chicken Salad',
    ingredients: ['chicken breast', 'lettuce', 'tomatoes', 'cucumber', 'olive oil', 'lemon', 'herbs'],
    instructions: [
      'Season chicken breast with herbs and grill until cooked through.',
      'Chop lettuce, tomatoes, and cucumber.',
      'Mix vegetables in a large bowl.',
      'Slice grilled chicken and place on top.',
      'Drizzle with olive oil and lemon juice.',
      'Toss and serve.',
    ],
    dietaryTags: ['gluten-free', 'low-carb'],
    prepTime: 25,
    servings: 2,
  },
  {
    name: 'Vegetarian Tacos',
    ingredients: ['black beans', 'corn', 'tortillas', 'avocado', 'lime', 'cilantro', 'onion', 'cheese'],
    instructions: [
      'Heat black beans and corn in a pan.',
      'Warm tortillas.',
      'Dice avocado and onion.',
      'Fill tortillas with beans, corn, avocado, and onion.',
      'Top with cheese, cilantro, and lime juice.',
    ],
    dietaryTags: ['vegetarian'],
    prepTime: 20,
    servings: 4,
  },
  {
    name: 'Salmon with Roasted Vegetables',
    ingredients: ['salmon', 'broccoli', 'carrots', 'olive oil', 'lemon', 'garlic', 'herbs'],
    instructions: [
      'Preheat oven to 400°F.',
      'Season salmon with herbs, garlic, and lemon.',
      'Toss vegetables with olive oil and seasonings.',
      'Roast vegetables for 15 minutes.',
      'Add salmon to the pan and roast for 12-15 minutes.',
      'Serve with lemon wedges.',
    ],
    dietaryTags: ['gluten-free', 'low-carb'],
    prepTime: 35,
    servings: 2,
  },
  {
    name: 'Vegan Chocolate Chip Cookies',
    ingredients: ['flour', 'sugar', 'vegan butter', 'vanilla extract', 'chocolate chips', 'baking soda'],
    instructions: [
      'Preheat oven to 375°F.',
      'Cream vegan butter and sugar.',
      'Add vanilla extract.',
      'Mix in flour and baking soda.',
      'Fold in chocolate chips.',
      'Drop onto baking sheet and bake for 10-12 minutes.',
    ],
    dietaryTags: ['vegan', 'nut-free'],
    prepTime: 25,
    servings: 24,
  },
  {
    name: 'Caprese Salad',
    ingredients: ['tomatoes', 'mozzarella', 'basil', 'olive oil', 'balsamic vinegar', 'salt', 'pepper'],
    instructions: [
      'Slice tomatoes and mozzarella.',
      'Arrange alternating slices on a plate.',
      'Tear basil leaves and scatter over top.',
      'Drizzle with olive oil and balsamic vinegar.',
      'Season with salt and pepper.',
    ],
    dietaryTags: ['vegetarian', 'gluten-free'],
    prepTime: 10,
    servings: 4,
  },
  {
    name: 'Stir-Fry Vegetables',
    ingredients: ['broccoli', 'bell peppers', 'carrots', 'soy sauce', 'ginger', 'garlic', 'rice'],
    instructions: [
      'Cook rice according to package directions.',
      'Heat oil in a wok or large pan.',
      'Add garlic and ginger, stir for 30 seconds.',
      'Add vegetables and stir-fry for 5-7 minutes.',
      'Add soy sauce and cook for 1 more minute.',
      'Serve over rice.',
    ],
    dietaryTags: ['vegan', 'vegetarian'],
    prepTime: 20,
    servings: 4,
  },
  {
    name: 'Chicken Curry',
    ingredients: ['chicken', 'onion', 'garlic', 'ginger', 'curry powder', 'coconut milk', 'tomatoes', 'rice'],
    instructions: [
      'Heat oil in a large pot and sauté onions until golden.',
      'Add garlic and ginger, cook for 1 minute.',
      'Add chicken and brown on all sides.',
      'Stir in curry powder and cook for 2 minutes.',
      'Add tomatoes and coconut milk, bring to a boil.',
      'Reduce heat and simmer for 20-25 minutes until chicken is cooked.',
      'Serve over rice.',
    ],
    dietaryTags: ['gluten-free'],
    prepTime: 45,
    servings: 4,
  },
  {
    name: 'Margherita Pizza',
    ingredients: ['pizza dough', 'tomato sauce', 'mozzarella cheese', 'basil', 'olive oil', 'garlic'],
    instructions: [
      'Preheat oven to 475°F.',
      'Roll out pizza dough on a floured surface.',
      'Spread tomato sauce over dough.',
      'Top with mozzarella cheese and fresh basil.',
      'Drizzle with olive oil and minced garlic.',
      'Bake for 12-15 minutes until crust is golden.',
    ],
    dietaryTags: ['vegetarian'],
    prepTime: 30,
    servings: 4,
  },
  {
    name: 'Greek Salad',
    ingredients: ['cucumber', 'tomatoes', 'red onion', 'feta cheese', 'olives', 'olive oil', 'lemon', 'oregano'],
    instructions: [
      'Dice cucumber and tomatoes into bite-sized pieces.',
      'Thinly slice red onion.',
      'Combine vegetables in a large bowl.',
      'Add crumbled feta cheese and olives.',
      'Drizzle with olive oil and lemon juice.',
      'Sprinkle with oregano and toss gently.',
    ],
    dietaryTags: ['vegetarian', 'gluten-free'],
    prepTime: 15,
    servings: 4,
  },
  {
    name: 'Beef Stir Fry',
    ingredients: ['beef', 'broccoli', 'carrots', 'bell peppers', 'soy sauce', 'ginger', 'garlic', 'rice'],
    instructions: [
      'Slice beef into thin strips and marinate in soy sauce.',
      'Cook rice according to package directions.',
      'Heat oil in a wok over high heat.',
      'Stir-fry beef until browned, then remove.',
      'Add vegetables and stir-fry for 3-4 minutes.',
      'Return beef to pan, add ginger and garlic.',
      'Toss everything together and serve over rice.',
    ],
    dietaryTags: [],
    prepTime: 25,
    servings: 4,
  },
  {
    name: 'Quinoa Salad Bowl',
    ingredients: ['quinoa', 'chickpeas', 'cucumber', 'tomatoes', 'red onion', 'feta cheese', 'lemon', 'olive oil'],
    instructions: [
      'Cook quinoa according to package directions and let cool.',
      'Dice cucumber, tomatoes, and red onion.',
      'Combine quinoa with vegetables and chickpeas.',
      'Add crumbled feta cheese.',
      'Dress with lemon juice and olive oil.',
      'Toss and serve chilled.',
    ],
    dietaryTags: ['vegetarian', 'gluten-free'],
    prepTime: 20,
    servings: 3,
  },
  {
    name: 'Pasta with Marinara Sauce',
    ingredients: ['pasta', 'tomatoes', 'garlic', 'onion', 'basil', 'olive oil', 'salt', 'pepper'],
    instructions: [
      'Cook pasta according to package directions.',
      'Heat olive oil in a pan and sauté garlic and onion.',
      'Add diced tomatoes and cook for 10 minutes.',
      'Season with salt, pepper, and fresh basil.',
      'Toss cooked pasta with sauce.',
      'Serve with grated cheese if desired.',
    ],
    dietaryTags: ['vegetarian', 'vegan'],
    prepTime: 25,
    servings: 4,
  },
  {
    name: 'Grilled Salmon with Asparagus',
    ingredients: ['salmon', 'asparagus', 'lemon', 'olive oil', 'garlic', 'herbs', 'salt', 'pepper'],
    instructions: [
      'Preheat grill to medium-high heat.',
      'Season salmon with herbs, salt, and pepper.',
      'Toss asparagus with olive oil and garlic.',
      'Grill salmon for 4-5 minutes per side.',
      'Grill asparagus for 5-7 minutes until tender.',
      'Serve with lemon wedges.',
    ],
    dietaryTags: ['gluten-free', 'low-carb', 'keto'],
    prepTime: 20,
    servings: 2,
  },
  {
    name: 'Vegetable Soup',
    ingredients: ['carrots', 'celery', 'onion', 'potatoes', 'tomatoes', 'vegetable broth', 'herbs', 'garlic'],
    instructions: [
      'Dice all vegetables into small pieces.',
      'Heat oil in a large pot and sauté onion and garlic.',
      'Add carrots and celery, cook for 5 minutes.',
      'Add potatoes, tomatoes, and vegetable broth.',
      'Bring to a boil, then simmer for 20 minutes.',
      'Season with herbs, salt, and pepper.',
    ],
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free'],
    prepTime: 35,
    servings: 6,
  },
  {
    name: 'Chicken Caesar Salad',
    ingredients: ['chicken breast', 'romaine lettuce', 'parmesan cheese', 'caesar dressing', 'croutons', 'lemon'],
    instructions: [
      'Grill or pan-sear chicken breast until cooked through.',
      'Chop romaine lettuce into bite-sized pieces.',
      'Slice chicken into strips.',
      'Toss lettuce with caesar dressing.',
      'Top with chicken, parmesan cheese, and croutons.',
      'Serve with lemon wedges.',
    ],
    dietaryTags: [],
    prepTime: 20,
    servings: 2,
  },
  {
    name: 'Mushroom Risotto',
    ingredients: ['arborio rice', 'mushrooms', 'onion', 'garlic', 'white wine', 'vegetable broth', 'parmesan cheese', 'butter'],
    instructions: [
      'Sauté mushrooms and set aside.',
      'In the same pan, cook onion and garlic until soft.',
      'Add rice and toast for 2 minutes.',
      'Pour in wine and stir until absorbed.',
      'Add broth one ladle at a time, stirring constantly.',
      'When rice is creamy, stir in mushrooms, butter, and parmesan.',
    ],
    dietaryTags: ['vegetarian'],
    prepTime: 40,
    servings: 4,
  },
  {
    name: 'Tofu Scramble',
    ingredients: ['tofu', 'onion', 'bell peppers', 'turmeric', 'garlic', 'spinach', 'olive oil', 'salt'],
    instructions: [
      'Crumble tofu into a bowl.',
      'Heat oil in a pan and sauté onion and bell peppers.',
      'Add garlic and cook for 30 seconds.',
      'Add crumbled tofu and turmeric.',
      'Stir in spinach and cook until wilted.',
      'Season with salt and pepper.',
    ],
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free'],
    prepTime: 15,
    servings: 2,
  },
  {
    name: 'Lentil Soup',
    ingredients: ['lentils', 'onion', 'carrots', 'celery', 'garlic', 'vegetable broth', 'cumin', 'lemon'],
    instructions: [
      'Rinse lentils and set aside.',
      'Dice vegetables into small pieces.',
      'Heat oil in a pot and sauté vegetables until soft.',
      'Add lentils, broth, and cumin.',
      'Bring to a boil, then simmer for 30 minutes.',
      'Season with lemon juice and serve.',
    ],
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free'],
    prepTime: 45,
    servings: 6,
  },
  {
    name: 'Shrimp Scampi',
    ingredients: ['shrimp', 'pasta', 'garlic', 'white wine', 'lemon', 'butter', 'parsley', 'red pepper flakes'],
    instructions: [
      'Cook pasta according to package directions.',
      'Heat butter in a large pan and add garlic.',
      'Add shrimp and cook until pink.',
      'Pour in white wine and lemon juice.',
      'Toss with cooked pasta and parsley.',
      'Season with red pepper flakes.',
    ],
    dietaryTags: [],
    prepTime: 20,
    servings: 4,
  },
  {
    name: 'Avocado Toast',
    ingredients: ['bread', 'avocado', 'lemon', 'salt', 'pepper', 'red pepper flakes', 'eggs'],
    instructions: [
      'Toast bread until golden brown.',
      'Mash avocado with lemon juice, salt, and pepper.',
      'Spread avocado mixture on toast.',
      'Top with optional fried or poached egg.',
      'Sprinkle with red pepper flakes.',
    ],
    dietaryTags: ['vegetarian'],
    prepTime: 10,
    servings: 2,
  },
  {
    name: 'Chicken Tacos',
    ingredients: ['chicken', 'tortillas', 'lettuce', 'tomatoes', 'cheese', 'sour cream', 'lime', 'cilantro'],
    instructions: [
      'Cook and shred chicken.',
      'Warm tortillas.',
      'Dice tomatoes and shred lettuce.',
      'Fill tortillas with chicken, lettuce, and tomatoes.',
      'Top with cheese, sour cream, and cilantro.',
      'Serve with lime wedges.',
    ],
    dietaryTags: [],
    prepTime: 25,
    servings: 4,
  },
  {
    name: 'Ratatouille',
    ingredients: ['eggplant', 'zucchini', 'tomatoes', 'bell peppers', 'onion', 'garlic', 'olive oil', 'herbs'],
    instructions: [
      'Slice all vegetables into rounds or cubes.',
      'Heat olive oil in a large pan.',
      'Sauté onion and garlic until soft.',
      'Add vegetables in layers, starting with eggplant.',
      'Cover and cook for 20-25 minutes until tender.',
      'Season with herbs and serve.',
    ],
    dietaryTags: ['vegan', 'vegetarian', 'gluten-free'],
    prepTime: 40,
    servings: 6,
  },
  {
    name: 'Beef Burger',
    ingredients: ['ground beef', 'burger buns', 'lettuce', 'tomatoes', 'onion', 'cheese', 'pickles', 'ketchup'],
    instructions: [
      'Form ground beef into patties.',
      'Season patties with salt and pepper.',
      'Grill or pan-fry burgers to desired doneness.',
      'Toast burger buns.',
      'Assemble burgers with lettuce, tomatoes, onion, cheese, and pickles.',
      'Serve with ketchup and mustard.',
    ],
    dietaryTags: [],
    prepTime: 20,
    servings: 4,
  },
  {
    name: 'Smoothie Bowl',
    ingredients: ['bananas', 'berries', 'yogurt', 'granola', 'honey', 'chia seeds', 'coconut flakes'],
    instructions: [
      'Blend frozen bananas and berries with yogurt.',
      'Pour into a bowl.',
      'Top with granola, chia seeds, and coconut flakes.',
      'Drizzle with honey.',
      'Serve immediately.',
    ],
    dietaryTags: ['vegetarian', 'gluten-free'],
    prepTime: 10,
    servings: 1,
  },
];

export default function SeedRecipes() {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSeed = async () => {
    setSeeding(true);
    setError(null);

    try {
      const transactions = SAMPLE_RECIPES.map(recipe => ({
        id: id(),
        ...recipe,
        createdAt: Date.now(),
      }));

      db.transact(
        transactions.map(recipe => tx.recipes[recipe.id].update(recipe))
      );

      setSeeded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to seed recipes');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="seed-recipes-container">
      <h3>Seed Sample Recipes</h3>
      <p>Add {SAMPLE_RECIPES.length} sample recipes to the database</p>
      {error && <div className="error-message">{error}</div>}
      {seeded && <div className="success-message">Recipes seeded successfully!</div>}
      <button
        onClick={handleSeed}
        disabled={seeding || seeded}
        className="seed-button"
      >
        {seeding ? 'Seeding...' : seeded ? 'Recipes Seeded' : 'Seed Recipes'}
      </button>
    </div>
  );
}

