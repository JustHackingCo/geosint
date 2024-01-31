FROM node:20
ARG MAPS_API_KEY
ENV MAPS_API_KEY=${MAPS_API_KEY}

WORKDIR /usr/src/app

RUN npm install body-parser cookie-parser express jsdom \
    node-fetch@2 ejs ajv js-yaml chokidar
RUN npm install pm2 -g

COPY app .

COPY challenges.yml .

RUN rm -f ./public/img/chall*/*

RUN node process.js

RUN node pull_challs.js

EXPOSE 6958

CMD [ "node", "server.js" ]

