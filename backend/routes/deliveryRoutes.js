const express = require('express');
const router = express.Router();
const Delivery = require('../models/Delivery');
const Product = require('../models/Product');

// Get all deliveries
router.get('/', async (req, res) => {
  try {
    const deliveries = await Delivery.find().populate('products.product');
    res.json(deliveries);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Create delivery
router.post('/', async (req, res) => {
  try {
    const delivery = await Delivery.create(req.body);
    res.json(delivery);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Validate delivery → stock ghata o
router.put('/validate/:id', async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (delivery.status === 'done')
      return res.status(400).json({ msg: 'Already validated' });

    for (let item of delivery.products) {
      const product = await Product.findById(item.product);
      if (product.stock < item.quantity)
        return res.status(400).json({ msg: `Insufficient stock for ${product.name}` });

      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    delivery.status = 'done';
    await delivery.save();
    res.json({ msg: 'Delivery validated, stock updated!', delivery });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;