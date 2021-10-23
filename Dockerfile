FROM node:latest as builder

WORKDIR /usr/src/app
COPY ./client/package.json ./
COPY ./client/package-lock.json ./
ENV BUILD_PATH='./build/admin/'
ENV PUBLIC_URL='/admin'

RUN npm install

COPY ./client/. ./
RUN npm run build


FROM node:latest

WORKDIR /usr/src/app
COPY ./backend/package.json ./
COPY ./backend/package-lock.json ./
RUN npm install

COPY ./backend/. ./.
COPY --from=builder /usr/src/app/build/. ./build/.
ENV VERBOSE=5
CMD ["node", "index.js"]
