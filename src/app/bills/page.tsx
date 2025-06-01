'use client';

import { useState } from 'react';
import { useStore, Bill } from '@/store/store';
import BillPreview from '@/components/BillPreview';

export default function BillsPage() {
  const { bills, removeBill, editBill } = useStore();
  const [selectedBill, setSelectedBill] = useState<string | null>(null);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);

  const handlePrint = (billId: string) => {
    setSelectedBill(billId);
  };

  const handleCloseBillPreview = () => {
    setSelectedBill(null);
  };

  const handleEditClick = (bill: Bill) => {
    setEditingBill({ ...bill });
  };

  const handleEditSave = () => {
    if (!editingBill) return;

    editBill(editingBill.id, {
      customerName: editingBill.customerName,
      customerPhone: editingBill.customerPhone,
      customerAddress: editingBill.customerAddress,
      items: editingBill.items
    });

    setEditingBill(null);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h2>Bills History</h2>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500">
                    No bills yet.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.id}>
                    <td>{bill.billNumber}</td>
                    <td>{new Date(bill.date).toLocaleDateString('en-IN')}</td>
                    <td>
                      {editingBill?.id === bill.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            className="input"
                            placeholder="Customer Name"
                            value={editingBill.customerName}
                            onChange={(e) => setEditingBill({ ...editingBill, customerName: e.target.value })}
                          />
                          <input
                            type="text"
                            className="input"
                            placeholder="Phone"
                            value={editingBill.customerPhone}
                            onChange={(e) => setEditingBill({ ...editingBill, customerPhone: e.target.value })}
                          />
                          <input
                            type="text"
                            className="input"
                            placeholder="Address"
                            value={editingBill.customerAddress}
                            onChange={(e) => setEditingBill({ ...editingBill, customerAddress: e.target.value })}
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium">{bill.customerName}</div>
                          <div className="text-sm text-gray-500">{bill.customerPhone}</div>
                          <div className="text-sm text-gray-500">{bill.customerAddress}</div>
                        </div>
                      )}
                    </td>
                    <td>₹{bill.total.toFixed(2)}</td>
                    <td>
                      <div className="flex gap-2">
                        {editingBill?.id === bill.id ? (
                          <>
                            <button
                              className="btn btn-secondary text-green-600 hover:text-green-700"
                              onClick={handleEditSave}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary text-gray-600 hover:text-gray-700"
                              onClick={() => setEditingBill(null)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-secondary text-blue-600 hover:text-blue-700"
                              onClick={() => handlePrint(bill.id)}
                            >
                              View/Print
                            </button>
                            <button
                              className="btn btn-secondary text-blue-600 hover:text-blue-700"
                              onClick={() => handleEditClick(bill)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-secondary text-red-600 hover:text-red-700"
                              onClick={() => removeBill(bill.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Preview Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto w-full max-w-4xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Bill Preview</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={handleCloseBillPreview}
              >
                Close
              </button>
            </div>
            <div className="p-4">
              <BillPreview bill={bills.find(b => b.id === selectedBill)!} />
            </div>
            <div className="p-4 border-t flex justify-end">
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
              >
                Print Bill
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 