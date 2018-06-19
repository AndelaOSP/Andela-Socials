FROM node:8

WORKDIR /apps/

# Requirements have to be pulled and installed here, otherwise caching won't work
COPY package.json /apps/


RUN npm install --save

# Load project files to new work directory
COPY . /apps

COPY ./docker/client/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
