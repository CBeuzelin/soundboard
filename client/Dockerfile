FROM node:14.16.1-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY ../client2 .
RUN npm run build --prod

FROM nginx:1.19.10-alpine
COPY --from=builder /app/dist/client /usr/share/nginx/html
