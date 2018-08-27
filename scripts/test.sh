#!/bin/bash

set -e
set -o pipefail # if any code doesn't return 0, exit the script
set -x # print each step of your code to the terminal

function docker_test() {
  python server/manage.py test server/api/tests/ server/graphql_schemas/tests/

}
