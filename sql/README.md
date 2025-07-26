# 🗄️ **SQLs para Execução no Supabase**

Execute estes SQLs **na ordem** no editor SQL do Supabase Dashboard:

## 📋 **Ordem de Execução:**

### **1️⃣ SQL 1: Criar ENUMs**
📁 `01_create_enums.sql`
- Criar tipos de QR code e planos de assinatura
- ⚠️ **Execute primeiro!**

### **2️⃣ SQL 2: Criar Profiles**  
📁 `02_create_profiles.sql`
- Tabela de perfis de usuário
- Políticas RLS e triggers

### **3️⃣ SQL 3: Criar Campaigns**
📁 `03_create_campaigns.sql`  
- Tabela para organizar QR codes em campanhas
- Índices e políticas

### **4️⃣ SQL 4: Expandir QR Codes**
📁 `04_expand_qr_codes.sql`
- Expandir tabela `image_qrcodes` para suportar múltiplos tipos
- Atualizar políticas RLS

### **5️⃣ SQL 5: Criar Analytics**
📁 `05_create_analytics.sql`
- Tabela `qr_scans` para tracking de analytics
- Índices para performance

### **6️⃣ SQL 6: Templates e Subscriptions**
📁 `06_create_templates_subscriptions.sql`
- Tabelas para templates de design e assinaturas
- Políticas RLS

### **7️⃣ SQL 7: Criar Funções**
📁 `07_create_functions.sql`
- Funções utilitárias (scan count, limits, auto profile creation)
- Triggers automáticos

### **8️⃣ SQL 8: Dados Iniciais e Views**
📁 `08_insert_data_views.sql`
- Templates padrão
- View de analytics
- Permissões finais

---

## 🎯 **Após Execução:**

Você terá o schema completo para:
- ✅ **7 tipos de QR code** (URL, Texto, WiFi, vCard, SMS, WhatsApp, Email)
- ✅ **Sistema de usuários** com planos freemium
- ✅ **Analytics avançados** com tracking de scans
- ✅ **Campanhas** para organização
- ✅ **Templates** de design
- ✅ **Limits automáticos** por plano
- ✅ **RLS completo** para segurança

## 🚀 **Próximo Passo:**
Após executar todos os SQLs, podemos implementar a interface React para os novos tipos de QR code!