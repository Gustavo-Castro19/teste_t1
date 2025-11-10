const { db } = require('../middleware/dbConnect');
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
    switch(tag) {
      case "electronics":
        this.brand = data.brand ?? "unknown";
        this.manufacturer = data.manufacturer ?? "unknown";
        this.model = data.model ?? "unknown";
        this.releaseDate = data.releaseDate ?? "unknown";
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

const validateBasic = (payload) => {
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
};

const transformDbRow = (row) => {
  return {
    id: String(row.id),
    name: row.nome,
    value: parseFloat(row.value),
    quantity: row.quantity,
    image_path: row.image_path,
    tag: row.tag,
    special: row.atributes ? (typeof row.atributes === 'string' ? JSON.parse(row.atributes) : row.atributes) : {},
    meta: row.meta ? (typeof row.meta === 'string' ? JSON.parse(row.meta) : row.meta) : {},
    created_at: row.created_at,
    updated_at: row.updated_at
  };
};

const create = async (payload) => {
  validateBasic(payload);
  
  const special = payload.special ? new SpecialAttributes(payload.special, payload.tag) : {};
  const meta = payload.meta || {};
  
  const sql = `
    INSERT INTO product (nome, value, quantity, image_path, tag, atributes, meta) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  try {
    const [result] = await db.execute(sql, [
      payload.name,
      payload.value,
      payload.quantity,
      payload.image_path || null,
      payload.tag || TAG.UNTAGGED,
      JSON.stringify(special),
      JSON.stringify(meta)
    ]);
    
    return await getById(result.insertId);
  } catch (err) {
    const error = new Error(`Error creating product: ${err.message}`);
    error.status = INVALID_REQUEST;
    throw error;
  }
};

const list = async (filters = {}) => {
  let sql = `
    SELECT id, nome, value, quantity, image_path, tag, atributes, meta, created_at, updated_at 
    FROM product
  `;
  const params = [];
  const conditions = [];
  
  if (filters.tag) {
    conditions.push('tag = ?');
    params.push(filters.tag);
  }
  
  if (filters.minValue !== undefined) {
    conditions.push('value >= ?');
    params.push(filters.minValue);
  }
  
  if (filters.maxValue !== undefined) {
    conditions.push('value <= ?');
    params.push(filters.maxValue);
  }
  
  if (filters.search) {
    conditions.push('nome LIKE ?');
    params.push(`%${filters.search}%`);
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  sql += ' ORDER BY id DESC';
  
  try {
    const [rows] = await db.execute(sql, params);
    return rows.map(transformDbRow);
  } catch (err) {
    const error = new Error(`Error listing products: ${err.message}`);
    error.status = 500;
    throw error;
  }
};

const getById = async (id) => {
  const sql = `
    SELECT id, nome, value, quantity, image_path, tag, atributes, meta, created_at, updated_at 
    FROM product 
    WHERE id = ?
  `;
  
  try {
    const [rows] = await db.execute(sql, [id]);
    
    if (rows.length === 0) {
      const err = new Error('Product not found');
      err.status = NOT_FOUND_ERROR;
      throw err;
    }
    
    return transformDbRow(rows[0]);
  } catch (err) {
    if (err.status === NOT_FOUND_ERROR) {
      throw err;
    }
    const error = new Error(`Error fetching product: ${err.message}`);
    error.status = 500;
    throw error;
  }
};

const update = async (id, payload) => {
  await getById(id);
  
  const updates = [];
  const params = [];
  
  if (payload.name !== undefined) {
    updates.push('nome = ?');
    params.push(payload.name);
  }
  
  if (payload.value !== undefined) {
    if (typeof payload.value !== 'number' || payload.value < 0) {
      const err = new Error('Field "value" must be a number greater than or equal to 0');
      err.status = INVALID_REQUEST;
      throw err;
    }
    updates.push('value = ?');
    params.push(payload.value);
  }
  
  if (payload.quantity !== undefined) {
    if (typeof payload.quantity !== 'number' || payload.quantity < 0) {
      const err = new Error('Field "quantity" must be a number greater than or equal to 0');
      err.status = INVALID_REQUEST;
      throw err;
    }
    updates.push('quantity = ?');
    params.push(payload.quantity);
  }
  
  if (payload.image_path !== undefined) {
    updates.push('image_path = ?');
    params.push(payload.image_path);
  }
  
  if (payload.tag !== undefined) {
    updates.push('tag = ?');
    params.push(payload.tag);
  }
  
  if (payload.special !== undefined) {
    updates.push('atributes = ?');
    params.push(JSON.stringify(payload.special));
  }
  
  if (payload.meta !== undefined) {
    updates.push('meta = ?');
    params.push(JSON.stringify(payload.meta));
  }
  
  if (updates.length === 0) {
    return await getById(id);
  }
  
  const sql = `UPDATE product SET ${updates.join(', ')} WHERE id = ?`;
  params.push(id);
  
  try {
    await db.execute(sql, params);
    return await getById(id);
  } catch (err) {
    const error = new Error(`Error updating product: ${err.message}`);
    error.status = INVALID_REQUEST;
    throw error;
  }
};

const remove = async (id) => {
  await getById(id);
  
  const sql = 'DELETE FROM product WHERE id = ?';
  
  try {
    await db.execute(sql, [id]);
  } catch (err) {
    const error = new Error(`Error deleting product: ${err.message}`);
    error.status = 500;
    throw error;
  }
};

const reset = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Reset is only allowed in test environment');
  }
  
  try {
    await db.execute('DELETE FROM product');
    await db.execute('ALTER TABLE product AUTO_INCREMENT = 1');
  } catch (err) {
    const error = new Error(`Error resetting database: ${err.message}`);
    error.status = 500;
    throw error;
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  reset,
  TAG,
};
