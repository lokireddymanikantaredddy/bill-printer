'use client';

import { InventoryItem, UNIT_TYPES } from '@/store/store';
import Button from '@/components/Button';

interface InventoryTableProps {
  inventory: InventoryItem[];
  editingItem: InventoryItem | null;
  onEdit: (item: InventoryItem) => void;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onEditChange: (item: InventoryItem) => void;
}

export default function InventoryTable({
  inventory,
  editingItem,
  onEdit,
  onSave,
  onCancel,
  onDelete,
  onEditChange,
}: InventoryTableProps) {
  const getUnitOptions = () => {
    return Object.entries(UNIT_TYPES).map(([key, unit]) => ({
      label: unit.value === 'pieces' ? 'Pieces' : unit.value.toUpperCase(),
      value: key
    }));
  };

  const getStockStatusClass = (item: InventoryItem) => {
    if (item.stock === 0) return 'text-red-600';
    if (item.stock <= item.minQuantity) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Unit
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Min Quantity
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stock
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventory.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                No items in inventory
              </td>
            </tr>
          ) : (
            inventory.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingItem?.id === item.id ? (
                    <input
                      type="text"
                      className="input"
                      value={editingItem.name}
                      onChange={(e) => onEditChange({ ...editingItem, name: e.target.value })}
                    />
                  ) : (
                    item.name
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingItem?.id === item.id ? (
                    <input
                      type="number"
                      className="input"
                      value={editingItem.price}
                      onChange={(e) => onEditChange({ ...editingItem, price: parseFloat(e.target.value) })}
                      min="0"
                      step="0.01"
                    />
                  ) : (
                    `₹${item.price}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingItem?.id === item.id ? (
                    <select
                      className="input"
                      value={Object.keys(UNIT_TYPES).find(
                        key => UNIT_TYPES[key].value === editingItem.unit.value
                      )}
                      onChange={(e) => onEditChange({ ...editingItem, unit: UNIT_TYPES[e.target.value] })}
                    >
                      {getUnitOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    item.unit.value
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingItem?.id === item.id ? (
                    <input
                      type="number"
                      className="input"
                      value={editingItem.minQuantity}
                      onChange={(e) => onEditChange({ ...editingItem, minQuantity: parseFloat(e.target.value) })}
                      min="0.1"
                      step="0.1"
                    />
                  ) : (
                    `${item.minQuantity} ${item.unit.value}`
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {editingItem?.id === item.id ? (
                    <input
                      type="number"
                      className="input"
                      value={editingItem.stock}
                      onChange={(e) => onEditChange({ ...editingItem, stock: parseFloat(e.target.value) })}
                      min="0"
                      step="0.1"
                    />
                  ) : (
                    <span className={getStockStatusClass(item)}>
                      {item.stock} {item.unit.value}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingItem?.id === item.id ? (
                    <div className="space-x-2">
                      <Button
                        variant="secondary"
                        color="green"
                        onClick={onSave}
                      >
                        Save
                      </Button>
                      <Button
                        variant="secondary"
                        color="gray"
                        onClick={onCancel}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="space-x-2">
                      <Button
                        variant="secondary"
                        color="blue"
                        onClick={() => onEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        color="red"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 