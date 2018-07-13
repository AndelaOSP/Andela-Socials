PROJECT_NAME ?= andela-socials
ORG_NAME ?= bench-projects
REPO_NAME ?= andela-socials

DOCKER_TEST_COMPOSE_FILE := docker/test/docker-compose.yml
DOCKER_TEST_PROJECT = $(PROJECT_NAME)test


# Select docker-compose file based on environment
ifeq ($(env),production)
	DOCKER_COMPOSE_FILE=./docker/prod/docker-compose.yml
else
	DOCKER_COMPOSE_FILE=./docker/dev/docker-compose.yml
endif

# Build the required images
build:
	${INFO} "Building the required docker images"
	@ docker-compose -f $(DOCKER_COMPOSE_FILE) build
	${INFO} "Build Completed successfully"
	@ echo " "


# Start all the containers
start:
	@ echo "Starting andela_socials docker containers"
	@ echo " "
	@ docker-compose -f $(DOCKER_COMPOSE_FILE) up

# stop all the containers
stop:
	@ echo "Stopping docker containers"
	@ echo " "
	@ docker-compose -f $(DOCKER_COMPOSE_FILE) down -v
	@ echo "All containers stopped successfully"

# colors
GREEN 	:= $(shell tput -Txterm setaf 2)
YELLOW 	:= $(shell tput -Txterm setaf 3)
WHITE	:= $(shell tput -Txterm setaf 7)
NC 	:= "\e[0m"
RESET 	:= $(shell tput -Txterm sgr0)

# shell functions
INFO 	:= @bash -c 'printf $(YELLOW); echo "===> $$1"; printf $(NC)' SOME_VALUE
SUCCESS := @bash -c 'printf $(GREEN); echo "===> $$1"; printf $(NC)' SOME_VALUE

INSPECT := $$(docker-compose -p $$1 -f $$2 ps -q $$3 | xargs -I ARGS docker inspect -f "{{ .State.ExitCode }}" ARGS)

CHECK := @bash -c 'if [[ $(INSPECT) -ne 0 ]]; then exit $(INSPECT); fi' VALUE

IMAGE_ID = $$(docker images $(REPO_NAME)rel  -q)
# run test
server test:
	@ coverage run server/manage.py test server/api/tests/ server/graphql_schemas/tests/


