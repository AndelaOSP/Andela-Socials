FROM node:carbon

LABEL MAINTAINER="Natalie Elizabeth <natalie.elizabeth@andela.com>"
LABEL application="asocialsfrontend"

ENV TERM=xterm-256color
ENV NODE_PATH /usr/local/lib/node_modules/

RUN npm install -g express@4.16.3 dotenv@4.0.0

COPY client/v1/dist /app/dist
COPY client/v1/server.js /app

WORKDIR /app

EXPOSE 9000

