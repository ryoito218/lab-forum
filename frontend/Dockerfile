# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

FROM node:18-alpine
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV production
EXPOSE 3000
CMD ["npm", "start"]