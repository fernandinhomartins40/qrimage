#!/bin/bash

# Script para aplicar migration no Supabase remoto
# Executa a migration via conexão direta com PostgreSQL

SUPABASE_HOST="82.25.69.57"
SUPABASE_PORT="8176"
SUPABASE_DB="postgres"
SUPABASE_USER="postgres"

echo "🚀 Aplicando migration no Supabase remoto..."
echo "📡 Host: $SUPABASE_HOST:$SUPABASE_PORT"

# Executar migration
if psql -h "$SUPABASE_HOST" -p "$SUPABASE_PORT" -U "$SUPABASE_USER" -d "$SUPABASE_DB" -f "supabase/migrations/20250726000001_expand_qr_system.sql"; then
    echo "✅ Migration aplicada com sucesso!"
else
    echo "❌ Erro ao aplicar migration"
    exit 1
fi