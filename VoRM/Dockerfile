FROM node:24 AS dependencies
WORKDIR /usr/src/app
COPY package* ./
RUN npm ci

FROM dependencies AS builder
COPY . .
RUN npm run build

FROM node:24 AS production

WORKDIR /usr/src/app
COPY package* ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/build ./build
CMD ["npm", "run", "prod"]
