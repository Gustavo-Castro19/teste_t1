# 📦 Inventory API

> API REST para gerenciamento de estoque com suporte a múltiplas categorias de produtos

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./DOCS/LICENSE.md)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5.1.0-blue.svg)](https://expressjs.com/)

##  Sobre o Projeto

API de gerenciamento de inventário desenvolvida em Node.js com Express, permitindo o controle de estoque de diferentes categorias de produtos (eletrônicos, móveis, hortifruti) com atributos especializados para cada tipo.

##  Funcionalidades

- ✅ CRUD completo de produtos
- ✅ Suporte a múltiplas categorias (Eletrônicos, Móveis, Hortifruti)
- ✅ Atributos especializados por categoria
- ✅ Validação de dados
- ✅ Tratamento de erros centralizado
- ✅ Testes automatizados com Jest
- ✅ API RESTful

## 🏗️ Estrutura do Projeto

```
.
├── src/
│   ├── app.js                    # Configuração do Express
│   ├── server.js                 # Inicialização do servidor
│   ├── entities/
│   │   └── products.js           # Entidades do domínio
│   ├── middleware/
│   │   └── errorHandler.js       # Middleware de tratamento de erros
│   ├── routes/
│   │   ├── productsRoutes.js     # Rotas de produtos por categoria
│   │   └── stockRoutes.js        # Rotas de estoque (CRUD)
│   └── services/
│       └── stockService.js       # Lógica de negócio
├── test_suits/
│   ├── stock.test.js             # Testes do serviço de estoque
│   ├── suit.test.js              # Suite de testes
│   └── test.sh                   # Script de testes
├── samples/
│   └── sampleDat.js              # Dados de exemplo
├── DOCS/
│   ├── LICENSE.md                # Licença do projeto
│   ├── plan_test.md              # Plano de testes
│   └── README.md                 # Documentação adicional
└── package.json                  # Dependências e scripts
```

## 🚀 Tecnologias

- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[Express](https://expressjs.com/)** - Framework web
- **[MySQL2](https://github.com/sidorares/node-mysql2)** - Conector MySQL
- **[Jest](https://jestjs.io/)** - Framework de testes
- **[Supertest](https://github.com/visionmedia/supertest)** - Testes de API
- **[Nodemon](https://nodemon.io/)** - Auto-reload em desenvolvimento
- **[ESLint](https://eslint.org/)** - Linter de código

## 📦 Instalação

### Pré-requisitos

- Node.js v16 ou superior
- npm ou yarn
- MySQL (opcional, para futuras implementações)

### Passos

1. Clone o repositório:
```bash
git clone https://github.com/Gustavo-Castro19/teste.git
cd teste
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (opcional):
```bash
PORT=3000
```

## 🎯 Como Usar

### Desenvolvimento

Inicie o servidor em modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Produção

Inicie o servidor em modo de produção:
```bash
npm start
```

### Testes

Execute os testes:
```bash
npm test
```

### Popular o Banco

Execute o script para popular o banco com dados de exemplo:
```bash
npm run populate
```

## 🔌 Endpoints da API

### Raiz da API
```http
GET /
```
Retorna informações sobre a API e seus endpoints disponíveis.

### Estoque (Stock)

#### Listar todos os produtos
```http
GET /stock
```

#### Buscar produto por ID
```http
GET /stock/:id
```

#### Criar novo produto
```http
POST /stock
Content-Type: application/json

{
  "name": "Produto",
  "value": 100.50,
  "quantity": 10,
  "tag": "no_category"
}
```

#### Atualizar produto
```http
PUT /stock/:id
Content-Type: application/json

{
  "name": "Produto Atualizado",
  "value": 150.00,
  "quantity": 5
}
```

#### Deletar produto
```http
DELETE /stock/:id
```

### Produtos por Categoria

#### Eletrônicos
```http
POST /products/electronics
Content-Type: application/json

{
  "name": "Smartphone",
  "value": 1500.00,
  "quantity": 20,
  "brand": "Samsung",
  "manufacturer": "Samsung Electronics",
  "model": "Galaxy S21",
  "releaseDate": "2021-01-29"
}
```

#### Móveis
```http
POST /products/furniture
Content-Type: application/json

{
  "name": "Mesa de Escritório",
  "value": 450.00,
  "quantity": 5,
  "dimensions": "120x60x75cm",
  "material": "MDF"
}
```

#### Hortifruti
```http
POST /products/hortifruti
Content-Type: application/json

{
  "name": "Maçã",
  "value": 5.50,
  "quantity": 100,
  "weight": "1kg"
}
```

## 📊 Exemplos de Resposta

### Sucesso (201 Created)
```json
{
  "id": "1",
  "name": "Smartphone",
  "value": 1500.00,
  "quantity": 20,
  "tag": "electronics",
  "special": {
    "brand": "Samsung",
    "manufacturer": "Samsung Electronics",
    "model": "Galaxy S21",
    "releaseDate": "2021-01-29"
  },
  "meta": {}
}
```

### Erro (400 Bad Request)
```json
{
  "error": "Field \"name\" is required"
}
```

### Erro (404 Not Found)
```json
{
  "error": "Product not found"
}
```

## 🧪 Testes

O projeto utiliza Jest para testes unitários e de integração. Os testes cobrem:

- Validação de dados
- Criação de produtos
- Atualização de produtos
- Remoção de produtos
- Busca de produtos
- Tratamento de erros

Execute os testes com:
```bash
npm test
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE.md](./DOCS/LICENSE.md) para mais detalhes.

## 👤 Autor

**Gustavo Castro**

- GitHub: [@Gustavo-Castro19](https://github.com/Gustavo-Castro19)

## 📌 Status do Projeto

🚧 **Em Desenvolvimento** - v0.1.0

### Próximas Implementações

- [ ] Integração completa com MySQL
- [ ] Autenticação e autorização
- [ ] Paginação de resultados
- [ ] Filtros avançados de busca
- [ ] Upload de imagens de produtos
- [ ] Histórico de movimentações
- [ ] Dashboard administrativo
- [ ] Documentação com Swagger
