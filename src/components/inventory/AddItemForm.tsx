'use client';

import { UNIT_TYPES } from '@/store/store';
import Button from '@/components/Button';

interface AddItemFormProps {
  newItem: {
    name: string;
    price: string;
    unit: typeof UNIT_TYPES[keyof typeof UNIT_TYPES];
    minQuantity: string;
    stock: string;
  };
  onSubmit: () => void;
  onChange: (field: string, value: string) => void;
}

export default function AddItemForm({ newItem, onSubmit, onChange }: AddItemFormProps) {
  const getUnitOptions = () => {
    return Object.entries(UNIT_TYPES).map(([key, unit]) => ({
      label: unit.value === 'pieces' ? 'Pieces' : unit.value.toUpperCase(),
      value: key
    }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          type="text"
          className="input"
          placeholder="Item Name"
          value={newItem.name}
          onChange={(e) => onChange('name', e.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Price
        </label>
        <input
          type="number"
          className="input"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => onChange('price', e.target.value)}
          min="0"
          step="0.01"
        />
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Unit
        </label>
        <select
          className="input"
          value={Object.keys(UNIT_TYPES).find(
            key => UNIT_TYPES[key].value === newItem.unit.value
          )}
          onChange={(e) => onChange('unit', e.target.value)}
        >
          {getUnitOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Min Quantity
        </label>
        <input
          type="number"
          className="input"
          placeholder="Min Quantity"
          value={newItem.minQuantity}
          onChange={(e) => onChange('minQuantity', e.target.value)}
          min="0.1"
          step="0.1"
        />
        <span className="text-xs text-gray-500 mt-1 block">
          Quantity per sale
        </span>
      </div>
      <div className="form-group">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Initial Stock
        </label>
        <input
          type="number"
          className="input"
          placeholder="Initial Stock"
          value={newItem.stock}
          onChange={(e) => onChange('stock', e.target.value)}
          min="0"
          step="0.1"
        />
      </div>
      <div className="md:col-span-5 flex justify-end">
        <Button
          variant="primary"
          onClick={onSubmit}
          disabled={!newItem.name || !newItem.price || !newItem.minQuantity}
        >
          + Add Item
        </Button>
      </div>
    </div>
  );
} 