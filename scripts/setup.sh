#!/bin/bash

set -e
set -o pipefail # if any code doesn't return 0, exit the script


function setup_server() {
	pip install -r server/requirements.txt
	python server/manage.py makemigrations
	python server/manage.py migrate
	python server/manage.py loaddata server/api/fixtures/initial.json
}

function setup_client() {
	cd client

	yarn -v
	export status=$?
	echo $status

	if [[ $status != 0 ]]; then
		echo 'I will be installing yarn for you now'
		npm install -g yarn
	fi

	if ! [[ -d "node_modules" ]]; then
		# run yarn install to install dependencies
		yarn install
	fi
}

function create_db(){
    echo "Creating user $DB_USER"
    PGPASSWORD=postgres dropuser -U postgres -w -e --if-exists $DB_USER
    PGPASSWORD=postgres psql -U postgres -w -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD' CREATEDB;"
	echo "Successfully created user $DB_USER"
    if PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -w -lqtA | cut -d\| -f1 | grep -qxF $DB_NAME; then
		echo "You already have a database named $DB_NAME."
	else
		echo -e "\n\n\033[31mCreating database $DB_NAME for the user $DB_USER\033[0m\n"
		PGPASSWORD=$DB_PASSWORD createdb -U $DB_USER -O $DB_USER -w $DB_NAME
        echo -e "successfully created $DB_NAME"
	fi
}

source scripts/configureVirtualEnv.sh
load_env_vars
create_virtualenv

create_db
setup_server
setup_client
echo "local environment setup successfully, run scripts/start.sh to start the application locally"
exit 0
