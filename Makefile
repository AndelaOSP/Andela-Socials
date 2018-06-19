docker-build:
	docker-compose build
docker-up:
	docker-compose up
docker-run-ssh:
	docker-compose up && /bin/bash
docker-build-ssh:
	docker-compose up --build && /bin/bash
docker-detach-ssh:
	docker-compose up -d && /bin/bash
docker-down:
	docker-compose down
docker-detach:
	docker-compose up -d



