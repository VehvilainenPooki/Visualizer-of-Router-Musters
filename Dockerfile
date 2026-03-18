FROM node:24

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

# Setup
COPY package* ./
RUN npm ci --omit=dev
COPY . .

RUN npm run build

CMD ["npm", "run", "prod"]
