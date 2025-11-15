#  Documento de Requisitos – Inventory API v1.5

## 1. Introdução
Este documento descreve os **Requisitos Funcionais** do sistema **Inventory API**, responsável pelo gerenciamento de estoque, produtos e suas categorias específicas.  


---

## 2. Objetivo
Definir, de forma clara, todos os requisitos necessários para o funcionamento correto da API de estoque, servindo como base para desenvolvimento, testes e validação.

---

## 3. Escopo

### Escopo Incluído
- Operações CRUD do estoque  
- Cadastro de produtos genéricos  
- Cadastro de produtos específicos  
- Validações obrigatórias  
- Consistência de dados e transações  
- Estrutura padronizada de respostas JSON  
- Garantias de performance básica  

### Fora de Escopo
- Autenticação e autorização  
- Segurança avançada  
- Testes de carga pesados (> 10k requests)  

---

# 4. Requisitos Funcionais

## 4.1 RF-STOCK — Requisitos do Estoque

### **RF-STOCK-01 — Listar Estoque**
O sistema deve listar todos os produtos cadastrados no estoque.  
- Pode retornar lista vazia  
- Formato JSON padronizado  

### **RF-STOCK-02 — Consultar Produto por ID**
O sistema deve retornar um produto específico pelo ID.  
- Deve retornar 404 se não existir  

### **RF-STOCK-03 — Adicionar Produto**
O sistema deve permitir criar produtos através de:

POST /stock

Campos obrigatórios: `name`, `value`, `quantity`.

### **RF-STOCK-04 — Atualizar Produto**
O sistema deve permitir atualizar parcialmente ou totalmente um produto:

PUT /stock/{id}

- Campos não enviados devem permanecer inalterados  

### **RF-STOCK-05 — Remover Produto**
O sistema deve permitir remover um produto pelo ID.  
- Remoção de um produto inexistente deve retornar 404  

### **RF-STOCK-06 — Listagem com múltiplos itens**
Se houver vários produtos cadastrados, a resposta deve conter todos eles.

### **RF-STOCK-07 — ID inválido**
IDs não numéricos devem responder 404.

### **RF-STOCK-08 — Quantidade zero**
O sistema deve permitir criar produtos com quantidade = 0.

---

## 4.2 RF-PROD — Requisitos de Produtos

### **RF-PROD-01 — Validação de nome**
O campo `name` é obrigatório.

### **RF-PROD-02 — Validação de valor**
`value` é obrigatório e não pode ser negativo.

### **RF-PROD-03 — Validação de quantidade**
`quantity` é obrigatório e não pode ser negativo.

### **RF-PROD-04 — Estrutura mínima do Produto**
Todo produto deve conter:
- `id`
- `name`
- `value`
- `quantity`
- `tag`
- `special`
- `meta`
- `created_at`
- `updated_at`

### **RF-PROD-05 — Produtos Eletrônicos**
Rota:

POST /products/electronics

Campos adicionais obrigatórios: `brand`, `manufacturer`, `model`, `releaseDate`.  
Tag: `"electronics"`.

### **RF-PROD-06 — Produtos Móveis**
Rota:

POST /products/furniture

Campos adicionais: `dimensions`, `material`.  
Tag: `"furniture"`.

### **RF-PROD-07 — Produtos Hortifruti**
Rota:

POST /products/hortifruti

Campo adicional: `weight`.  
Tag: `"fruits"`.

---

## 4.3 RF-FRONT — Requisitos da Interface (Front-End)

### **RF-FRONT-01 — Formato uniforme**
Toda resposta deve estar em JSON padronizado.

### **RF-FRONT-02 — Mensagens de erro claras**
Exemplos:  
- `"Field \"name\" is required"`  
- `"Product not found"`  

### **RF-FRONT-03 — Dados suficientes para renderização**
Os campos retornados devem permitir exibição em tabelas, detalhes e listagens.

### **RF-FRONT-04 — IDs inválidos**
IDs inválidos devem gerar mensagens apropriadas.

---

## 4.4 RF-TRANS — Requisitos de Transação e Consistência

### **RF-TRANS-01 — Atualização consistente**
Atualizações não devem sobrescrever campos não enviados.

### **RF-TRANS-02 — Remoção definitiva**
Após deletar um produto:
- GET `/stock/{id}` deve retornar 404.

### **RF-TRANS-03 — Consistência pós-erro**
Erros não podem alterar dados existentes.

### **RF-TRANS-04 — Garantia de performance**
Listagens até 100 registros devem responder em menos de 2 segundos.

---

# 5. Regras de Validação

| Campo | Obrigatório | Contexto |
|-------|-------------|----------|
| name | Sim | Todos os produtos |
| value | Sim | Produtos genéricos |
| quantity | Sim | Produtos genéricos |
| brand | Sim | Eletrônicos |
| manufacturer | Sim | Eletrônicos |
| model | Sim | Eletrônicos |
| releaseDate | Sim | Eletrônicos |
| material | Sim | Móveis |
| dimensions | Sim | Móveis |
| weight | Sim | Hortifruti |

---

# 6. Regras de Negócio

### **RN-01 — Quantidade não pode ser negativa**  
Quantidade = 0 é permitido.

### **RN-02 — Valor não pode ser negativo**

### **RN-03 — IDs são únicos**

### **RN-04 — Categoria define atributos obrigatórios**

---

# 7. Requisitos Não Funcionais (RNF)

### **RNF-01 — Performance**
- Resposta em < 2s para até 100 itens  
- Capacidade mínima de 100 req/s em stress moderado  

### **RNF-02 — Confiabilidade**
Nenhum dado deve ser corrompido após operações concorrentes.

### **RNF-03 — Padrão JSON**
Todo retorno deve ser JSON UTF-8.

### **RNF-04 — Registro de erros**
Erros devem ser logados de maneira consistente.

---

# 8. Rastreabilidade

| Requisito | Casos de Teste |
|-----------|----------------|
| RF-STOCK | CT-001 a CT-023 |
| RF-PROD | CT-003, CT-010, CT-011, CT-012, CT-013–019 |
| RF-FRONT | CT-001, CT-002, CT-020, CT-022 |
| RF-TRANS | CT-005, CT-007, CT-017, CT-018, CT-021, CT-023 |

---

# 9. Conclusão
Este documento consolida todos os requisitos funcionais, não funcionais e regras de negócio da **Inventory API**, garantindo alinhamento com o plano de testes e servindo como base formal para desenvolvimento e validação.

---
