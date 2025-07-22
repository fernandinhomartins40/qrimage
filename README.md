# Gerador de QR Code para Imagens

Aplicação web para gerar QR codes de imagens com armazenamento em Supabase customizado.

## 🚀 Configuração do Supabase

Este projeto utiliza uma instância customizada do Supabase. Siga os passos abaixo para configurar:

### 1. Configuração do Banco de Dados

Execute o SQL disponível no arquivo `database-setup.sql` no SQL Editor do seu Supabase Dashboard:

```sql
-- Execute todo o conteúdo do arquivo database-setup.sql
```

### 2. Configuração das Variáveis de Ambiente

1. Copie o arquivo `.env.example` para `.env`:
   ```sh
   cp .env.example .env
   ```

2. Preencha as variáveis com suas credenciais do Supabase:
   ```env
   VITE_SUPABASE_URL=http://82.25.69.57:8177
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTMxODgzNjksImV4cCI6MTc4NDcyNDM2OX0.49u8tE5eDuYz8hZ_xdKppreOhfgEIfi1WbcUJBaedm8
   VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtaW5zdGFuY2UtbWFuYWdlciIsImlhdCI6MTc1MzE4ODM2OSwiZXhwIjoxNzg0NzI0MzY5fQ.A1O-yIwlrk0owy_1abtLD_C1VXczVJXV1xLEiTHvvA4
   ```

## 🛠️ Instalação e Execução

```sh
# 1. Clone o repositório
git clone <YOUR_GIT_URL>

# 2. Navegue para o diretório
cd qrimage

# 3. Instale as dependências
npm i

# 4. Configure o arquivo .env (veja seção acima)

# 5. Execute o servidor de desenvolvimento
npm run dev
```

## 📋 Credenciais do Supabase

### URLs e Endpoints
- **Supabase URL**: `http://82.25.69.57:8177`
- **API REST URL**: `http://82.25.69.57:8177/rest/v1`

### Chaves de Autenticação
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlLWluc3RhbmNlLW1hbmFnZXIiLCJpYXQiOjE3NTMxODgzNjksImV4cCI6MTc4NDcyNDM2OX0.49u8tE5eDuYz8hZ_xdKppreOhfgEIfi1WbcUJBaedm8`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UtaW5zdGFuY2UtbWFuYWdlciIsImlhdCI6MTc1MzE4ODM2OSwiZXhwIjoxNzg0NzI0MzY5fQ.A1O-yIwlrk0owy_1abtLD_C1VXczVJXV1xLEiTHvvA4`
- **JWT Secret**: `V2H8Ezr10BTQ9rpEl0gE8x10vZrzGqbom5hwGnouudpS77dY9I2O9zL57ziGOAgr`

### Conexão PostgreSQL Direta
- **Host**: `82.25.69.57`
- **Porta**: `5503`
- **Database**: `postgres`
- **Username**: `postgres`
- **Password**: `xk9kTUhPhvmWupdZ`

## 🔧 Funcionalidades

- ✅ Upload de imagens (PNG, JPG, JPEG)
- ✅ Geração automática de QR codes
- ✅ Armazenamento seguro no Supabase Storage
- ✅ Modo visualização simples com cores personalizáveis
- ✅ Páginas de compartilhamento responsivas
- ✅ Políticas RLS configuradas para acesso público

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ImageUpload.tsx     # Componente de upload
│   ├── QRCodeGenerator.tsx # Gerador principal
│   └── ui/                 # Componentes shadcn/ui
├── integrations/
│   └── supabase/
│       ├── client.ts       # Cliente Supabase configurado
│       └── types.ts        # Tipos TypeScript do DB
├── pages/
│   ├── Index.tsx           # Página inicial
│   ├── ImageView.tsx       # Visualização de imagens
│   └── NotFound.tsx        # Página 404
└── lib/
    └── utils.ts            # Utilitários
```

## 🐳 Deploy com Docker

### Deploy Automático (GitHub Actions)

1. **Configure a secret no repositório GitHub**:
   - Vá em Settings → Secrets and variables → Actions
   - Adicione a secret `VPS_PASSWORD` com a senha do seu VPS

2. **Push para a branch main**:
   ```bash
   git add .
   git commit -m "Deploy to production"
   git push origin main
   ```

3. **Aplicação será deployada automaticamente em**:
   - `http://31.97.85.98:3020`

### Deploy Local

1. **Via Docker Compose** (recomendado):
   ```bash
   docker-compose up -d --build
   ```

2. **Via script de deploy**:
   ```bash
   chmod +x deploy-local.sh
   ./deploy-local.sh
   ```

3. **Via Docker manual**:
   ```bash
   # Build da imagem
   docker build -t qrimage .
   
   # Executar container
   docker run -d --name qrimage -p 3020:80 qrimage
   ```

### Comandos Úteis

```bash
# Ver logs
docker logs qrimage -f

# Parar aplicação
docker stop qrimage

# Reiniciar aplicação
docker restart qrimage

# Remover aplicação
docker stop qrimage && docker rm qrimage

# Via docker-compose
docker-compose down
docker-compose up -d --build
docker-compose logs -f
```

## 🌐 URLs de Acesso

### Produção (VPS)
- **Aplicação**: `http://31.97.85.98:3020`
- **Health Check**: `http://31.97.85.98:3020/health`

### Local
- **Aplicação**: `http://localhost:3020`
- **Health Check**: `http://localhost:3020/health`

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/11fc11b8-7c01-4112-b1e3-786494c62d1c) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
