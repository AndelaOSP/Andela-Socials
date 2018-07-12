#!/bin/bash

set -e
set -o pipefail # if any code doesn't return 0, exit the script

echo 'Are you making use of virtualenvironment wrapper?'
echo 'Enter y or n'

read response

if [[ $response == "n" ]]; then
  if [ -d "venv" ] ; then
    source venv/bin/activate
  else
    echo -e '\n\n\033[31mYou do not have a venv folder!\033[0m\n'
  fi
else
  echo "Virtualenv Wrapper in use!"
fi


function start_client() {
  cd client
  yarn start:dev &
}

function start_server() {
  cd ..
  python server/manage.py runserver 0.0.0.0:8000
}

start_client && start_server

exit 0
