FROM python:3.6.5

# Set mirroes to Nearest Zone for faster builds
RUN sed -i "s/http:\/\/archive./http:\/\/nz.archive./g" /etc/apt/sources.list

# Setup Debian linux
RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get -y install build-essential curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN nodejs -v && npm -v


WORKDIR /andela_social
COPY server /andela_social/server
COPY client /andela_social/client

# Install node modules and bundle client files
WORKDIR /andela_social/client
RUN npm install && npm start

# Build wheel archive for requirement and dependencies
WORKDIR /andela_social/server
RUN pip install --upgrade pip wheel
RUN pip wheel --wheel-dir=/wheelhouse -r requirements.txt

# Install pip packages from wheel archives
RUN pip install --no-index -f /wheelhouse -r requirements.txt

# OUTPUT: Build artefacts (Wheels) and staticfiles are output here
VOLUME /wheelhouse

COPY server/start-server.sh /start-server.sh
COPY server/wait_for_database.sh /wait_for_database.sh

RUN chmod +x /start-server.sh
RUN chmod +x /wait_for_database.sh

ENTRYPOINT ["/wait_for_database.sh"]
