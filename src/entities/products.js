// NOT IN USE ON MAIN AT THIS MOMENT --- IGNORE THIS ARCHIVE FOR NOW 
// THIS IS JUST AN EXPERIMENT FOR ALTERNATIVE BRANCHS


module.exports= class Stock{
  #id; 
  #name;
  #price;
  #quantity; 

  constructor(id, name, price, quantity){
    this.#id=id;
    this.#name=name;
    this.#price=price;
    this.#quantity=quantity;
  }

  writeUp(){
    return `id: ${this.#id}, name: ${this.#name}, price: ${this.#price}`;
  }

  get id(){
    return this.#id;
  }

  get name(){
    return this.#name;
  }

  get price(){
    return this.#price;
  }

};

