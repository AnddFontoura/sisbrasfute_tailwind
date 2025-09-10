FROM node:22-alpine

# Instala dependências necessárias para polling funcionar (fs events)
RUN apk add --no-cache bash

WORKDIR /app

# Copia os arquivos de dependência e instala
COPY package*.json ./
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta padrão do Vite/Ionic
EXPOSE 8104

# Comando de inicialização com host 0.0.0.0 e porta definida
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8104"]