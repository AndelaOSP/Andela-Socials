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
	@ echo " "
	@ echo "Starting local development server and database"
	@ docker-compose -f $(DOCKER_COMPOSE_FILE) up

# Start all the containers
start:
	@ echo "Starting andela_socials docker containers"
	@ echo " "
	@ docker-compose -f $(DOCKER_COMPOSE_FILE) up 

# stop all the containers
stop:
	@ echo "Stop development docker containers"
	@ docker-compose -f $(DOCKER_COMPOSE_FILE) down -v
	@ echo "All containers stopped successfully"
