#!/bin/sh
function create_virtualenv() {
	echo 'Choose 1 to create  new virtualenv environment.'
	echo 'choose 2 to create  new virtualenv wrapper environment.'
	echo 'choose 3 to use an existing environment.'
	echo 'choose 4 to skip this step.'
	read -p 'Enter 1 , 2 , 3 or 4: ' response

	if [ $response == "1" ]; then
		pip install virtualenv
		virtualenv --python=python3 venv
	  source venv/bin/activate
	elif [ $response == "2" ]; then
    read -p "Enter preffered virtual environment name: " preffered_name
    mkvirtualenv "--python=$(which python3) $preffered_name"
	elif [ $response == "3" ]; then
    activate_virtualenv
	elif [ $response == "4" ]; then
    echo "Okay no changes have been made to your environments."
  else
    echo "Invalid choice."
    create_virtualenv
	fi
}
function switch_virtualenv(){
  echo "You are currently working in $VIRTUAL_ENV"
  read -p "Would you like to change your virtual environment ? (y / n) " change_choice

  if [[ $change_choice == "y" ]]; then
    activate_virtualenv
  elif [[ $change_choice == "n" ]]; then
    echo "Okay then your virtual env remains as $VIRTUAL_ENV"
  else
    echo "Invalid Choice."
    switch_virtualenv
  fi
}
function activate_virtualenv(){
  echo 'Would you like to use  virtualenvironment wrapper?'
  read -p 'Enter y or n: ' response

  if [[ $response == "y" ]]; then
    read -p "Enter virtualenv wrapper name: " venv_wrapper_name
    if ($(
    source "$WORKON_HOME/$venv_wrapper_name/bin/activate"
    )); then
    source "$WORKON_HOME/$venv_wrapper_name/bin/activate"
    echo "You are now in $venv_wrapper_name"
    else
      echo "$venv_wrapper_name does not exit.."
      activate_virtualenv
    fi
  elif [[ $response == "n" ]]; then
    echo "Using project based virtualenvironment."
    if [ -d "venv" ] ; then
      source venv/bin/activate
    else
      echo 'You do not have a venv folder!'
      read -p "Would you like to create one ? (y or n) " venv_creation
      if [[ $venv_creation == "y" ]]; then
        create_virtualenv
      elif [[ $venv_creation == "n" ]]; then
        echo "All packages will be installed in global environment."
      else
        echo "Invalid choice."
        activate_virtualenv
      fi
    fi
  else
    echo "Invalid choice!"
    activate_virtualenv
  fi
}
function setup_virtualenv(){
  if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "You do not have a virtual environment setup."
    read -p "Would you like to activate one ? (y or n) " setup_choice
    if [[ $setup_choice == "y" ]]; then
      activate_virtualenv
    elif [[ $setup_choice == "n" ]]; then
      echo 'You have opted not to use a virtual environment!'
    else
      echo ' That was an invalid choice.'
      activate_virtualenv
    fi
  else
    switch_virtualenv
  fi
}

function load_env_vars(){
  echo "Loading environment variables."
  set -a
  [ -f .env ] && . .env
  set +a
}
