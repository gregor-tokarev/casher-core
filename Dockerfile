FROM node:16-slim as builder
WORKDIR /app/
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs:16
WORKDIR /root/
COPY --from=builder /app/dist ./dist/
COPY --from=builder /app/node_modules ./node_modules/
ENV NODE_ENV=production
CMD ["./dist/src/main.js"]
