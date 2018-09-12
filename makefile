BACKEND_PROJECT_NAME ?= asocials-backend
PROJECT_NAME ?= andela-socials
ORG_NAME ?= bench-projects
REPO_NAME ?= andela-socials-backend

DOCKER_TEST_COMPOSE_FILE := docker/test/docker-compose.yml
DOCKER_TEST_PROJECT := "$(PROJECT_NAME)test"
DOCKER_RELEASE_COMPOSE_FILE := docker/release/docker-compose.yml
DOCKER_BACKEND_PROJECT = $(PROJECT_NAME)-backend
DOCKER_FRONTEND_PROJECT := "$(PROJECT_NAME)-frontend"
DOCKER_REGISTRY ?= gcr.io

ifeq ($(DOCKER_REGISTRY), docker.io)
	REPO_FILTER := $(ORG_NAME)/$(REPO_NAME)
else
	REPO_FILTER := $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME)[^[:space:]|\$$]*
endif


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

build_backend:
	${INFO} "Creating backend server image"
	@ echo "$(PROJECT_NAME)"
	@ docker-compose -p $(DOCKER_BACKEND_PROJECT) -f $(DOCKER_RELEASE_COMPOSE_FILE) build server
	${SUCCESS} "Images build Completed successfully"
	${INFO} "Building application artifacts.."
	@ docker-compose -p $(DOCKER_BACKEND_PROJECT) -f $(DOCKER_RELEASE_COMPOSE_FILE) run -d server
	${INFO} "Check for completeness"
	${CHECK} $(DOCKER_BACKEND_PROJECT) $(DOCKER_RELEASE_COMPOSE_FILE) server
	${SUCCESS} "Build complete"

build_frontend:
	${INFO} "Creating frontend image"
	@ docker-compose -p $(DOCKER_FRONTEND_PROJECT) -f $(DOCKER_RELEASE_COMPOSE_FILE) build web
	${SUCCESS} "Images build Completed successfully"
	@ echo " "
	${INFO} "Building frontend artifacts... "
	@ docker-compose -p $(DOCKER_FRONTEND_PROJECT) -f $(DOCKER_RELEASE_COMPOSE_FILE) run -d web
	${INFO} "Check for completeness"


test:
	${INFO} "Building required docker images for testing"
	@ echo " "
	@ docker-compose -p $(DOCKER_TEST_PROJECT) -f $(DOCKER_TEST_COMPOSE_FILE) build --pull test
	${INFO} "Running tests in docker"
	@ docker-compose -p $(DOCKER_TEST_PROJECT) -f $(DOCKER_TEST_COMPOSE_FILE) up test
	${CHECK} $(DOCKER_TEST_PROJECT) $(DOCKER_TEST_COMPOSE_FILE) test
	${INFO} "Copying test coverage reports
	@ bash -c 'if [ -d "reports" ]; then rm -Rf reports; fi'
	@ docker cp $$(docker-compose -p $(DOCKER_TEST_PROJECT) -f $(DOCKER_TEST_COMPOSE_FILE) ps -q test):/application/.coverage reports
	${INFO} "Cleaning up workspace..."
	@ docker-compose -p $(DOCKER_TEST_PROJECT) -f $(DOCKER_TEST_COMPOSE_FILE) down -v

tag:
	${INFO} "Tagging release image with tags $(TAG_ARGS)..."
	@ $(foreach tag,$(TAG_ARGS), docker tag $(IMAGE_ID) $(DOCKER_REGISTRY)/$(ORG_NAME)/$(REPO_NAME):$(tag);)
	@ docker images
	${SUCCESS} "Tagging completed successfully"

publish:
	@ echo "we are in publishing now"
	${INFO} "Publishing release image $(REPO_NAME)rel to $(DOCKER_REGISTRY)/$(REPO_NAME).."
	@ $(foreach tag,$(shell echo $(REPO_EXPR)), docker push $(tag);)
	${INFO} "Publish complete"


ifeq (tag,$(firstword $(MAKECMDGOALS)))
  TAG_ARGS := $(word 2, $(MAKECMDGOALS))
  ifeq ($(TAG_ARGS),)
    $(error You must specify a tag)
  endif
  $(eval $(TAG_ARGS):;@:)
endif

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

IMAGE_ID = $$(docker images andelasocialsbackend_server -q)

REPO_EXPR := $$(docker inspect -f '{{range .RepoTags}}{{.}} {{end}}' $(IMAGE_ID) | grep -oh "$(REPO_FILTER)" | xargs)
