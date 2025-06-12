# Restro

# Installation steps
1. Install the required Packages
```
> npm install 
```
2. use the ```.env.sample``` to create your ```.env``` file and fill in the required details
```
HOST= //set this to localhost for testing
SQLUSER=
SQLPASSWORD=
DBNAME= // name of the db creating using the sample sql files
JWTSECRET= // random string used to sign the JWT
SESSION_SECRET= // random string for the session
PORT=
```
3. use the sql files in the ```./models``` directory to load the dummy data for the project

4. start the project
```
> npm start               #to run the project
```