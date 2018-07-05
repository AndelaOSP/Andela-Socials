#!/bin/bash

set -e
set -o pipefail # if any code doesn't return 0, exit the script

echo 'Are you making use of virtualenvironment wrapper?'
echo 'Enter y or n'

read response

if [ $response == "n" ]; then
  source venv/bin/activate
else
  echo "Virtualenv Wrapper in use!"
fi

python manage.py runserver 0.0.0.0:8000 & yarn start:dev
exit 0
