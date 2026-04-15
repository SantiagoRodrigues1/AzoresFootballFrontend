# 🎯 TEAM MANAGER LOGIN GUIDE

## ✅ TUDO PRONTO PARA USAR!

Foram criados **22 Team Managers** automaticamente, um para cada equipa. Todos estão guardados na base de dados MongoDB.

---

## 📝 Test Credentials

Use qualquer uma destas contas para fazer login:

### Exemplos:

#### 1. Manager de Santa Clara B
```
Email: manager_santa_clara_b@league.com
Password: temp123
Equipa: Santa Clara B
```

#### 2. Manager de SC Praiense
```
Email: manager_sc_praiense@league.com
Password: temp123
Equipa: SC Praiense
```

#### 3. Manager de Angrense
```
Email: manager_angrense@league.com
Password: temp123
Equipa: Angrense
```

---

## 🔑 Padrão de Email

Todos os managers seguem este padrão:

```
manager_<teamname>@league.com
```

**Exemplos:**
- manager_fayal@league.com
- manager_madalena@league.com
- manager_vitria_do_pico@league.com
- manager_gd_velense@league.com
- manager_graciosa_fc@league.com
- etc...

---

## 📋 Lista Completa de Todas as Equipas + Managers

| # | Equipa | Email |
|---|--------|-------|
| 1 | Santa Clara B | manager_santa_clara_b@league.com |
| 2 | São Roque (Açores) | manager_so_roque_aores@league.com |
| 3 | Operário Lagoa | manager_operrio_lagoa@league.com |
| 4 | SC Praiense | manager_sc_praiense@league.com |
| 5 | Angrense | manager_angrense@league.com |
| 6 | União Micaelense | manager_unio_micaelense@league.com |
| 7 | FC Urzelinense | manager_fc_urzelinense@league.com |
| 8 | CD Lajense | manager_cd_lajense@league.com |
| 9 | Flamengos | manager_flamengos@league.com |
| 10 | Rabo de Peixe | manager_rabo_de_peixe@league.com |
| 11 | Fayal | manager_fayal@league.com |
| 12 | Madalena | manager_madalena@league.com |
| 13 | Vitória do Pico | manager_vitria_do_pico@league.com |
| 14 | FC Calheta | manager_fc_calheta@league.com |
| 15 | GD Velense | manager_gd_velense@league.com |
| 16 | Graciosa FC | manager_graciosa_fc@league.com |
| 17 | Guadalupe | manager_guadalupe@league.com |
| 18 | GD Mocidade Praiense | manager_gd_mocidade_praiense@league.com |
| 19 | Marítimo Graciosa | manager_martimo_graciosa@league.com |
| 20 | SC Barreiro | manager_sc_barreiro@league.com |
| 21 | Boavista Ribeirinha | manager_boavista_ribeirinha@league.com |
| 22 | JD Lajense B | manager_jd_lajense_b@league.com |

**Password para todas:** `temp123`

---

## 🚀 Como Fazer Login

1. Vá para http://localhost:8080/
2. Clique em "Autenticação" ou "Login"
3. Preencha:
   - **Email:** `manager_<teamname>@league.com` (ex: manager_santa_clara_b@league.com)
   - **Password:** `temp123`
4. Clique em "Entrar"

---

## ✨ O Que Pode Fazer Como Team Manager

Após fazer login:

1. Vá a **"Matches"** (Jogos)
2. Procure pelos jogos da sua equipa
3. Um botão verde **"Escalação"** aparece
4. Dentro do período permitido, pode:
   - **24h antes do jogo:** Criar chamada de jogadores (19 players)
   - **1h antes do jogo:** Selecionar formação e construir escalação visual
   - Submeter escalação (fica bloqueada automaticamente)

---

## 🔐 Segurança

- ✅ Cada manager só consegue gerir a sua equipa
- ✅ Não conseguem aceder a outras equipas
- ✅ As ações estão automaticamente bloqueadas fora dos períodos permitidos
- ✅ Passwords podem ser alteradas no perfil

---

## ⚠️ Notas Importantes

- **Password padrão:** `temp123` - Dirige-se que mude após o primeiro login
- **Role:** `team_manager` - Acesso limitado apenas a funcionalidades de escalação
- **Equipa Atribuída:** Cada manager está vinculado à sua equipa
- **Sem Admin:** Team Managers não têm acesso à painel admin

---

## 🆘 Troubleshooting

### "Email ou password incorretos"
- Verifique se o email está escrito corretamente
- Password é `temp123` (maiúsculas importam)
- Certifique-se que clicou criar conta antes (o sistema pode pedir registo primeiro)

### "Botão Escalação desativado"
- O jogo está fora do período de 24h antes
- Ou a equipa não tem jogo agendado

### "Não vejo jogos da minha equipa"
- Pode que não existam jogos agendados para essa equipa
- Contacte o admin para agendar jogos

---

## 📞 Support

Qualquer problema, contacte o administrador com:
- Email usado
- Nome da equipa
- Timestamp da ação

Bom jogo! ⚽
