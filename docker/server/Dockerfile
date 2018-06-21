FROM python:3.6.2

ENV PYTHONUNBUFFERED 1

WORKDIR /apps/

#Update pip version
RUN pip install --upgrade pip

# Requirements have to be pulled and installed here, otherwise caching won't work
COPY requirements.txt /apps/

RUN pip install -r /apps/requirements.txt

# Load project files to new work directory
COPY . /apps

COPY ./docker/server/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
