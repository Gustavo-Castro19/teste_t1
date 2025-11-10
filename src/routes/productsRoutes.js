const express = require('express');
const router = express.Router();
const stockService = require('../services/stockService');

router.post('/electronics', async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      tag: stockService.TAG.ELECTRONICS,
      special: {
        brand: req.body.brand,
        manufacturer: req.body.manufacturer,
        model: req.body.model,
        releaseDate: req.body.releaseDate
      }
    };
    const item = await stockService.create(payload);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/furniture', async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      tag: stockService.TAG.FURNITURE,
      special: {
        dimensions: req.body.dimensions,
        material: req.body.material
      }
    };
    const item = await stockService.create(payload);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/hortifruti', async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      tag: stockService.TAG.FRUITS,
      special: {
        weight: req.body.weight
      }
    };
    const item = await stockService.create(payload);
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
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
