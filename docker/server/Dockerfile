#set up python runtime environment
FROM python:3.6.5
ENV PYTHONUNBUFFERED 1

# Copy the requirements.txt to a tmp folder
COPY ./requirements.txt /requirements.txt


# Update pip version and build wheel archive
RUN pip install --upgrade pip wheel
RUN pip wheel --wheel-dir=/wheelhouse -r requirements.txt

# Install pip packages from wheel archives
RUN pip install --no-index -f /wheelhouse -r requirements.txt

# OUTPUT: Build artefacts (Wheels)
VOLUME /wheelhouse

# Go to work directory
WORKDIR /andela_social

# Copy server files to work directory
COPY . /andela_social

# Copy setup scripts to folder
COPY start-server.sh /start-server.sh
COPY wait_for_database.sh /wait_for_database.sh

# Make the setup scripts executable
RUN chmod +x /start-server.sh && \
    chmod +x /wait_for_database.sh

#set the wait for database script as the entry
ENTRYPOINT "/wait_for_database.sh" && /bin/bash
# ENTRYPOINT "/start-server.sh" && /bin/bash
