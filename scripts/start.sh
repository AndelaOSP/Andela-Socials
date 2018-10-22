#!/bin/bash

set -e
set -o pipefail # if any code doesn't return 0, exit the script

function start_client() {
  cd client
  yarn start:dev &
}

function start_server() {
  cd ..
  python server/manage.py runserver 0.0.0.0:8000
}

source scripts/configureVirtualEnv.sh
load_env_vars
setup_virtualenv

chmod u+x scripts/checkEnv.sh
scripts/checkEnv.sh
start_client && start_server
exit 0
