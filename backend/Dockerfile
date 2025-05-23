FROM node:20

# Define diretório de trabalho
WORKDIR /app

# Copia apenas package.json + lock para instalar dependências primeiro (cache)
COPY package*.json ./

# Instala todas as dependências (inclusive as de dev como ts-node)
RUN npm install

# Copia o restante do projeto
COPY . .

# Comando padrão para rodar com ts-node
CMD ["npx", "ts-node", "src/main.ts"]