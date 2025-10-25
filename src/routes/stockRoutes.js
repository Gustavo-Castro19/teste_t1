const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

router.get('/', (req, res, next) => {
  try {
    const items = stockService.list();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', (req, res, next) => {
  try {
    const item = stockService.getById(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', (req, res, next) => {
  try {
    const item = stockService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', (req, res, next) => {
  try {
    const updated = stockService.update(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', (req, res, next) => {
  try {
    stockService.remove(req.params.id);
    res.json({ message: 'Product removed successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
