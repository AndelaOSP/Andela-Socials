# ANDELA SOCIALS

Andela Social was born out of the desire to keep Andelans very sociable within the organization.
It is a platform for events aggregation, to get Andelans from different departments to mingle and have fun together over a cup of coffee, a game of soccer, at a swimming pool or at a friends dinner party.
It is a platform to get events organized within the fellowship properly tracked and managed for all to see and for all to relate with irrespective of their centers.
These will improve socialization between Andelans inside and outside the company.


### INSTALLATION
Clone from git using
```
git@github.com:AndelaOSP/Andela-Socials.git
```

Create a `.env` file with the content of the `.env.sample` and edit with your personal details.

#### Node Installation
It is advisable to use node version 8 for this project. Check your node version using `node --version`. To help manage the node versions you can install and run on your system you can use nvm. Follow this [guide](https://gist.github.com/d2s/372b5943bce17b964a79#install-nvm-for-managing-nodejs-versions) to help install nvm.

You would then run `nvm install v8.0` to install node version 8 and `nvm use v8` to use that specific node version, but this will only work with that running bash session. To make version 8 the default node version for your system you would use `nvm alias default 8.0`

#### Project Setup
Navigate into the root directory of the project and run the script `setup.sh` with the command:
```
./setup.sh
```

This scripts automatically sets up the project automatically and starts the application once that is done.

### STARTING THE APP
Subsequently, if you need to start the application after the initial setup has completed you can run the command:
```
./start.sh
```

### DB CREATION
Use the createdb.sh script to setup your database for the application

Your .env variable should look like this, you can aslo reference the file to see how it is used.
```
    DB_USER=a_socials
    DB_PASS=a_socials
    DB_PORT=5432
    DB_NAME=a_socials
```

### UI MOCK
The UI mock for the project is available [here](https://www.figma.com/file/Yn3JRZ3YLBVSg4o8L9dhIAv2/Andela_Socials)

### DUMMY DATA
You can seed the dummy data into your database using the command `python manage.py loaddata fixtures/initial.json` when that is done you have access to dummy categories and dummy users. A user information you can use is:
*username:* _andelasocials_
*password:* _testuser_

### CONTRIBUTORS
View the list of [contributors](https://github.com/AndelaOSP/Andela-Socials/contributors) who participate in this project.
