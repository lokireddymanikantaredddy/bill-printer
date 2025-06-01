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
  paidAmount: { type: Number, required: true, default: 0 },
  status: { 
    type: String, 
    required: true,
    enum: ['PENDING', 'PARTIALLY_PAID', 'PAID'],
    default: 'PENDING'
  }
});

const BillSchema = new mongoose.Schema({
  billNumber: { type: String, required: true, unique: true },
  date: { type: Date, required: true, default: Date.now },
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String, required: true },
  items: [BillItemSchema],
  total: { type: Number, required: true },
  isCredit: { type: Boolean, required: true, default: false },
  creditDetails: { type: CreditDetailsSchema, required: false }
}, {
  timestamps: true
});

// Create index on billNumber for faster lookups
BillSchema.index({ billNumber: 1 });

export default mongoose.models.Bill || mongoose.model('Bill', BillSchema); 