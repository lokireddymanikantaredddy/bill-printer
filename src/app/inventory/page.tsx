'use client';

import { useState } from 'react';
import { useStore, InventoryItem, UNIT_TYPES } from '@/store/store';
import AddItemForm from '@/components/inventory/AddItemForm';
import InventoryTable from '@/components/inventory/InventoryTable';

export default function InventoryPage() {
  const { inventory, addInventoryItem, removeInventoryItem, editInventoryItem } = useStore();
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    unit: UNIT_TYPES.GRAM,
    minQuantity: '100',
    stock: '0'
  });
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price || !newItem.minQuantity) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      addInventoryItem({
        name: newItem.name,
        price: parseFloat(newItem.price),
        unit: newItem.unit,
        minQuantity: parseFloat(newItem.minQuantity),
        stock: parseFloat(newItem.stock)
      });

      setNewItem({
        name: '',
        price: '',
        unit: UNIT_TYPES.GRAM,
        minQuantity: '100',
        stock: '0'
      });
    } catch (error) {
      alert('Failed to add item. Please try again.');
    }
  };

  const handleEditClick = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const handleEditSave = () => {
    if (!editingItem?.id) return;

    try {
      editInventoryItem(editingItem.id, {
        name: editingItem.name,
        price: editingItem.price,
        unit: editingItem.unit,
        minQuantity: editingItem.minQuantity,
        stock: editingItem.stock
      });

      setEditingItem(null);
    } catch (error) {
      alert('Failed to update item. Please try again.');
    }
  };

  const handleEditCancel = () => {
    setEditingItem(null);
  };

  const handleNewItemChange = (field: string, value: string) => {
    if (field === 'unit') {
      setNewItem({ ...newItem, unit: UNIT_TYPES[value] });
    } else {
      setNewItem({ ...newItem, [field]: value });
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Add New Item</h2>
        <AddItemForm
          newItem={newItem}
          onSubmit={handleAddItem}
          onChange={handleNewItemChange}
        />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Inventory Items</h2>
        <InventoryTable
          inventory={inventory}
          editingItem={editingItem}
          onEdit={handleEditClick}
          onSave={handleEditSave}
          onCancel={handleEditCancel}
          onDelete={removeInventoryItem}
          onEditChange={setEditingItem}
        />
      </div>
    </div>
  );
} 