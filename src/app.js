const express = require('express');
const stockRoutes = require('./routes/stockRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'Stock API - v0.1.0' });
});

app.use('/stock', stockRoutes);

app.use(errorHandler);

module.exports = app;
