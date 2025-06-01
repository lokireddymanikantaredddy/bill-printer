import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UnitType = {
  value: string;
  baseUnit: 'g' | 'ml' | 'pieces' | 'kg' | 'l' | 'ton';
  conversion: number; // conversion to base unit (e.g., 1000 for kg to g)
};

export const UNIT_TYPES: { [key: string]: UnitType } = {
  GRAM: { value: 'g', baseUnit: 'g', conversion: 1 },
  KG: { value: 'kg', baseUnit: 'g', conversion: 1000 },
  TON: { value: 'ton', baseUnit: 'kg', conversion: 1000 }, // 1 ton = 1000 kg
  ML: { value: 'ml', baseUnit: 'ml', conversion: 1 },
  LITER: { value: 'l', baseUnit: 'ml', conversion: 1000 },
  PIECES: { value: 'pieces', baseUnit: 'pieces', conversion: 1 }
};

// Helper function to convert between units
export const convertUnits = (value: number, fromUnit: UnitType, toUnit: UnitType): number => {
  if (fromUnit.baseUnit !== toUnit.baseUnit && 
      !(fromUnit.baseUnit === 'g' && toUnit.baseUnit === 'kg') && 
      !(fromUnit.baseUnit === 'kg' && toUnit.baseUnit === 'g') &&
      !(fromUnit.baseUnit === 'kg' && toUnit.baseUnit === 'ton') &&
      !(fromUnit.baseUnit === 'ton' && toUnit.baseUnit === 'kg')) {
    throw new Error('Cannot convert between different base unit types');
  }

  // Convert to the smallest unit first
  let baseValue: number;
  if (fromUnit.baseUnit === 'ton') {
    baseValue = value * fromUnit.conversion * 1000; // Convert to grams
  } else {
    baseValue = value * fromUnit.conversion;
  }

  // Then convert to the target unit
  if (toUnit.baseUnit === 'ton') {
    return baseValue / (toUnit.conversion * 1000); // Convert from grams to tons
  }
  return baseValue / toUnit.conversion;
};

export interface InventoryItem {
  id: string;
  name: string;
  price: number;
  unit: UnitType;
  minQuantity: number;
  stock: number;
}

export interface BillItem extends Omit<InventoryItem, 'minQuantity'> {
  quantity: number;
  displayQuantity: number;
  total: number;
}

export interface Bill {
  id: string;
  date: string;
  billNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: BillItem[];
  total: number;
  isCredit: boolean;
  creditDetails?: {
    interestRate: number; // yearly interest rate in percentage
    startDate: string;
    dueDate: string;
    paidAmount: number;
    status: 'PENDING' | 'PARTIALLY_PAID' | 'PAID';
  };
}

interface StoreState {
  inventory: InventoryItem[];
  bills: Bill[];
  settings: {
    defaultInterestRate: number; // yearly interest rate in percentage
    defaultCreditDuration: number; // in days
  };
}

interface StoreActions {
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  editInventoryItem: (id: string, updates: Partial<Omit<InventoryItem, 'id'>>) => void;
  removeInventoryItem: (id: string) => void;
  addBill: (bill: Omit<Bill, 'id' | 'date' | 'billNumber'>) => void;
  removeBill: (id: string) => void;
  editBill: (id: string, updates: Partial<Omit<Bill, 'id'>>) => void;
  updateStock: (items: { id: string; quantity: number }[]) => void;
  makePayment: (billId: string, amount: number) => void;
  updateBillCredit: (billId: string, updates: Partial<Bill['creditDetails']>) => void;
}

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2) + Date.now().toString(36);

// Helper function to generate bill numbers
const generateBillNumber = (bills: Bill[]) => {
  const prefix = 'BILL';
  const number = (bills.length + 1).toString().padStart(4, '0');
  return `${prefix}${number}`;
};

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set, get) => ({
      inventory: [],
      bills: [],
      settings: {
        defaultInterestRate: 12, // 12% per year by default
        defaultCreditDuration: 30, // 30 days by default
      },

      addInventoryItem: (item) => {
        const newItem: InventoryItem = {
          ...item,
          id: generateId(),
          minQuantity: item.minQuantity || 1,
          stock: item.stock || 0,
        };
        set((state) => ({
          inventory: [...state.inventory, newItem],
        }));
      },

      editInventoryItem: (id, updates) => {
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      removeInventoryItem: (id) => {
        set((state) => ({
          inventory: state.inventory.filter((item) => item.id !== id),
        }));
      },

      addBill: (billData) => {
        const { bills } = get();
        const newBill: Bill = {
          ...billData,
          id: generateId(),
          date: new Date().toISOString(),
          billNumber: generateBillNumber(bills),
        };
        set((state) => ({
          bills: [...state.bills, newBill],
        }));
      },

      removeBill: (id) => {
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== id),
        }));
      },

      editBill: (id, updates) => {
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === id ? { ...bill, ...updates } : bill
          ),
        }));
      },

      updateStock: (items) => {
        set((state) => ({
          inventory: state.inventory.map((item) => {
            const update = items.find((i) => i.id === item.id);
            if (update) {
              return {
                ...item,
                stock: Math.max(0, (item.stock || 0) - update.quantity),
              };
            }
            return item;
          }),
        }));
      },

      makePayment: (billId, amount) => {
        set((state) => ({
          bills: state.bills.map((bill) => {
            if (bill.id !== billId || !bill.creditDetails) return bill;

            const newPaidAmount = (bill.creditDetails.paidAmount || 0) + amount;
            const newStatus = 
              newPaidAmount >= bill.total ? 'PAID' :
              newPaidAmount > 0 ? 'PARTIALLY_PAID' :
              'PENDING';

            return {
              ...bill,
              creditDetails: {
                ...bill.creditDetails,
                paidAmount: newPaidAmount,
                status: newStatus,
              }
            };
          })
        }));
      },

      updateBillCredit: (billId, updates) => {
        set((state) => ({
          bills: state.bills.map((bill) => {
            if (bill.id !== billId || !bill.creditDetails) return bill;
            return {
              ...bill,
              creditDetails: {
                ...bill.creditDetails,
                ...updates
              }
            };
          })
        }));
      },
    }),
    {
      name: 'bill-app-storage',
    }
  )
); 