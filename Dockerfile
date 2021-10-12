FROM node:latest as build

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN npm run build

FROM build

CMD ["node", "scripts/start.js"]

