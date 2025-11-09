const express = require('express');
const stockRoutes = require('./routes/stockRoutes');
const productsRoutes = require('./routes/productsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Stock API - v0.1.0',
    endpoints: {
      stock: '/stock',
      products: '/products'
    }
  });
});

app.use('/stock', stockRoutes);
app.use('/products', productsRoutes);


app.use(errorHandler);

module.exports = app;
