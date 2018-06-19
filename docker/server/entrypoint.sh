#!/bin/bash

set -e

function check_db_connect() {
python << END
import sys
import psycopg2
try:
  psycopg2.connect(dbname="$DB_NAME", user="$DB_USER", password="$DB_PASS", host="$DB_HOST")
except psycopg2.OperationalError:
    sys.exit(-1)
sys.exit(0)
END
}
until check_db_connect; do
  >&2 echo "database connection failed .....Reconnecting"
  sleep 0.5
done
>&2 echo "database is connected"
python manage.py makemigrations
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
