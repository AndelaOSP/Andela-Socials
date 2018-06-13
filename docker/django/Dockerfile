FROM python:3.6.2

ENV PYTHONUNBUFFERED 1

# Setup Debian linux
RUN export DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get -y install build-essential curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs
RUN nodejs -v && npm -v

WORKDIR /app/

#Update pip version
RUN pip install --upgrade pip

# Requirements have to be pulled and installed here, otherwise caching won't work
COPY requirements.txt /app/
COPY package.json /app/

RUN pip install -r /app/requirements.txt && npm install

# Load project files to new work directory
COPY . /app

COPY ./docker/django/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
