#!/usr/bin/env bash
set -e

function wait_db() {
python << END
import sys
import psycopg2

try:
  conn = psycopg2.connect(dbname="$DB_NAME", user="$DB_USER", password="$DB_PASSWORD", host="$DB_HOST")
except psycopg2.OperationalError:
    sys.exit(-1)
sys.exit(0)
END
}
until wait_db; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 1
done
>&2 echo "Postgres is up - continuing..."

/start-server.sh
