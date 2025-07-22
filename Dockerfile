# Multi-stage build para otimizar o tamanho da imagem
FROM node:20-alpine AS build

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package.json package-lock.json ./

# Instalar dependências
RUN npm ci --only=production --silent

# Copiar código fonte
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção com nginx
FROM nginx:alpine

# Remover configuração padrão do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar build da aplicação
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]