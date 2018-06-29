#!/bin/bash

set -e
set -o pipefail # if any code doesn't return 0, exit the script
set -x # print each step of your code to the terminal


function venv() {
	echo 'Do you want me to install and activate a virtualenvironment?'
	echo 'Enter y or n'

	read response

	if [ $response == "y" ]; then
		pip install virtualenv
		virtualenv --python=python3 venv
	  source venv/bin/activate
	else
		echo 'I take it you have a virtual environment activated'
	fi
}

function setup_server() {
	pip install -r requirements.txt
	python manage.py makemigrations
	python manage.py migrate
}

function setup_client() {
	yarn -v
	export status=$?
	echo $status

	if (($status!=0)); then
		echo 'I will be installing yarn for you now'
		npm install -g yarn
	fi

	yarn install
}

venv
setup_server
setup_client

yarn start:dev & python manage.py runserver 0.0.0.0:8000
exit 0
