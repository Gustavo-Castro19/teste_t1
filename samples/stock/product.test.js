import Product from "./product.js";

  //TESTING WITH IMPORT 

const product = new Product(11,"produto",10);

test('product class is initializing right', ()=>{
  expect(product.id).toEqual(11);
  expect(product.name).toEqual('produto');
  expect(product.price).toEqual(10);
});

test('writeUp is writing correctly', ()=>{
expect(product.writeUp()).toEqual("id: 11, name: produto, price: 10");
});
