class stock{
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

class fruits extends stock{
  #weight=1.0;
  
  
 /* set price(){
    return priceWeight(this.price,this.weight,this.quantity);
  }*/

  priceWeight(price,weight,quantity){
    if(weight <0.01) return 0; 
    return (price/weight)*quantity;
  }

};


export default stock;