# Set up python runtime environment
FROM python:3.6.5

LABEL MAINTAINER="Natalie Elizabeth <natalie.elizabeth@andela.com>"
LABEL application="asocialsbackend"

ENV TERM=xterm-256color

# Set mirrors to Nearest Zone for faster builds
RUN sed -i "s/http:\/\/archive./http:\/\/nz.archive./g" /etc/apt/sources.list

# Create working directory
WORKDIR /app

# Copy requirements.txt to working directory
COPY server/requirements.txt /app/requirements.txt

# Update pip version and build wheel archive
RUN pip install pip==10.0.0 wheel==0.29.0

# Install pip packages from online
RUN pip install -r requirements.txt

# Copy server files to work directory
COPY server /app

