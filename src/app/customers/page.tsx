'use client';

import { useState } from 'react';
import { useStore } from '@/store/store';
import { Card } from '@tremor/react';

interface CustomerSummary {
  name: string;
  phone: string;
  address: string;
  totalBills: number;
  totalAmount: number;
  lastPurchase: string;
  bills: string[]; // Array of bill IDs
}

export default function CustomersPage() {
  const { bills, editBill } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerSummary | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Create customer summaries
  const customerMap = new Map<string, CustomerSummary>();
  
  bills.forEach(bill => {
    const key = `${bill.customerName}-${bill.customerPhone}`;
    const existing = customerMap.get(key);
    
    if (existing) {
      customerMap.set(key, {
        ...existing,
        totalBills: existing.totalBills + 1,
        totalAmount: existing.totalAmount + bill.total,
        lastPurchase: new Date(bill.date) > new Date(existing.lastPurchase) 
          ? bill.date 
          : existing.lastPurchase,
        bills: [...existing.bills, bill.id]
      });
    } else {
      customerMap.set(key, {
        name: bill.customerName,
        phone: bill.customerPhone || '',
        address: bill.customerAddress || '',
        totalBills: 1,
        totalAmount: bill.total,
        lastPurchase: bill.date,
        bills: [bill.id]
      });
    }
  });

  const customers = Array.from(customerMap.values());

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleEditCustomer = () => {
    if (!selectedCustomer) return;

    // Update all bills for this customer
    selectedCustomer.bills.forEach(billId => {
      const bill = bills.find(b => b.id === billId);
      if (bill) {
        editBill(billId, {
          customerName: editForm.name,
          customerPhone: editForm.phone,
          customerAddress: editForm.address
        });
      }
    });

    setShowEditModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Customers</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search customers..."
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
                <th className="text-left py-2">Phone</th>
                <th className="text-left py-2">Address</th>
                <th className="text-right py-2">Total Bills</th>
                <th className="text-right py-2">Total Amount</th>
                <th className="text-left py-2">Last Purchase</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{customer.name}</td>
                  <td className="py-2">{customer.phone}</td>
                  <td className="py-2">{customer.address}</td>
                  <td className="py-2 text-right">{customer.totalBills}</td>
                  <td className="py-2 text-right">₹{customer.totalAmount.toFixed(2)}</td>
                  <td className="py-2">{new Date(customer.lastPurchase).toLocaleDateString('en-IN')}</td>
                  <td className="py-2">
                    <button
                      className="btn btn-secondary text-blue-600 hover:text-blue-700"
                      onClick={() => {
                        setSelectedCustomer(customer);
                        setEditForm({
                          name: customer.name,
                          phone: customer.phone,
                          address: customer.address
                        });
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">
              Edit Customer Details
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  className="input w-full"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  className="input w-full"
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedCustomer(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleEditCustomer}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 