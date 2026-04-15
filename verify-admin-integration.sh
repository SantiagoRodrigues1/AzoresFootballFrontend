#!/bin/bash
# verify-admin-integration.sh
# Script para verificar se a integração do painel admin está correta

echo "🔍 Verificando Integração do Painel Admin AzoresScore..."
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contadores
PASS=0
FAIL=0

# Função para verificar
check_file() {
    local file=$1
    local label=$2
    
    if [ -f "$file" ]; then
        echo -e "${GREEN}✅${NC} $label"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} $label"
        ((FAIL++))
    fi
}

check_content() {
    local file=$1
    local search=$2
    local label=$3
    
    if grep -q "$search" "$file"; then
        echo -e "${GREEN}✅${NC} $label"
        ((PASS++))
    else
        echo -e "${RED}❌${NC} $label"
        ((FAIL++))
    fi
}

echo "📂 Verificando Ficheiros..."
check_file "src/pages/AdminPanelPage.tsx" "AdminPanelPage.tsx criado"
check_file "src/pages/MorePage.tsx" "MorePage.tsx existe"
check_file "src/App.tsx" "App.tsx existe"
check_file "ADMIN_PANEL_GUIDE.md" "Documentação criada"
check_file "IMPLEMENTATION_SUMMARY.md" "Sumário criado"
echo ""

echo "📝 Verificando Conteúdo dos Ficheiros..."
check_content "src/App.tsx" "AdminPanelPage" "App.tsx importa AdminPanelPage"
check_content "src/App.tsx" "/admin-panel" "App.tsx tem rota /admin-panel"
check_content "src/pages/MorePage.tsx" "navigate('/admin-panel')" "MorePage.tsx navega para admin-panel"
check_content "src/pages/AdminPanelPage.tsx" "role === 'admin'" "AdminPanelPage.tsx verifica role"
check_content "src/pages/AdminPanelPage.tsx" "api/admin/dashboard" "AdminPanelPage.tsx carrega dashboard API"
echo ""

echo "📦 Verificando Dependências..."
if grep -q '"framer-motion"' package.json; then
    echo -e "${GREEN}✅${NC} framer-motion instalado"
    ((PASS++))
else
    echo -e "${RED}❌${NC} framer-motion não encontrado"
    ((FAIL++))
fi

if grep -q '"axios"' package.json; then
    echo -e "${GREEN}✅${NC} axios instalado"
    ((PASS++))
else
    echo -e "${RED}❌${NC} axios não encontrado"
    ((FAIL++))
fi
echo ""

# Resultado Final
echo "═══════════════════════════════════════════"
echo "🎯 RESULTADO FINAL"
echo "═══════════════════════════════════════════"
echo -e "${GREEN}✅ Passou: $PASS${NC}"
echo -e "${RED}❌ Falhou: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}🎉 Tudo está perfeito! Integração completa.${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. npm install (se necessário atualizar deps)"
    echo "2. npm run dev (iniciar dev server)"
    echo "3. http://localhost:8080 (abrir no browser)"
    echo "4. Login com: admin@azores-score.com / admin123"
    echo "5. Clique em 'Mais' → '📊 Gerir Admin'"
    exit 0
else
    echo -e "${YELLOW}⚠️ Alguns problemas encontrados.${NC}"
    echo "Verifique os ficheiros marcados com ❌"
    exit 1
fi
