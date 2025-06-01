'use client';

import { Bill, BillItem } from '@/store/store';
import Button from '@/components/Button';

interface BillPreviewProps {
  bill?: Bill;
  selectedItems?: BillItem[];
  onUpdateQuantity?: (itemId: string, displayValue: number) => void;
  onRemoveItem?: (itemId: string) => void;
  onGenerateBill?: () => void;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  isCredit?: boolean;
  interestRate?: number;
}

const BillPreview = ({ 
  bill,
  selectedItems,
  onUpdateQuantity,
  onRemoveItem,
  onGenerateBill,
  customerName,
  customerPhone,
  customerAddress,
  isCredit,
  interestRate
}: BillPreviewProps) => {
  // If bill is provided, use it for display mode
  if (bill) {
    return (
      <div className="p-4 space-y-6 text-sm sm:text-base">
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">Sri Srinivasa Fertilizers</h1>
          <p className="text-gray-600">Fertilizers and Agricultural Products</p>
          <p className="text-gray-600">Gudur, Nellore District</p>
          <p className="text-gray-600">Phone: +91 9876543210</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p><strong>Bill No:</strong> {bill.billNumber}</p>
            <p><strong>Date:</strong> {new Date(bill.date).toLocaleDateString('en-IN')}</p>
          </div>
          <div className="space-y-1">
            <p><strong>Customer:</strong> {bill.customerName}</p>
            <p><strong>Phone:</strong> {bill.customerPhone}</p>
            {bill.customerAddress && (
              <p><strong>Address:</strong> {bill.customerAddress}</p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-t">
                  <th className="text-left p-2 sm:p-4 text-xs sm:text-sm">Item</th>
                  <th className="text-right p-2 sm:p-4 text-xs sm:text-sm">Price</th>
                  <th className="text-right p-2 sm:p-4 text-xs sm:text-sm">Quantity</th>
                  <th className="text-right p-2 sm:p-4 text-xs sm:text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 sm:p-4 text-xs sm:text-sm">{item.name}</td>
                    <td className="p-2 sm:p-4 text-right text-xs sm:text-sm">₹{item.price}</td>
                    <td className="p-2 sm:p-4 text-right text-xs sm:text-sm">
                      {item.displayQuantity} {item.unit.value}
                    </td>
                    <td className="p-2 sm:p-4 text-right text-xs sm:text-sm">₹{item.total.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td colSpan={3} className="p-2 sm:p-4 text-right text-xs sm:text-sm">Total:</td>
                  <td className="p-2 sm:p-4 text-right text-xs sm:text-sm">₹{bill.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {bill.isCredit && bill.creditDetails && (
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-xs sm:text-sm">
            <h3 className="font-semibold">Credit Details</h3>
            <p><strong>Interest Rate:</strong> {bill.creditDetails.interestRate}% per year</p>
            <p><strong>Start Date:</strong> {new Date(bill.creditDetails.startDate).toLocaleDateString('en-IN')}</p>
            <p><strong>Due Date:</strong> {new Date(bill.creditDetails.dueDate).toLocaleDateString('en-IN')}</p>
            {bill.creditDetails.paidAmount > 0 && (
              <>
                <p><strong>Paid Amount:</strong> ₹{bill.creditDetails.paidAmount.toFixed(2)}</p>
                <p><strong>Balance:</strong> ₹{(bill.total - bill.creditDetails.paidAmount).toFixed(2)}</p>
              </>
            )}
            <p><strong>Status:</strong> {bill.creditDetails.status}</p>
          </div>
        )}

        <div className="text-center text-xs sm:text-sm text-gray-600 space-y-2">
          <p>Thank you for your business!</p>
          <p>For any queries, please contact: +91 9876543210</p>
        </div>
      </div>
    );
  }

  // Editing mode
  if (!selectedItems || selectedItems.length === 0) {
    return null;
  }

  const total = selectedItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6 space-y-6">
      <h2 className="text-xl font-semibold">Bill Preview</h2>
      
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4 text-xs sm:text-sm">Item</th>
                <th className="text-right p-4 text-xs sm:text-sm">Price</th>
                <th className="text-right p-4 text-xs sm:text-sm">Quantity</th>
                <th className="text-right p-4 text-xs sm:text-sm">Total</th>
                <th className="text-center p-4 text-xs sm:text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {selectedItems.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4 text-xs sm:text-sm">{item.name}</td>
                  <td className="p-4 text-right text-xs sm:text-sm">₹{item.price}</td>
                  <td className="p-4 text-right">
                    <input
                      type="number"
                      className="input w-20 text-right text-xs sm:text-sm"
                      value={item.displayQuantity}
                      onChange={(e) => onUpdateQuantity?.(item.id, parseFloat(e.target.value))}
                      min="1"
                      step="1"
                    />
                    {item.unit.value}
                  </td>
                  <td className="p-4 text-right text-xs sm:text-sm">₹{item.total.toFixed(2)}</td>
                  <td className="p-4 text-center">
                    <Button
                      variant="secondary"
                      color="red"
                      onClick={() => onRemoveItem?.(item.id)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td colSpan={3} className="p-4 text-right text-xs sm:text-sm">Total:</td>
                <td className="p-4 text-right text-xs sm:text-sm">₹{total.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="primary"
          onClick={onGenerateBill}
          disabled={!customerName || selectedItems.length === 0}
        >
          Generate Bill
        </Button>
      </div>
    </div>
  );
};

export default BillPreview; 