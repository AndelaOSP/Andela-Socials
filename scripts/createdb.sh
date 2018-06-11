#!/bin/bash
# reference: http://www.yolinux.com/TUTORIALS/LinuxTutorialPostgreSQL.html

read -d '' HELP_STRING <<'EOF'
  "Script used to create DB_USER, DB_PASS and DB_NAME for your app."
  Usage:
    ./createdb.sh <dbname/username>

  Application:
    The argument passed to the script creates a user
    with the argument as the user and also as the database name

    Your .env variable should look like this

    DB_USER=a_socials
    DB_PASS=a_socials
    DB_PORT=5432
    DB_NAME=a_socials

    where a_socials is the argument passed to the shell script.

    example:
      ./createdb.sh a_socials


    Shell Displays this:
      ./createdb.sh a_socials
      Enter password for new role: (not displayed) a_socials
      Enter it again: (not displayed) a_socials
      CREATE ROLE a_socials PASSWORD 'md523979cec4152758c460ce352458f8de9' SUPERUSER CREATEDB CREATEROLE INHERIT LOGIN;
      Password: (not displayed) a_socials
EOF


if [[ $# -eq 0 ]]; then
    echo 'Please provide a single argument for the username/dbname'
    echo "$HELP_STRING"
elif
    [ "$#" -ne 1 ]; then
    echo 'Please provide just one argument as the username'
    echo "$HELP_STRING"
else
    USERNAME_DBNAME=$1
    createuser -P -s -e $USERNAME_DBNAME
    createdb --username=$USERNAME_DBNAME --owner=$USERNAME_DBNAME -W $USERNAME_DBNAME
fi