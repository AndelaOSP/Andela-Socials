# load and export envfile
include .env
export $(shell sed 's/=.*//' .env)

ENVIRONMENT_VARIABLE = ${ENVIRONMENT}

ifeq ($(ENVIRONMENT_VARIABLE),production)
	DOCKER_COMPOSE_FILE=./docker/prod/docker-compose.yml
else 
	DOCKER_COMPOSE_FILE=./docker/dev/docker-compose-dev.yml
endif


# Build the required images and start the container
build:
	@ echo "Building the required docker images"
	@ docker-compose -f $(DOCKER_COMPOSE_FILE) build
	@ echo "Build Completed successfully"

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
