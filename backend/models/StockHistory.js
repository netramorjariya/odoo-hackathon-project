const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
  type: { type: String, enum: ['receipt', 'delivery', 'transfer', 'adjustment'] },
  description: { type: String },
  quantity: { type: Number },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true });

module.exports = mongoose.model('StockHistory', stockHistorySchema);