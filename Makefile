docker-dev-build:
	docker-compose -f docker-compose-dev.yml build

docker-dev-up:
	docker-compose -f docker-compose-dev.yml up

docker-dev-up-ssh:
	docker-compose -f docker-compose-dev.yml up && /bin/bash

docker-dev-build-ssh:
	docker-compose -f docker-compose-dev.yml up --build && /bin/bash

docker-dev-detach-ssh:
	docker-compose -f docker-compose-dev.yml up -d && /bin/bash

docker-dev-down:
	docker-compose -f docker-compose-dev.yml down

docker-dev-detach:
	docker-compose -f docker-compose-dev.yml up -d

docker-prod-build:
	docker-compose -f docker-compose-prod.yml build

docker-prod-up:
	docker-compose -f docker-compose-prod.yml up

docker-prod-up-ssh:
	docker-compose -f docker-compose-prod.yml up && /bin/bash

docker-prod-build-ssh:
	docker-compose -f docker-compose-prod.yml up --build && /bin/bash

docker-prod-detach-ssh:
	docker-compose -f docker-compose-prod.yml up -d && /bin/bash

docker-prod-down:
	docker-compose -f docker-compose-prod.yml down

docker-prod-detach:
	docker-compose -f docker-compose-prod.yml up -d

docker-build-client:
	docker-compose -f docker-compose-dev.yml up --build web_client

docker-build-server:
	docker-compose -f docker-compose-dev.yml up --build web_server

docker-run-server:
	docker-compose -f docker-compose-dev.yml up web_server

docker-run-client:
	docker-compose -f docker-compose-dev.yml up web_client
