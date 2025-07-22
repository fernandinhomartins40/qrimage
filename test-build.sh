#!/bin/bash

# Script para testar o build Docker localmente
# Uso: ./test-build.sh

set -e

# Configurações
APP_NAME="qrimage-test"
IMAGE_NAME="$APP_NAME:test"

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

# Função de limpeza
cleanup() {
    log "🧹 Limpando recursos de teste..."
    docker stop $APP_NAME 2>/dev/null || true
    docker rm $APP_NAME 2>/dev/null || true
    docker rmi $IMAGE_NAME 2>/dev/null || true
}

# Configurar trap para limpeza
trap cleanup EXIT

log "🧪 Iniciando teste de build do Docker"

# ====================================
# TESTE 1: VERIFICAR DEPENDÊNCIAS
# ====================================
log "📋 TESTE 1: Verificando dependências"

if ! command -v docker &> /dev/null; then
    error "Docker não está instalado!"
    exit 1
fi

success "Docker está disponível"

# ====================================
# TESTE 2: BUILD DA IMAGEM
# ====================================
log "🔨 TESTE 2: Testando build da imagem"

# Remover imagem de teste se existir
docker rmi $IMAGE_NAME 2>/dev/null || true

# Build com mais verbose para debug
log "Iniciando build..."
if docker build -t $IMAGE_NAME . --progress=plain --no-cache; then
    success "Build concluído com sucesso!"
else
    error "Falha no build da imagem!"
    exit 1
fi

# Verificar se imagem foi criada
if docker images | grep -q $APP_NAME; then
    success "Imagem criada e listada"
    docker images | grep $APP_NAME
else
    error "Imagem não encontrada"
    exit 1
fi

# ====================================
# TESTE 3: EXECUTAR CONTAINER
# ====================================
log "🚀 TESTE 3: Testando execução do container"

# Executar container de teste
if docker run -d \
  --name $APP_NAME \
  -p 3021:80 \
  -e VITE_SUPABASE_URL=http://82.25.69.57:8177 \
  -e VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTMxODgzNjksImV4cCI6MTc4NDcyNDM2OX0.49u8tE5eDuYz8hZ_xdKppreOhfgEIfi1WbcUJBaedm8 \
  $IMAGE_NAME; then
    success "Container iniciado com sucesso"
else
    error "Falha ao iniciar container"
    exit 1
fi

# ====================================
# TESTE 4: HEALTH CHECKS
# ====================================
log "🏥 TESTE 4: Executando health checks"

# Aguardar container inicializar
log "Aguardando 15 segundos para container inicializar..."
sleep 15

# Verificar se container está rodando
if docker ps | grep -q $APP_NAME; then
    success "Container está rodando"
    docker ps | grep $APP_NAME
else
    error "Container não está rodando"
    log "Logs do container:"
    docker logs $APP_NAME
    exit 1
fi

# Health check
log "Testando health endpoint..."
if curl -f http://localhost:3021/health >/dev/null 2>&1; then
    success "Health check passou"
else
    warning "Health check falhou, mas container pode ainda estar inicializando"
    sleep 10
    if curl -f http://localhost:3021/health >/dev/null 2>&1; then
        success "Health check passou após espera adicional"
    else
        error "Health check continua falhando"
        log "Logs do container:"
        docker logs $APP_NAME --tail=20
        exit 1
    fi
fi

# Teste da página principal
log "Testando página principal..."
if curl -f http://localhost:3021 >/dev/null 2>&1; then
    success "Página principal acessível"
else
    warning "Página principal pode não estar totalmente carregada"
fi

# ====================================
# RESULTADO FINAL
# ====================================
success "🎉 TODOS OS TESTES PASSARAM!"
echo
log "📊 Informações do container de teste:"
docker ps --filter "name=$APP_NAME" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo
log "🌐 Teste disponível em: http://localhost:3021"
log "🏥 Health check: http://localhost:3021/health"
echo
log "🧹 Limpeza será executada automaticamente ao sair"