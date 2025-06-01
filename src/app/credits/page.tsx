'use client';

import { useState } from 'react';
import { useStore, Bill } from '@/store/store';
import { Card } from '@tremor/react';
import DetailedReport from '@/components/DetailedReport';

export default function CreditsPage() {
  const { bills, makePayment, updateBillCredit, settings } = useStore();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Filter only credit bills
  const creditBills = bills.filter(bill => bill.isCredit);

  // Calculate interest for a bill
  const calculateInterest = (bill: Bill) => {
    if (!bill.creditDetails) return 0;

    const startDate = new Date(bill.creditDetails.startDate);
    const endDate = new Date();
    const daysElapsed = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const yearlyInterestRate = bill.creditDetails.interestRate / 100;
    const dailyInterestRate = yearlyInterestRate / 365;
    
    const remainingAmount = bill.total - (bill.creditDetails.paidAmount || 0);
    const interest = remainingAmount * dailyInterestRate * daysElapsed;
    
    return interest;
  };

  const handlePayment = () => {
    if (!selectedBill || !paymentAmount) return;
    
    makePayment(selectedBill.id, parseFloat(paymentAmount));
    setShowPaymentModal(false);
    setSelectedBill(null);
    setPaymentAmount('');
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-xl font-semibold">Credit Management</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <input
                type="date"
                className="input w-full sm:w-auto"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
              />
              <span className="hidden sm:inline">to</span>
              <input
                type="date"
                className="input w-full sm:w-auto"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
              />
            </div>
            <button
              className="btn btn-primary w-full sm:w-auto"
              onClick={() => setShowReport(true)}
            >
              Generate Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 text-xs sm:text-sm">Bill No</th>
                  <th className="text-left p-4 text-xs sm:text-sm">Date</th>
                  <th className="text-left p-4 text-xs sm:text-sm">Customer</th>
                  <th className="text-right p-4 text-xs sm:text-sm">Amount</th>
                  <th className="text-right p-4 text-xs sm:text-sm">Interest</th>
                  <th className="text-right p-4 text-xs sm:text-sm">Balance</th>
                  <th className="text-center p-4 text-xs sm:text-sm">Status</th>
                  <th className="text-left p-4 text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {creditBills.map((bill) => {
                  const interest = calculateInterest(bill);
                  const paidAmount = bill.creditDetails?.paidAmount || 0;
                  const balance = bill.total + interest - paidAmount;

                  return (
                    <tr key={bill.id} className="border-b">
                      <td className="p-4 text-xs sm:text-sm">{bill.billNumber}</td>
                      <td className="p-4 text-xs sm:text-sm">{new Date(bill.date).toLocaleDateString('en-IN')}</td>
                      <td className="p-4 text-xs sm:text-sm">
                        <div>
                          <div>{bill.customerName}</div>
                          <div className="text-gray-500 text-xs">{bill.customerPhone}</div>
                        </div>
                      </td>
                      <td className="p-4 text-right text-xs sm:text-sm">₹{bill.total.toFixed(2)}</td>
                      <td className="p-4 text-right text-xs sm:text-sm">₹{interest.toFixed(2)}</td>
                      <td className="p-4 text-right text-xs sm:text-sm">₹{balance.toFixed(2)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${bill.creditDetails?.status === 'PAID' ? 'bg-green-100 text-green-800' :
                            bill.creditDetails?.status === 'PARTIALLY_PAID' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'}`}>
                          {bill.creditDetails?.status || 'PENDING'}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          className="btn btn-secondary text-blue-600 hover:text-blue-700 text-xs sm:text-sm w-full sm:w-auto"
                          onClick={() => {
                            setSelectedBill(bill);
                            setShowPaymentModal(true);
                          }}
                        >
                          Make Payment
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedBill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              Make Payment - Bill #{selectedBill.billNumber}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Amount: ₹{selectedBill.total.toFixed(2)}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interest: ₹{calculateInterest(selectedBill).toFixed(2)}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Paid Amount: ₹{(selectedBill.creditDetails?.paidAmount || 0).toFixed(2)}
                </label>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Balance: ₹{(selectedBill.total + calculateInterest(selectedBill) - (selectedBill.creditDetails?.paidAmount || 0)).toFixed(2)}
                </label>
                <input
                  type="number"
                  className="input w-full mt-2"
                  placeholder="Enter payment amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedBill(null);
                    setPaymentAmount('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handlePayment}
                >
                  Make Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-6 w-full h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Detailed Report
              </h3>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowReport(false)}
              >
                Close
              </button>
            </div>
            <DetailedReport
              bills={bills}
              startDate={new Date(dateRange.startDate)}
              endDate={new Date(dateRange.endDate)}
            />
          </div>
        </div>
      )}
    </div>
  );
} 