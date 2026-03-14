const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  fromWarehouse: { type: String, required: true },
  toWarehouse: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  status: { type: String, enum: ['draft', 'done'], default: 'draft' }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);