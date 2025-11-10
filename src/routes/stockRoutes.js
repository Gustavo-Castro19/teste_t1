const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

router.get('/', async (req, res, next) => {
  try {
    const filters = {
      tag: req.query.tag,
      minValue: req.query.minValue ? parseFloat(req.query.minValue) : undefined,
      maxValue: req.query.maxValue ? parseFloat(req.query.maxValue) : undefined,
      search: req.query.search
    };
    
    const items = await stockService.list(filters);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await stockService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const item = await stockService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const updated = await stockService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await stockService.remove(req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
