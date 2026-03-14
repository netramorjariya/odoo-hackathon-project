const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const Product = require('../models/Product');

router.get('/', async (req, res) => {
  try {
    const receipts = await Receipt.find().populate('products.product');
    res.json(receipts);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const receipt = await Receipt.create(req.body);
    res.json(receipt);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

router.put('/validate/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id);
    if (receipt.status === 'done')
      return res.status(400).json({ msg: 'Already validated' });
    for (let item of receipt.products) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }
    receipt.status = 'done';
    await receipt.save();
    res.json({ msg: 'Stock updated!', receipt });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;