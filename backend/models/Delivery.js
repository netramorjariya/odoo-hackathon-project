const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  customer: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, enum: ['draft', 'done'], default: 'draft' },
  warehouse: { type: String, default: 'Main Warehouse' }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);