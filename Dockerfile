FROM node:latest as stage1

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

FROM stage1 as build
COPY . ./
RUN #npm run build

FROM build
CMD ["node", "server.js"]

