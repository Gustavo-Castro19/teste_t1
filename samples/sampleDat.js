const http = require('http');

const API_URL = 'localhost';
const API_PORT = 3000;

const colors = {
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m'
};

function makeRequest(method, path, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_URL,
      port: API_PORT,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function addProduct(endpoint, data, name) {
  console.log(`${colors.yellow}Adding: ${name}${colors.reset}`);
  try {
    const result = await makeRequest('POST', endpoint, data);
    if (result.id) {
      console.log(`${colors.green}✓ Successfully added (ID: ${result.id})${colors.reset}`);
    } else {
      console.log(`${colors.red}✗ Failed to add${colors.reset}`);
      console.log(result);
    }
  } catch (error) {
    console.log(`${colors.red}✗ Error: ${error.message}${colors.reset}`);
  }
}

async function populate() {
  console.log(`${colors.blue}================================================${colors.reset}`);
  console.log(`${colors.blue}  Populating Stock API with Sample Data${colors.reset}`);
  console.log(`${colors.blue}================================================${colors.reset}\n`);

  // Generic Products
  console.log(`${colors.blue}Adding Generic Products...${colors.reset}\n`);
  
  await addProduct('/stock', {
    name: 'Caneta Bic Azul',
    value: 1.50,
    quantity: 500
  }, 'Caneta Bic Azul');

  await addProduct('/stock', {
    name: 'Caderno 100 folhas',
    value: 12.90,
    quantity: 200
  }, 'Caderno 100 folhas');

  await addProduct('/stock', {
    name: 'Lápis HB',
    value: 0.80,
    quantity: 1000
  }, 'Lápis HB');

  // Electronics
  console.log(`\n${colors.blue}Adding Electronic Products...${colors.reset}\n`);

  await addProduct('/products/electronics', {
    name: 'iPhone 15 Pro Max',
    value: 7999.00,
    quantity: 25,
    brand: 'Apple',
    manufacturer: 'Foxconn',
    model: 'A2849',
    releaseDate: '2023-09-22'
  }, 'iPhone 15 Pro Max');

  await addProduct('/products/electronics', {
    name: 'MacBook Pro 14 M3',
    value: 12999.00,
    quantity: 15,
    brand: 'Apple',
    manufacturer: 'Apple Inc',
    model: 'MRXN3',
    releaseDate: '2023-11-07'
  }, 'MacBook Pro 14 M3');

  await addProduct('/products/electronics', {
    name: 'Logitech MX Master 3S',
    value: 649.00,
    quantity: 80,
    brand: 'Logitech',
    manufacturer: 'Logitech',
    model: '910-006559',
    releaseDate: '2022-05-26'
  }, 'Logitech MX Master 3S');

  // Furniture
  console.log(`\n${colors.blue}Adding Furniture Products...${colors.reset}\n`);

  await addProduct('/products/furniture', {
    name: 'Mesa de Escritório Executive',
    value: 1299.90,
    quantity: 15,
    dimensions: '150x75x75cm',
    material: 'MDP com acabamento em BP'
  }, 'Mesa de Escritório Executive');

  await addProduct('/products/furniture', {
    name: 'Cadeira Gamer Pro',
    value: 1899.00,
    quantity: 25,
    dimensions: '70x70x130cm',
    material: 'Couro sintético PU e estrutura de aço'
  }, 'Cadeira Gamer Pro');

  await addProduct('/products/furniture', {
    name: 'Sofá Retrátil 3 Lugares',
    value: 2499.00,
    quantity: 8,
    dimensions: '220x90x85cm',
    material: 'Tecido suede e espuma D28'
  }, 'Sofá Retrátil 3 Lugares');

  // Hortifruti
  console.log(`\n${colors.blue}Adding Hortifruti Products...${colors.reset}\n`);

  await addProduct('/products/hortifruti', {
    name: 'Maçã Gala',
    value: 8.99,
    quantity: 150,
    weight: 0.15
  }, 'Maçã Gala');

  await addProduct('/products/hortifruti', {
    name: 'Banana Prata',
    value: 5.99,
    quantity: 200,
    weight: 0.12
  }, 'Banana Prata');

  await addProduct('/products/hortifruti', {
    name: 'Tomate Italiano',
    value: 7.50,
    quantity: 100,
    weight: 0.10
  }, 'Tomate Italiano');

  await addProduct('/products/hortifruti', {
    name: 'Melancia',
    value: 3.99,
    quantity: 50,
    weight: 5.00
  }, 'Melancia');

  console.log(`\n${colors.blue}================================================${colors.reset}`);
  console.log(`${colors.green}  Database population completed!${colors.reset}`);
  console.log(`${colors.blue}================================================${colors.reset}\n`);

  // Display summary
  console.log(`${colors.yellow}Fetching summary...${colors.reset}\n`);
  const summary = await makeRequest('GET', '/stock');
  console.log(`Total products: ${summary.length}`);
  console.log(`${colors.green}Done! Your API is now populated with sample data.${colors.reset}`);
}

populate().catch(console.error);
