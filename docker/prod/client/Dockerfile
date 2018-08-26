FROM node:carbon

# Set andela_social as working directory
WORKDIR /andela_social

# Copy client and dependencies to working directory
COPY . /andela_social

# Install the dependencies from package json
RUN npm install && npm start
