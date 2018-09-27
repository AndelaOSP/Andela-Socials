FROM node:carbon

LABEL MAINTAINER="Natalie Elizabeth <natalie.elizabeth@andela.com>"
LABEL application="asocialsfrontend"

ENV TERM=xterm-256color

RUN npm install -g serve@6.5.6

WORKDIR /app

COPY client/dist /app

EXPOSE 9000
