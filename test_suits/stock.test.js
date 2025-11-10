const request = require('supertest');
const app = require('../src/app');
const stockService = require('../src/services/stockService');

describe('Stock API with Database', () => {
  beforeEach(async () => {
    if (process.env.NODE_ENV === 'test') {
      await stockService.reset();
    }
  });

  describe('POST /stock', () => {
    it('should create a new product', async () => {
      const response = await request(app)
        .post('/stock')
        .send({
          name: 'Test Product',
          value: 10.50,
          quantity: 5
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Product');
      expect(response.body.value).toBe(10.50);
      expect(response.body.quantity).toBe(5);
    });

    it('should return 400 when name is missing', async () => {
      const response = await request(app)
        .post('/stock')
        .send({
          value: 10.50,
          quantity: 5
        })
        .expect(400);

      expect(response.body.error.message).toContain('name');
    });
  });

  describe('GET /stock', () => {
    it('should list all products', async () => {
      await stockService.create({ name: 'Product 1', value: 10, quantity: 5 });
      await stockService.create({ name: 'Product 2', value: 20, quantity: 10 });

      const response = await request(app)
        .get('/stock')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });
  });

  describe('GET /stock/:id', () => {
    it('should get product by id', async () => {
      const created = await stockService.create({ name: 'Test', value: 10, quantity: 5 });

      const response = await request(app)
        .get(`/stock/${created.id}`)
        .expect(200);

      expect(response.body.id).toBe(created.id);
      expect(response.body.name).toBe('Test');
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .get('/stock/99999')
        .expect(404);
    });
  });

  describe('PUT /stock/:id', () => {
    it('should update product', async () => {
      const created = await stockService.create({ name: 'Test', value: 10, quantity: 5 });

      const response = await request(app)
        .put(`/stock/${created.id}`)
        .send({ quantity: 15 })
        .expect(200);

      expect(response.body.quantity).toBe(15);
      expect(response.body.name).toBe('Test');
    });
  });

  describe('DELETE /stock/:id', () => {
    it('should delete product', async () => {
      const created = await stockService.create({ name: 'Test', value: 10, quantity: 5 });

      await request(app)
        .delete(`/stock/${created.id}`)
        .expect(200);

      await request(app)
        .get(`/stock/${created.id}`)
        .expect(404);
    });
  });
});
