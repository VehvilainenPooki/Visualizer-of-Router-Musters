FROM node:24

ENV TZ="Europe/Helsinki"

WORKDIR /usr/src/app

# Setup
COPY package* ./
RUN npm config set cache /tmp --global
RUN npm ci

CMD ["npm", "run", "dev"]
