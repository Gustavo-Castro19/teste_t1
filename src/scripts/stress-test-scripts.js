const Stock = require("../entities/products");

function generateProducts(quantity) {
  let productArray = [];

  for (let i = 0; i < quantity; i++) {
    const id = i;
    const quantity = Math.floor(Math.random() * 100);
    const name = "Product " + i;
    const value = parseFloat((Math.random() * 1000 + 1).toFixed(2));
    const newProduct = new Stock(id, name, value, quantity);

    productArray.push(newProduct);
  }
  return productArray;
}

module.exports = { generateProducts };
