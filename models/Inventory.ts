import mongoose from 'mongoose';

const UnitTypeSchema = new mongoose.Schema({
  value: { type: String, required: true },
  baseUnit: { 
    type: String, 
    required: true,
    enum: ['g', 'ml', 'pieces', 'kg', 'l', 'ton']
  },
  conversion: { type: Number, required: true }
});

const InventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: UnitTypeSchema, required: true },
  minQuantity: { type: Number, required: true, default: 1 },
  stock: { type: Number, required: true, default: 0 }
}, {
  timestamps: true
});

export default mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema); 