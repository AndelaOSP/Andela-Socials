#!/bin/bash
set -e
set -o pipefail # if any code doesn't return 0, exit the script

function postgres_ready(){
python << END
import sys
import psycopg2
try:
    conn = psycopg2.connect(dbname="postgres", user="postgres", password="postgres", host="postgres")
except psycopg2.OperationalError:
    sys.exit(-1)
sys.exit(0)
END
}

until postgres_ready; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done

>&2 echo "Postgres is up - continuing..."

function setup_server() {
	python manage.py makemigrations
	python manage.py migrate
}

setup_server
python manage.py runserver 0.0.0.0:8000
