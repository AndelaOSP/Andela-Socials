#set up python runtime environment
FROM python:3.6.2
ENV PYTHONUNBUFFERED 1

# Copy the requirements.txt to a tmp folder
COPY ./requirements.txt /requirements.txt

# Update pip version and install dependencies from requirements.txt
RUN pip install --upgrade pip \
 && pip install -r /requirements.txt

# Go to work directory
WORKDIR /andela_social

# Copy setup scripts to folder
COPY docker/start-server.sh /start-server.sh
COPY docker/wait_for_database.sh /wait_for_database.sh

# Make the setup scripts executable
RUN chmod +x /start-server.sh \
 && chmod +x /wait_for_database.sh

#set the wait for database script as the entry
ENTRYPOINT "/wait_for_database.sh" && /bin/bash
