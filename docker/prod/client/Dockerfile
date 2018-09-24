FROM node:8.4.0

# install and cache dependencies in /tmp directory.
# doing it this way also installs any newly added dependencies.
ADD package.json /tmp/package.json
RUN cd /tmp && npm install

# Copy client and dependencies to working directory
COPY . /andela_social
RUN cp -a /tmp/node_modules /andela_social

# Set andela_social as working directory
WORKDIR /andela_social

# Copy start-client.sh scripts
COPY start-client.sh  /start-client.sh

# Make the start-client script executable
RUN chmod +x /start-client.sh

# Set the start script as the entrypoint
ENTRYPOINT "/start-client.sh" && /bin/bash
