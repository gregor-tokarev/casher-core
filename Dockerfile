FROM node:16-slim as builder
WORKDIR /app/
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-slim
WORKDIR /root/
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/
CMD ["node", "./dist/main.js"]
