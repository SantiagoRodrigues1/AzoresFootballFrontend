# 📑 TEAM IDS & DATA STRUCTURES - ÍNDICE COMPLETO

**Guia de navegação de todos os documentos sobre IDs de equipas na aplicação**

---

## 📂 DOCUMENTOS CRIADOS

Este mapa foi dividido em **3 documentos complementares**:

### 1. 🏗️ [TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md](TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md)
**Documento principal e completo (100% das informações)**

Contém:
- ✅ Sumário executivo
- ✅ Tipos de dados TypeScript (interfaces completas)
- ✅ 5 serviços principais com interfaces
- ✅ Dois sistemas de nomes (casa/fora vs homeTeam/awayTeam)
- ✅ 12+ API endpoints de resolução de team IDs
- ✅ Ficheiros com dados de equipas (62 ficheiros identificados)
- ✅ Backend - modelos MongoDB (Club.js, Match.js, User.js)
- ✅ Padrões de resolução de Team IDs
- ✅ Fluxo completo de dados de team ID
- ✅ Lista completa de ficheiros (62 total)

**Use quando:** Precisa de documentação **completa e detalhada**

---

### 2. ⚡ [TEAM_IDS_QUICK_REFERENCE.md](TEAM_IDS_QUICK_REFERENCE.md)
**Referência rápida para desenvolvedores (lookup rápido)**

Contém:
- ✅ Tabela de "Onde procurar" (15 registos)
- ✅ Mapeamento rápido dos 3 tipos de IDs
- ✅ Localização exata de cada tipo
- ✅ Campos por ficheiro
- ✅ Operações comuns (6 exemplos)
- ✅ API endpoints
- ✅ Conversão de dados (string ↔ ObjectId)
- ✅ Problemas comuns e soluções
- ✅ Exemplo completo prático
- ✅ Checklist de implementação

**Use quando:** Precisa de **resposta rápida** a uma pergunta

---

### 3. 🔗 [TEAM_IDS_VISUAL_STRUCTURE.md](TEAM_IDS_VISUAL_STRUCTURE.md)
**Representação visual de estruturas (diagramas ASCII)**

Contém:
- ✅ Hierarquia de dados (diagrama)
- ✅ Fluxo de resolução visual
- ✅ Mapeamento de ficheiros por operação
- ✅ Comparação visual: Casa/fora vs HomeTeam/AwayTeam
- ✅ Tabela de sources de Team ID
- ✅ Validação de permissões (diagrama)
- ✅ Exemplos de payloads JSON (API responses)
- ✅ Debugging: como verificar Team IDs
- ✅ Tabela de lookup: onde encontrar cada campo

**Use quando:** Precisa **visualizar** a estrutura e fluxos

---

## 🎯 GUIA RÁPIDO: Qual Documento Ler?

| Pergunta | Ir para | Ficheiro |
|----------|---------|----------|
| **"Quero uma visão COMPLETA de tudo"** | A. Leia primeiro | TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md |
| **"Preciso de resposta RÁPIDA"** | B. Quick reference | TEAM_IDS_QUICK_REFERENCE.md |
| **"Quero ver DIAGRAMAS e estruturas"** | C. Visual | TEAM_IDS_VISUAL_STRUCTURE.md |
| **"Onde está o campo X?"** | B → Secção "Localização exata" | QUICK_REFERENCE |
| **"Como validar permissões?"** | C → "Validação de Permissões" | VISUAL_STRUCTURE |
| **"Exemplos de API payloads?"** | C → "API Payload Samples" | VISUAL_STRUCTURE |
| **"Implementar nova funcionalidade"** | A → "Fluxo de dados" OR B → "Ops comuns" | COMPLETE_MAP + QUICK_REFERENCE |
| **"Debugging: porquê não funciona?"** | C → "Debugging" | VISUAL_STRUCTURE |
| **"Preciso de toda a lista de ficheiros"** | A → Secção 5.7 | COMPLETE_MAP |
| **"Qual é a diferença casa/fora vs homeTeam?"** | C → "Comparação" | VISUAL_STRUCTURE |

---

## 📍 ÍNDICE CRUZADO: Tópicos por Documento

### **TEAM IDs Basics**
- Documento A: Secção 1 (Tipos de Dados)
- Documento B: Secção 1 (Mapeamento Rápido)
- Documento C: Secção 1 (Hierarquia)

### **HomeTeam/AwayTeam (Moderno)**
- Documento A: Secção 3.2
- Documento B: Secção 2.2
- Documento C: Secção 8 - "Modern System"

### **Casa/Fora (Legacy)**
- Documento A: Secção 3.1
- Documento B: Secção 2.1
- Documento C: Secção 8 - "Legacy System"

### **API Endpoints**
- Documento A: Secção 4
- Documento B: Secção 5 (API ENDPOINTS)
- Documento C: Secção 10 (API Payload Samples)

### **Team Manager Validação**
- Documento A: Secção 5.2 (lineupHelpers.ts)
- Documento B: Secção 2 (Operação 2)
- Documento C: Secção 11 (Diagrama)

### **Ficheiros Completos**
- Documento A: Secção 5 (62 ficheiros)
- Documento B: Tabelas de localização
- Documento C: Secção 12 (Tabela rápida)

### **Backend (MongoDB)**
- Documento A: Secção 6 (Modelos e Estruturas)
- Documento C: Secção 10 (Payloads)

### **Debugging**
- Documento B: Secção 6 (Problemas Comuns)
- Documento C: Secção 12 (Debugging)

---

## 🔍 COMO USAR ESTE ÍNDICE

### Cenário 1: "Estou a começar a entender o sistema"
1. **Leia Documento C** (Visual) - 10 mins
2. **Leia Documento B** - Secção 1 (Mapeamento) - 5 mins
3. **Leia Documento A** - Secção 1-3 (Tipos de dados) - 15 mins

### Cenário 2: "Preciso implementar nova feature com teamId"
1. **Documento A** - Secção 4 (API endpoints)
2. **Documento B** - Secção 3 (Operações comuns)
3. **Documento C** - Secção 2 (Fluxo)

### Cenário 3: "Algo não está a funcionar"
1. **Documento C** - Secção 12 (Debugging)
2. **Documento B** - Secção 6 (Problemas comuns)
3. **Documento A** - Secção 7 (Padrões de resolução)

### Cenário 4: "Preciso entender diferenças casa/fora vs homeTeam"
1. **Documento C** - Secção 8 (Comparação visual)
2. **Documento A** - Secção 3 (Sistemas de nomes)
3. **Documento B** - Secção 2.1-2.2

### Cenário 5: "Adicionar suporte a novo tipo de equipa"
1. **Documento A** - Secção 5 (Ficheiros por tipo)
2. **Documento A** - Secção 6 (Backend models)
3. **Documento B** - Secção 3 (Operações)

---

## 📊 MATRIZ DE REFERÊNCIA RÁPIDA

### Encontrar Tipos TypeScript

| Type | Documento | Localização |
|------|-----------|------------|
| `Match` | A | Secção 1.1 |
| `Team` | A | Secção 1.2 |
| `Player` | A | Secção 1.4 |
| `MatchEvent` | A | Secção 1.3 |
| `MatchLineup` | A | Secção 1.5 |
| `MatchCallUp` | A | Secção 1.5 |

### Encontrar APIs

| Endpoint | Documento | Localização |
|----------|-----------|------------|
| GET /api/matches/{id} | A/B/C | A-Secção 4.1 |
| GET /api/players/team/{teamId} | A/B/C | A-Secção 4.2 |
| GET /api/teams/{teamId} | A/C | A-Secção 4.3 |
| GET /api/team-manager/lineups/{matchId}/{teamId} | A/B/C | A-Secção 4.4 |

### Encontrar Componentes

| Componente | Documento | Localização |
|-----------|-----------|------------|
| LiveMatchManager | A/B/C | A-Secção 5.3 |
| MatchCardPremium | A/B/C | A-Secção 5.4 |
| TeamMatchesSection | A/B/C | A-Secção 5.4 |
| lineupHelpers | A/B/C | A-Secção 5.5 |

### Encontrar Serviços

| Serviço | Documento | Localização |
|---------|-----------|------------|
| liveMatchService | A/B/C | A-Secção 2.1 |
| squadService | A/B/C | A-Secção 2.2 |
| matchService | A/B/C | A-Secção 2.3 |

---

## 🎓 EXEMPLOS POR DOCUMENTO

### A - TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md

**Exemplo 1: Estrutura de Match**
```
Secção 1.1 - Tipo Match com homeTeam/awayTeam
```

**Exemplo 2: Usar casa/fora**
```
Secção 3.1 - Sistema legacy português
```

**Exemplo 3: Backend validação**
```
Secção 6.2 - liveMatchService.js
```

### B - TEAM_IDS_QUICK_REFERENCE.md

**Exemplo 1: Operação - Validar Team Manager**
```
Secção 3 - "2️⃣ Validar Team Manager Permissions"
```

**Exemplo 2: Problema - Team not found**
```
Secção 6 - "Problemas Comuns e Soluções"
```

### C - TEAM_IDS_VISUAL_STRUCTURE.md

**Exemplo 1: Flow visual de resolução**
```
Secção 2 - "Fluxo de Resolução de Team IDs"
```

**Exemplo 2: Debugging no console**
```
Secção 12 - "Browser Development Tools"
```

---

## 📈 ESTATÍSTICAS DOS DOCUMENTOS

| Métrica | Valor |
|---------|-------|
| **Ficheiros identificados** | 62 |
| **API endpoints mapeados** | 12+ |
| **Interfaces TypeScript documentadas** | 10 |
| **Backend models** | 3 (Club, Match, User) |
| **Serviços principais** | 5 |
| **Padrões de resolução** | 3 tipos |
| **Linhas de documentação** | 2000+ |
| **Diagramas ASCII** | 8 |
| **Exemplos de código** | 40+ |

---

## ✅ CHECKLIST: O Que Cada Documento Cobre

### A - TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md

- [x] Tipos TypeScript completos
- [x] Interfaces de serviços
- [x] Dois sistemas de nomes (casa/fora + homeTeam/awayTeam)
- [x] 12+ endpoints mapeados
- [x] 62 ficheiros identificados e categorizados
- [x] Backend models MongoDB
- [x] Backend services
- [x] Backend routes
- [x] Padrões de resolução ObjectId
- [x] Fluxo completo de dados
- [x] Estruturas resumidas por tipo

### B - TEAM_IDS_QUICK_REFERENCE.md

- [x] Tabela "Onde procurar"
- [x] Mapeamento dos 3 tipos de IDs
- [x] Localização exata de cada tipo
- [x] Campos por ficheiro
- [x] 6 operações comuns
- [x] Tabela de API endpoints
- [x] Conversão de dados
- [x] Problemas comuns e soluções
- [x] Exemplo prático completo
- [x] Checklist de implementação

### C - TEAM_IDS_VISUAL_STRUCTURE.md

- [x] Hierarquia de dados (diagrama)
- [x] Fluxo visual de resolução (9 steps)
- [x] Mapeamento de ficheiros por operação
- [x] Comparação visual legacy vs moderno
- [x] Tabela de sources de team ID
- [x] Diagrama de validação de permissões
- [x] API payload examples (JSON)
- [x] Debugging: 4 métodos
- [x] Tabela rápida de campos
- [x] Comparação casa/fora vs homeTeam/awayTeam

---

## 🚀 ORDEM RECOMENDADA DE LEITURA

Para **novo desenvolvedor na equipa**:

1. **Documento C** - Secção 1 (5 mins)
   - Entender hierarquia básica

2. **Documento B** - Secção 1 (5 mins)
   - Know os 3 tipos de IDs

3. **Documento C** - Secção 2 (10 mins)
   - Ver fluxo visual

4. **Documento A** - Secções 1-3 (20 mins)
   - Entender interfaces

5. **Documento A** - Secção 5 (10 mins)
   - Saber onde procurar

6. **Documento B** - Secção 3 (5 mins)
   - Operações comuns

**Total: ~55 minutos** para entendimento completo

---

## 🔗 LINKS DIRETOS PARA SECÇÕES

### Quick Access (Documento A)
- [Tipos de Dados](TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md#-1-tipos-de-dados)
- [Serviços](TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md#-2-serviços-de-resolução-de-equipas)
- [Casa/Fora vs HomeTeam/AwayTeam](TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md#-3-dois-sistemas-de-nomes-de-equipas)
- [API Endpoints](TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md#-4-api-endpoints-e-mapeamento-de-ids)
- [Ficheiros Completos](TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md#-5-ficheiros-com-dados-de-equipas)
- [Backend Models](TEAM_IDS_DATA_STRUCTURES_COMPLETE_MAP.md#-6-backend---modelos-e-estruturas)

### Quick Access (Documento B)
- [Mapeamento de IDs](TEAM_IDS_QUICK_REFERENCE.md#-mapeamento-rápido-team-ids-em-3-tipos)
- [Localização Exata](TEAM_IDS_QUICK_REFERENCE.md#-localização-exata-de-cada-tipo)
- [Operações Comuns](TEAM_IDS_QUICK_REFERENCE.md#-operações-comuns)
- [Problemas e Soluções](TEAM_IDS_QUICK_REFERENCE.md#-problemas-comuns-e-soluções)
- [Exemplo Completo](TEAM_IDS_QUICK_REFERENCE.md#-exemplo-completo-ler-match-e-extrair-team-ids)

### Quick Access (Documento C)
- [Hierarquia](TEAM_IDS_VISUAL_STRUCTURE.md#-hierarquia-de-dados)
- [Fluxo de Resolução](TEAM_IDS_VISUAL_STRUCTURE.md#-fluxo-de-resolução-de-team-ids)
- [Operações por Ficheiro](TEAM_IDS_VISUAL_STRUCTURE.md#-mapeamento-de-ficheiros-por-tipo-de-operação)
- [Comparação Legacy/Moderno](TEAM_IDS_VISUAL_STRUCTURE.md#-comparação-casafora-vs-hometeamawayteam)
- [API Payloads](TEAM_IDS_VISUAL_STRUCTURE.md#-api-payload-samples)
- [Debugging](TEAM_IDS_VISUAL_STRUCTURE.md#-debugging-como-verificar-team-ids)

---

## 📝 NOTAS

Estes documentos são criados a partir de análise **100% automática** do workspace:
- Grep search de 60+ ficheiros
- Parse da estrutura TypeScript
- Análise de serviços e componentes
- Inspeção de models MongoDB
- Mapeamento de APIs e routes

**Última atualização:** 2026-04-09

---

**Escolha o documento certo para a sua pergunta e ganhe tempo! 🚀**

