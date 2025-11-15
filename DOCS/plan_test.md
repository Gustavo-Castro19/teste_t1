# Plano de Testes – Sistema de Estoque e Produtos v1.1 

## 1 Introdução e Objetivos

Este plano cobre a API de **Estoque e Produtos**, incluindo endpoints para
listagem, cadastro, atualização e exclusão de produtos de diferentes categorias
(eletrônicos, móveis e hortifruti), além da integração com o front-end.

O objetivo principal é validar que a API e a UI atendem aos requisitos
funcionais (RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS) e a certos atributos de qualidade.

Nossos objetivos:

* **Verificar corretude funcional** – endpoints implementam o comportamento
  especificado (listagem, consulta, criação, atualização e remoção de produtos).
* **Avaliar robustez e validação de entrada** – entradas inválidas geram
  códigos HTTP e mensagens de erro apropriados.
* **Checar consistência e precisão** – operações de estoque respeitam regras de negócio
  e transações são consistentes.
* **Confirmar integração com a UI** – front-end reflete corretamente os dados da API.

---

## 2 Escopo

### 2.1 Escopo incluído

* Listagem de estoque (vazio e com múltiplos produtos).
* Consulta de produto por ID.
* Cadastro de produtos genéricos e específicos (eletrônicos, móveis, hortifruti).
* Atualização de dados de produto.
* Remoção de produto.
* Integração com o front-end (UI). OBS: POSTERGARDO INDEFINIDAMENTE
* Validações de entrada (campos obrigatórios, valores negativos, IDs inválidos).
* Teste básico de performance (listagem com >100 produtos).

### 2.2 Fora de escopo

* Autenticação ou autorização.
* Persistência avançada além do banco configurado.
* Testes de concorrência, carga e stress além do caso básico (CT-022).
* Testes de segurança (injeção, XSS etc.).

---

## 3 Estratégia de Testes

### 3.1 Níveis e tipos de teste

* **Unitário** – validações de dados, regras de negócio (opcional).
* **Integração de API** – Postman, Jest ou equivalente para exercitar endpoints.
* **Sistema/E2E** – verificar a integração com a UI. OBS: POSTERGARDO INDEFINIDAMENTE

**Tipos aplicáveis**:

* Funcionais
* Valores-limite (boundary)
* Negativos
* Regressão
* Performance (básico)

### 3.2 Técnicas de projeto de testes

* **Particionamento em classes de equivalência** – ex.: IDs válidos vs inválidos.
* **Análise de valores-limite** – ex.: quantidade = 0, valor negativo.
* **Transição de estados** – produto antes/depois de operações CRUD.

---

## 4 Papéis, Responsabilidades e Logística

| Papel          | Responsabilidade |
|----------------|------------------|
| **Tester/QA**  | Escrever plano, derivar casos, executar testes, registrar defeitos, sumarizar resultados. |
| **Dev**        | Implementar API, corrigir defeitos, apoiar entendimento do comportamento. |
| **Revisor**    | Revisar plano e casos quanto a completude e clareza. |

Execução local ou em ambiente de testes. A API deve estar rodando antes dos testes.

---

## 5 Casos de Teste

### CT-001 – Listar estoque (positivo)

**Pré-condições:** Existir ao menos um item no estoque.  
**Passos:**  
1. Criar produto com POST `/stock`
2. GET `/stock`

**Esperado:** 
- HTTP 200
- JSON array com campos: `id`, `name`, `value`, `quantity`, `tag`, `special`, `meta`, `created_at`, `updated_at`

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-002 – Listar estoque (vazio)

**Pré-condições:** Nenhum item cadastrado.  
**Passos:**  
1. GET `/stock`

**Esperado:** 
- HTTP 200
- JSON `[]` (array vazio)

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-003 – Adicionar produto (positivo)

**Pré-condições:** Acesso ao endpoint.  
**Passos:**  
1. POST `/stock` com JSON:
```json
{
  "name": "Product B",
  "value": 50,
  "quantity": 5
}
```

**Esperado:** 
- HTTP 201
- JSON com `id`, `name`, `value`, `quantity` e campos adicionais

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-004 – Adicionar produto sem nome (negativo)

**Pré-condições:** Acesso ao endpoint.  
**Passos:**  
1. POST `/stock` sem campo `name`:
```json
{
  "value": 100,
  "quantity": 10
}
```

**Esperado:** 
- HTTP 400
- Mensagem de erro: `Field "name" is required`

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-005 – Atualizar produto existente (positivo)

**Pré-condições:** Produto existente no estoque.  
**Passos:**  
1. Criar produto
2. PUT `/stock/{id}` com novos valores:
```json
{
  "value": 80
}
```

**Esperado:** 
- HTTP 200
- JSON com valores atualizados, mantendo campos não modificados

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-006 – Atualizar produto inexistente (negativo)

**Pré-condições:** Nenhum produto com o ID especificado.  
**Passos:**  
1. PUT `/stock/99999` com dados válidos

**Esperado:** 
- HTTP 404
- Mensagem: `Product not found`

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-007 – Remover produto existente (positivo)

**Pré-condições:** Produto existente.  
**Passos:**  
1. Criar produto
2. DELETE `/stock/{id}`
3. Verificar com GET `/stock/{id}`

**Esperado:** 
- HTTP 200 na deleção
- HTTP 404 na verificação posterior
- Mensagem de confirmação: `Product removed successfully`

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-008 – Consultar produto por ID (positivo)

**Pré-condições:** Produto existente.  
**Passos:**  
1. Criar produto
2. GET `/stock/{id}`

**Esperado:** 
- HTTP 200
- Objeto JSON completo do produto

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-009 – Consultar produto inexistente (negativo)

**Pré-condições:** Nenhum.  
**Passos:**  
1. GET `/stock/99999`

**Esperado:** 
- HTTP 404
- Mensagem: `Product not found`

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-010 – Cadastrar produto eletrônico (positivo)

**Pré-condições:** Nenhum.  
**Passos:**  
1. POST `/products/electronics` com JSON:
```json
{
  "name": "iPhone 15",
  "value": 5000,
  "quantity": 10,
  "brand": "Apple",
  "manufacturer": "Foxconn",
  "model": "A2849",
  "releaseDate": "2023-09-22"
}
```

**Esperado:** 
- HTTP 201
- Produto com `tag: "electronics"`
- Campo `special` contendo: `brand`, `manufacturer`, `model`, `releaseDate`

**Requisitos:** RF-PROD

---

### CT-011 – Cadastrar produto móvel (positivo)

**Pré-condições:** Nenhum.  
**Passos:**  
1. POST `/products/furniture` com JSON:
```json
{
  "name": "Mesa de Escritório",
  "value": 800,
  "quantity": 5,
  "dimensions": "120x60x75cm",
  "material": "MDP"
}
```

**Esperado:** 
- HTTP 201
- Produto com `tag: "furniture"`
- Campo `special` contendo: `dimensions`, `material`

**Requisitos:** RF-PROD

---

### CT-012 – Cadastrar produto hortifruti (positivo)

**Pré-condições:** Nenhum.  
**Passos:**  
1. POST `/products/hortifruti` com JSON:
```json
{
  "name": "Maçã Gala",
  "value": 8.99,
  "quantity": 100,
  "weight": 0.15
}
```

**Esperado:** 
- HTTP 201
- Produto com `tag: "fruits"`
- Campo `special` contendo: `weight`

**Requisitos:** RF-PROD

---

### CT-013 – Adicionar produto sem valor (negativo)

**Pré-condições:** Acesso ao endpoint.  
**Passos:**  
1. POST `/stock` sem campo `value`:
```json
{
  "name": "Product F",
  "quantity": 10
}
```

**Esperado:** 
- HTTP 400
- Mensagem: `Field "value" is required`

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-014 – Adicionar produto sem quantidade (negativo)

**Pré-condições:** Acesso ao endpoint.  
**Passos:**  
1. POST `/stock` sem campo `quantity`:
```json
{
  "name": "Product G",
  "value": 100
}
```

**Esperado:** 
- HTTP 400
- Mensagem: `Field "quantity" is required`

**Requisitos:** RF-STOCK, RF-PROD, RF-TRANS

---

### CT-015 – Adicionar produto com valor negativo (negativo)

**Pré-condições:** Acesso ao endpoint.  
**Passos:**  
1. POST `/stock` com `value` < 0:
```json
{
  "name": "Product H",
  "value": -10,
  "quantity": 1
}
```

**Esperado:** 
- HTTP 400
- Mensagem de erro sobre valor inválido

**Requisitos:** RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS

---

### CT-016 – Adicionar produto com quantidade zero (positivo)

**Pré-condições:** Nenhum.  
**Passos:**  
1. POST `/stock` com `quantity: 0`:
```json
{
  "name": "Product I",
  "value": 50,
  "quantity": 0
}
```

**Esperado:** 
- HTTP 201
- Produto criado com `quantity: 0`

**Requisitos:** RF-STOCK, RF-PROD, RF-TRANS

---

### CT-017 – Atualizar apenas quantidade (positivo)

**Pré-condições:** Produto existente.  
**Passos:**  
1. Criar produto
2. PUT `/stock/{id}` alterando somente `quantity`:
```json
{
  "quantity": 15
}
```

**Esperado:** 
- HTTP 200
- Apenas `quantity` alterada
- Outros campos mantidos

**Requisitos:** RF-STOCK, RF-PROD, RF-TRANS

---

### CT-018 – Atualizar apenas valor (positivo)

**Pré-condições:** Produto existente.  
**Passos:**  
1. Criar produto
2. PUT `/stock/{id}` alterando somente `value`:
```json
{
  "value": 150
}
```

**Esperado:** 
- HTTP 200
- Apenas `value` alterado
- Outros campos mantidos

**Requisitos:** RF-STOCK, RF-PROD, RF-TRANS

---

### CT-019 – Atualizar apenas nome (positivo)

**Pré-condições:** Produto existente.  
**Passos:**  
1. Criar produto
2. PUT `/stock/{id}` alterando somente `name`:
```json
{
  "name": "Product L Updated"
}
```

**Esperado:** 
- HTTP 200
- Apenas `name` alterado
- Outros campos mantidos

**Requisitos:** RF-STOCK, RF-PROD, RF-TRANS

---

### CT-020 – Consultar produto por ID inválido (negativo)

**Pré-condições:** Nenhum.  
**Passos:**  
1. GET `/stock/abc`

**Esperado:** 
- HTTP 404
- Mensagem de erro

**Requisitos:** RF-STOCK, RF-FRONT

---

### CT-021 – Remover produto já deletado (negativo)

**Pré-condições:** Produto removido.  
**Passos:**  
1. Criar e deletar produto
2. DELETE `/stock/{id}` novamente

**Esperado:** 
- HTTP 404
- Mensagem: `Product not found`

**Requisitos:** RF-STOCK, RF-PROD, RF-TRANS

---

### CT-022 – Listar produtos com múltiplos itens (positivo)

**Pré-condições:** Múltiplos produtos cadastrados.  
**Passos:**  
1. Criar 3 produtos
2. GET `/stock`

**Esperado:** 
- HTTP 200
- Array com 3 elementos
- Cada elemento com estrutura completa

**Requisitos:** RF-STOCK, RF-FRONT

---

### CT-023 – Performance na listagem (positivo)

**Pré-condições:** >100 produtos cadastrados.  
**Passos:**  
1. GET `/stock`.  
**Esperado:** HTTP 200; resposta em < 2s com array completo.  

**Requisitos:** RF-STOCK, RF-FRONT, RF-TRANS.  

---

## 6 Matriz de Rastreabilidade


Matriz de Rastreabilidade — Estoque & Produtos
| Caso | descrição | RF-STOCK | RF-PROD | RF-FRONT | RF-TRANS |
|------|-----------|----------|---------|----------|----------|
|CT-001| Listar estoque (positivo)|	✔ | ✔	| ✔  | ✔  |
|CT-002| Listar estoque (vazio)|	✔ |	✔	|✔	| ✔  |
|CT-003| Adicionar produto (positivo)|	✔	|✔	|✔	|✔ |
|CT-004| Adicionar produto sem nome (negativo)|	✔ |	✔ |	✔ |	✔ |
|CT-005| Atualizar produto existente (positivo)|	✔ |	✔	|✔	|✔ |
|CT-006| Atualizar produto inexistente (negativo)|	✔ |	✔ |	✔ |	✔ |
|CT-007| Remover produto existente (positivo)|	✔ |	✔ |	✔ |	✔ |
|CT-008| Consultar produto por ID (positivo)|	✔ |	✔ |	✔ |	✔ |
|CT-009| Consultar produto inexistente (negativo)|	✔ |	✔ |	✔ |	✔ |
|CT-010| Cadastrar produto eletrônico	|–|	✔ |	–|	–|
|CT-011| Cadastrar produto móvel	|–|	✔	|–	|–|
|CT-012| Cadastrar produto hortifruti|	–|	✔	|–|	–|
|CT-013| Adicionar produto sem valor (negativo)|	✔ |	✔ |	✔ |	✔ |
|CT-014| Adicionar produto sem quantidade (negativo)|	✔ |	✔ |	–|	✔ |
|CT-015| Adicionar produto com valor negativo (negativo)|	✔ |	✔ |	✔ |	✔ |
|CT-016| Adicionar produto com quantidade zero (positivo)|	✔ |	✔ |	–|	✔ |
|CT-017| Atualizar apenas quantidade (positivo)|	✔ |	✔ |	–|	✔ |
|CT-018| Atualizar apenas valor (positivo)|	✔ |	✔ |	–|	✔ |
|CT-019| Atualizar apenas nome (positivo)|	✔ |	✔ |	–|	✔ |
|CT-020| Consultar por ID inválido (negativo)|	✔ |	–|	|✔	|–|
|CT-021| Remover produto já deletado (negativo) |✔ |✔|–|✔ |
|CT-022| Listar produtos com múltiplos itens (positivo)|	✔	|–|	✔	|–|
|CT-023| Performance na listagem (positivo)|✔ |–|✔ |✔ |

---

## 7 Entregáveis

* **Plano de Testes** – este documento, descrevendo estratégia, escopo, casos, critérios e cronograma.  
* **Casos de Teste** – detalhamento (Seção 5).  
* **Suíte de Testes** – coleção Postman/Newman ou Jest com os casos automatizados.  
* **Log de Execução** – resultados de cada execução (pass/fail, tempo de resposta).  
* **Relatórios de Defeitos** – documentando bugs, severidade, prioridade e passos de reprodução.  
* **Relatório Sumário** – síntese final com métricas de aprovação, falhas, riscos abertos.  

---

## 8 Critérios de Entrada e Saída

**Entrada:**
* API compila e executa sem erros.
* Front-end acessível (HTML/JS) e conectado à API.
* Ambiente de testes configurado (Postman, Jest, banco populado com dados básicos).
* Massa de dados inicial pronta (ao menos 1 produto cadastrado).

**Saída:**
* Todos os casos de teste executados.
* Nenhum defeito de **alta severidade** em aberto.
* ≥ 85% dos casos críticos aprovados.
* Relatório final documentado e aceito pelas partes interessadas.

---

## 9 Riscos e Mitigações

| Risco | Mitigação |
|-------|-----------|
| Requisitos incompletos ou ambíguos | Reuniões de alinhamento, documentação complementar. |
| Ambiente instável (banco/API indisponível) | Criar script de reset automático, containers para isolamento. |
| Restrições de tempo | Priorização dos casos críticos, automação parcial. |
| Dados inconsistentes após testes | Preparar massa controlada e resetar banco entre execuções. |
| Integração com front-end falhar | Validar API isoladamente antes de validar UI. |

---

## 10 Ambiente e Dados de Teste

* **Hardware** – qualquer máquina moderna (mín. 4GB RAM, dual-core).  
* **Software** – Node v20.10+, Express, MySQL 12+, Postman, Jest, navegadores Chrome/Firefox.  
* **Rede** – ambiente local ou servidor de testes acessível na rede.  
* **Dados de teste** –  
  - Estoque inicial vazio.  
  - Produto de exemplo para CTs positivos.  
  - IDs inválidos e valores negativos para CTs negativos.  
  - Massa de 100+ produtos para CT-022 (performance).  
* **Reset** – scripts SQL ou endpoints utilitários para limpar/repopular base.  

---

## 11 Cronograma

| Etapa | Descrição | Ferramentas/Ambiente | Duração Estimada |
|-------|-----------|----------------------|------------------|
| 1. Levantamento de Requisitos | Analisar RFs e critérios de aceitação | Documentos, reuniões | 1 dia |
| 2. Planejamento de Testes | Elaborar plano de testes e estratégias | Node, Jest, Express, MySQL | 1 dia |
| 3. Projeto dos Casos de Teste | Criar casos detalhados e dados de teste | Postman, Jest | 1 dia |
| 4. Preparação do Ambiente | Configurar ambiente, massa de dados | Windows/Linux, MySQL, Postman | 1 dia |
| 5. Execução dos Testes | Executar casos, registrar resultados | Postman, Jest, Browsers | 2–3 dias |
| 6. Análise de Resultados | Avaliar resultados, priorizar correções | Relatórios, reuniões | 1 dia |
| 7. Reteste e Validação Final | Retestes após correções, validar RFs | Node, Postman | 1 dia |
| 8. Teste de Usabilidade | Validar integração com UI | Usuários, reuniões | 1 dia |
| 9. Teste de Performance | Medir tempo de resposta, carga leve | Postman, scripts benchmark | 1 dia |
| 10. Documentação e Apresentação | Consolidar resultados, relatório final | Documentos, slides | 1 dia |

*Observações:*  
- Cronograma pode ser ajustado conforme complexidade do sistema e disponibilidade da equipe.  
- Retestes são críticos antes da entrega final.    
---

## Bibliografia 
 * site oficial do framework de testes - [JEST](https://jestjs.io/)
 * artigo web - [plano de teste - um mapa essencial para o teste de software](https://www.devmedia.com.br/plano-de-teste-um-mapa-essencial-para-teste-de-software/13824)
 * artigo web - [Como Criar um Plano de Testes Eficiente: Guia para QA’s e Desenvolvedores](https://daviteixeiradev.com/como-criar-um-plano-de-testes-eficiente-guia-para-qa-e-desenvolvedores/)
