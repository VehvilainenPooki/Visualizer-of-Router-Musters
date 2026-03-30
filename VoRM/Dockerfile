FROM node:24

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

# Setup
COPY package* ./
RUN npm ci

COPY . .

RUN npm run build

# Clean install for production (optional - removes dev dependencies)
RUN npm ci --omit=dev

CMD ["npm", "run", "prod"]
