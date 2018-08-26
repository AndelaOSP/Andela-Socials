FROM python:3.6

LABEL MAINTAINER="Natalie Elizabeth <natalie.elizabeth@andela.com>"
LABEL application="andelasocials"

# ARG SECRET_KEY='secret key'
# ARG DJANGO_SETTINGS_MODULE='hofbackend.settings.test'

# Prevent dpkg errors
# ENV TERM=xterm-256color \
#     SECRET_KEY=${SECRET_KEY} \
#     DJANGO_SETTINGS_MODULE=${DJANGO_SETTINGS_MODULE}

# Set mirrors to Nearest Zone for faster builds
RUN sed -i "s/http:\/\/archive./http:\/\/nz.archive./g" /etc/apt/sources.list


RUN pip install --upgrade pip wheel

# PIP environment variables (NOTE: must be set after installing wheel)
# ENV WHEELHOUSE=/wheelhouse PIP_WHEEL_DIR=/wheelhouse PIP_FIND_LINKS=/wheelhouse XDG_CACHE_HOME=/cache

# OUTPUT: Build artefacts (Wheels) are output here
VOLUME /wheelhouse

VOLUME /build

VOLUME /reports

WORKDIR /application

# Install application dev requirements
COPY src/requirements-dev.txt requirements-dev.txt
COPY src/setup.py setup.py
COPY src/manage.py manage.py

# Download requirements to the build cache
RUN pip download -d /build -r requirements-dev.txt --no-input && \
    pip install --no-index -f /build -r requirements-dev.txt --no-input

ADD src /application
ADD .git /application/.git/
RUN python setup.py bdist_wheel -d ${WHEELHOUSE}

COPY scripts/test.sh /usr/local/bin/test.sh
RUN chmod +x /usr/local/bin/test.sh

# Set defaults for entrypoint and command string
ENTRYPOINT ["test.sh"]
