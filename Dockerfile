FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .

# Build React assets if a build step exists
RUN npm run build --if-present

EXPOSE 3000

CMD ["node", "index.js"]
