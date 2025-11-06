// NOT IN USE ON MAIN AT THIS MOMENT --- IGNORE THIS ARCHIVE FOR NOW
// THIS IS JUST AN EXPERIMENT FOR ALTERNATIVE BRANCHS

module.exports = class Stock {
  #id;
  #name;
  #value;
  #quantity;

  constructor(id, name, value, quantity) {
    this.#id = id;
    this.#name = name;
    this.#value = value;
    this.#quantity = quantity;
  }

  writeUp() {
    return `id: ${this.#id}, name: ${this.#name}, value: ${
      this.#value
    }, quantity: ${this.#quantity}`;
  }

  get id() {
    return this.#id;
  }

  get name() {
    return this.#name;
  }
  get value() {
    return this.#value;
  }

  get quantity() {
    return this.#quantity;
  }
};
