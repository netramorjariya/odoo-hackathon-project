const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  previousQty: { type: Number, required: true },
  countedQty: { type: Number, required: true },
  difference: { type: Number, required: true },
  reason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Adjustment', adjustmentSchema);