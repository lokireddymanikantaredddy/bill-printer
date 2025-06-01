'use client';

import { useState } from 'react';
import { useStore, InventoryItem, BillItem, Bill, convertUnits } from '@/store/store';
import BillPreview from '@/components/BillPreview';

export default function BillingPage() {
  const { inventory, addBill, settings, editInventoryItem } = useStore();
  const [selectedItems, setSelectedItems] = useState<BillItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isCredit, setIsCredit] = useState(false);
  const [interestRate, setInterestRate] = useState(settings.defaultInterestRate.toString());
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddItem = (item: InventoryItem) => {
    const existingItem = selectedItems.find(i => i.id === item.id);
    const newQuantity = existingItem ? existingItem.displayQuantity + 1 : 1;
    const requiredStock = newQuantity * (item.minQuantity || 1);

    if (!hasEnoughStock(item, requiredStock)) {
      alert(`Not enough stock for ${item.name}. Available: ${item.stock} ${item.unit.value}`);
      return;
    }

    if (existingItem) {
      setSelectedItems(selectedItems.map(i => 
        i.id === item.id 
          ? { 
              ...i, 
              displayQuantity: newQuantity,
              quantity: requiredStock,
              total: newQuantity * i.price 
            }
          : i
      ));
    } else {
      setSelectedItems([...selectedItems, { 
        ...item, 
        displayQuantity: 1,
        quantity: item.minQuantity || 1,
        total: item.price
      }]);
    }
  };

  const handleUpdateQuantity = (itemId: string, displayValue: number) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const requiredStock = displayValue * (item.minQuantity || 1);
    if (!hasEnoughStock(item, requiredStock)) {
      alert(`Not enough stock for ${item.name}. Available: ${item.stock} ${item.unit.value}`);
      return;
    }

    setSelectedItems(selectedItems.map(selectedItem =>
      selectedItem.id === itemId
        ? { 
            ...selectedItem, 
            displayQuantity: displayValue,
            quantity: requiredStock,
            total: displayValue * selectedItem.price 
          }
        : selectedItem
    ));
  };

  const handleRemoveItem = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const handleGenerateBill = async () => {
    if (!customerName || selectedItems.length === 0) {
      alert('Please enter customer name and add items to the bill');
      return;
    }

    // Check stock availability for all items
    for (const item of selectedItems) {
      const inventoryItem = inventory.find(i => i.id === item.id);
      if (!inventoryItem) continue;

      if (!hasEnoughStock(inventoryItem, item.quantity)) {
        alert(`Not enough stock for ${item.name}. Available: ${inventoryItem.stock} ${inventoryItem.unit.value}`);
        return;
      }
    }

    const total = selectedItems.reduce((sum, item) => sum + item.total, 0);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + settings.defaultCreditDuration);

    const bill = {
      customerName,
      customerPhone,
      customerAddress,
      items: selectedItems,
      total,
      isCredit,
      creditDetails: isCredit ? {
        startDate: new Date().toISOString(),
        dueDate: dueDate.toISOString(),
        interestRate: parseFloat(interestRate),
        status: 'PENDING' as const,
        paidAmount: 0
      } : undefined
    };

    try {
      // Update stock for each item
      for (const item of selectedItems) {
        const inventoryItem = inventory.find(i => i.id === item.id);
        if (!inventoryItem) continue;

        const newStock = (inventoryItem.stock || 0) - item.quantity;
        await editInventoryItem(item.id, { stock: newStock });
      }

      // Add the bill
      await addBill(bill);

      setSelectedItems([]);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
      setIsCredit(false);
      setInterestRate(settings.defaultInterestRate.toString());
      alert('Bill generated successfully!');
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message.replace('Error: ', '');
        alert(`Failed to generate bill:\n\n${errorMessage}`);
      } else {
        alert('Failed to generate bill. Please try again.');
      }
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to check if there's enough stock
  const hasEnoughStock = (item: InventoryItem, requestedQuantity: number) => {
    return (item.stock || 0) >= requestedQuantity;
  };

  // Function to get minimum quantity
  const getMinQuantity = (item: InventoryItem) => {
    return item.minQuantity || 1;
  };

  // Function to get stock status class
  const getStockStatusClass = (item: InventoryItem) => {
    if (!item.stock || item.stock === 0) return 'text-red-600';
    if (item.stock <= getMinQuantity(item)) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="Customer Name"
              className="input flex-1"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="input flex-1"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Address"
              className="input w-full"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isCredit}
                onChange={(e) => setIsCredit(e.target.checked)}
              />
              Credit Bill
            </label>
            {isCredit && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label>Interest Rate (%):</label>
                <input
                  type="number"
                  className="input w-24"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Search products..."
              className="input w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 text-xs sm:text-sm">Name</th>
                    <th className="text-right p-4 text-xs sm:text-sm">Stock</th>
                    <th className="text-right p-4 text-xs sm:text-sm">Price</th>
                    <th className="text-center p-4 text-xs sm:text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-4 text-xs sm:text-sm">{item.name}</td>
                      <td className={`p-4 text-right text-xs sm:text-sm ${getStockStatusClass(item)}`}>
                        {item.stock || 0} {item.unit.value}
                      </td>
                      <td className="p-4 text-right text-xs sm:text-sm">₹{item.price}</td>
                      <td className="p-4 text-center">
                        <button
                          className={`px-3 py-1 rounded text-white text-sm ${
                            hasEnoughStock(item, getMinQuantity(item))
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                          onClick={() => handleAddItem(item)}
                          disabled={!hasEnoughStock(item, getMinQuantity(item))}
                        >
                          Add
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div>
        <BillPreview
          selectedItems={selectedItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onGenerateBill={handleGenerateBill}
          customerName={customerName}
          customerPhone={customerPhone}
          customerAddress={customerAddress}
          isCredit={isCredit}
          interestRate={parseFloat(interestRate)}
        />
      </div>
    </div>
  );
} 