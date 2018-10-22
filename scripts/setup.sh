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
	if psql -lqtA | cut -d\| -f1 | grep -qxF "a_socials"; then
		echo "You already have a database named a_socials."
	else
		echo "You need to create a database."
		echo -e "\n\n\033[31mPlease provide a single argument for the username/dbname\033[0m\n"
		read dbname
		DBNAME=$dbname
		echo -e "\n\n\033[31mPlease provide just one argument as the username\033[0m\n"
		read dbuser
		USERNAME_DBNAME=$dbuser
		if ! psql -lqtA | grep  $USERNAME_DBNAME; then
			createuser -P -s -e $DBNAME
		fi
		createdb --username=$USERNAME_DBNAME --owner=$USERNAME_DBNAME -W $DBNAME
	fi
}

source scripts/configureVirtualEnv.sh
load_env_vars
create_virtualenv

create_db
setup_server
setup_client
exit 0
