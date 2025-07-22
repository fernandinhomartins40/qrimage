# Multi-stage build para otimizar o tamanho da imagem
FROM node:20-alpine AS build

# Instalar dependências do sistema necessárias
RUN apk add --no-cache git

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro para melhor cache
COPY package.json package-lock.json ./

# Instalar todas as dependências (incluindo devDependencies para o build)
RUN npm ci --silent --no-audit --no-fund

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Verificar se o build foi criado corretamente
RUN ls -la /app/dist

# Estágio de produção com nginx
FROM nginx:alpine

# Instalar curl para health checks
RUN apk add --no-cache curl

# Remover configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build da aplicação
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Criar diretórios de log se não existirem
RUN mkdir -p /var/log/nginx

# Verificar se os arquivos foram copiados
RUN ls -la /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]