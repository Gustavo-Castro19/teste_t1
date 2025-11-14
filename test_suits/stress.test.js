const { generateProducts } = require("../src/scripts/stress-test-scripts");

let stressTestConfig = {
  requestQuantity: 100, 
  concurrentRequests: 10,
  timeout: 60000,
  baseURL: "http://localhost:3030",
};

async function makeRequest(method, path, data = null) {
  const response = await fetch(`${stressTestConfig.baseURL}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: data ? JSON.stringify(data) : null,
  });

  const result = await response.json();
  return {
    status: response.status,
    data: result,
    success: response.status >= 200 && response.status < 300,
  };
}

async function executeBatchRequests(requests, batchSize = 10) {
  const results = [];
  const times = [];

  for (let i = 0; i < requests.length; i += batchSize) {
    const batch = requests.slice(i, i + batchSize);
    const startTime = Date.now();

    const batchResults = await Promise.allSettled(batch);
    const endTime = Date.now();

    results.push(...batchResults);
    times.push(endTime - startTime);
  }

  return { results, times };
}

describe(`Teste de Stress - ${stressTestConfig.requestQuantity} requests com ${stressTestConfig.concurrentRequests} simultaneas`, () => {
  beforeAll(() => {
    console.log("\nIniciando Testes de Stress da API");
    console.log(
      `Configuracao: ${stressTestConfig.requestQuantity} requests, ${stressTestConfig.concurrentRequests} simultaneas`
    );
  });
  afterAll(() => {
    console.log("Testes de Stress Finalizados\n");
  });

  test(
    "Stress Test - Criação massiva de produtos (POST /stock)",
    async () => {
      const products = generateProducts(stressTestConfig.requestQuantity);
      const requests = products.map((product) =>
        makeRequest("POST", "/stock", {
          name: product.name,
          value: product.value,
          quantity: product.quantity,
        })
      );

      const testStartTime = Date.now();
      const { results, times } = await executeBatchRequests(
        requests,
        stressTestConfig.concurrentRequests
      );
      const testEndTime = Date.now();

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      const failed = results.length - successful;
      const totalTime = testEndTime - testStartTime;
      const averageTime =
        times.reduce((sum, time) => sum + time, 0) / times.length;
      const requestsPerSecond =
        (stressTestConfig.requestQuantity / totalTime) * 1000;
      console.log("\nRESULTADOS DO TESTE DE STRESS:");
      console.log(
        `Requisicoes bem-sucedidas: ${successful}/${stressTestConfig.requestQuantity}`
      );
      console.log(`Requisicoes falharam: ${failed}`);
      console.log(`Tempo total: ${totalTime}ms`);
      console.log(`Tempo medio por lote: ${averageTime.toFixed(2)}ms`);
      console.log(
        `Requisicoes por segundo: ${requestsPerSecond.toFixed(2)} req/s`
      );
      console.log(
        `Taxa de sucesso: ${(
          (successful / stressTestConfig.requestQuantity) *
          100
        ).toFixed(2)}%`
      );

      expect(successful).toBeGreaterThan(
        stressTestConfig.requestQuantity * 0.95
      );
      expect(totalTime).toBeLessThan(stressTestConfig.timeout);
      expect(failed).toBeLessThan(stressTestConfig.requestQuantity * 0.05);
    },
    stressTestConfig.timeout
  );

  test(
    "Stress Test - Leitura massiva de produtos (GET /stock)",
    async () => {
      const requests = Array(stressTestConfig.requestQuantity)
        .fill(null)
        .map(() => makeRequest("GET", "/stock"));

      const testStartTime = Date.now();
      const { results, times } = await executeBatchRequests(
        requests,
        stressTestConfig.concurrentRequests
      );
      const testEndTime = Date.now();

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      const failed = results.length - successful;
      const totalTime = testEndTime - testStartTime;
      const averageTime =
        times.reduce((sum, time) => sum + time, 0) / times.length;
      const requestsPerSecond =
        (stressTestConfig.requestQuantity / totalTime) * 1000;
      console.log("\nRESULTADOS DO TESTE GET:");
      console.log(
        `Requisicoes bem-sucedidas: ${successful}/${stressTestConfig.requestQuantity}`
      );
      console.log(`Requisicoes falharam: ${failed}`);
      console.log(`Tempo total: ${totalTime}ms`);
      console.log(`Tempo medio por lote: ${averageTime.toFixed(2)}ms`);
      console.log(
        `Requisicoes por segundo: ${requestsPerSecond.toFixed(2)} req/s`
      );

      expect(successful).toBeGreaterThan(
        stressTestConfig.requestQuantity * 0.98
      );
      expect(totalTime).toBeLessThan(stressTestConfig.timeout);
    },
    stressTestConfig.timeout
  );

  test(
    "Stress Test - Cenário misto (70% GET, 30% POST)",
    async () => {
      const products = generateProducts(
        Math.floor(stressTestConfig.requestQuantity * 0.3)
      );
      const requests = [];

      products.forEach((product) => {
        requests.push(
          makeRequest("POST", "/stock", {
            name: product.name,
            value: product.value,
            quantity: product.quantity,
          })
        );
      });

      const getRequestsCount =
        stressTestConfig.requestQuantity - products.length;
      for (let i = 0; i < getRequestsCount; i++) {
        requests.push(makeRequest("GET", "/stock"));
      }

      const shuffledRequests = requests.sort(() => Math.random() - 0.5);

      const testStartTime = Date.now();
      const { results, times } = await executeBatchRequests(
        shuffledRequests,
        stressTestConfig.concurrentRequests
      );
      const testEndTime = Date.now();

      const successful = results.filter(
        (r) => r.status === "fulfilled" && r.value.success
      ).length;
      const failed = results.length - successful;
      const totalTime = testEndTime - testStartTime;
      const averageTime =
        times.reduce((sum, time) => sum + time, 0) / times.length;
      const requestsPerSecond =
        (stressTestConfig.requestQuantity / totalTime) * 1000;
      console.log("\nRESULTADOS DO TESTE MISTO:");
      console.log(
        `Requisicoes bem-sucedidas: ${successful}/${stressTestConfig.requestQuantity}`
      );
      console.log(`Requisicoes falharam: ${failed}`);
      console.log(`Tempo total: ${totalTime}ms`);
      console.log(`Tempo medio por lote: ${averageTime.toFixed(2)}ms`);
      console.log(
        `Requisicoes por segundo: ${requestsPerSecond.toFixed(2)} req/s`
      );
      console.log(
        `Composicao: ${products.length} POST + ${getRequestsCount} GET`
      );

      expect(successful).toBeGreaterThan(
        stressTestConfig.requestQuantity * 0.95
      );
      expect(totalTime).toBeLessThan(stressTestConfig.timeout);
    },
    stressTestConfig.timeout
  );
});
