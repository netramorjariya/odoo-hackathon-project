const express = require('express');
const router = express.Router();
const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');

router.get('/', async (req, res) => {
  try {
    const adjustments = await Adjustment.find().populate('product');
    res.json(adjustments);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { product, countedQty, reason } = req.body;
    const prod = await Product.findById(product);
    const difference = countedQty - prod.stock;

    const adjustment = await Adjustment.create({
      product, previousQty: prod.stock,
      countedQty, difference, reason
    });

    await Product.findByIdAndUpdate(product, { stock: countedQty });

    await StockHistory.create({
      type: 'adjustment',
      description: `Stock adjusted for ${prod.name}: ${prod.stock} → ${countedQty}`,
      quantity: difference,
      product
    });

    res.json(adjustment);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;