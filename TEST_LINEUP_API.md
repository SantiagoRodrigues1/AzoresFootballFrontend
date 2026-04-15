# Teste de API de Escalação

## Objetivo
Verificar se o endpoint `GET /api/team-manager/lineups/:matchId/:teamId` está retornando os dados corretamente.

## Estrutura Esperada da Resposta

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "match": "...",
    "team": "...",
    "formation": "4-3-3",
    "starters": [
      {
        "playerId": "...",
        "playerName": "João Silva",
        "playerNumber": 1,
        "position": "goalkeeper",
        "formationPosition": "GK",
        "isCaptain": false,
        "isViceCaptain": false
      },
      ...11 more
    ],
    "substitutes": [...],
    "status": "draft|submitted|approved|locked",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

## Passos para Testar

### 1. Verificar se há escalações salvas no BD
```bash
# No arquivo REFEREE_SYSTEM_CURL_TESTS.sh ou similar, adicionar:
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/team-manager/lineups/MATCH_ID/TEAM_ID
```

### 2. Se retornar 404, significa que:
- Não há escalação salva para este jogo/equipa
- O frontend deveria fazer fallback para: Squad genérico → Mock players

### 3. Se retornar 200 com starters vazio, significa que:
- A escalação foi salva mas sem jogadores
- Também deveria fazer fallback

### 4. Se retornar 200 com starters preenchidos:
- Escalação foi carregada com sucesso
- Verificar se o mapeamento para player[] está correto

## Problema Potencial no Código

No LiveMatchManager.tsx linha ~100, o código faz:
```typescript
if (data?.data?.starters && data.data.starters.length > 0) {
```

Mas a resposta da API é:
```
{
  success: true,
  data: {
    starters: [...],
    ...
  }
}
```

Portanto `data.data.starters` deveria funcionar... a menos que:
- `data` = resposta JSON
- `data.data` = { starters: [...], ... }
- `data.data.starters` = array

Isto está correto!

## Próximo Passo: Debug no Browser

1. Abrir DevTools (F12)
2. Ir para aba Network
3. Navegar para "Gerir Jogo ao Vivo"
4. Procurar pelo request GET a `/api/team-manager/lineups/...`
5. Clicar e ver a resposta
6. Verificar se a resposta tem `starters` preenchido

Se não há escalação salva, fazer o fallback para squad.
