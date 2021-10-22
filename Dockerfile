FROM node:latest

WORKDIR /usr/src/app
COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . ./
RUN rm -rf build
RUN npm run build

ENV VERBOSE=5
CMD ["node", "server.js"]

