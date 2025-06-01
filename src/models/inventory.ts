import mongoose from 'mongoose';

const UnitSchema = new mongoose.Schema({
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
  unit: { type: UnitSchema, required: true },
  minQuantity: { type: Number, default: 0 },
  stock: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Add a pre-save middleware to ensure stock is initialized
InventorySchema.pre('save', function(next) {
  if (this.isNew) {
    if (!this.stock) this.stock = 0;
    if (!this.minQuantity) this.minQuantity = 0;
  }
  next();
});

export default mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema); 