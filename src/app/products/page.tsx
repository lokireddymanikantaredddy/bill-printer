'use client';

import { useState } from 'react';
import { useStore, InventoryItem } from '@/store/store';
import { Card } from '@tremor/react';

export default function ProductsPage() {
  const { inventory, editInventoryItem } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [newStock, setNewStock] = useState('');

  // Filter products based on search term
  const filteredProducts = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateStock = () => {
    if (!selectedProduct || !newStock) return;

    editInventoryItem(selectedProduct.id, {
      stock: parseFloat(newStock)
    });

    setShowStockModal(false);
    setSelectedProduct(null);
    setNewStock('');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Products</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search products..."
              className="input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Price</th>
                <th className="text-left py-2">Unit</th>
                <th className="text-left py-2">Quantity per Sale</th>
                <th className="text-left py-2">Stock</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stockStatus = 
                  !product.stock || product.stock === 0 ? 'Out of Stock' :
                  product.stock < 10 ? 'Low Stock' : 'In Stock';
                
                const statusColor = 
                  stockStatus === 'Out of Stock' ? 'text-red-600' :
                  stockStatus === 'Low Stock' ? 'text-yellow-600' :
                  'text-green-600';

                return (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">₹{product.price}</td>
                    <td className="py-2">{product.unit.value}</td>
                    <td className="py-2">{product.minQuantity} {product.unit.value}</td>
                    <td className="py-2">{product.stock || 0}</td>
                    <td className={`py-2 font-medium ${statusColor}`}>
                      {stockStatus}
                    </td>
                    <td className="py-2">
                      <button
                        className="btn btn-secondary text-blue-600 hover:text-blue-700"
                        onClick={() => {
                          setSelectedProduct(product);
                          setNewStock(product.stock?.toString() || '0');
                          setShowStockModal(true);
                        }}
                      >
                        Update Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Update Stock - {selectedProduct.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Stock: {selectedProduct.stock || 0} {selectedProduct.unit.value}
                </label>
                <input
                  type="number"
                  className="input w-full"
                  placeholder="Enter new stock quantity"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  min="0"
                  step="0.1"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowStockModal(false);
                    setSelectedProduct(null);
                    setNewStock('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleUpdateStock}
                >
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 