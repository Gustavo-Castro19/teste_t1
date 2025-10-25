let items = []; 
let nextId = 1;

function validateBasic(payload) {
  if (!payload || typeof payload !== 'object') {
    const err = new Error('Invalid payload');
    err.status = 400;
    throw err;
  }
  const { name, value, quantity } = payload;
  if (!name) {
    const err = new Error('Field "name" is required');
    err.status = 400;
    throw err;
  }
  if (value === undefined) {
    const err = new Error('Field "value" is required');
    err.status = 400;
    throw err;
  }
  if (quantity === undefined) {
    const err = new Error('Field "quantity" is required');
    err.status = 400;
    throw err;
  }
}

function create(payload) {
  validateBasic(payload);
  const item = {
    id: String(nextId++),
    name: payload.name,
    value: payload.value,
    quantity: payload.quantity,
    meta: payload.meta || {},
  };
  items.push(item);
  return item;
}

function list() {
  return items.slice();
}

function getById(id) {
  const found = items.find((i) => i.id === String(id));
  if (!found) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  return found;
}

function update(id, payload) {
  const idx = items.findIndex((i) => i.id === String(id));
  if (idx === -1) {
    const err = new Error('Product not found');
    err.status = 404;
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

function remove(id) {
  const idx = items.findIndex((i) => i.id === String(id));
  if (idx === -1) {
    const err = new Error('Product not found');
    err.status = 404;
    throw err;
  }
  items.splice(idx, 1);
}

function reset() {
  items = [];
  nextId = 1;
}

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  reset,
};
