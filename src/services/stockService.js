let items = []; 
let nextId = 0;
const INVALID_REQUEST = 400;
const NOT_FOUND_ERROR = 404;

const TAG = Object.freeze({
  ELECTRONICS: "electronics",
  FRUITS: "fruits",
  FURNITURE: "furniture",
  UNTAGGED: "no_category"
});

class SpecialAttributes {
  constructor(data = {}, tag) {
      switch(tag){
        case "electronics":
          this.brand = data.brand ?? "unknow";
          this.manufacturer = data.manufacturer ?? "unknow";
          this.model = data.model ?? "unknow";
          this.releaseDate = data.releaseDate ?? "unknow";
          break; 
        case "furniture":
          this.dimensions = data.dimensions ?? "";
          this.material = data.material ?? "";
          break; 
        case "fruits":
          this.weight = data.weight ?? "";
          break;
        default: 
          break; 
      }
  }
}

const validateBasic= (payload) => {
  if (!payload || typeof payload !== 'object') {
    const err = new Error('Invalid payload');
    err.status = INVALID_REQUEST;
    throw err;
  }
  
  const { name, value, quantity } = payload;
  
  if (!name) {
    const err = new Error('Field "name" is required');
    err.status = INVALID_REQUEST;
    throw err;
  }
  
  if (value === undefined) {
    const err = new Error('Field "value" is required');
    err.status = INVALID_REQUEST;
    throw err;
  }
  
  if (typeof value !== 'number' || value < 0) {
    const err = new Error('Field "value" must be a number greater than or equal to 0');
    err.status = INVALID_REQUEST;
    throw err;
  }
  
  if (quantity === undefined) {
    const err = new Error('Field "quantity" is required');
    err.status = INVALID_REQUEST;
    throw err;
  }
  
  if (typeof quantity !== 'number' || quantity < 0) {
    const err = new Error('Field "quantity" must be a number greater than or equal to 0');
    err.status = INVALID_REQUEST;
    throw err;
  }
}

const create = (payload) => {
  validateBasic(payload);
  
  const item = {
    id: String(++nextId),
    name: payload.name,
    value: payload.value,
    quantity: payload.quantity,
    tag: payload.tag || TAG.UNTAGGED,
    special: payload.special ? new SpecialAttributes(payload.special,payload.tag) : {},
    meta: payload.meta || {},
  };
  
  items.push(item);
  return item;
}

function list() {
  return items.slice();
}

const getById = (id) => {
  const found = items.find((i) => i.id === String(id));
  if (!found) {
    const err = new Error('Product not found');
    err.status = NOT_FOUND_ERROR;
    throw err;
  }
  return found;
}

const update = (id, payload) => {
  const idx = items.findIndex((i) => i.id === String(id));
  if (idx === -1) {
    const err = new Error('Product not found');
    err.status = NOT_FOUND_ERROR;
    throw err;
  }
  
  const current = items[idx];
  const updated = {
    ...current,
    ...payload,
    id: current.id, 
  };
  
  items[idx] = updated;
  return updated;
}

const remove= (id) => {
  const idx = items.findIndex((i) => i.id === String(id));
  if (idx === -1) {
    const err = new Error('Product not found');
    err.status = NOT_FOUND_ERROR;
    throw err;
  }
  items.splice(idx, 1);
}

const reset = () => {
  items = [];
  nextId = 0;
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  reset,
  TAG,
};
