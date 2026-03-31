FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build
RUN ls -la dist/ && ls -la dist/main.js

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main 2>&1"]
