#  RELATÓRIO DE TESTE – INVENTORY API v1.5

## 1) Metadados do Ciclo
- **Projeto/Sistema:** Inventory API — Sistema de Estoque e Produtos  
- **Versão testada (build):** v1.5.0  
- **Período de execução:** 14/11/2025  
- **Responsável pelo relatório:** equipe: Gustavo, Ricardo, Daniel, Matheus Gabriel,Kauã Kairon, Victor Hugo.   
- **Plano de teste de referência:** *plan_test.md (rev. 1.1)*  
- **Requisitos-base:** _RF-STOCK, RF-PROD, RF-FRONT, RF-TRANS (ver doc_requisitos) para detalhes_ 

---

## 2) Resumo Executivo
**Status geral:** ✔ **Aprovado**  
**Confiabilidade para Release:** **Alta**

**Destaques:**
- Todas as suites de teste **passaram (100%)**  
- **Nenhum defeito encontrado**  
- Teste de stress demonstrou:  
  - **100% de sucesso nas requisições**  
  - Sem falhas simultâneas  
  - Performance dentro do SLA (< 2s)  
  - Média de **152 req/s** nos cenários mais pesados  
- API estável em volume e concorrência moderada  

**Go/No-Go recomendado:** ✔ **GO**

---

## 3) Escopo & Itens de Teste

### Incluído
- CRUD completo do estoque  
- Validações de campos obrigatórios  
- Inserção de produtos específicos (electronics/furniture/fruits)  
- Atualizações parciais  
- Remoção e revalidação  
- Testes de performance (stress)  

### Fora de escopo
- Autenticação  
- Segurança avançada  
- Stress de alta carga (> 10k req)  

---

## 4) Ambiente de Teste
- **Node:** v22.20.0  
- **Servidor:** Localhost  
- **Ferramentas:** Jest, Supertest, Postman  
- **Banco:** MySQL (local)  
- **Dados:** massa sintética gerada no setup  

---

## 5) Abordagem
- Testes funcionais automatizados com Jest + Supertest  
- Testes de stress com 100 requisições e 10 simultâneas  
- Validação de integridade, persistência e concorrência básica  

---

## 6) Critérios de Entrada/Saída – Status

| Critério | Status |
|---------|--------|
| API disponível e estável | ✔ Atendido |
| Banco configurado | ✔ Atendido |
| Massa inicial de dados pronta | ✔ Atendido |
| 100% dos testes executados | ✔ Atendido |
| Sem defeitos críticos | ✔ Atendido |
| Todos os requisitos coberto
___
## 7) Cronograma (Planejado x Realizado)

| Etapa | Planejado | Realizado | Status |
|------|-----------|-----------|--------|
| Execução funcional | 12/11 | 12/11 | ✔ |
| Execução stress | 12/11 | 12/11 | ✔ |
| Consolidação | 16/11 | 16/11 | ✔ |

---
## 8) Métricas do Ciclo

| Métrica | Valor |
|--------|-------|
| Casos planejados | 23 |
| Casos executados | 23 |
| **Casos aprovados** | **23 (100%)** |
| Casos reprovados | 0 |
| Casos bloqueados | 0 |
| **Pass Rate** | **100%** |
| Defeitos encontrados | 0 |
| Densidade de defeitos | 0 |
| Cobertura de requisitos | 100% |

---

## 9) Resultados dos Testes

### ✔ Testes Funcionais
Todos os 23 casos de teste funcionais executados → **100% aprovados**  
Nenhuma inconsistência encontrada.

---

## 10) Testes Não Funcionais – Stress Test

### POST Stress
- Sucesso: **100/100**
- Falhas: **0**
- Tempo total: **655ms**
- Req/s: **152.67**
- Status: ✔ Aprovado

### GET Stress
- Sucesso: **100/100**
- Falhas: **0**
- Tempo total: **717ms**
- Req/s: **139.47**
- Status: ✔ Aprovado

### Teste Misto (30% POST / 70% GET)
- Sucesso: **100/100**
- Falhas: **0**
- Tempo total: **637ms**
- Req/s: **156.99**
- Status: ✔ Aprovado

**Conclusão:**  
A API suporta múltiplas requisições simultâneas com performance excelente.

---

## 11) Defeitos
### 📌 Nenhum defeito encontrado
- Nenhum comportamento inesperado  
- Nenhum retorno incorreto  
- Nenhum erro de validação fora da especificação  

---

## 12) Rastreabilidade (Requisito → Casos → Resultado)

| Requisito | Casos Relacionados | Resultado |
|-----------|--------------------|-----------|
| RF-STOCK | CT-001..CT-023 | ✔ Aprovado |
| RF-PROD | CT-003..CT-023 | ✔ Aprovado |
| RF-FRONT | CT-001, CT-002, CT-022 | ✔ Aprovado |
| RF-TRANS | CT-001..CT-007, CT-013..018, CT-021, CT-023 | ✔ Aprovado |

---

## 13) Logs de Execução

Test Suites: 2 passed, 2 total
Tests: 25 passed, 25 total
Time: 7.802 s
Ran all test suites.


---

## 14) Riscos & Observações

- ❗ Jest exibiu aviso sobre handles abertos  
  **Impacto:** Nenhum — testes não foram afetados  
  **Recomendação:** usar `--detectOpenHandles` em execuções futuras  
---

## 15) 

### 1-Recomendações
- Melhorar limpeza das operações assíncronas (Jest warning)  
- Executar testes de stress em cargas maiores (500–1000 req)  
- Incluir testes de endurance (long duration)  
- Incluir testes mais robustos de validação de dados 

### 2-Lições aprendidas
- Prazos mal definidos levam a não construção ou falta de testagem, o front-end não pode ser integrado devido a confusões de Cronograma
- Fazer testes durante o desenvolvimento do sistema leva a taxa de sucessos fenomenais e minam erros, termos feitos testes antes de construir a API levou a uma taxa de sucesso abnormal e falta de bugs
- Definir as fronteiras do sistema cedo leva a solidez muito forte de lógica apontada como razão maior do sucesso das suites de testagem

---

## 16) Aprovação

| Papel | Nome | Decisão | Data |
|-------|--------|----------|--------|
| QA/DEV | Gustavo Castro | ✔ Aprovado | 14/11/2025 |
| QA/DEV | Matheus Gabriel | ✔ Aprovado| 14/11/2025 |
| QA/DEV | Ricardo | ✔ Aprovado | 14/11/2025 |
| QA/DEV | Daniel | ✔ Aprovado | 14/11/2025 |
| QA/DEV | Kaua | ✔ Aprovado | 14/11/2025 |
| QA/DEV | Victor Hugo | ✔ Aprovado | 14/11/2025 |

---
