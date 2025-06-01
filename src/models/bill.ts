import mongoose from 'mongoose';

const BillItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: {
    value: { type: String, required: true },
    baseUnit: { 
      type: String, 
      required: true,
      enum: ['g', 'ml', 'pieces', 'kg', 'l', 'ton']
    },
    conversion: { type: Number, required: true }
  },
  quantity: { type: Number, required: true },
  displayQuantity: { type: Number, required: true },
  total: { type: Number, required: true }
});

const CreditDetailsSchema = new mongoose.Schema({
  interestRate: { type: Number, required: true },
  startDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  paidAmount: { type: Number, default: 0 },
  lastPaymentDate: { type: Date },
  status: { 
    type: String, 
    enum: ['PENDING', 'PARTIALLY_PAID', 'PAID'],
    default: 'PENDING'
  }
});

const BillSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String },
  customerAddress: { type: String },
  items: [BillItemSchema],
  total: { type: Number, required: true },
  isCredit: { type: Boolean, default: false },
  creditDetails: { type: CreditDetailsSchema }
}, {
  timestamps: true
});

export default mongoose.models.Bill || mongoose.model('Bill', BillSchema); 