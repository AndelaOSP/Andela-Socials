#!/bin/bash

RED='\033[0;31m'
NC='\033[0m'

# function to remove empty lines
remove_empty_lines() {
    sed '/^$/d' $1 > $1.temp 
}

# remove commented lines
remove_comments () {
    sed '/^[[:space:]]*#/d' $1 > $1.temp 
    mv $1.temp $1
}

# function to prepare file.
prep_file() {
    remove_empty_lines $1
    remove_comments $1.temp
}

# create new .env file and add to .gitignore.
create_new_env() {
    sed '/^[[:space:]]*#/d' .env.sample > .env
    echo ".env" >> .gitignore
}

# use awk inbuilt command to compare variables.
compare() {
    errors=$(awk 'BEGIN { FS = "=" }
                  NR == FNR {
                    variable[$1] = $2
                  }
                  NR != FNR { 
                    if (length(variable[$1]) == 0) 
                      {
                        n += 1
                        error[$1] = $1 
                      }
                  } 
                  END {
                    if (n > 0) {
                        for ( var in error ) print var } 
                  }' .env.temp .env.sample.temp)

    echo $errors
}

cleanup() {
    rm .env.temp .env.sample.temp
}

# check if the .env file exists
echo "Checking for environment variables..."

if [[ -f ".env" ]]; then
    prep_file ".env"
    prep_file ".env.sample"
    errors=$(compare)
    cleanup
    if [ ! -z "$errors" ]; then
        echo
        echo -e "${RED}You have missing environment variables${NC}"
        error_array=($errors)
        for var in ${error_array[@]};
        do
          echo $var;
        done
        echo
        exit 1
    else
        echo "Environment variables check passed..."
        echo
    fi
else
    echo
    echo -e "${RED}You don't have an .env file${NC}"
    create_new_env
    echo "Your .env file was created automatically"
    echo -e "${RED}Please fill in the missing values in your new .env file before starting the app${NC}"
    echo
    exit 1
fi


