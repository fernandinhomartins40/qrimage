import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const SUPABASE_URL = "http://82.25.69.57:8176";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTM0NjgyMDMsImV4cCI6MTc4NTAwNDIwM30.pvtIAW0hu1UU7UWF5DDmpysMHDynOVyVWHKvJoTLcDo";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runMigration() {
  try {
    console.log('🚀 Iniciando execução da migration...');
    
    // Ler o arquivo de migration
    const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20250726000001_expand_qr_system.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Migration carregada, executando no Supabase...');
    
    // Executar a migration
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    });
    
    if (error) {
      console.error('❌ Erro na migration:', error);
      throw error;
    }
    
    console.log('✅ Migration executada com sucesso!');
    console.log('📊 Resultado:', data);
    
  } catch (error) {
    console.error('💥 Falha na execução da migration:', error.message);
    process.exit(1);
  }
}

runMigration();