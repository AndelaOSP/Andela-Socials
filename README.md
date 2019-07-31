# ANDELA SOCIALS

[![CircleCI](https://circleci.com/gh/AndelaOSP/Andela-Socials.svg?style=shield&circle-token=f63d8e7f6a1e65078cd1988847cbb29e6382bba1)](https://circleci.com/gh/AndelaOSP/Andela-Socials) [![Maintainability](https://api.codeclimate.com/v1/badges/0da1c9a1fec63a855e21/maintainability)](https://codeclimate.com/github/AndelaOSP/Andela-Socials/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/0da1c9a1fec63a855e21/test_coverage)](https://codeclimate.com/github/AndelaOSP/Andela-Socials/test_coverage)

Andela Social was born from the desire to keep Andelans sociable within the organization.
It is a platform for events aggregation, to get Andelans from different departments, cohorts and centers to mingle and have fun together over a cup of coffee, a game of soccer, at a swimming pool or at a friends dinner party.
With this platform, events organized within the fellowship are properly tracked and managed for all to see and for all to relate with irrespective of their centers.
This will improve socialization among Andelans both inside and outside the organisation.

## PROJECT REQUIREMENTS
- Node.js 8.4.0
- PostgreSQL 10.4
- virtualenv 16.0.0
- Django 1.11.5
- python 3.6
- graphene-django 2.1
- psycopg2 2.7.3
- Docker

## PROJECT SETUP

### DB CREATION (Ignore if you have the database created already)

Use the createdb.sh script to setup your database for the application.

Your `.env` variables should contain the values listed below, you can reference the file to see how it is used.

```sh
   DB_USER=a_socials
   DB_PASS=a_socials
   DB_PORT=5432
   DB_NAME=a_socials
```

### Node Installation

It is advisable to use node version 8 for this project. Check your node version using `node --version`. To help manage the node versions you can install and run on your system you can use nvm. Follow this [guide](https://gist.github.com/d2s/372b5943bce17b964a79#install-nvm-for-managing-nodejs-versions) to help install nvm.

You would then run `nvm install v8.0` to install node version 8 and `nvm use v8` to use that specific node version, but this will only work with that running bash session. To make version 8 the default node version for your system you would use `nvm alias default 8.0`

Clone from git using

```sh
git clone git@github.com:AndelaOSP/Andela-Socials.git
```

Create a `.env` file in the root directory. Use the content of the `.env.sample` and edit with the appropriate details.

Reach out to the Team Lead for the appropriate `.env` details when in doubt. :)


### SETUP WITH VIRTUAL ENVIRONMENT

Navigate into the root directory of the project and run the script `setup.sh` with the command:

```sh
scripts/setup.sh
```

This scripts automatically sets up the project.

### STARTING THE APP

Subsequently, if you need to START the application after the initial setup has completed you can run the command:

```sh
scripts/start.sh

```

If you need to START the production side of the application, you can run the command:

```sh
scripts/startProd.sh

```

### STOPPING THE APP

To STOP the application run the command:

```sh
scripts/stop.sh
```

### TEST(Virtual Environment Setup)

To run server side test run the command below:

```sh
tox
```

Or run the command below:

```sh
make server test
```

To run cypress test for the client side, navigate to the client folder

```sh
cd client
```

For e2e tests, ensure you have `cypress.json`, start the server and run:

```sh
yarn test:visual
```

For unit tests, run:

```sh
yarn test
```

### SETTING UP WITH DOCKER

Before booting up the environment (`make build`) ensure that you have [docker](https://docs.docker.com/) **installed** and **running** on your machine.
If you are using mac this [install](https://docs.docker.com/docker-for-mac/install/) should get you started.

The resources will be configured via docker-compose services. This will ensure that the application will be developed and deployed under similar environments.

To setup development environment, create a `dev.env` file in the `docker/dev` directory and populate it with environment variables using `.env.sample` file in the root directory as a model.

To start the build, run:

```sh
make build
```

After the build is complete, spin up the docker containers with:

```bash
make start
```

Then you can access the client application; served by webpack-dev-server at `http://localhost:9000`, and the backend application; served by the django development server at `http://localhost:8000`

To stop the application, you can pull down the containers with:

```bash
make stop
```

To setup production environment, create a `prod.env` file in the `docker/prod` directory and populate it with environment variables using `.env.sample` file in the root directory as a model.
To run any make command successfully for the production application, ensure the variable `env` is set to `production` in the makefile in the root directory.

To achieve this;
If on a bash terminal, you can do `export env=production` before running any make command.
Alternatively, you can set the variable as part of the make command before execution.

```bash
make build env=production
make start env=production
make stop env=production
```

For the production application, [Nginx](https://www.nginx.com/resources/glossary/nginx/) serves as an HTTP and reverse proxy server. It serves static assets that have been collected into the staticfiles directory and routes dynamic requests to the django application running on gunicorn server. After a succesful `make start` command, Nginx listens for requests on port 80. You can go to http://localhost to view application.

Please note that you only need to build the dockerized application once. Subsequently, run `make start` to start the application.

### TEST(Docker Setup)

To run tests, in the terminal, run the command `docker ps` to view the available docker containers. Use the command `docker exec -it [dev_server_id] bash`
To run the server side tests, execute the command `coverage run manage.py test -v 2 --snapshot-update api/tests/ graphql_schemas/tests/` in the bash terminal.

To run the client side tests, follow the above steps and replace `docker exec -it [dev_server_id] bash` with `docker exec -it [dev_client_id] bash`. Execute the command `yarn test` in that container's terminal.

You can click `ctrl+d` to exit the bash terminal.
### Ngrok

This service only runs when using docker in production mode locally **NB**: **Configured to use frontend only**.
```
Reference:
    https://ngrok.com/product
    https://ngrok.com/docs
```
Once you have docker running locally for prod, navigate to Ngrok dashboard
```
http://localhost:4040/status
```
to get the public URL. e.g. `https://05473cbc.ngrok.io`

### UI MOCK

The UI mock for the project is available [here](https://www.figma.com/file/Yn3JRZ3YLBVSg4o8L9dhIAv2/Andela_Socials)

### DATABASE SEEDING

#### Static Dummy Data

Before you seed data into your new database, ensure you run `python server/manage.py migrate`.
You can now seed the dummy data into your database using the command `server/manage.py loaddata server/api/fixtures/initial.json` when that is done you have access to dummy categories, events and dummy users.
You need to log in with an andela email to have access to this dummies.

#### Dynamic Dummy Data

In order to seed dynamic data like Events that show up in the current day and futuristic dates, ensure that you have already seeded static dummy data as described above. The static dummy data is a dependency for the dynamic dummy data. To load in dynamic dummy data at anytime, run `python server/manage.py load_dynamic_fixtures`. To load a specific fixture, run `python server/manage.py load_dynamic_fixtures api <filename_of_fixture>`.

### DEFAULT ADMIN

Navigate to django's default admin page `/admin` using the credentials below to gain access.

USERNAME: admin
PASSWORD: adminpassword

### DEPLOYMENT TO GCP

To make any deployments to GCP, the application has to go through the workflow stipulated on the Circleci `config.yml` file. The workflow has two parts, test and deploy of which, deploy only works with the `Master` and `Release` branches. Considering that the whole deployment process is really long, there steps are under the `scripts/deployBackend.sh` file.

### BUILDING, TAGGING AND RELEASE

To test whether the backend or frontend are working correctly within a docker container, run `make build_backend` or `make build_frontend` which will create images for both. If they exit successfully, you can then move to the next stage which will be to tag and publish which are done using the `make tag` and `make publish` commands respectively.

## CONTRIBUTORS

View the list of [contributors](https://github.com/AndelaOSP/Andela-Socials/contributors) who participate in this project.
