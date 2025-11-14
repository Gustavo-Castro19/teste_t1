# 📘 Relatório de Teste – Modelo Completo (Exemplo)

> **Objetivo**: fornecer um **modelo pronto** e **exemplificado** de relatório de teste para ser usado pelos alunos após a execução, consolidando resultados, métricas, evidências, riscos e recomendações.  
> **Observação**: o **Plano de Teste já existe** — este documento foca **apenas no relatório** do(s) ciclo(s) executado(s).

---

## 1) Metadados do Ciclo
- **Projeto/Sistema**: _Portal Acadêmico UCB_  
- **Versão testada (build/tag)**: _v1.7.3 (commit 3acb9e9)_  
- **Período de execução**: _20/10/2025 a 05/11/2025_  
- **Responsável pelo relatório**: _Equipe QA – João / Amanda_  
- **Plano de teste de referência**: _PT-PAUCB-2025-10 (rev. 2)_  
- **Ambiente**: _Homologação (HMG-02)_  
- **Requisitos de base**: _Especificação RS-PAUCB-1.4 (link interno)_

> Substitua pelos seus dados. Esses campos ajudam auditoria e rastreabilidade.

---

## 2) Resumo Executivo
**Status do ciclo**: _Concluído com pendências menores_  
**Confiabilidade para release**: _Moderada-Alta_  
**Principais destaques**:
- Cobertura funcional planejada **atingida** (ver Seção 8).
- **21 defeitos** reportados (3 críticos, 6 altos, 8 médios, 4 baixos); **17 fechados** antes do encerramento do ciclo.
- **Performance** dentro do **SLA** definido para 95% das requisições (ver Seção 10).
- **Automação**: regressão crítica coberta por **Cypress** (32 specs) e **unit tests** (78% de cobertura nas áreas-chave).

**Go/No-Go recomendado**: **Go com ressalvas**  
- Condicionado ao fechamento dos defeitos **#BUG-1042 (alto)** e **#BUG-1051 (médio)** antes do deploy.

---

## 3) Escopo & Itens de Teste
- **Escopo coberto**: matrícula online, emissão de boletos, consulta de notas, recuperação de senha.
- **Fora de escopo**: relatórios administrativos (postergados), integrações com BI.
- **Itens de teste**: API acadêmica v2, Web SPA, job de faturamento noturno.

---

## 4) Ambiente de Teste
- **Infra**: 2 vCPU, 8 GB RAM, Postgres 14, Redis 6, Nginx 1.24, Node 18 LTS.
- **Dados**: massa sintética + subset anonimizado da base de 2024/2.
- **Ferramentas**: Jira, Zephyr, GitHub, Cypress, Jest, PyTest, JMeter, OWASP ZAP (triagem).

> Se o ambiente divergir do produção, **explique o impacto** (p.ex., latência, limites, dados).

---

## 5) Abordagem & Níveis (conforme Plano)
- **Níveis**: unitário → integração → sistema → e2e/regressão → UAT.
- **Técnicas**: caixa-preta (particionamento de equivalência, valor-limite), exploratório baseado em riscos, teste baseado em requisitos, smoke e regressão dirigida por mudança.
- **Não-funcionais**: carga e p95 com JMeter; varredura básica de segurança (ZAP passive scan).

---

## 6) Critérios de Entrada/Saída – Status
| Critério | Descrição | Status |
|---|---|---|
| Entrada | Build estável (sem _known blockers_) | **Atendido** |
| Entrada | Ambiente HMG com dados prontos | **Atendido** |
| Entrada | Requisitos e casos revisados | **Atendido** |
| Saída | 0 defeitos críticos abertos | **Não atendido** (fechados antes do Go) |
| Saída | ≥ 85% casos executados | **Atendido** (95%) |
| Saída | KPIs mínimos (ver Sec. 8) | **Atendido** |

---

## 7) Cronograma: Planejado × Realizado
| Marco | Planejado | Realizado | Desvio |
|---|---|---|---|
| Smoke | 21/10 | 21/10 | 0d |
| Sistema/E2E | 22–31/10 | 22/10–01/11 | +1d (ambiente) |
| Performance | 01–02/11 | 02–03/11 | +1d |
| UAT | 03–05/11 | 03–05/11 | 0d |

---

## 8) Métricas do Ciclo (Exemplo preenchido)
| Métrica | Valor | Observação |
|---|---:|---|
| Casos planejados | 100 |  |
| Casos executados | 95 | 95% do planejado |
| **Aprovados** | **82** |  |
| Reprovados | 9 |  |
| Bloqueados | 4 | dependência externa |
| **Pass Rate** = Aprovados/Executados | **86,3%** | 82/95 |
| Defeitos totais | 21 | 3C/6A/8M/4B |
| **Densidade de defeitos** | 0,21 defeitos/caso | 21/100 |
| **Cobertura de requisitos** | 92% | 46/50 requisitos testados |
| **Cobertura de código** (unit) | 78% | _lines_ (Jest/PyTest) |
| **DRE** (eficiência remoção) | 90,5% | 19 removidos antes ÷ (19 + 2 UAT) |

> **Como calcular rapidamente**:  
> - **Pass Rate** = Aprovados ÷ Executados.  
> - **Densidade** = Defeitos ÷ Casos planejados (ou por KLOC, se aplicável).  
> - **Cobertura de requisitos** = Requisitos com evidência ÷ Requisitos do escopo.  
> - **DRE** = Defeitos removidos antes da liberação ÷ (removidos + encontrados depois).

---

## 9) Resultados por Tipo & Nível
### 9.1 Smoke
- 18/18 cenários críticos **OK** (login, navegação, matrícula básica).

### 9.2 Sistema / Funcional
- **Casos**: 72 planejados / **68 executados** / **60 aprovados** / 6 reprovados / 2 bloqueados.  
- Falhas concentradas em **boleto** (cálculo de juros) e **recuperação de senha** (limite de tentativas).

### 9.3 Integração
- APIs acadêmicas com faturamento: **OK**, exceto _timeout_ eventual no job noturno (monitorado).

### 9.4 Regressão (Cypress)
- **32 specs** / **298 testes** / **290 passed**, 8 falhas intermitentes (flaky) correlacionadas a _spinner_.

### 9.5 UAT
- 14 cenários críticos validados com área de negócios.  
- **2 defeitos** levantados (usabilidade e mensagem confusa).

---

## 10) Testes Não Funcionais (Performance/Segurança)
### 10.1 Performance (JMeter – cenário “Matrícula”)
- **Carga**: 200 usuários simultâneos por 15 min, rampa de 5 min.
- **Throughput**: **120 req/s** (média).
- **Tempo de resposta p95**: **980 ms** (SLA ≤ 1.2 s) → **OK**.
- **Erro (%)**: **0,7%** (SLA ≤ 1%) → **OK**.
- **Gargalos observados**: picos de latência durante _GC_ no Node e _checkpoint_ no Postgres.  
  **Ação**: ajustar _pool_ de conexões e compressão de _assets_.

### 10.2 Segurança (varredura passiva – ZAP)
- **Informativos**: headers de segurança incompletos em /static.  
  **Recomendação**: adicionar `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`.

---

## 11) Defeitos
### 11.1 Distribuição
| Severidade | Qtde |
|---|---:|
| **Crítica** | **3** |
| Alta | 6 |
| Média | 8 |
| Baixa | 4 |
| **Total** | **21** |

| Status | Qtde |
|---|---:|
| **Fechado** | **17** |
| Em correção | 3 |
| Aberto | 1 |

### 11.2 Top 5 Defeitos (exemplo)
| ID | Título | Sev. | Status | Módulo | Observação |
|---|---|---|---|---|---|
| BUG-1031 | Boleto com juros incorreto após 5 dias | **Alta** | **Fechado** | Faturamento | Ajuste fórmula + teste de regressão |
| BUG-1042 | Recuperação de senha não respeita _cooldown_ | **Alta** | **Em correção** | Autenticação | Limite 3 tentativas/30 min |
| BUG-1019 | Timeout no job noturno | Média | Fechado | Integração | Aumentar _timeout_ e _retry_ |
| BUG-1007 | Mensagem ambígua no UAT | Baixa | Fechado | UX | Texto revisado |
| BUG-0999 | Spinner infinito ao salvar matrícula | **Crítica** | **Fechado** | SPA | Condição de corrida corrigida |

> Inclua **links de evidência** (prints, HAR, logs), quando possível.

---

## 12) Cobertura & Rastreabilidade
### 12.1 Matriz de Rastreabilidade (recorte)
| Requisito | Caso(s) de Teste | Defeito(s) | Status |
|---|---|---|---|
| **R1**: matrícula com pré-requisitos | CT-01, CT-05, CT-06 | BUG-0999 | **Aprovado** |
| **R2**: emissão de boleto | CT-12, CT-13 | BUG-1031 | **Aprovado após fix** |
| **R3**: recuperar senha | CT-21, CT-22 | BUG-1042 | **Reprovado** |
| **R4**: consultar notas | CT-31 | — | **Aprovado** |
| **R5**: login SSO | CT-40, CT-41 | — | **Aprovado** |

### 12.2 Check ISO 25010 (amostra)
| Característica | Evidência | Situação |
|---|---|---|
| Adequação funcional | Casos CT-01..CT-41 | **OK** |
| Eficiência de desempenho | JMeter p95 980 ms | **OK** |
| Compatibilidade | Navegadores (Chrome/Firefox/Edge) | **OK** |
| Usabilidade | UAT – 2 ajustes textuais | **Parcial** |
| Confiabilidade | Sem crash em 72h de teste | **OK** |
| Segurança | Headers pendentes | **Parcial** |
| Manutenibilidade | Cobertura unit 78% | **Parcial** |
| Portabilidade | Docker compose replicável | **OK** |

---

## 13) Relatos de Teste (Logs de Execução)
> **Exemplo de registro** (repita por caso ou por suíte):
- **CT-12 – Emitir boleto com desconto**  
  **Pré-condição**: aluno adimplente; desconto 10% ativo.  
  **Passos**: acessar fatura → aplicar desconto → emitir.  
  **Resultado esperado**: valor final com 10% de desconto.  
  **Resultado obtido**: **Falha** – desconto aplicado 5%.  
  **Evidência**: _evidencias/ct-12-boleto-errado.png_  
  **Defeito**: vinculado a **BUG-1031**.

---

## 14) Riscos, Desvios e Mitigações
- **Risco**: _flaky_ em salvar matrícula pode reaparecer sob carga.  
  **Mitigação**: adicionar _waits_ explícitos e _data-test-id_ nos elementos; reforçar testes de componente.
- **Desvio**: relatório administrativo fora do escopo deste ciclo.  
  **Ação**: replanejar para a _release_ v1.8.

---

## 15) Automação – Sumário
### 15.1 Unit/Component
- **Framework**: Jest / PyTest  
- **Cobertura**: **78% linhas**, **71% ramos** nas áreas críticas.  
- **Falhas**: 3 testes instáveis corrigidos (mock de datas).

### 15.2 E2E (Cypress)
- **Specs**: 32 | **Passes**: 290 | **Falhas**: 8 (_flaky_ de _spinner_)  
- **Pipeline CI**: execução por PR, _artifacts_ com vídeos e _screenshots_.  
- **Tarefas**: padronizar _fixtures_ e intercepts; reduzir dependência do _backend_ com _stubs_.

---

## 16) Lições Aprendidas
- Preparar massa de dados **versionada** reduziu 1 dia de retrabalho.  
- _Page Objects_ no Cypress diminuíram a manutenção dos testes.  
- Documentar SLAs no plano agilizou a aceitação de performance.

---

## 17) Recomendações
1. Fechar **BUG-1042** antes do deploy.  
2. Endurecer headers de segurança (CSP, XFO, XCTO).  
3. Priorizar automação para **fluxos de boleto** e **recuperação de senha**.  
4. Extender testes de carga para 300 usuários e 30 min, validando estabilidade.

---

## 18) Aprovação
| Papel | Nome | Decisão | Data/Assinatura |
|---|---|---|---|
| QA Lead | _Assinatura_ | **Aprovado com ressalvas** | 05/11/2025 |
| PO/Negócio | _Assinatura_ | **Aprovado** | 05/11/2025 |
| Tech Lead | _Assinatura_ | **Aprovado** | 05/11/2025 |

---

## 19) Anexos (exemplos)
- **A1** – Export de defeitos (CSV/Jira)  
- **A2** – Evidências (prints, vídeos Cypress, HAR)  
- **A3** – Relatório JMeter (HTML)  
- **A4** – _Coverage_ (lcov/pytest-cov)  
- **A5** – Matriz completa de rastreabilidade (XLSX)

---

### 🧩 Mini-Checklist de Entrega (aluno)
- [ ] Metadados completos (projeto, versão, período).  
- [ ] Métricas calculadas e **consistentes** com tabelas.  
- [ ] Defeitos com **links de evidência**.  
- [ ] Rastreabilidade requisito → caso → defeito.  
- [ ] Sumário de automação e performance.  
- [ ] Recomendações claras de Go/No-Go.  
