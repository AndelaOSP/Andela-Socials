## ANDELA SOCIALS

Andela Social was born out of the desire to keep Andelans very sociable within the organization.
It is a platform for events aggregation, to get Andelans from different departments to mingle and have fun together over a cup of coffee, a game of soccer, at a swimming pool or at a friends dinner party.
It is a platform to get events organized within the fellowship properly tracked and managed for all to see and for all to relate with irrespective of their centers.
These will improve socialization between Andelans inside and outside the company.

## SYSTEM DEPENDENCIES

This app's functionality depends on multiple python, npm and graphql packages listed below

### FRONTEND
  *  **[React](https://reactjs.org/)** - A JavaScript library for building user interfaces
  *  **[Redux](https://redux.js.org/)** - A predictable state container for JavaScript apps.
  *  **[GraphQl](https://graphql.org/)** - A query language for APIs and a runtime for fulfilling those queries with your existing data

### BACKEND
  *  **[Django](https://www.djangoproject.com/)** - A high-level Python Web framework that encourages rapid development and clean, pragmatic design
  *  **[GraphQl](https://graphql.org/)** - A query language for APIs and a runtime for fulfilling those queries with your existing data
  *  **[Postgres](https://www.postgresql.org/)** - An object based relational database system

## INSTALLATION

Clone from git using
```
git@github.com:AndelaOSP/Andela-Socials.git
```

Create a `.env` file with the content of the `.env.sample` and edit with your personal details.

### CREATE DATABASE
Create database by running the script `createdb.sh` with the command:
```
./createdb.sh <db_name> e.g. ./createdb.sh a_socials
```

In a case where you get a `permission denied` error, you need to fix the error by making the file into an executable by running this script:
```
chmod +x ./createdb.sh
```

After which you can now run the `createdb` script again.

### SETUP APPLICATION
Navigate into the root directory of the project and run the script `setup.sh` with the command:
```
./setup.sh
```

This scripts automatically sets up the project automatically and starts the application once that is done. You can access it on `localhost:8000`

## STARTING THE APP SUBSEQUENTLY

Subsequently, if you need to start the application after the initial setup has completed you can run the command:
```
./start.sh
```

## UI MOCK

The UI mock for the project is available [here](https://www.figma.com/file/Yn3JRZ3YLBVSg4o8L9dhIAv2/Andela_Socials)

## DUMMY DATA

You can seed the dummy data into your database using the command `python manage.py loaddata fixtures/initial.json` when that is done you have access to dummy categories and dummy users. A user information you can use is:
*username:* _andelasocials_
*password:* _testuser_

## CONTRIBUTORS

View the list of [contributors](https://github.com/AndelaOSP/Andela-Socials/contributors) who participate in this project.
