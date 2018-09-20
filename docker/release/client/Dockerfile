FROM node:carbon

LABEL MAINTAINER="Natalie Elizabeth <natalie.elizabeth@andela.com>"
LABEL application="asocialsfrontend"

ENV TERM=xterm-256color
ENV CI=true

RUN npm install -g serve@6.5.6

WORKDIR /app

COPY client /app

RUN rm -rf node-modules

RUN npm install

RUN npm rebuild node-sass --force
