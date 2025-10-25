const Stock = require("../src/entities/products.js")

const product = new Stock(11,"produto",10,20);

test('product class is initializing right', ()=>{
  expect(product.id).toEqual(11);
  expect(product.name).toEqual('produto');
  expect(product.price).toEqual(10);
});
