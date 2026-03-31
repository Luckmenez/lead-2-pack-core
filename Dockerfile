FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
