import { DietaryTag } from '../types';
import './FilterBar.css';

interface FilterBarProps {
  selectedFilters: DietaryTag[];
  onFiltersChange: (filters: DietaryTag[]) => void;
}

const availableFilters: { value: DietaryTag; label: string }[] = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'dairy-free', label: 'Dairy-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'low-carb', label: 'Low-Carb' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
];

export default function FilterBar({ selectedFilters, onFiltersChange }: FilterBarProps) {
  const handleFilterToggle = (filter: DietaryTag) => {
    if (selectedFilters.includes(filter)) {
      onFiltersChange(selectedFilters.filter(f => f !== filter));
    } else {
      onFiltersChange([...selectedFilters, filter]);
    }
  };

  const handleClearFilters = () => {
    onFiltersChange([]);
  };

  return (
    <div className="filter-bar-container">
      <div className="filter-bar-header">
        <h3>Dietary Restrictions</h3>
        {selectedFilters.length > 0 && (
          <button onClick={handleClearFilters} className="clear-filters-button">
            Clear Filters
          </button>
        )}
      </div>
      <div className="filter-options">
        {availableFilters.map(({ value, label }) => (
          <label key={value} className="filter-checkbox">
            <input
              type="checkbox"
              checked={selectedFilters.includes(value)}
              onChange={() => handleFilterToggle(value)}
            />
            <span className="filter-label">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
