require('dotenv').config();
const request = require('supertest');
const app = require('../src/app'); 


async function clearStock() {
  const res = await request(app).get('/stock');
  if (res.status === 200 && Array.isArray(res.body)) {
    for (const item of res.body) {
      const id = item.idPro || item.id;
      if (id !== undefined && id !== null) {
        try {
          await request(app).delete(`/stock/${id}`).expect(200);
        } catch (e) {
          console.error(`Falha ao deletar item com ID ${id}:`, e.message);
        }
      }
    }
  }
}

 const createProduct = (payload) =>{
  return request(app).post('/stock').send(payload);
}

async function createAndGetId(payload) { const createRes = await createProduct(payload);
  if ([200, 201].includes(createRes.status)) {
    const body = createRes.body;
    return body.idPro || body.id;
  }
  throw new Error(`Falha ao criar produto: Status ${createRes.status}`);
}

describe('Casos CT-001 a CT-022 - API /stock ', () => {
  beforeEach(async () => {
    await clearStock();
  });

  test('CT-001 - Listar estoque (positivo): GET /stock retorna array com pelo menos um item após criação', async () => {
    const payload = { name: 'Lapis Teste', value: 1.2, quantity: 5 };
    const createdId = await createAndGetId(payload);

    const listRes = await request(app).get('/stock').expect(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);
    const found = listRes.body.find(p => (p.idPro === createdId || p.id === createdId));
    expect(found).toBeDefined();
  });

  test('CT-002 - Listar estoque (vazio): GET /stock retorna [] quando não há itens', async () => {
    const response = await request(app).get('/stock').expect(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });

  test('CT-003 - Adicionar produto (positivo): POST /stock cria produto e retorna 201 + objeto', async () => {
    const payload = { name: 'Caneta Teste', value: 2.5, quantity: 10 };
    const response = await createProduct(payload).expect([200, 201]);
    const body = response.body;
    const id = body.idPro || body.id;
    expect(id).toBeDefined();
    expect(body.name).toBe(payload.name);
    expect(body.value).toBe(payload.value);
    expect(body.quantity).toBe(payload.quantity);
  });


  test('CT-004 - Adicionar produto sem nome (negativo): POST /stock sem name retorna 400', async () => {
    const payload = { value: 10.0, quantity: 2 };
    const response = await request(app).post('/stock').send(payload).expect(400);
    const errorMessage = JSON.stringify(response.body).toLowerCase();
    expect(errorMessage).toMatch(/(name| non-empty)/);
  });

  test('CT-005 - Atualizar produto existente (positivo): PUT /stock/{idPro} atualiza e retorna 200 com objeto atualizado', async () => {
    const createPayload = { name: 'Produto Atualizavel', value: 50.0, quantity: 3 };
    const id = await createAndGetId(createPayload);
    expect(id).toBeDefined();

    const updatePayload = { name: 'Produto Atualizado', value: 45.5, quantity: 7 };
    const updateRes = await request(app).put(`/stock/${id}`).send(updatePayload).expect(200);
    const updated = updateRes.body;
    
    expect(updated.name).toBe(updatePayload.name);
    expect(updated.value).toBe(updatePayload.value);
    expect(updated.quantity).toBe(updatePayload.quantity);
    
    const getRes = await request(app).get(`/stock/${id}`).expect(200);
    expect(getRes.body.name).toBe(updatePayload.name);
  });

  test('CT-006 - Atualizar produto inexistente ou inválido (negativo): PUT /stock/{idPro} com id inexistente retorna 400/404', async () => {
    const nonExistentId = 999999999;
    const updatePayload = { name: 'Nao existe', value: 10, quantity: 1 };
    const response = await request(app).put(`/stock/${nonExistentId}`).send(updatePayload).expect([400, 404]);
    const errorMessage = JSON.stringify(response.body).toLowerCase();
    expect(errorMessage).toMatch(/(product|not found)/);
  });


  describe('CT-007 - Remover Produto Existente (Positivo)', () => {
    test('DELETE /stock/{id} deve remover produto existente e retornar 200', async () => {
      const payload = { name: 'Product D', value: 60, quantity: 2 };
      const createdId = await createAndGetId(payload);

      await request(app).delete(`/stock/${createdId}`).expect(200);

      await request(app).get(`/stock/${createdId}`).expect(404);
    });
  });

  describe('CT-008 - Obter Produto por ID (Positivo)', () => {
    test('GET /stock/{id} deve obter produto por ID e retornar 200', async () => {
      const payload = { name: 'Product E', value: 90, quantity: 7 };
      const createRes = await createProduct(payload).expect(201);
      const createdId = createRes.body.idPro || createRes.body.id;

      const response = await request(app).get(`/stock/${createdId}`).expect(200);

      expect(response.body.idPro || response.body.id).toBe(createdId);
      expect(response.body.name).toBe('Product E');
    });
  });

  describe('CT-009 - Obter Produto Inexistente (Negativo)', () => {
    test('GET /stock/{id} com ID inexistente deve retornar 404', async () => {
      const nonExistentId = 99999;
      await request(app).get(`/stock/${nonExistentId}`).expect(404);
    });
  });

  describe('CT-010: Adicionar Produto Eletrônico (Adaptado para /stock se possível)', () => {
    test('POST /products/electronics deve criar produto eletrônico com atributos especiais', async () => {
      const payload = {
        name: 'iPhone 15',
        value: 5000,
        quantity: 10,
        brand: 'Apple',
        manufacturer: 'Foxconn',
        model: 'A2849',
        releaseDate: '2023-09-22'
      };
      
      const response = await request(app).post('/products/electronics').send(payload).expect(201);
      
      expect(response.body.tag).toBe('electronics');
      expect(response.body.special).toHaveProperty('brand', 'Apple');
      expect(response.body.special).toHaveProperty('manufacturer', 'Foxconn');
    });
  });

  describe('CT-011: Adicionar Produto Móveis ', () => {
    test('POST /products/furniture deve criar produto móveis com atributos especiais', async () => {
      const payload = {
        name: 'Mesa de Escritório',
        value: 800,
        quantity: 5,
        dimensions: '120x60x75cm',
        material: 'MDP'
      };

      const response = await request(app).post('/products/furniture').send(payload).expect(201);

      expect(response.body.tag).toBe('furniture');
      expect(response.body.special).toHaveProperty('dimensions', '120x60x75cm');
      expect(response.body.special).toHaveProperty('material', 'MDP');
    });
  });

  describe('CT-012: Adicionar Produto Hortifruti (Adaptado)', () => {
    test('POST /products/hortifruti deve criar produto hortifruti com atributos especiais', async () => {
      const payload = {
        name: 'Maçã Gala',
        value: 8.99,
        quantity: 100,
        weight: 0.15
      };

      const response = await request(app).post('/products/hortifruti').send(payload).expect(201);

      expect(response.body.tag).toBe('fruits');
      expect(response.body.special).toHaveProperty('weight', 0.15);
    });
  });

  describe('CT-013: Adicionar Produto com Valor Faltando (Negativo)', () => {
    test('POST /stock sem "value" deve retornar 400', async () => {
      const payload = { name: 'Product F', quantity: 10 };
      const response = await request(app).post('/stock').send(payload).expect(400);

      const errorMessage = JSON.stringify(response.body).toLowerCase();
      expect(errorMessage).toMatch(/(value|valor)/);
      expect(errorMessage).toMatch(/(required|obrigatorio|non-negative number)/);
    });
  });

  describe('CT-014: Adicionar Produto com Quantidade Faltando (Negativo)', () => {
    test('POST /stock sem "quantity" deve retornar 400', async () => {
      const payload = { name: 'Product G', value: 100 };
      const response = await request(app).post('/stock').send(payload).expect(400);

      const errorMessage = JSON.stringify(response.body).toLowerCase();
      expect(errorMessage).toMatch(/(quantity|quantidade)/);
      expect(errorMessage).toMatch(/(required|obrigatorio|non-negative number)/);
    });
  });

  describe('CT-015: Adicionar Produto com Valor Negativo (Negativo)', () => {
    test('POST /stock com valor negativo deve retornar 400', async () => {
      const payload = { name: 'Product H', value: -10, quantity: 1 };
      const response = await request(app).post('/stock').send(payload).expect(400);

      const errorMessage = JSON.stringify(response.body).toLowerCase();
      expect(errorMessage).toMatch(/(value|valor)/);
    });
  });

  describe('CT-016: Adicionar Produto com Quantidade Zero (Positivo)', () => {
    test('POST /stock deve criar produto com quantidade zero e retornar 201', async () => {
      const payload = { name: 'Product I', value: 50, quantity: 0 };
      const response = await request(app).post('/stock').send(payload).expect(201);

      expect(response.body.quantity).toBe(0);
    });
  });

  describe('CT-017: Atualizar Apenas Quantidade', () => {
    test('PUT /stock/{id} deve atualizar apenas o campo "quantity"', async () => {
      const createPayload = { name: 'Product J', value: 100, quantity: 5 };
      const createdId = await createAndGetId(createPayload);

      const updatePayload = { quantity: 15 };
      const response = await request(app).put(`/stock/${createdId}`).send(updatePayload).expect(200);

      expect(response.body.quantity).toBe(15);
      expect(response.body.name).toBe('Product J');
      expect(response.body.value).toBe(100);
    });
  });

  describe('CT-018: Atualizar Apenas Valor', () => {
    test('PUT /stock/{id} deve atualizar apenas o campo "value"', async () => {
      const createPayload = { name: 'Product K', value: 100, quantity: 5 };
      const createdId = await createAndGetId(createPayload);

      const updatePayload = { value: 150 };
      const response = await request(app).put(`/stock/${createdId}`).send(updatePayload).expect(200);

      expect(response.body.value).toBe(150);
      expect(response.body.name).toBe('Product K');
      expect(response.body.quantity).toBe(5);
    });
  });

  describe('CT-019: Atualizar Apenas Nome', () => {
    test('PUT /stock/{id} deve atualizar apenas o campo "name"', async () => {
      const createPayload = { name: 'Product L', value: 100, quantity: 5 };
      const createdId = await createAndGetId(createPayload);

      const updatePayload = { name: 'Product L Updated' };
      const response = await request(app).put(`/stock/${createdId}`).send(updatePayload).expect(200);

      expect(response.body.name).toBe('Product L Updated');
      expect(response.body.value).toBe(100);
      expect(response.body.quantity).toBe(5);
    });
  });

  describe('CT-020: Obter Produto com ID Inválido (Negativo)', () => {
    test('GET /stock/abc deve retornar 404 para formato de ID inválido', async () => {
      const response = await request(app).get('/stock/abc').expect(404);
      expect(response.body).toBeDefined(); 
    });
  });

  describe('CT-021: Remover Produto Já Deletado (Negativo)', () => {
    test('DELETE /stock/{id} deve retornar 404 ao tentar remover produto inexistente', async () => {
      const payload = { name: 'Product M', value: 40, quantity: 4 };
      const createdId = await createAndGetId(payload);

      await request(app).delete(`/stock/${createdId}`).expect(200);

      await request(app).delete(`/stock/${createdId}`).expect(404);
    });
  });

  describe('CT-022: Listar Produtos com Múltiplos Itens', () => {
    test('GET /stock deve listar vários produtos corretamente', async () => {
      await createAndGetId({ name: 'Product 1', value: 10, quantity: 5 });
      await createAndGetId({ name: 'Product 2', value: 20, quantity: 10 });
      await createAndGetId({ name: 'Product 3', value: 30, quantity: 15 });

      const response = await request(app).get('/stock').expect(200);

      expect(response.body.length).toBe(3); 
    });
  });
});
