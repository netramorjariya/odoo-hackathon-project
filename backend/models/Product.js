const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  category: { type: String },
  unit: { type: String, default: 'pcs' },
  stock: { type: Number, default: 0 },
  minStock: { type: Number, default: 10 },
  warehouse: { type: String, default: 'Main Warehouse' }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);