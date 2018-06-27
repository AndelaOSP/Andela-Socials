#!/bin/bash
set -e
set -o pipefail # if any code doesn't return 0, exit the script


function setup_server() {
  python manage.py makemigrations
  python manage.py migrate
  if [ $ENVIRONMENT = "production" ]; then
    python manage.py collectstatic --noinput
  fi
}

function start_server() {
  if [ $ENVIRONMENT = "production" ]; then
    echo Starting Gunicorn server..
    exec gunicorn a_socials.wsgi:application \
      --bind 0.0.0.0:8000 \
      --workers 3
  else
    echo Starting Django development server..
    python manage.py runserver 0.0.0.0:8000
  fi
}

setup_server
start_server

exit 0
