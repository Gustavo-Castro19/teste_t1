const express = require('express');
const prod = require('entities/product');

let port=3000;
const app = express();


const clearStock = (stock) => {
  delete stock; 
}


app.listen(port, ()=>{
  console.log(`listen on http://localhost:${port}`);
});

app.get('/',(req,res)=>{
  res.send("hello world");
});



