FROM node:carbon

COPY . /app

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY ./docker/node/start_node.sh /start_node.sh

RUN chmod +x /start_node.sh

ENTRYPOINT ["/start_node.sh"]
