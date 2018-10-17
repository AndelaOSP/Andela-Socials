FROM node:carbon

LABEL MAINTAINER="Natalie Elizabeth <natalie.elizabeth@andela.com>"
LABEL application="asocialsfrontend"

ENV TERM=xterm-256color
ENV NODE_PATH /usr/local/lib/node_modules/

RUN npm install -g express@4.16.3 dotenv@4.0.0

COPY client/dist /app/dist
COPY client/server.js /app

WORKDIR /app

EXPOSE 9000

