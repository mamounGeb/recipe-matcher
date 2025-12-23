import { useState, KeyboardEvent, useEffect, useRef } from 'react';
import './IngredientInput.css';
import { getIngredientSuggestions } from '../services/api';

interface IngredientInputProps {
  ingredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

export default function IngredientInput({ ingredients, onIngredientsChange }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounce API calls for ingredient suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputValue.trim().length > 0) {
        const results = await getIngredientSuggestions(inputValue.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
        setSelectedIndex(-1);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [inputValue]);

  const handleAddIngredient = (ingredient?: string) => {
    const trimmed = (ingredient || inputValue).trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue('');
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleAddIngredient(suggestions[selectedIndex]);
      } else {
        handleAddIngredient();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleAddIngredient(suggestion);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow click events to fire
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
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
        <div className="autocomplete-container">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Type an ingredient and press Enter..."
            className="ingredient-input"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div ref={suggestionsRef} className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion}
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <button 
          onClick={() => handleAddIngredient()}
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
