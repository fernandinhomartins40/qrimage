#!/bin/bash

# Script para deploy local da aplicação QRImage
# Uso: ./deploy-local.sh

set -e

# Configurações
APP_NAME="qrimage"
APP_PORT="3020"
IMAGE_NAME="$APP_NAME:latest"

# Cores para logs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função de limpeza em caso de erro
cleanup() {
    error "Deploy falhou. Executando limpeza..."
    docker stop $APP_NAME 2>/dev/null || true
    docker rm $APP_NAME 2>/dev/null || true
    exit 1
}

# Configurar trap para limpeza
trap cleanup ERR

log "🚀 Iniciando deploy local da aplicação $APP_NAME"

# ====================================
# ETAPA 1: VERIFICAÇÕES PRÉ-DEPLOY
# ====================================
log "📋 ETAPA 1: Verificações pré-deploy"

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    error "Docker não está instalado!"
    exit 1
fi

success "Docker está instalado"

# Verificar se porta está disponível
if lsof -Pi :$APP_PORT -sTCP:LISTEN -t >/dev/null ; then
    warning "Porta $APP_PORT está em uso. Parando processo..."
    docker stop $APP_NAME 2>/dev/null || true
    docker rm $APP_NAME 2>/dev/null || true
fi

success "Porta $APP_PORT está disponível"

# ====================================
# ETAPA 2: BUILD DA APLICAÇÃO
# ====================================
log "🔨 ETAPA 2: Build da aplicação"

# Remover imagem antiga se existir
log "Removendo imagem antiga..."
docker rmi $IMAGE_NAME 2>/dev/null || true

# Build da nova imagem
log "Fazendo build da imagem Docker..."
docker build -t $IMAGE_NAME . --no-cache

success "Imagem Docker criada com sucesso"

# ====================================
# ETAPA 3: DEPLOY DO CONTAINER
# ====================================
log "🚀 ETAPA 3: Deploy do container"

# Executar container
log "Iniciando container..."
docker run -d \
  --name $APP_NAME \
  --restart unless-stopped \
  -p $APP_PORT:80 \
  -e VITE_SUPABASE_URL=http://82.25.69.57:8177 \
  -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTMxODgzNjksImV4cCI6MTc4NDcyNDM2OX0.49u8tE5eDuYz8hZ_xdKppreOhfgEIfi1WbcUJBaedm8 \
  $IMAGE_NAME

success "Container iniciado com sucesso"

# ====================================
# ETAPA 4: VERIFICAÇÕES PÓS-DEPLOY
# ====================================
log "🔍 ETAPA 4: Verificações pós-deploy"

# Aguardar container inicializar
log "Aguardando container inicializar..."
sleep 10

# Verificar se container está rodando
if ! docker ps | grep -q $APP_NAME; then
    error "Container não está rodando!"
    docker logs $APP_NAME --tail=20
    exit 1
fi

success "Container está rodando"

# Health check
log "Executando health check..."
sleep 5

if curl -f http://localhost:$APP_PORT/health >/dev/null 2>&1; then
    success "Health check passou"
else
    error "Health check falhou"
    docker logs $APP_NAME --tail=20
    exit 1
fi

# Teste da página principal
if curl -f http://localhost:$APP_PORT >/dev/null 2>&1; then
    success "Página principal acessível"
else
    warning "Página principal pode não estar totalmente carregada ainda"
fi

# ====================================
# ETAPA 5: INFORMAÇÕES FINAIS
# ====================================
log "📊 ETAPA 5: Informações do deploy"

echo
success "🎉 DEPLOY CONCLUÍDO COM SUCESSO!"
echo
log "🌐 Aplicação QRImage disponível em:"
log "   - http://localhost:$APP_PORT"
echo
log "📋 Informações do container:"
docker ps --filter "name=$APP_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo
log "💾 Uso de recursos:"
docker stats $APP_NAME --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" 2>/dev/null || true
echo
log "📝 Comandos úteis:"
log "   - Ver logs: docker logs $APP_NAME -f"
log "   - Parar: docker stop $APP_NAME"
log "   - Reiniciar: docker restart $APP_NAME"
log "   - Remover: docker stop $APP_NAME && docker rm $APP_NAME"
echo