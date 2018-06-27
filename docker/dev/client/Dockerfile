FROM node:8.4.0

# Set andela_social as working directory
WORKDIR /andela_social

# Copy client and dependencies to working directory
COPY client /andela_social/client
COPY package.json package.json
COPY webpack.config.dev.js webpack.config.dev.js

# Install the dependencies from package json
RUN npm install

# Copy start-client.sh scripts
COPY docker/dev/client/start-client.sh  /start-client.sh

# Make the start-client script executable
RUN chmod +x /start-client.sh

# Set the start script as the entrypoint
ENTRYPOINT "/start-client.sh" && /bin/bash
