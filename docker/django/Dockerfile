FROM python:3.6.2

ENV PYTHONUNBUFFERED 1

#Update pip version
RUN pip install --upgrade pip

# Load project files to new work directory
WORKDIR /app
COPY . /app

# Requirements have to be pulled and installed here, otherwise caching won't work
COPY requirements.txt /app/

RUN pip install -r /app/requirements.txt

COPY ./docker/django/start_django.sh /start_django.sh
COPY ./docker/django/entrypoint.sh /entrypoint.sh

RUN chmod +x /start_django.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
