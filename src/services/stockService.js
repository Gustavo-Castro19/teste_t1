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
  static schema = {
    [TAG.ELECTRONICS]: {
      brand: "string",
      manufacturer: "string",
      model: "string",
      releaseDate: "string",
    },
    [TAG.FURNITURE]: {
      dimensions: "string",
      material: "string",
    },
    [TAG.FRUITS]: {
      weight: "number",
    },
  };

  constructor(data = {}, tag) {
    const rules = SpecialAttributes.schema[tag] || {};
    for (const key of Object.keys(rules)) {
      const expected = rules[key];
      const value = data[key];

      if (value === undefined) {
        this[key] = expected === "number" ? 0 : "";
        continue;
      }

      if (typeof value !== expected) {
        throw Object.assign(new Error(`Attribute \"${key}\" must be of type ${expected}`), {
          status: INVALID_REQUEST,
        });
      }

      this[key] = value;
    }
  }
};
  


const validateBasic = (payload) => {
  if (!payload || typeof payload !== 'object') {
    throw Object.assign(new Error('Payload must be an object'), { status: INVALID_REQUEST });
  };

  const { name, value, quantity } = payload;

  const requiredString = (field, val) => {
    if (!val || typeof val !== 'string') {
      throw Object.assign(new Error(`Field \"${field}\" must be a non-empty string`), { status: INVALID_REQUEST });
    };
  };

  const requiredNumber = (field, val) => {
    if (typeof val !== 'number' || Number.isNaN(val) || val < 0) {
      throw Object.assign(new Error(`Field \"${field}\" must be a non-negative number`), { status: INVALID_REQUEST });
    }
  };

  requiredString('name', name);
  requiredNumber('value', value);
  requiredNumber('quantity', quantity);

  if (payload.tag) validateTag(payload.tag);

  if (payload.special && typeof payload.special !== 'object') {
    throw Object.assign(new Error('Field "special" must be an object'), { status: INVALID_REQUEST });
  };

  if (payload.meta && typeof payload.meta !== 'object') {
    throw Object.assign(new Error('Field "meta" must be an object'), { status: INVALID_REQUEST });
  };
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

const validateTag = (tag) => {
  if (!tag) return TAG.UNTAGGED;
  const allowed = Object.values(TAG);
  if (!allowed.includes(tag)) {
    throw Object.assign(new Error(`Invalid tag: ${tag}`), { status: INVALID_REQUEST });
  }
  return tag;
};

const create = async (payload) => {
  validateBasic(payload);

  const tag = validateTag(payload.tag);
  const special = payload.special ? new SpecialAttributes(payload.special, tag) : {};
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
      tag,
      JSON.stringify(special),
      JSON.stringify(meta)
    ]);

    return await getById(result.insertId);
  } catch (err) {
    throw Object.assign(new Error(`Error creating product: ${err.message}`), { status: INVALID_REQUEST });
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
    validateTag(filters.tag);
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

  if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');

  sql += ' ORDER BY id DESC';

  try {
    const [rows] = await db.execute(sql, params);
    return rows.map(transformDbRow);
  } catch (err) {
    throw Object.assign(new Error(`Error listing products: ${err.message}`), { status: 500 });
  }
};

const getById = async (id) => {
  const sql = `
    SELECT id, nome, value, quantity, image_path, tag, atributes, meta, created_at, updated_at
    FROM product WHERE id = ?
  `;

  try {
    const [rows] = await db.execute(sql, [id]);

    if (rows.length === 0) {
      throw Object.assign(new Error('Product not found'), { status: NOT_FOUND_ERROR });
    }

    return transformDbRow(rows[0]);
  } catch (err) {
    if (err.status === NOT_FOUND_ERROR) throw err;
    throw Object.assign(new Error(`Error fetching product: ${err.message}`), { status: 500 });
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
      throw Object.assign(new Error('Field "value" must be a non-negative number'), { status: INVALID_REQUEST });
    }
    updates.push('value = ?');
    params.push(payload.value);
  }

  if (payload.quantity !== undefined) {
    if (typeof payload.quantity !== 'number' || payload.quantity < 0) {
      throw Object.assign(new Error('Field "quantity" must be a non-negative number'), { status: INVALID_REQUEST });
    }
    updates.push('quantity = ?');
    params.push(payload.quantity);
  }

  if (payload.image_path !== undefined) {
    updates.push('image_path = ?');
    params.push(payload.image_path);
  }

  if (payload.tag !== undefined) {
    validateTag(payload.tag);
    updates.push('tag = ?');
    params.push(payload.tag);
  }

  if (payload.special !== undefined) {
    const tag = payload.tag || (await getById(id)).tag;
    const special = new SpecialAttributes(payload.special, tag);
    updates.push('atributes = ?');
    params.push(JSON.stringify(special));
  }

  if (payload.meta !== undefined) {
    updates.push('meta = ?');
    params.push(JSON.stringify(payload.meta));
  }

  if (updates.length === 0) return await getById(id);

  const sql = `UPDATE product SET ${updates.join(', ')} WHERE id = ?`;
  params.push(id);

  try {
    await db.execute(sql, params);
    return await getById(id);
  } catch (err) {
    throw Object.assign(new Error(`Error updating product: ${err.message}`), { status: INVALID_REQUEST });
  }
};

const remove = async (id) => {
  await getById(id);
  try {
    await db.execute('DELETE FROM product WHERE id = ?', [id]);
  } catch (err) {
    throw Object.assign(new Error(`Error deleting product: ${err.message}`), { status: 500 });
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
    throw Object.assign(new Error(`Error resetting database: ${err.message}`), { status: 500 });
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
  SpecialAttributes,
};
