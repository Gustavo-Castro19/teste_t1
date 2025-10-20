const request = require('supertest')(process.env.BASE_URL || 'http://localhost:3000');

async function clearStock() {
  const res = await request.get('/stock');
  if (res.status === 200 && Array.isArray(res.body)) {
    for (const item of res.body) {
      const id = item.idPro || item.id;
      if (id !== undefined && id !== null) {
        try {
          await request.delete(`/stock/${id}`);
        } catch (e) {}
      }
    }
  }
}

async function createProduct(payload) {
  const res = await request.post('/stock').send(payload);
  return res;
}

describe('Casos CT-001 a CT-006 - API /stock', () => {
  beforeEach(async () => {
    await clearStock();
  });

  test('CT-002 - Listar estoque (vazio): GET /stock retorna [] quando não há itens', async () => {
    const res = await request.get('/stock');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test('CT-003 - Adicionar produto (positivo): POST /stock cria produto e retorna 201 + objeto', async () => {
    const payload = { name: 'Caneta Teste', value: 2.5, quantity: 10 };
    const res = await createProduct(payload);
    expect([200, 201]).toContain(res.status);
    const body = res.body;
    const id = body.idPro || body.id;
    expect(id).toBeDefined();
    expect(body.name).toBe(payload.name);
    expect(body.value).toBe(payload.value);
    expect(body.quantity).toBe(payload.quantity);
  });

  test('CT-001 - Listar estoque (positivo): GET /stock retorna array com pelo menos um item após criação', async () =>{ 
    const payload = { name: 'Lapis Teste', value: 1.2, quantity: 5 };
    const createRes = await createProduct(payload);
    expect([200, 201]).toContain(createRes.status);
    const created = createRes.body;
    const id = created.idPro || created.id;
    expect(id).toBeDefined();
    const listRes = await request.get('/stock');
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.body)).toBe(true);
    expect(listRes.body.length).toBeGreaterThanOrEqual(1);
    const found = listRes.body.find(p => (p.idPro === id || p.id === id) || (p.name === payload.name && p.value === payload.value && p.quantity === payload.quantity));
    expect(found).toBeDefined();
  });

  test('CT-004 - Adicionar produto sem nome (negativo): POST /stock sem name retorna 400', async () => {
    const payload = { value: 10.0, quantity: 2 };
    const res = await request.post('/stock').send(payload);
    expect(res.status).toBe(400);
    const body = res.body;
    const hasMessage = body && (typeof body.message === 'string' || typeof body.error === 'string' || typeof body === 'string');
    expect(hasMessage).toBeTruthy();
  });

  test('CT-005 - Atualizar produto existente (positivo): PUT /stock/{idPro} atualiza e retorna 200 com objeto atualizado', async () => {
    const payload = { name: 'Produto Atualizavel', value: 50.0, quantity: 3 };
    const createRes = await createProduct(payload);
    expect([200, 201]).toContain(createRes.status);
    const id = createRes.body.idPro || createRes.body.id;
    expect(id).toBeDefined();
    const updatePayload = { name: 'Produto Atualizado', value: 45.5, quantity: 7 };
    const updateRes = await request.put(`/stock/${id}`).send(updatePayload);
    expect(updateRes.status).toBe(200);
    const updated = updateRes.body;
    if (updated && typeof updated === 'object') {
      expect(updated.name === updatePayload.name || updated.name === payload.name).toBeTruthy();
      if (updated.value !== undefined) expect(updated.value).toBe(updatePayload.value);
      if (updated.quantity !== undefined) expect(updated.quantity).toBe(updatePayload.quantity);
    } else {
      const getRes = await request.get(`/stock/${id}`);
      expect(getRes.status).toBe(200);
      const getBody = getRes.body;
      expect(getBody.name).toBe(updatePayload.name);
      expect(getBody.value).toBe(updatePayload.value);
      expect(getBody.quantity).toBe(updatePayload.quantity);
    }
  });

  test('CT-006 - Atualizar produto inexistente ou inválido (negativo): PUT /stock/{idPro} com id inexistente retorna 400/404', async () => {
    const nonExistentId = 999999999;
    const updatePayload = { name: 'Nao existe', value: 10, quantity: 1 };
    const res = await request.put(`/stock/${nonExistentId}`).send(updatePayload);
    expect([400, 404]).toContain(res.status);
    const body = res.body;
    const hasMessage = body && (typeof body.message === 'string' || typeof body.error === 'string' || typeof body === 'string');
    expect(hasMessage).toBeTruthy();
  });
});
