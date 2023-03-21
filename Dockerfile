FROM node:16

WORKDIR /usr/src/app

# Install app dependencies
# COPY package*.json ./
RUN npm install body-parser cookie-parser express jsdom node-fetch

COPY . .

RUN rm -f ./public/img/chall*/*

RUN node pull_challs.js

EXPOSE 6958

CMD [ "node", "server.js" ]

