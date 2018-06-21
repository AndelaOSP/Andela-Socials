FROM python:3.6

# Set mirroes to Nearest Zone for faster builds
RUN sed -i "s/http:\/\/archive./http:\/\/nz.archive./g" /etc/apt/sources.list

# Setup Debian linux
RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get -y install build-essential curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN nodejs -v && npm -v


WORKDIR /andela_social
COPY . /andela_social

# Install node modules and bundle client files
RUN npm install && npm rebuild node-sass --force && npm start

# Build wheel archive for requirement and dependencies
RUN pip install --upgrade pip wheel
RUN pip install -r requirements.txt

# Install pip packages from wheel archives
RUN pip install --no-index -f /wheelhouse -r requirements.txt

COPY docker/start-server.sh /start-server.sh
COPY docker/wait_for_database.sh /wait_for_database.sh

RUN chmod +x /start-server.sh
RUN chmod +x /wait_for_database.sh

ENTRYPOINT ["/wait_for_database.sh", "prod"]
