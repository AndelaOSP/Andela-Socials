#!/bin/bash
set -e
set -o pipefail # if any code doesn't return 0, exit the script


echo "Waiting for postgres..."
sleep 1
echo "PostgreSQL started"
python manage.py makemigrations
python manage.py migrate
if [[ $DEBUG == 'FALSE' ]]; then
  npm run start & python manage.py runserver 0.0.0.0:8000
else
   npm run start:dev & python manage.py runserver 0.0.0.0:8000
fi
