const express = require('express');
const router = express.Router();
const StockHistory = require('../models/StockHistory');

router.get('/', async (req, res) => {
  try {
    const history = await StockHistory.find()
      .populate('product')
      .sort({ createdAt: -1 });
    res.json(history);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;