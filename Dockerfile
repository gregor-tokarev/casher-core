FROM node:16-slim as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN ./node_modules/.bin/prisma generate

FROM gcr.io/distroless/nodejs:16
COPY --from=builder /app/dist /app/dist/
COPY --from=builder /app/node_modules /app/node_modules/
COPY --from=builder /app/prisma /app/prisma/
WORKDIR /app
CMD ["./dist/main.js"]
