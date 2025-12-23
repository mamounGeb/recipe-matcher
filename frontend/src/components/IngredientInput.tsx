import { useState, KeyboardEvent } from 'react';
import './IngredientInput.css';

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

export default function IngredientInput({ ingredients, onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddIngredient = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleRemoveIngredient = (ingredientToRemove: string) => {
    onIngredientsChange(ingredients.filter(ing => ing !== ingredientToRemove));
  };

  const handleClearAll = () => {
    onIngredientsChange([]);
  };

  return (
    <div className="ingredient-input-container">
      <div className="ingredient-input-header">
        <h2>What's in your fridge?</h2>
        <p>Enter the ingredients you have available</p>
      </div>
      
      <div className="ingredient-input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type an ingredient and press Enter..."
          className="ingredient-input"
        />
        <button 
          onClick={handleAddIngredient}
          className="add-button"
          disabled={!inputValue.trim()}
        >
          Add
        </button>
      </div>

      {ingredients.length > 0 && (
        <div className="ingredients-list">
          <div className="ingredients-header">
            <span className="ingredients-count">{ingredients.length} ingredient{ingredients.length !== 1 ? 's' : ''}</span>
            <button onClick={handleClearAll} className="clear-all-button">
              Clear All
            </button>
          </div>
          <div className="ingredient-tags">
            {ingredients.map((ingredient, index) => (
              <span key={index} className="ingredient-tag">
                {ingredient}
                <button
                  onClick={() => handleRemoveIngredient(ingredient)}
                  className="remove-tag-button"
                  aria-label={`Remove ${ingredient}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
