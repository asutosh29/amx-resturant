# Restro
## Features
### 1. User
- Place order from the Menu
- Filters and Search are given for ease of access
- User can provide extra instructions (if needed)
- User will be provided with a Table Number and Order ID on placing the order

### 2. Admin
- Access and Manage orders at all stages
- Manage users and give roles (customer and admin)
- Chef page shows all the relevant orders (placed and being cooked) for the Chef
- Pagination for clutter free viewing of all orders


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
3. use the sql files in the ```./models``` directory to load the dummy data for the project. run ```init.sql``` then ```mockdata.sql```. 

4. start the project
```
> npm start
```


## Usage Instructions
The first user which is created after initialisation is assigned the role ```super``` and has admin access and give or revoke admin privilleges for other users 