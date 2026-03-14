const express = require('express');
const router = express.Router();
const Transfer = require('../models/Transfer');
const Product = require('../models/Product');
const StockHistory = require('../models/StockHistory');

router.get('/', async (req, res) => {
  try {
    const transfers = await Transfer.find().populate('products.product');
    res.json(transfers);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const transfer = await Transfer.create(req.body);
    res.json(transfer);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.put('/validate/:id', async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id).populate('products.product');
    if (transfer.status === 'done') return res.status(400).json({ msg: 'Already done' });

    for (let item of transfer.products) {
      await StockHistory.create({
        type: 'transfer',
        description: `${item.product.name} moved: ${transfer.fromWarehouse} → ${transfer.toWarehouse}`,
        quantity: 0,
        product: item.product._id
      });
    }

    transfer.status = 'done';
    await transfer.save();
    res.json({ msg: 'Transfer completed!', transfer });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;