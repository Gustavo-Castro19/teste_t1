const request = require('supertest');
const app = require('../src/app');
const StockService = require('../src/services/stockService');

beforeEach(() => {
  StockService.reset();
});

describe('Stock API (integration)', () => {
  it('should create, list, get, update and delete a product', async () => {
    const createRes = await request(app)
      .post('/stock')
      .send({ name: 'Apple', value: 1.2, quantity: 10 })
      .expect(201);
    expect(createRes.body).toHaveProperty('id');
    const createdId = createRes.body.id;

    const listRes = await request(app).get('/stock').expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBe(1);

    const getRes = await request(app).get(`/stock/${createdId}`).expect(200);
    expect(getRes.body.name).toBe('Apple');

    const updateRes = await request(app)
      .put(`/stock/${createdId}`)
      .send({ quantity: 5 })
      .expect(200);
    expect(updateRes.body.quantity).toBe(5);

    await request(app).delete(`/stock/${createdId}`).expect(204);

    await request(app).get(`/stock/${createdId}`).expect(404);
  });

  it('returns 400 when creating with missing fields', async () => {
    await request(app).post('/stock').send({ name: 'NoValue' }).expect(400);
  });
});
